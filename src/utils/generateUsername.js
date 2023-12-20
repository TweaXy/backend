const generateUsername = (email) => {
    const username = email.split('@')[0];

    const uniqueId = Math.random().toString(10).substring(2, 6);

    const uniqueUsername = `${username}_${uniqueId}`;

    return uniqueUsername;
};

export default generateUsername;
