-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `Username` VARCHAR(191) NOT NULL,
    `name` VARCHAR(50) NOT NULL,
    `bio` VARCHAR(160) NULL,
    `email` VARCHAR(191) NOT NULL,
    `phone` VARCHAR(11) NOT NULL,
    `password` VARCHAR(20) NOT NULL,
    `cover` LONGBLOB NULL,
    `avatar` LONGBLOB NULL,
    `joinedDate` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `birthdayDate` DATE NULL,
    `location` VARCHAR(30) NULL,
    `passwordResetcode` INTEGER NULL,
    `website` VARCHAR(100) NULL,

    UNIQUE INDEX `User_Username_key`(`Username`),
    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


ALTER TABLE `User`
ADD CONSTRAINT `email_check` CHECK (`email` REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    
ALTER TABLE `User`
ADD CONSTRAINT `website_check` CHECK (`website` REGEXP '^$|(https?:\\/\\/)?(www\\.)?[a-z0-9]+(\\.[a-z]{2,}){1,3}(#?\\/?[a-zA-Z0-9#]+)*\\/?(\\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$'); 

ALTER TABLE `User`
ADD CONSTRAINT `phone_check` CHECK (`phone` REGEXP '^[0-9]+$'); 

ALTER TABLE `User`
ADD CONSTRAINT `phone_length_check` CHECK (LENGTH(phone) =11); 

ALTER TABLE `User`
ADD CONSTRAINT `password_check` CHECK (LENGTH(password) >3);

ALTER TABLE `User`
ADD CONSTRAINT `Username_min_length_check` CHECK (LENGTH(Username) >4); 

ALTER TABLE `User`
ADD CONSTRAINT `name_min_length_check` CHECK (LENGTH(name) >3); 



-- CreateTable
CREATE TABLE `Tokens` (

    `UserID` VARCHAR(191) NOT NULL,
    `token` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tokens_token_key`(`token`),
    PRIMARY KEY (`UserID`, `token`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tweets` (
    `tweetID` VARCHAR(191) NOT NULL,
    `UserID` VARCHAR(191) NOT NULL,
    `text` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Tweets_tweetID_key`(`tweetID`),
    PRIMARY KEY (`tweetID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Likes` (
    `tweetID` VARCHAR(191) NOT NULL,
    `UserID` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`UserID`, `tweetID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_UserFollows` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_UserFollows_AB_unique`(`A`, `B`),
    INDEX `_UserFollows_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Blocks` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_Blocks_AB_unique`(`A`, `B`),
    INDEX `_Blocks_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_Mutes` (
    `A` VARCHAR(191) NOT NULL,
    `B` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `_Mutes_AB_unique`(`A`, `B`),
    INDEX `_Mutes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Tokens` ADD CONSTRAINT `Tokens_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tweets` ADD CONSTRAINT `Tweets_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_UserID_fkey` FOREIGN KEY (`UserID`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Likes` ADD CONSTRAINT `Likes_tweetID_fkey` FOREIGN KEY (`tweetID`) REFERENCES `Tweets`(`tweetID`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserFollows` ADD CONSTRAINT `_UserFollows_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_UserFollows` ADD CONSTRAINT `_UserFollows_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Blocks` ADD CONSTRAINT `_Blocks_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Blocks` ADD CONSTRAINT `_Blocks_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Mutes` ADD CONSTRAINT `_Mutes_A_fkey` FOREIGN KEY (`A`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_Mutes` ADD CONSTRAINT `_Mutes_B_fkey` FOREIGN KEY (`B`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
