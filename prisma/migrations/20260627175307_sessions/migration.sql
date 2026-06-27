/*
  Warnings:

  - Added the required column `isTokenExpired` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tokenExpiresAt` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isActive` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "Session" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isTokenExpired" BOOLEAN NOT NULL,
ADD COLUMN     "tokenExpiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isActive" BOOLEAN NOT NULL,
ADD COLUMN     "roles" "Role"[] DEFAULT ARRAY['USER']::"Role"[],
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
