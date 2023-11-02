export default {
    definition: {
        openapi: '3.1.0',
        info: {
            title: 'TweaXy API with Swagger',
            version: '0.1.0',
            description:
                'This is a Social media API made with Express and documented with Swagger',
            license: {
                name: 'MIT',
                url: 'https://spdx.org/licenses/MIT.html',
            },
            contact: {
                name: 'TwitterBackendTeam',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};
