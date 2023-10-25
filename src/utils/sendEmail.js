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
});

const from = 'TweeXy <alia.abdullah02@eng-st.cu.edu.eg>';

const sendVerificationEmail = async (email, token) => {
    const html = `<body style="background-color: #f5f8fa">
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

    const mailOptions = {
        from: from,
        to: email,
        html,
        subject: `${token} is your verification token`,
        text: html,
    };

    await transporter.sendMail(mailOptions);
};

export { sendVerificationEmail };
