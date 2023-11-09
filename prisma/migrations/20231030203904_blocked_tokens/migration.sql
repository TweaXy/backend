-- CreateTable
CREATE TABLE `Blockedtokens` (
    `userID` VARCHAR(191) NOT NULL,
    `token` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `BlockedTokens_token_key`(`token`),
    PRIMARY KEY (`token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Blockedtokens` ADD CONSTRAINT `BlockedTokens_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
