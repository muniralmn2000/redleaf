require('dotenv').config(); // Load .env variables at the very top
// console.log('Attempting to load MONGODB_URI from .env:', process.env.MONGODB_URI); // DEBUG LINE REMOVED
const express = require('express');
const cors = require('cors');
const multer = require('multer'); // For handling file uploads
const nodemailer = require('nodemailer'); // Added for email sending
const connectDB = require('./config/db');
const User = require('./models/User');
const fs = require('fs'); // For sync methods
const fsPromises = require('fs').promises; // For async methods
const path = require('path'); // For constructing paths
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

// Connect to Database
connectDB();

const app = express();
const port = process.env.PORT || 3000;

// Nodemailer Transporter Configuration
// TODO: Replace with your actual email service configuration and credentials.
// It's highly recommended to use environment variables for sensitive data like email passwords.
// Example using environment variables for Gmail:
/*
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address (e.g., from .env file)
    pass: process.env.EMAIL_PASS  // Your Gmail App Password (e.g., from .env file)
  }
});
*/
// For testing locally without sending real emails, you can use a development tool
// like Ethereal.email or Mailtrap, or log emails to the console.
// Placeholder transporter - an actual transporter must be configured for emails to send.
let transporter;
if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    transporter = nodemailer.createTransport({
        service: 'gmail', // Or your email provider
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
    console.log('Nodemailer transporter configured using environment variables.');
} else {
    console.warn('EMAIL_USER or EMAIL_PASS not found in .env. Email notifications will be disabled.');
    // You might want to set up a dummy transporter for testing if no credentials are provided
    // or ensure your application handles this gracefully.
}

// Middleware
app.use(cors()); // Enable All CORS Requests for now
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true })); // To parse URL-encoded bodies

// Configure Multer for file uploads (basic setup, files won't be saved yet)
// This tells multer to expect files but doesn't specify where to store them permanently.
// For now, files will be available in req.files if sent via multipart/form-data.
const upload = multer({ storage: multer.memoryStorage() }); // Store files in memory for now

// Specific route for admin login page
app.get('/admin-login-test', async (req, res) => {
  const targetPath = path.join(__dirname, 'pages', 'admin.html');
  console.log(`ADMIN_LOGIN_TEST: Attempting to serve file from path: ${targetPath}`); // Log the path

  try {
    // Check if file exists and is accessible
    await fsPromises.access(targetPath, fsPromises.constants.F_OK | fsPromises.constants.R_OK);
    console.log(`ADMIN_LOGIN_TEST: File exists and is readable at ${targetPath}`);
    res.sendFile(targetPath, (err) => {
      if (err) {
        console.error('ADMIN_LOGIN_TEST: Error sending file:', err);
        // Avoid sending another response if headers already sent by res.sendFile on error
        if (!res.headersSent) {
            res.status(500).send('Error sending file. Check server logs.');
        }
      }
    });
  } catch (error) {
    console.error(`ADMIN_LOGIN_TEST: File not accessible at ${targetPath}. Error:`, error);
    res.status(404).send('File not found or not accessible. Check server logs.');
  }
});

// Serve static files from the "pages" directory
// app.use(express.static(path.join(__dirname, 'pages')));  // Temporarily commenting out to test explicit route
// Serve static files from the root directory (for index.html, styles.css etc. if they are at root)
// app.use(express.static(path.join(__dirname, '.'))); // Temporarily commenting out

// Ensure content_data directory exists (create if not) - run once at startup
const contentDataDir = path.join(__dirname, 'content_data');
(async () => {
  try {
    await fsPromises.mkdir(contentDataDir, { recursive: true });
    console.log('content_data directory is ready.');
  } catch (error) {
    console.error('Error creating content_data directory:', error);
  }
})();

// Hardcoded admin credentials and dummy token
const ADMIN_EMAIL = 'admin@gmail.com';
const ADMIN_PASSWORD = 'adminpass123'; // Replace if you want a different password
const ADMIN_DUMMY_TOKEN = 'secret-admin-token-xyz123';

// --- Admin Dashboard and Content Management ---
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'supersecretkey', // Change for production
    resave: false,
    saveUninitialized: false
}));

// --- Data Storage ---
const DATA_FILE = path.join(__dirname, 'data.json');
const IMAGES_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(IMAGES_DIR)) fs.mkdirSync(IMAGES_DIR);

