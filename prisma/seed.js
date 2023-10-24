import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import Chance from 'chance';
const chance = new Chance();


const prisma = new PrismaClient();


const main = async () => {
    console.log('Start seeding ...');


    for (let i = 0; i < 10; i++) {
        const person = faker.person;
        await prisma.user.create({
            data: {
                username: `${person.firstName()}_${person.lastName()}`,
                name: person.firstName({}),
                password: faker.helpers.arrayElement([
                    '$2a$08$jfdElvFY5OaiC7oBgTT9WOlRLJ2cNfRxj98GXAoFteGuXjyHxpO46',
                    '$2a$08$wIyNnOdsMiNAU9orWqo1iO30mdQg/eIOfQqL44lF.IFSpAuCn8Yfq',
                    '$2a$08$XM/JeCP6NJVF97wRfJ2hGu5dbw.3WyZkIlnla5Y29cBg8vQ3L5EJ6']),
                email: `${person.firstName()}@gmail.com`,
                phone: `0${chance.phone({ formatted: false })}`,
                birthdayDate: faker.date.birthdate(),
                location: faker.location.city(),
                website: faker.internet.url(),
            }
        });
    }
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
