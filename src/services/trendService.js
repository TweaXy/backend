import prisma from '../prisma.js';

/**
 * get trends sorted by tweets within it
 * @async
 * @method
 * @returns {Trends} tends
 */
const getTrendsSorted = async () => {
    return await prisma.trends.findMany({
        take: 10,
        orderBy: {
            tweets: {
                _count: 'desc',
            },
        },
    });
};

export default {
    getTrendsSorted,
};