// --- Default Content ---
const defaultContent = {
    heroTitle: "Welcome to Our School Portal",
    heroSubtitle: "Empowering students for a brighter future.",
    aboutText: "We are committed to providing quality education and fostering a love for learning.",
    images: []
};

// --- Helper: Load/Save Content ---
function loadContent(page) {
    const file = path.join(__dirname, `${page}.json`);
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, JSON.stringify({}, null, 2));
        return {};
    }
    return JSON.parse(fs.readFileSync(file));
}
function saveContent(page, content) {
    const file = path.join(__dirname, `${page}.json`);
    fs.writeFileSync(file, JSON.stringify(content, null, 2));
}

// --- Admin Credentials (hashed for security) ---
const ADMIN_PASSWORD_HASH = bcrypt.hashSync("Muner1234", 10); // Store hash, not plain text

// --- Multer Config for Image Uploads ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, IMAGES_DIR),
    filename: (req, file, cb) => {
        // Unique filename: timestamp-originalname
        const unique = Date.now() + '-' + file.originalname.replace(/\s+/g, '_');
        cb(null, unique);
    }
});
const uploadImage = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
    fileFilter: (req, file, cb) => {
        // Only allow images
        if (!file.mimetype.startsWith('image/')) {
            return cb(new Error('Only image files are allowed!'), false);
        }
        cb(null, true);
    }
});

// --- Middleware: Auth Check ---
function requireLogin(req, res, next) {
    if (req.session && req.session.admin) return next();
    res.redirect('/admin/login');
}

const CONTENT_PATH = path.join(__dirname, 'content.json');
function loadContentJson() {
  if (!fs.existsSync(CONTENT_PATH)) {
    fs.writeFileSync(CONTENT_PATH, JSON.stringify({
      home: { title: '', description: '', image: '' },
      about: { title: '', description: '', image: '' },
      contact: { title: '', description: '', image: '' }
    }, null, 2));
  }
  return JSON.parse(fs.readFileSync(CONTENT_PATH));
}

// Routes
app.get('/', (req, res) => {
  const content = loadContentJson();
  res.render('home', { content, admin: req.session.admin });
});

app.get('/about', (req, res) => {
  const content = loadContentJson();
  res.render('about', { content, admin: req.session.admin });
});

app.get('/contact', (req, res) => {
  const content = loadContentJson();
  res.render('contact', { content, admin: req.session.admin });
});

