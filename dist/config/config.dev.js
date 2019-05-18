Object.defineProperty(exports, "__esModule", { value: true });
let config = {
    version: '2.3',
    serve: {
        port: 6164,
    },
    keys: ['some secret hurr'],
    session: {
        key: 'rap2:sess',
    },
    db: {
        dialect: 'mysql',
        host: 'localhost',
        port: 3306,
        username: 'root',
        password: '58104038lpw',
        database: 'TEST_APP',
        pool: {
            max: 5,
            min: 0,
            idle: 10000,
        },
        logging: false,
    },
    redis: {},
    mail: {
        host: 'smtp-mail.outlook.com',
        port: 587,
        secure: false,
        auth: {
            user: 'rap2_notify@outlook.com',
            pass: ''
        }
    },
    mailSender: 'rap2_notify@outlook.com',
};
exports.default = config;
//# sourceMappingURL=config.dev.js.map