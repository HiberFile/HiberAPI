-- AlterTable
ALTER TABLE `UserEmailChecking` ADD COLUMN `emitAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- CreateTable
CREATE TABLE `UserResetPassword` (
    `id` VARCHAR(191) NOT NULL,
    `inProcessing` BOOLEAN NOT NULL DEFAULT true,
    `emitAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `UserResetPassword_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserResetPassword` ADD CONSTRAINT `UserResetPassword_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
