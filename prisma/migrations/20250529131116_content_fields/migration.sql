/*
  Warnings:

  - You are about to drop the column `data` on the `Content` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Content" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "section" TEXT NOT NULL,
    "title" TEXT,
    "subtitle" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Content" ("id", "section", "updatedAt") SELECT "id", "section", "updatedAt" FROM "Content";
DROP TABLE "Content";
ALTER TABLE "new_Content" RENAME TO "Content";
CREATE UNIQUE INDEX "Content_section_key" ON "Content"("section");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
