-- This is an empty migration to add email constraint on EmailVerificationTokens table
ALTER TABLE `Emailverificationtoken`
ADD CONSTRAINT `unverified_email_check` CHECK (`email` REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');
    