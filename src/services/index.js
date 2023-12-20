/**
 * @namespace Service
 */

/**
 * Interaction select schema for Prisma queries.
 * @typedef {Object} InteractionSelectSchema
 * @property {boolean} id - Indicates whether to select the 'id' field.
 * @property {boolean} createdDate - Indicates whether to select the 'createdDate' field.
 * @property {boolean} text - Indicates whether to select the 'text' field.
 * @property {boolean} media - Indicates whether to select the 'media' field.
 * @property {Object} user - User information select schema.
 * @property {boolean} user.id - Indicates whether to select the 'id' field for the user.
 * @property {boolean} user.name - Indicates whether to select the 'name' field for the user.
 * @property {boolean} user.username - Indicates whether to select the 'username' field for the user.
 * @property {boolean} user.avatar - Indicates whether to select the 'avatar' field for the user.
 * @property {Object} parentInteraction - Parent interaction select schema.
 * @property {boolean} parentInteraction.id - Indicates whether to select the 'id' field for the parent interaction.
 * @property {boolean} parentInteraction.createdDate - Indicates whether to select the 'createdDate' field for the parent interaction.
 * @property {boolean} parentInteraction.text - Indicates whether to select the 'text' field for the parent interaction.
 * @property {boolean} parentInteraction.media - Indicates whether to select the 'media' field for the parent interaction.
 * @property {Object} parentInteraction.user - User information select schema for the parent interaction.
 * @property {boolean} parentInteraction.user.id - Indicates whether to select the 'id' field for the parent interaction user.
 * @property {boolean} parentInteraction.user.name - Indicates whether to select the 'name' field for the parent interaction user.
 * @property {boolean} parentInteraction.user.username - Indicates whether to select the 'username' field for the parent interaction user.
 * @property {boolean} parentInteraction.user.avatar - Indicates whether to select the 'avatar' field for the parent interaction user.
 */
const interactionSelectSchema = {
    id: true,
    createdDate: true,
    text: true,
    media: true,
    user: {
        select: {
            id: true,
            name: true,
            username: true,
            avatar: true,
        },
    },
    parentInteraction: {
        select: {
            id: true,
            createdDate: true,
            text: true,
            media: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                },
            },
        },
    },
};

const userSchema = (currentUserID) => {
    return {
        user: {
            select: {
                id: true,
                name: true,
                username: true,
                avatar: true,
                bio: true,
                followedBy: {
                    select: {
                        userID: true,
                    },
                    where: {
                        userID: currentUserID,
                    },
                },
                following: {
                    select: {
                        followingUserID: true,
                    },
                    where: {
                        followingUserID: currentUserID,
                    },
                },
                blockedBy: {
                    select: {
                        userID: true,
                    },
                    where: {
                        userID: currentUserID,
                    },
                },
                blocking: {
                    select: {
                        blockingUserID: true,
                    },
                    where: {
                        blockingUserID: currentUserID,
                    },
                },
            },
        },
    };
};
export { interactionSelectSchema, userSchema };
