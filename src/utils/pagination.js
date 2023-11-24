import querystring from 'querystring';

import prisma from '../prisma.js';
import AppError from '../errors/appError.js';
import getFullUrl from './getFullUrl.js';

export default async function pagination(req, model, baseSchema) {
    // 1. check on offset and limit
    let { offset = '0', limit = '10' } = req.query;

    offset = Math.max(parseInt(offset), 0);
    limit = Math.min(parseInt(limit), 10);

    // get total totalCount of model in db
    const totalCount = await prisma[model].count();
    // 2. throw error if offset is greater than total count
    if (offset >= totalCount) {
        return new AppError('offset is greater than total count', 400);
    }
    // 3. add to db schema the offset and limit
    const schema = { ...baseSchema, take: limit, skip: offset };
    // 4. execute query
    const items = await prisma[model].findMany(schema);
    // 5. calcualte pagination data
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
        data: { items },
        pagination: {
            totalCount,
            itemsCount: items.length,
            nextPage,
            prevPage,
        },
    };
}
