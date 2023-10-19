import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const main = async () => {
    console.log('Start seeding ...');

    const user1 = await prisma.user.create({
        data: {
            email: 'a1@a.com',
            username: 'a1',
            name: 'a1',
        },
    });

    await prisma.user.create({
        data: {
            email: 'a2@a.com',
            username: 'a2',
            name: 'a2',
            following: {
                connect: { id: user1.id },
            },
        },
    });

    console.log('Seeding finished.');
};

main()
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
