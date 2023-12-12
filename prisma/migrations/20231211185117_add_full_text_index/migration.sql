
-- DropIndex
DROP INDEX `Interactions_text_idx` ON `Interactions`;

-- DropIndex
DROP INDEX `TrendsInteractions_trend_idx` ON `TrendsInteractions`;



-- CreateIndex
CREATE FULLTEXT INDEX `Interactions_text_idx` ON `Interactions`(`text`);

-- CreateIndex
CREATE FULLTEXT INDEX `TrendsInteractions_trend_idx` ON `TrendsInteractions`(`trend`);
