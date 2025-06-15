/*
  Warnings:

  - Added the required column `link` to the `tools` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tools" ADD COLUMN     "link" TEXT NOT NULL;
