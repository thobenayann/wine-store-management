/*
  Warnings:

  - You are about to alter the column `stock` on the `Wine` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `stock_alert` on the `Wine` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Wine" ALTER COLUMN "stock" SET DATA TYPE INTEGER,
ALTER COLUMN "stock_alert" SET DATA TYPE INTEGER;
