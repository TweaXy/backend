import admin from 'firebase-admin';
const sendNotification = async (
    androidTokens,
    webTokens,
    action,
    username,
    interaction
) => {
    console.log('sendNotification');
    if (action == 'FOLLOW')
        try {
            const webMessages = webTokens.map((token) => {
                return {
                    token: token,
                    webpush: {
                        notification: {
                            title: `${username} followed you`,
                            body: `${username} followed you`,
                        },
                    },
                };
            });
            const androidMessages = androidTokens.map((token) => {
                return {
                    token: token,
                    android: {
                        notification: {
                            title: `${username} followed you `,
                            body: `${username} followed you `,
                        },
                    },
                };
            });

            const messages = [...webMessages, ...androidMessages];

            const sendPromises = messages.map((message) =>
                admin.messaging().send(message)
            );
            await Promise.all(sendPromises);
        } catch (err) {
            //        console.error(err);
        }
    else if (action == 'LIKE')
        try {
            const truncatedText = !interaction.text
                ? interaction.type
                : interaction.text.substring(0, 100);
            const webMessages = webTokens.map((token) => {
                return {
                    token: token,
                    webpush: {
                        notification: {
                            title: `${username}  liked your ${interaction.type}`,
                            body: `${username} liked ${truncatedText}`,
                        },
                    },
                };
            });
            const androidMessages = androidTokens.map((token) => {
                return {
                    token: token,
                    android: {
                        notification: {
                            title: `${username}  liked your ${interaction.type}`,
                            body: `${username} liked ${truncatedText}`,
                        },
                    },
                };
            });

            const messages = [...webMessages, ...androidMessages];
            const sendPromises = messages.map((message) =>
                admin.messaging().send(message)
            );
            await Promise.all(sendPromises);
        } catch (err) {
            //      console.error(err);
        }
    else if (action == 'RETWEET')
        try {
            const truncatedText = !interaction.text
                ? interaction.type
                : interaction.text.substring(0, 100);
            const webMessages = webTokens.map((token) => {
                return {
                    token: token,
                    webpush: {
                        notification: {
                            title: `${username}  reposted your ${interaction.type}`,
                            body: `${username} reposted ${truncatedText}`,
                        },
                    },
                };
            });
            const androidMessages = androidTokens.map((token) => {
                return {
                    token: token,
                    android: {
                        notification: {
                            title: `${username}  reposted your ${interaction.type}`,
                            body: `${username} reposted ${truncatedText}`,
                        },
                    },
                };
            });

            const messages = [...webMessages, ...androidMessages];
            const sendPromises = messages.map((message) =>
                admin.messaging().send(message)
            );
            await Promise.all(sendPromises);
        } catch (err) {
            //      console.error(err);
        }
    else if (action == 'REPLY')
        try {
            const truncatedText = !interaction.text
                ? interaction.type
                : interaction.text.substring(0, 100);
            const webMessages = webTokens.map((token) => {
                return {
                    token: token,
                    webpush: {
                        notification: {
                            title: `${username}  replied to your ${interaction.type}`,
                            body: `${username} replied to ${truncatedText}`,
                        },
                    },
                };
            });
            const androidMessages = androidTokens.map((token) => {
                return {
                    token: token,
                    android: {
                        notification: {
                            title: `${username}  replied to your ${interaction.type}`,
                            body: `${username} replied to ${truncatedText}`,
                        },
                    },
                };
            });

            const messages = [...webMessages, ...androidMessages];
            const sendPromises = messages.map((message) =>
                admin.messaging().send(message)
            );
            await Promise.all(sendPromises);
        } catch (err) {
            //   console.error(err);
        }
    else if (action == 'MENTION')
        try {
            const truncatedText = !interaction.text
                ? interaction.type
                : interaction.text.substring(0, 100);
            const webMessages = webTokens.map((token) => {
                return {
                    token: token,
                    webpush: {
                        notification: {
                            title: `${username} mentioned you in a ${interaction.type}`,
                            body: `${username}  mentioned you in ${truncatedText}`,
                        },
                    },
                };
            });
            const androidMessages = androidTokens.map((token) => {
                return {
                    token: token,
                    android: {
                        notification: {
                            title: `${username} mentioned you in a ${interaction.type}`,
                            body: `${username}  mentioned you in ${truncatedText}`,
                        },
                    },
                };
            });
            const messages = [...webMessages, ...androidMessages];

            const sendPromises = messages.map((message) =>
                admin.messaging().send(message)
            );
            await Promise.all(sendPromises);
        } catch (err) {
            //    console.error(err);
        }
};
export default sendNotification;
