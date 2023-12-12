SELECT
  `tweexy`.`user`.`id` AS `UserId`,
  `tweexy`.`user`.`Username` AS `Username`,
  `tweexy`.`user`.`name` AS `name`,
  `tweexy`.`user`.`avatar` AS `avatar`
FROM
  `tweexy`.`user`
WHERE
  (`tweexy`.`user`.`deletedDate` IS NULL)