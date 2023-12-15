/**
 * Map raw database interactions to the required format.
 *
 * @method
 * @memberof Service.Interactions.Timeline
 * @param {object[]} interactions - The raw database interactions.
 * @returns {{ids: number[], data: Array<TimelineInteractionData>}} - The mapped data.
 */
const mapInteractions = (interactions) => {
    const ids = [];
    const data = interactions.map((interaction) => {
        //add ids
        ids.push(interaction.interactionId);

        //add parent id if exists
        if (interaction.parentID) ids.push(interaction.parentID);

        // map main interaction to required format
        const mainInteraction = {
            id: interaction.interactionId,
            text: interaction.text,
            createdDate: interaction.createdDate,
            type: interaction.type,
            media: interaction.Media?.split(',') ?? null,
            user: {
                id: interaction.UserId,
                username: interaction.Username,
                name: interaction.name,
                avatar: interaction.avatar,
            },
            likesCount: interaction.likesCount,
            viewsCount: interaction.viewsCount,
            retweetsCount: interaction.retweetsCount,
            commentsCount: interaction.commentsCount,
            isUserInteract: {
                isUserLiked: interaction.isUserLiked,
                isUserRetweeted: interaction.isUserRetweeted,
                isUserCommented: interaction.isUserCommented,
            },
            Irank: interaction.Irank,
        };

        // map parent interaction to required format if exist
        const parentInteraction =
            interaction.type !== 'RETWEET'
                ? null
                : {
                      id: interaction.parentID,
                      text: interaction.parentText,
                      createdDate: interaction.parentCreatedDate,
                      type: interaction.parentType,
                      media: interaction.parentMedia?.split(',') ?? null,
                      user: {
                          id: interaction.parentUserId,
                          username: interaction.parentUsername,
                          name: interaction.parentName,
                          avatar: interaction.parentAvatar,
                      },
                  };
        // return main and parent interaction mapped format
        return { mainInteraction, parentInteraction };
    });

    return { ids, data };
};

export default mapInteractions;
