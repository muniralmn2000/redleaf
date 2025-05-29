-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "studentId" TEXT,
    "isTransferStudent" BOOLEAN,
    "previousInstitution" TEXT,
    "specialization" TEXT,
    "experience" TEXT,
    "qualifications" TEXT,
    "idDocumentPath" TEXT,
    "transferLetterPath" TEXT,
    "resumePath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'pending'
);
INSERT INTO "new_User" ("createdAt", "email", "experience", "fullName", "id", "idDocumentPath", "isTransferStudent", "password", "previousInstitution", "qualifications", "resumePath", "role", "specialization", "studentId", "transferLetterPath") SELECT "createdAt", "email", "experience", "fullName", "id", "idDocumentPath", "isTransferStudent", "password", "previousInstitution", "qualifications", "resumePath", "role", "specialization", "studentId", "transferLetterPath" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
