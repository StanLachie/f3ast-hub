/*
  Warnings:

  - A unique constraint covering the columns `[stripeCustomerId]` on the table `Restaurant` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "SubscriptionStatus" ADD VALUE 'INCOMPLETE';
ALTER TYPE "SubscriptionStatus" ADD VALUE 'INCOMPLETE_EXPIRED';
ALTER TYPE "SubscriptionStatus" ADD VALUE 'UNPAID';

-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "stripeCustomerId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE UNIQUE INDEX "Restaurant_stripeCustomerId_key" ON "Restaurant"("stripeCustomerId");
