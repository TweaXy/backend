import querystring from 'querystring';

import prisma from '../prisma.js';
import getFullUrl from './getFullUrl.js';
/**
 * @namespace Utils.Pagination
 */
/**
 * @typedef {Object} paginationParams
 * @memberof Utils.Pagination
 * @property {Object} pagination - An object containing pagination details.
 * @property {number} totalCount - The total count of items in the database.
 * @property {number} itemsCount - The number of items in the current page.
 * @property {string|null} nextPage - The URL for the next page, or null if there is no next page.
 * @property {string|null} prevPage - The URL for the previous page, or null if there is no previous page.
 */
/**
 * @typedef {Object} PaginatedResult
 * @memberof Utils.Pagination
 * @property {Object} data - An object containing the paginated items.
 * @property {Array} data.items - An array of items obtained from the database query.
 * @property {paginationParams} pagination - An object containing pagination details.
 */

/**
 * Retrieves the offset and limit values from the request query.
 * @method
 * @memberof Utils.Pagination
 * @param {Object} req - The HTTP request object.
 * @returns {{offset: number, limit: number}} An object containing the offset and limit values.
 * @throws {AppError} Throws an error if the offset is greater than the total count.
 */
const getOffsetAndLimit = (req) => {
    let { offset = '0', limit = '10' } = req.query;

    offset = Math.max(parseInt(offset), 0);
    limit = Math.min(parseInt(limit), 10);
    limit = Math.max(limit, 1);

    return { offset, limit };
};

/**
 * Retrieves the total count of items in the database for a given model.
 * @method
 * @memberof Utils.Pagination
 * @async
 * @param {string} model - The name of the Prisma model.
 * @returns {Promise<number>} The total count of items in the database.
 */
const getTotalCount = async (model) => {
    return await prisma[model].count();
};

/**
 * Calculates pagination data based on request parameters and query results.
 * @method
 * @memberof Utils.Pagination
 * @param {Object} req - The HTTP request object.
 * @param {number} offset - The offset value.
 * @param {number} limit - The limit value.
 * @param {number} totalCount - The total count of items in the database.
 * @param {Array} items - The array of items obtained from the database query.
 * @returns {paginationParams} An object containing pagination details.
 */
const calcualtePaginationData = (req, offset, limit, totalCount, items) => {
    const baseUrl = getFullUrl(req);

    const hasNextPage = offset + limit < totalCount;
    const hasPrevPage = offset > 0;

    const nextQuery = {
        ...req.query,
        limit,
        offset: offset + limit,
    };

    const prevQuery = {
        ...req.query,
        limit,
        offset: Math.max(0, offset - limit),
    };

    const nextPage = hasNextPage
        ? `${baseUrl}?${querystring.stringify(nextQuery)}`
        : null;
    const prevPage = hasPrevPage
        ? `${baseUrl}?${querystring.stringify(prevQuery)}`
        : null;

    return {
        totalCount,
        itemsCount: items.length,
        nextPage,
        prevPage,
    };
};

/**
 * Paginate through a collection of items in the database based on the provided request parameters.
 * @async
 * @method
 * @memberof Utils.Pagination
 * @param {Object} req - The HTTP request object.
 * @param {string} model - The name of the Prisma model to paginate.
 * @param {Object} baseSchema - The base Prisma schema to which pagination parameters will be added.
 * @returns {Promise<PaginatedResult>} An object containing paginated data and pagination details.
 * @throws {AppError} Throws an error if the offset is greater than the total count.

 */

const pagination = async (req, model, baseSchema) => {
    // 1. check on offset and limit
    let { offset, limit } = getOffsetAndLimit(req);

    // get total totalCount of model in db
    const totalCount = await getTotalCount(model);

    // 2. let offset be the last  if it is greater than totalCount
    offset = Math.min(offset, totalCount);
    // 3. add to db schema the offset and limit
    const schema = { ...baseSchema, take: limit, skip: offset };
    // 4. execute query
    const items = await prisma[model].findMany(schema);
    // 5. calcualte pagination data

    return {
        data: { items },
        pagination: calcualtePaginationData(
            req,
            offset,
            limit,
            totalCount,
            items
        ),
    };
};
export {
    getOffsetAndLimit,
    getTotalCount,
    calcualtePaginationData,
    pagination,
};
