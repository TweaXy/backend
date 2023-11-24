/*
 add view to user

*/

CREATE VIEW UserBaseInfo AS 
SELECT id AS userId, username, name, avatar FROM User WHERE deletedDate IS NULL;