// Registration endpoint
// Using upload.fields([]) to handle multipart/form-data which includes files
// We specify the expected file fields here.
app.post('/api/register', upload.fields([
  { name: 'id_document', maxCount: 1 },
  { name: 'transfer_letter', maxCount: 1 }
]), async (req, res) => {
  console.log('Received registration data (no-DB mode):');
  console.log('Body:', req.body);
  // console.log('Files:', req.files); // Files are in memory, access via req.files object

  const { fullName, email, password, role, studentId, is_transfer } = req.body;

  // --- MOCKED USER DATA (NO DATABASE INTERACTION) ---
  const mockUser = {
    _id: `mock_${Date.now()}`,
    fullName,
    email,
    password, // In a real app, hash this before saving or even logging!
    role,
    studentId: role === 'student' ? (studentId || `mock_student_${Date.now()}`) : undefined,
    isTransferStudent: is_transfer === 'yes',
    // Placeholder paths for files if they were part of the request
    idDocumentPath: req.files && req.files.id_document ? `uploads/ids/mock_${req.files.id_document[0].originalname}` : undefined,
    transferLetterPath: is_transfer === 'yes' && req.files && req.files.transfer_letter ? `uploads/transfers/mock_${req.files.transfer_letter[0].originalname}` : undefined
  };
  console.log('Mock user data constructed:', mockUser);
  // --- END MOCKED USER DATA ---

  // try {
    // // Check if user already exists
    // let user = await User.findOne({ email });
    // if (user) {
    //   return res.status(400).json({ message: 'User already exists with this email' });
    // }

    // const newUserFields = {
    //   fullName,
    //   email,
    //   password, // Plain password for now, will hash later
    //   role,
    // };

    // if (role === 'student') {
    //   if (studentId) {
    //     // Check if studentId is unique before assigning
    //     const existingStudent = await User.findOne({ studentId });
    //     if (existingStudent) {
    //       // This scenario needs a robust way to generate a *new* unique ID
    //       // For now, we'll error. Later, we can implement a retry or a sequence.
    //       return res.status(400).json({ message: 'Generated Student ID is already taken. Please try again.' });
    //     }
    //     newUserFields.studentId = studentId;
    //   } else {
    //     // Handle case where studentId might not be passed from frontend but is expected for students
    //     // For now, this relies on the frontend generating and sending it.
    //     return res.status(400).json({ message: 'Student ID is required for student registration.'});
    //   }
      
    //   if (req.files && req.files.id_document) {
    //     // For now, just storing a placeholder that a file was received.
    //     // Actual file storage and path generation will be handled later.
    //     newUserFields.idDocumentPath = `uploads/ids/${req.files.id_document[0].originalname}-${Date.now()}`;
    //     console.log('ID Document received:', req.files.id_document[0].originalname);
    //   }
    //   newUserFields.isTransferStudent = is_transfer === 'yes';
    //   if (is_transfer === 'yes' && req.files && req.files.transfer_letter) {
    //     newUserFields.transferLetterPath = `uploads/transfers/${req.files.transfer_letter[0].originalname}-${Date.now()}`;
    //     console.log('Transfer Letter received:', req.files.transfer_letter[0].originalname);
    //   }
    // }

    // user = new User(newUserFields);
    // await user.save();

    // console.log('User saved:', user);

    // Send registration email using mockUser data
    if (transporter) {
      const studentIdHtml = mockUser.role === 'student' && mockUser.studentId ? `<li><strong>Student ID:</strong> ${mockUser.studentId}</li>` : '';
      const transferStudentHtml = mockUser.isTransferStudent ? '<li><strong>Is Transfer Student:</strong> Yes</li>' : '';

      const mailOptions = {
        from: `"School Portal Admin" <${process.env.EMAIL_USER || 'noreply@example.com'}>`, 
        to: 'pagepage@gmail.com', // Using the hardcoded email from your original code
        subject: 'New User Registration - School Portal (Simulated)', 
        html: 
          '<h1>New User Registration (Simulated)</h1>' +
          '<p>A new user has registered on the School Portal (data not saved to DB).</p>' +
          '<h2>User Details:</h2>' +
          '<ul>' +
            `<li><strong>Full Name:</strong> ${mockUser.fullName}</li>` +
            `<li><strong>Email:</strong> ${mockUser.email}</li>` +
            `<li><strong>Role:</strong> ${mockUser.role}</li>` +
            studentIdHtml +
            transferStudentHtml +
          '</ul>' +
          '<p><em>This is an automated notification.</em></p>'
      };

      // --- SIMULATION ONLY --- 
      console.log('SIMULATING EMAIL SEND: Would send the following email options:');
      console.log(JSON.stringify(mailOptions, null, 2));
      // --- END SIMULATION ONLY ---

      // The original try...catch block that attempted to send email is now completely bypassed.

    } else {
      console.warn('Nodemailer transporter not configured. Skipping email notification.');
    }

    res.status(201).json({
      message: 'User registration simulated successfully (no data saved)!',
      userId: mockUser._id,
      studentId: mockUser.studentId,
      email: mockUser.email,
      role: mockUser.role
    });

  // } catch (error) {
  //   console.error('Error during registration (simulated):', error.message);
  //   // if (error.code === 11000) { // Duplicate key error (e.g. email or studentId)
  //   //     return res.status(400).json({ message: 'Duplicate field value entered. Email or Student ID might be taken.' });
  //   // }
  //   res.status(500).json({ message: 'Server error during registration (simulated). Please try again later.' });
  // }
});

// Admin Login Endpoint
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body;
  if (email === ADMIN_EMAIL && bcrypt.compareSync(password, ADMIN_PASSWORD_HASH)) {
    req.session.admin = true;
    res.json({ 
      success: true, 
      message: 'Admin login successful!', 
      token: ADMIN_DUMMY_TOKEN 
    });
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin credentials.' });
  }
});

