/*
  Warnings:

  - You are about to drop the column `newFileDownloadedId` on the `Webhook` table. All the data in the column will be lost.
  - You are about to drop the column `userNewFileDownloadedId` on the `Webhook` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Webhook` DROP FOREIGN KEY `Webhook_newFileDownloadedId_fkey`;

-- DropForeignKey
ALTER TABLE `Webhook` DROP FOREIGN KEY `Webhook_userNewFileDownloadedId_fkey`;

-- AlterTable
ALTER TABLE `Webhook` DROP COLUMN `newFileDownloadedId`,
    DROP COLUMN `userNewFileDownloadedId`,
    ADD COLUMN `newFileDownloadingId` INTEGER NULL,
    ADD COLUMN `userNewFileDownloadingId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Webhook` ADD CONSTRAINT `Webhook_userNewFileDownloadingId_fkey` FOREIGN KEY (`userNewFileDownloadingId`) REFERENCES `UserWebhooks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Webhook` ADD CONSTRAINT `Webhook_newFileDownloadingId_fkey` FOREIGN KEY (`newFileDownloadingId`) REFERENCES `FileWebhooks`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
