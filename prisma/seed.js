import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { init } from '@paralleldrive/cuid2';
import Chance from 'chance';
const chance = new Chance();

const prisma = new PrismaClient();
const createID = init({ length: 25 });
const minNameLength = 5; // Change this to your desired minimum length

const trendWords = new Set(); // Change this to your desired minimum length

function generateRandomName() {
    let name = faker.person.firstName();

    while (name.length < minNameLength) {
        // Regenerate a name until it meets the minimum length requirement
        name = faker.person.firstName();
    }

    return name;
}

function generateUniqueWord() {
    let condition = true;
    while (condition) {
        const word = faker.lorem.word({ length: { min: 5, max: 10 } });
        if (!trendWords.has(word)) {
            trendWords.add(word);
            return word;
        }
    }
}

const main = async () => {
    console.log('Start seeding ...');

    await prisma.user.deleteMany();
    let usersIDS = [];

    let interactionsIDS = [];

    /////////creating 10 users
    for (let i = 0; i < 100; i++) {
        let person = faker.person;
        let newID = createID();
        usersIDS.push(newID);
        const user1 = {
            data: {
                id: newID,
                username: `${person.firstName()}_${person.lastName()}`.replace(
                    /[^a-zA-Z0-9_]/g,
                    ''
                ),
                name: generateRandomName(),
                password: faker.helpers.arrayElement([
                    '$2a$08$ad.6THl.NHxdAYfgQIh5deg6YOtsfwTWvI7AM6II6jkgop05.n3SS',
                ]),
                email: `${person.firstName()}${i}${i + 1}@gmail.com`,
                phone: `0${chance.phone({ formatted: false })}`,
                birthdayDate: faker.date.birthdate(),
                location: faker.location.city(),
                avatar: process.env.DEFAULT_KEY,
            },
        };
        await prisma.user.create(user1);
    }

    await prisma.user.create({
        data: {
            id: createID(),
            username: 'kalawy_456',
            name: 'kalawy2',
            password: faker.helpers.arrayElement([
                '$2a$08$ad.6THl.NHxdAYfgQIh5deg6YOtsfwTWvI7AM6II6jkgop05.n3SS',
            ]),
            email: 'kalawy789@gmail.com',
            phone: '01220202020',
            birthdayDate: faker.date.birthdate(),
            location: faker.location.city(),
            avatar: process.env.DEFAULT_KEY,
        },
    });

    await prisma.user.create({
        data: {
            id: createID(),
            username: 'kalawy_123',
            name: 'kalawy1',
            password: faker.helpers.arrayElement([
                '$2a$08$ad.6THl.NHxdAYfgQIh5deg6YOtsfwTWvI7AM6II6jkgop05.n3SS',
            ]),
            email: 'kalawy123456@gmail.com',
            phone: '01220444020',
            birthdayDate: faker.date.birthdate(),
            location: faker.location.city(),
            avatar: process.env.DEFAULT_KEY,
        },
    });

    await prisma.user.create({
        data: {
            id: createID(),
            username: 'micheal_ehab',
            name: 'micheal',
            password: faker.helpers.arrayElement([
                '$2a$08$ad.6THl.NHxdAYfgQIh5deg6YOtsfwTWvI7AM6II6jkgop05.n3SS',
            ]),
            email: 'micheal123456@gmail.com',
            phone: '01155999668',
            birthdayDate: faker.date.birthdate(),
            location: faker.location.city(),
            avatar: process.env.DEFAULT_KEY,
        },
    });

    await prisma.user.create({
        data: {
            id: createID(),
            username: 'eman_ibrahim',
            name: 'eman',
            password: faker.helpers.arrayElement([
                '$2a$08$ad.6THl.NHxdAYfgQIh5deg6YOtsfwTWvI7AM6II6jkgop05.n3SS',
            ]),
            email: 'eman123456@gmail.com',
            phone: '01155995868',
            birthdayDate: faker.date.birthdate(),
            location: faker.location.city(),
            avatar: process.env.DEFAULT_KEY,
        },
    });

    ////creating 10 trends words
    for (let i = 0; i < 10; i++) {
        let trendWord = generateUniqueWord();
        trendWords.add(trendWord);
    }

    /////////creating 3 Tweets for each user
    let trentNumber = 0;
    let trendsItems = Array.from(trendWords);
    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 3; j++) {
            let newID = createID();
            interactionsIDS.push(newID);
            await prisma.interactions.create({
                data: {
                    id: newID,
                    type: 'TWEET',
                    text: `#${
                        trendsItems[trentNumber]
                    } \n ${faker.lorem.sentence()} `,
                    userID: usersIDS[i],
                },
            });
            trentNumber++;
            if (trentNumber == 10) trentNumber = 0;
        }
    }

    /////////put in each interaction trend
    trentNumber = 0;
    for (let i = 0; i < 300; i++) {
        await prisma.trendsInteractions.create({
            data: {
                trend: trendsItems[trentNumber],
                interactionID: interactionsIDS[i],
            },
        });
        trentNumber++;
        if (trentNumber == 10) trentNumber = 0;
    }

    /////////put in each user 3 following
    for (let i = 0; i < 50; i++) {
        for (let j = 1; j <= 3; j++) {
            await prisma.follow.create({
                data: {
                    userID: usersIDS[i],
                    followingUserID: usersIDS[i + j],
                },
            });
        }
    }

    /////////put 600 retweet
    let parent = 0;
    for (let i = 0; i < 70; i++) {
        for (let j = 0; j <= 1; j++) {
            await prisma.interactions.create({
                data: {
                    type: 'RETWEET',
                    userID: usersIDS[i],
                    text: faker.lorem.sentence(),
                    id: createID(),
                    parentInteractionID: interactionsIDS[parent],
                },
            });
            parent++;
        }
    }

    /////////put 60 comment

    for (let i = 70; i < 100; i++) {
        for (let j = 0; j <= 3; j++) {
            await prisma.interactions.create({
                data: {
                    type: 'COMMENT',
                    userID: usersIDS[i],
                    text: faker.lorem.sentence(),
                    id: createID(),
                    parentInteractionID: interactionsIDS[parent],
                },
            });
            parent++;
        }
    }

    /////////each user like 3 interactions
    let likeNumber = 300;
    for (let j = 0; j < 60; j++) {
        for (let i = 0; i < 3; i++) {
            likeNumber--;
            await prisma.likes.create({
                data: {
                    userID: usersIDS[j],
                    interactionID: interactionsIDS[likeNumber],
                },
            });
        }
    }

    ///////each user is mentioned 3 interactions
    let mentionNumber = 300;
    for (let i = 0; i < 50; i++) {
        for (let j = 0; j < 3; j++) {
            mentionNumber--;
            await prisma.mentions.create({
                data: {
                    userID: usersIDS[i],
                    interactionID: interactionsIDS[mentionNumber],
                },
            });
        }
    }

    console.log('finish seeding ...');
};

main()
    .catch(async (e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
