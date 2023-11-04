import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';
import { init } from '@paralleldrive/cuid2';
import Chance from 'chance';
const chance = new Chance();


const prisma = new PrismaClient();
const createID = init({ length: 25 });
const minNameLength = 4; // Change this to your desired minimum length

function generateRandomName() {
    let name = faker.person.firstName();

    while (name.length < minNameLength) {
        // Regenerate a name until it meets the minimum length requirement
        name = faker.person.firstName();
    }

    return name;
}


const main = async () => {
    console.log('Start seeding ...');
    let usersIDS = [];
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
                    '$2a$08$52kiBx2aGG898hg.VahyteFIC44a./VAz.B2zUz6AjqP/nggtcno6']),
                email: `${person.firstName()}@gmail.com`,
                phone: `0${chance.phone({ formatted: false })}`,
                birthdayDate: faker.date.birthdate(),
                location: faker.location.city(),
            }
        });
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
