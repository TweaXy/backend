-- CreateTable
CREATE TABLE `BlockedTokens` (
    `UserID` VARCHAR(191) NOT NULL,
    `token` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `BlockedTokens_token_key`(`token`),
    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BlockedTokens` ADD CONSTRAINT `BlockedTokens_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
