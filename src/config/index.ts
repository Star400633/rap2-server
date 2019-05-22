import { IConfigOptions } from "../types";

// local or development or production
let configObj: IConfigOptions =
    (process.env.NODE_ENV === 'local' && require('./config.local')).default ||
    (process.env.NODE_ENV === 'development' && require('./config.prod')).default ||
    require('./config.dev').default

export default configObj
