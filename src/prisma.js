import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});

prisma.$use(async (params, next) => {
    try {
        if (
            params.model == 'Interactions' ||
            params.model == 'User' ||
            params.model == 'DirectMessages'
        ) {
            if (
                params.action == 'delete' ||
                (params.action == 'deleteMany' &&
                    process.env.NODE_ENV != 'test')
            ) {
                params.action =
                    params.action === 'delete' ? 'update' : 'updateMany';
                if (!params.args) params.args = {};
                if (params.args.data)
                    params.args.data['deletedDate'] = new Date().toISOString();
                else
                    params.args.data = {
                        deletedDate: new Date().toISOString(),
                    };
            }
            if (
                params.action == 'findFirst' ||
                params.action == 'findUnique' ||
                params.action == 'findMany' ||
                params.action == 'update' ||
                params.action == 'updateMany'
            ) {
                if (params.args.where) params.args.where['deletedDate'] = null;
                else params.args.where = { deletedDate: null };
            }
        }
        return next(params);
    } catch (error) {
        console.error('Error in prisma middleware 🤯: ', error);
        return next(params);
    }
});

export default prisma;
