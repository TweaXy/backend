/*
 add view to User

*/

CREATE VIEW UserBaseInfo AS 
SELECT id AS UserId, Username, name, avatar FROM User WHERE deletedDate IS NULL;


