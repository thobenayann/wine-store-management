/*
  Warnings:

  - Added the required column `type` to the `Wine` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "WineType" AS ENUM ('RED', 'WHITE', 'ROSE');

-- AlterTable
ALTER TABLE "Wine" ADD COLUMN     "type" "WineType" NOT NULL;
