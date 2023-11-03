import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: false,
    },
});

const from = 'TweeXy <alia.abdullah02@eng-st.cu.edu.eg>';

const verificationEmailTemplate = (
    token
) => `<body style="background-color: #f5f8fa">
    <div
        style="width: 45%; margin: 50px auto; background-color: white; padding: 50px"
    >
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
        <p>Thanks,</p>
        <p>The TweeXy Team</p>
    </div>
</body>
`;

const resetPasswordEmailTemplate = (
    username,
    token
) => `<body style="background-color: #f5f8fa">
    <div
        style="width: 25%; margin: 50px auto; background-color: white; padding: 50px"
    >
        <h1>Reset your password?</h1>
        <p>
        you requested a password reset for @${username}, use the confirmation code below to complete the process. If you didn't make this request, ignore this email.
        </p>
        <h4>${token}</h4>
        <div style="color: #8899a6; text-align: center;">
            <p>This email was meant for @${username}.</p>
            <p>Thanks,</p>
            <p>The TweeXy Team</p>
        </div>
    </div>
</body>
`;
const sendVerificationEmail = async (email, token) => {
    const mailOptions = {
        from: from,
        to: email,
        html: verificationEmailTemplate(token),
        subject: `${token} is your verification token`,
        text: verificationEmailTemplate(token),
    };

    await transporter.sendMail(mailOptions);
};

const sendForgetPasswordEmail = async (email, username, token) => {
    const mailOptions = {
        from: from,
        to: email,
        html: resetPasswordEmailTemplate(username, token),
        subject: 'Password reset request',
        text: resetPasswordEmailTemplate(username, token),
    };

    await transporter.sendMail(mailOptions);
};

export { sendVerificationEmail, sendForgetPasswordEmail };
