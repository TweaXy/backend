import prisma from '../prisma.js';
import { interactionSelectSchema } from './index.js';
/**
 * @namespace Service.Trend
 */

/**
 * Gets trends sorted by the number of tweets within each trend.
 *
 * @memberof Service.Trend
 * @function
 * @async
 * @param {number} limit - The maximum number of trends to retrieve.
 * @param {number} offset - The number of trends to skip before starting to collect the trends.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of trends sorted by tweet count.
 */
const getTrendsSorted = async (limit, offset) => {
    const trends = await prisma.trendsInteractions.groupBy({
        take: limit,
        skip: offset,
        by: 'trend',
        orderBy: {
            _count: {
                interactionID: 'desc',
            },
        },
        _count: {
            interactionID: true,
        },
    });
    return trends.map((trend) => {
        return {
            trend: trend.trend,
            count: trend._count.interactionID,
        };
    });
};

/**
 * Gets interactions for a specific trend.
 *
 * @memberof Service.Trend
 * @function
 * @async
 * @param {string} trend - The trend for which to retrieve interactions.
 * @returns {Promise<Array<InteractionSelectSchema>>} A promise that resolves to an array of interactions for the specified trend.
 */
const getTrendInteractions = async (trend) => {
    const interactions = await prisma.interactions.findMany({
        where: {
            trends: {
                some: {
                    trend: trend,
                },
            },
        },
        select: interactionSelectSchema,
    });
    return interactions;
};

/**
 * Gets interactions for a specific trend.
 *
 * @memberof Service.Trend
 * @function
 * @async
 * @returns {Promise<Number>} A promise that resolves to the total number of trends.
 */
const getTrendsTotalCount = async () => {
    const trendsCount = await prisma.trendsInteractions.groupBy({
        by: 'trend',
    });
    return trendsCount.length;
};

export default {
    getTrendsSorted,
    getTrendInteractions,
    getTrendsTotalCount,
};
