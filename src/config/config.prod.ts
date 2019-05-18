import { IConfigOptions } from "../types";

// 先从环境变量取配置
let config: IConfigOptions =  {
    version: '2.3',
    serve: {
        port: 4678,
    },
    keys: ['some secret hurr'],
    session: {
        key: 'rap2:sess',
    },
    db: {
        dialect: 'mysql',
        host: 'star93.site',
        port: 3306,
        username: 'root',
        password: '4038lpw',
        database: 'YP_MOCK',
        pool: {
            max: 80,
            min: 0,
            idle: 20000,
            acquire: 20000,
        },
        logging: false,
    },
    redis: {
        host: process.env.REDIS_URL || 'localhost',
        port: (process.env.REDIS_PORT && parseInt(process.env.REDIS_PORT)) || 6379
    },
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
}

export default config
