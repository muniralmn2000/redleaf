const mongoose = require('mongoose');
require('dotenv').config(); // To load .env variables

const connectDB = async () => {
  // try {
  //   const conn = await mongoose.connect(/* process.env.MONGODB_URI */ "mongodb://placeholder_uri_not_used", {
  //     useNewUrlParser: true,
  //     useUnifiedTopology: true,
  //     // Mongoose 6 doesn't require useCreateIndex and useFindAndModify anymore
  //   });
  //   console.log(`MongoDB Connected: ${conn.connection.host}`);
  // } catch (error) {
  //   console.error(`Error connecting to MongoDB: ${error.message}`);
  //   process.exit(1); // Exit process with failure
  // }
  console.log("Database connection SKIPPED (running in no-DB mode).");
};

module.exports = connectDB; 