const separateMentionsTrends = (text) => {
    if (text == null || text == undefined) {
        return { mentions: null, trends: null };
    }
    // Regular expressions to find mentions and hashtags
    const mentionPattern = /@(\w+)/g;
    const hashtagPattern = /#(\w+)/g;

    // Find mentions and hashtags in the text
    const mentions = text.match(mentionPattern) || [];
    const trends = text.match(hashtagPattern) || [];

    return {
        mentions: mentions.map((mention) => mention.slice(1)), // Remove '@' from mentions
        trends: trends.map((hashtag) => hashtag.slice(1)), // Remove '#' from hashtags
    };
};
export default separateMentionsTrends;
