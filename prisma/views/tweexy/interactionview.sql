WITH `likescount` AS (
  SELECT
    `tweexy`.`likes`.`interactionID` AS `interactionID`,
    count(0) AS `LikesCount`
  FROM
    `tweexy`.`likes`
  GROUP BY
    `tweexy`.`likes`.`interactionID`
),
`viewscount` AS (
  SELECT
    `tweexy`.`views`.`interactionID` AS `interactionID`,
    count(0) AS `ViewsCount`
  FROM
    `tweexy`.`views`
  GROUP BY
    `tweexy`.`views`.`interactionID`
),
`retweetscount` AS (
  SELECT
    `tweexy`.`interactions`.`parentInteractionID` AS `parentInteractionID`,
    count(0) AS `retweetsCount`
  FROM
    `tweexy`.`interactions`
  WHERE
    (`tweexy`.`interactions`.`type` = 'RETWEET')
  GROUP BY
    `tweexy`.`interactions`.`parentInteractionID`
),
`commentscount` AS (
  SELECT
    `tweexy`.`interactions`.`parentInteractionID` AS `parentInteractionID`,
    count(0) AS `commentsCount`
  FROM
    `tweexy`.`interactions`
  WHERE
    (`tweexy`.`interactions`.`type` = 'COMMENT')
  GROUP BY
    `tweexy`.`interactions`.`parentInteractionID`
),
`mediafiles` AS (
  SELECT
    GROUP_CONCAT(`m`.`fileName` SEPARATOR ', ') AS `MediaFiles`,
    `m`.`InteractionsID` AS `InteractionsID`
  FROM
    `tweexy`.`media` `m`
  GROUP BY
    `m`.`InteractionsID`
)
SELECT
  `i`.`id` AS `interactionId`,
  `i`.`text` AS `text`,
  `i`.`createdDate` AS `createdDate`,
  `i`.`deletedDate` AS `deletedDate`,
  `i`.`type` AS `type`,
  `m`.`MediaFiles` AS `Media`,
  `tweexy`.`u`.`UserId` AS `UserId`,
  `tweexy`.`u`.`Username` AS `Username`,
  `tweexy`.`u`.`name` AS `name`,
  `tweexy`.`u`.`avatar` AS `avatar`,
  `parentinteraction`.`id` AS `parentID`,
  `parentinteraction`.`text` AS `parentText`,
  `parentinteraction`.`createdDate` AS `parentCreatedDate`,
  `parentinteraction`.`type` AS `parentType`,
  `parentinteractionm`.`MediaFiles` AS `parentMedia`,
  `tweexy`.`parentinteractionuser`.`UserId` AS `parentUserId`,
  `tweexy`.`parentinteractionuser`.`Username` AS `parentUsername`,
  `tweexy`.`parentinteractionuser`.`name` AS `parentName`,
  `tweexy`.`parentinteractionuser`.`avatar` AS `parentAvatar`,
  coalesce(`l`.`LikesCount`, 0) AS `LikesCount`,
  coalesce(`v`.`ViewsCount`, 0) AS `ViewsCount`,
  coalesce(`r`.`retweetsCount`, 0) AS `retweetsCount`,
  coalesce(`c`.`commentsCount`, 0) AS `commentsCount`
FROM
  (
    (
      (
        (
          (
            (
              (
                (
                  (
                    `tweexy`.`interactions` `i`
                    LEFT JOIN `likescount` `l` ON((`l`.`interactionID` = `i`.`id`))
                  )
                  LEFT JOIN `viewscount` `v` ON((`v`.`interactionID` = `i`.`id`))
                )
                LEFT JOIN `retweetscount` `r` ON((`r`.`parentInteractionID` = `i`.`id`))
              )
              LEFT JOIN `commentscount` `c` ON((`c`.`parentInteractionID` = `i`.`id`))
            )
            LEFT JOIN `tweexy`.`interactions` `parentinteraction` ON(
              (
                `parentinteraction`.`id` = `i`.`parentInteractionID`
              )
            )
          )
          LEFT JOIN `mediafiles` `m` ON((`m`.`InteractionsID` = `i`.`id`))
        )
        LEFT JOIN `mediafiles` `parentinteractionm` ON(
          (
            `parentinteractionm`.`InteractionsID` = `parentinteraction`.`id`
          )
        )
      )
      JOIN `tweexy`.`userbaseinfo` `u` ON((`tweexy`.`u`.`UserId` = `i`.`UserID`))
    )
    LEFT JOIN `tweexy`.`userbaseinfo` `parentinteractionuser` ON(
      (
        `tweexy`.`parentinteractionuser`.`UserId` = `parentinteraction`.`UserID`
      )
    )
  )
WHERE
  (
    (
      (`i`.`type` = 'TWEET')
      OR (`i`.`type` = 'RETWEET')
    )
    AND (`i`.`deletedDate` IS NULL)
  )