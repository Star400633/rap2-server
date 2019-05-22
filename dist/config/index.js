Object.defineProperty(exports, "__esModule", { value: true });
let configObj = (process.env.NODE_ENV === 'local' && require('./config.local')).default ||
    (process.env.NODE_ENV === 'development' && require('./config.prod')).default ||
    require('./config.dev').default;
exports.default = configObj;
//# sourceMappingURL=index.js.map