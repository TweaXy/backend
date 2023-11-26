import transporter from '../config/emailConfig.js';

const from = 'TweeXy <alia.abdullah02@eng-st.cu.edu.eg>';
/**
 * Namespace for utility functions related to send email.
 * @namespace Utils.SendEmail
 */

/**
 * Generates the HTML body for an email with the provided content.
 *
 * @function generateEmailBody
 * @memberof  Utils.SendEmail
 * @param {string} content - The content to be included in the email body.
 * @returns {string} - The HTML body for the email.
 */
const generateEmailBody = (content) => `
    <body style="background-color: #f5f8fa">
        <div style="width: 45%; margin: 50px auto; background-color: white; padding: 50px">
            ${content}
            <p>Thanks,</p>
            <p>The TweeXy Team</p>
        </div>
    </body>
`;

/**
 * Generates the HTML body for a verification email with the provided token.
 *
 * @function verificationEmailTemplate
 * @memberof  Utils.SendEmail
 * @param {string} token - The verification token to be included in the email.
 * @returns {string} - The HTML body for the verification email.
 */

const verificationEmailTemplate = (token) => {
    const content = `
        <h1>Confirm your email address</h1>
        <p>
            There's one quick step you need to complete before creating your X
            account. Let's' make sure this is the right email address for you —
            please confirm this is the right address to use for your new
            account.
        </p>
        <p>Please enter this verification code to get started on X:</p>
        <h2>${token}</h2>
        <small>Verification codes expire after two hours.</small>
    `;
    return generateEmailBody(content);
};

/**
 * Generates the HTML body for a reset password email with the provided username and token.
 *
 * @function resetPasswordEmailTemplate
 * @memberof  Utils.SendEmail
 * @param {string} username - The username associated with the account.
 * @param {string} token - The reset password token to be included in the email.
 * @returns {string} - The HTML body for the reset password email.
 */
const resetPasswordEmailTemplate = (username, token) => {
    const content = `
        <h1>Reset your password?</h1>
        <p>
            You requested a password reset for @${username}, use the confirmation code below to complete the process. If you didn't make this request, ignore this email.
        </p>
        <h4>${token}</h4>
        <div style="color: #8899a6; text-align: center;">
            <p>This email was meant for @${username}.</p>
        </div>
    `;
    return generateEmailBody(content);
};

/**
 * Sends an email with the specified content, subject, and recipient.
 *
 * @function sendEmail
 * @memberof  Utils.SendEmail
 * @async
 * @param {string} email - The recipient's email address.
 * @param {string} template - The HTML body of the email.
 * @param {string} subject - The subject of the email.
 * @throws {Error} - Throws an error if there's an issue sending the email.
 */
const sendEmail = async (email, template, subject) => {
    const mailOptions = {
        from: from,
        to: email,
        subject: subject,
        html: template,
        text: template,
    };

    await transporter.sendMail(mailOptions);
};

/**
 * Sends a verification email to the specified email address with the provided token.
 *
 * @function sendVerificationEmail
 * @memberof  Utils.SendEmail
 * @async
 * @param {string} email - The recipient's email address.
 * @param {string} token - The verification token to be included in the email.
 * @throws {Error} - Throws an error if there's an issue sending the verification email.
 */
const sendVerificationEmail = async (email, token) => {
    const subject = `${token} is your verification token`;
    await sendEmail(email, verificationEmailTemplate(token), subject);
};

/**
 * Sends a reset password email to the specified email address with the provided username and token.
 *
 * @function sendForgetPasswordEmail
 * @memberof  Utils.SendEmail
 * @async
 * @param {string} email - The recipient's email address.
 * @param {string} username - The username associated with the account.
 * @param {string} token - The reset password token to be included in the email.
 * @throws {Error} - Throws an error if there's an issue sending the reset password email.
 */
const sendForgetPasswordEmail = async (email, username, token) => {
    const subject = 'Password reset request';
    await sendEmail(
        email,
        resetPasswordEmailTemplate(username, token),
        subject
    );
};

export { sendVerificationEmail, sendForgetPasswordEmail };
