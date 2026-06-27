/*
  Warnings:

  - You are about to drop the column `isTokenExpired` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `tokenExpiresAt` on the `Session` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[token]` on the table `Session` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `expiresAt` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- AlterTable
ALTER TABLE "Session" DROP COLUMN "isTokenExpired",
DROP COLUMN "tokenExpiresAt",
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ipAddress" TEXT,
ADD COLUMN     "isRevoked" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "isActive" SET DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "Session_token_key" ON "Session"("token");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
