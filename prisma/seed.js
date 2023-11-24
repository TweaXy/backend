import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { init } from '@paralleldrive/cuid2';
import Chance from 'chance';
const chance = new Chance();

const prisma = new PrismaClient();
const createID = init({ length: 25 });
const minNameLength = 4; // Change this to your desired minimum length

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
    let usersIDS = [];

    let trendsIDS = [];

    let interactionsIDS = [];

    /////////creating 10 users
    for (let i = 0; i < 10; i++) {
        let person = faker.person;
        let newID = createID();
        usersIDS.push(newID);
        await prisma.user.create({
            data: {
                id: newID,
                username: `${person.firstName()}_${person.lastName()}`,
                name: generateRandomName(),
                password: faker.helpers.arrayElement([
                    '$2a$08$ad.6THl.NHxdAYfgQIh5deg6YOtsfwTWvI7AM6II6jkgop05.n3SS',
                    '$2a$08$/nTMIO0QQAYxXwOJ18IUBeWAeea2lb1aE6XhnIxBN96BA.xjucbai',
                    '$2a$08$52kiBx2aGG898hg.VahyteFIC44a./VAz.B2zUz6AjqP/nggtcno6',
                ]),
                email: `${person.firstName()}@gmail.com`,
                phone: `0${chance.phone({ formatted: false })}`,
                birthdayDate: faker.date.birthdate(),
                location: faker.location.city(),
            },
        });
    }

    /////////creating 6 trends
    for (let j = 0; j < 6; j++) {
        let newTrend = createID();
        trendsIDS.push(newTrend);
        await prisma.trends.create({
            data: {
                id: newTrend,
                text: `#${generateUniqueWord()}`,
            },
        });
    }
    /////////creating 3 Tweets for each user
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 3; j++) {
            let newID = createID();
            interactionsIDS.push(newID);
            await prisma.interactions.create({
                data: {
                    id: newID,
                    type: 'TWEET',
                    text: faker.lorem.sentence(),
                    userID: usersIDS[i],
                },
            });
        }
    }

    /////////put in each iinteraction trend
    let trentNumber = 0;
    for (let i = 0; i < 30; i++) {
        await prisma.trendsInteractions.create({
            data: {
                trendID: trendsIDS[trentNumber],
                interactionID: interactionsIDS[i],
            },
        });
        trentNumber++;
        if (trentNumber == 6) trentNumber = 0;
    }

    /////////put in each user 3 following
    for (let i = 0; i < 5; i++) {
        for (let j = 1; j <= 3; j++) {
            await prisma.follow.create({
                data: {
                    userID: usersIDS[i],
                    followingUserID: usersIDS[i + j],
                },
            });
        }
    }

    /////////each user block 3 users
    for (let i = 5; i < 10; i++) {
        for (let j = 1; j <= 3; j++) {
            await prisma.blocks.create({
                data: {
                    userID: usersIDS[i],
                    blockingUserID: usersIDS[i - j],
                },
            });
        }
    }

    /////////each user block 3 users
    for (let i = 0; i < 5; i++) {
        for (let j = 1; j <= 3; j++) {
            await prisma.mutes.create({
                data: {
                    userID: usersIDS[i],
                    mutingUserID: usersIDS[i + j],
                },
            });
        }
    }

    /////////each user lik 3 interactions
    let likeNumber = 30;
    for (let j = 0; j < 10; j++) {
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
    let mentionNumber = 30;
    for (let i = 0; i < 10; i++) {
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
