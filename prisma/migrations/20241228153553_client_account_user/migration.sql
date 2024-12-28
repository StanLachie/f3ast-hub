/*
  Warnings:

  - You are about to drop the `ClientAccount` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `first_name` to the `user` table without a default value. This is not possible if the table is not empty.
  - Added the required column `last_name` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ClientAccount" DROP CONSTRAINT "ClientAccount_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "ClientAccount" DROP CONSTRAINT "ClientAccount_userId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "first_name" TEXT NOT NULL,
ADD COLUMN     "last_name" TEXT NOT NULL,
ADD COLUMN     "promotional_emails" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "restaurantId" INTEGER,
ADD COLUMN     "stripeId" TEXT;

-- DropTable
DROP TABLE "ClientAccount";

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_restaurantId_fkey" FOREIGN KEY ("restaurantId") REFERENCES "Restaurant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
