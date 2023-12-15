import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    log: ['info', 'warn', 'error'],
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
const getUserConversations = async (userID) => {
    const conversations = await prisma.conversations.findMany({
        where: {
            OR: [
                {
                    user1ID: userID,
                },
                {
                    user2ID: userID,
                },
            ],
        },
        select: {
            user1: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                },
            },
            user2: {
                select: {
                    id: true,
                    name: true,
                    username: true,
                    avatar: true,
                },
            },
            DirectMessages: {
                select: {
                    id: true,
                    text: true,
                    createdDate: true,
                    seen: true,
                    media: true,
                    sender: {
                        select: {
                            id: true,
                            username: true,
                        },
                    },
                },
                take: 1,
                orderBy: {
                    createdDate: 'desc',
                },
            },
            _count: {
                select: {
                    DirectMessages: {
                        where: {
                            seen: false,
                        },
                    },
                },
            },
        },
    });
    return conversations.map((r) => {
        const { _count, ...ret } = r;
        return { ...ret, unseenCount: r._count.DirectMessages };
    });
};
const res = await getUserConversations('be0gpxmm8tz71mlgrgya1o0bh');

// Using destructuring to create a new object without the 'b' property

console.log(res);
export default prisma;
