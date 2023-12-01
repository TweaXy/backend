import prisma from '../prisma.js';

/**
 * @namespace Service.Trend
 */

/**
 * Gets trends sorted by the number of tweets within each trend.
 *
 * @memberof Service.Trend
 * @method getTrendsSorted
 * @async
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of trends sorted by tweet count.
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