// Content Update Endpoint
app.post('/api/content/update', async (req, res) => {
  // Authorization check
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Expects "Bearer TOKEN_STRING"

  if (token !== ADMIN_DUMMY_TOKEN) {
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid or missing admin token.' });
  }

  const { pageName, elementId, newText } = req.body;

  if (!pageName || !elementId || typeof newText === 'undefined') {
    return res.status(400).json({ 
      success: false, 
      message: 'Bad Request: pageName, elementId, and newText are required.' 
    });
  }

  const filePath = path.join(contentDataDir, `${pageName}.json`);

  try {
    let pageContent = {};
    try {
      // Try to read existing file
      const fileData = await fsPromises.readFile(filePath, 'utf8');
      pageContent = JSON.parse(fileData);
    } catch (readError) {
      // If file doesn't exist or is invalid JSON, start with an empty object
      // ENOENT is the error code for "file not found"
      if (readError.code !== 'ENOENT') {
        console.warn(`Warning: Error reading ${filePath}, initializing fresh. Error:`, readError.message);
      }
      // File not found is okay, we'll create it.
    }

    pageContent[elementId] = newText;

    await fsPromises.writeFile(filePath, JSON.stringify(pageContent, null, 2), 'utf8');
    res.json({ 
      success: true, 
      message: `Content updated successfully for ${pageName} - ${elementId}.` 
    });

  } catch (error) {
    console.error('Error updating content file:', error);
    res.status(500).json({ success: false, message: 'Server error while updating content.' });
  }
});

// Get Content Endpoint
app.get('/api/content/:pageName', async (req, res) => {
  const { pageName } = req.params;
  const filePath = path.join(contentDataDir, `${pageName}.json`);

  try {
    const fileData = await fsPromises.readFile(filePath, 'utf8');
    const pageContent = JSON.parse(fileData);
    res.json(pageContent);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // File not found for the page
      res.status(404).json({ success: false, message: `Content not found for page: ${pageName}` });
    } else {
      console.error(`Error reading content file for ${pageName}:`, error);
      res.status(500).json({ success: false, message: 'Server error while retrieving content.' });
    }
  }
});

// --- Public Website ---
app.get('/', (req, res) => {
    const content = loadContent('home');
    res.render('site', { content, admin: req.session.admin, page: 'home' });
});

// --- Admin Login ---
app.get('/admin/login', (req, res) => {
    res.render('login', { error: null });
});
app.post('/admin/login', (req, res) => {
    const { email, password } = req.body;
    if (
        email === "munirdanby@gmail.com" &&
        password === "Muner1234"
    ) {
        req.session.admin = true;
        res.json({ success: true });
    } else {
        res.status(401).json({ error: "Invalid credentials" });
    }
});
app.get('/admin/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/admin/login'));
});

// --- Admin Dashboard ---
app.get('/admin', requireLogin, (req, res) => {
    const content = loadContentJson();
    res.render('admin', { content });
});

// --- Update Text Content ---
app.post('/admin/update-text', requireLogin, (req, res) => {
    const { page, field, value } = req.body;
    const content = loadContent(page);
    content[field] = value;
    saveContent(page, content);
    res.json({ success: true });
});

// --- Upload Image ---
app.post('/admin/upload-image', requireLogin, uploadImage.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const { caption } = req.body;
    const content = loadContent('home');
    content.images.push({
        url: '/uploads/' + req.file.filename,
        caption: caption || ""
    });
    saveContent('home', content);
    res.json({ success: true, image: { url: '/uploads/' + req.file.filename, caption } });
});

// --- Edit Image Caption ---
app.post('/admin/edit-image', requireLogin, (req, res) => {
    const { index, caption } = req.body;
    const content = loadContent('home');
    if (content.images[index]) {
        content.images[index].caption = caption;
        saveContent('home', content);
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Image not found" });
    }
});

// --- Delete Image ---
app.post('/admin/delete-image', requireLogin, (req, res) => {
    const { index } = req.body;
    const content = loadContent('home');
    if (content.images[index]) {
        // Remove file from disk
        const imgPath = path.join(__dirname, content.images[index].url.replace('/uploads/', 'uploads/'));
        if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
        // Remove from array
        content.images.splice(index, 1);
        saveContent('home', content);
        res.json({ success: true });
    } else {
        res.status(400).json({ error: "Image not found" });
    }
});

// --- API for frontend to get content (for dynamic loading) ---
app.get('/api/content', (req, res) => {
    res.json(loadContent('home'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
}); 

app.get('/login', (req, res) => {
  res.render('login', { error: null });
});
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (email === "munir@gmail.com" && password === "12341234") {
    req.session.admin = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
}); 