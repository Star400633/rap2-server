var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const property_1 = require("../models/bo/property");
const md5 = require("md5");
const querystring = require("querystring");
const rp = require("request-promise");
const isMd5 = require('is-md5');
class MigrateService {
    static importRepoFromRAP1ProjectData(orgId, curUserId, projectData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!projectData || !projectData.id || !projectData.name)
                return false;
            let pCounter = 1;
            let mCounter = 1;
            let iCounter = 1;
            const repo = yield models_1.Repository.create({
                name: projectData.name,
                description: projectData.introduction,
                visibility: true,
                ownerId: curUserId,
                creatorId: curUserId,
                organizationId: orgId,
            });
            for (const module of projectData.moduleList) {
                const mod = yield models_1.Module.create({
                    name: module.name,
                    description: module.introduction,
                    priority: mCounter++,
                    creatorId: curUserId,
                    repositoryId: repo.id
                });
                for (const page of module.pageList) {
                    for (const action of page.actionList) {
                        const itf = yield models_1.Interface.create({
                            moduleId: mod.id,
                            name: `${page.name}-${action.name}`,
                            description: action.description,
                            url: action.requestUrl || '',
                            priority: iCounter++,
                            creatorId: curUserId,
                            repositoryId: repo.id,
                            method: getMethodFromRAP1RequestType(+action.requestType)
                        });
                        for (const p of action.requestParameterList) {
                            yield processParam(p, property_1.SCOPES.REQUEST);
                        }
                        for (const p of action.responseParameterList) {
                            yield processParam(p, property_1.SCOPES.RESPONSE);
                        }
                        function processParam(p, scope, parentId) {
                            return __awaiter(this, void 0, void 0, function* () {
                                const RE_REMARK_MOCK = /@mock=(.+)$/;
                                const ramarkMatchMock = RE_REMARK_MOCK.exec(p.remark);
                                const remarkWithoutMock = p.remark.replace(RE_REMARK_MOCK, '');
                                const name = p.identifier.split('|')[0];
                                let rule = p.identifier.split('|')[1] || '';
                                let type = (p.dataType || 'string').split('<')[0];
                                type = type[0].toUpperCase() + type.slice(1);
                                let value = (ramarkMatchMock && ramarkMatchMock[1]) || '';
                                if (/^function/.test(value))
                                    type = 'Function';
                                if (/^\$order/.test(value)) {
                                    type = 'Array';
                                    rule = '+1';
                                    let orderArgs = /\$order\((.+)\)/.exec(value);
                                    if (orderArgs)
                                        value = `[${orderArgs[1]}]`;
                                }
                                let description = [];
                                if (p.name)
                                    description.push(p.name);
                                if (p.remark && remarkWithoutMock)
                                    description.push(remarkWithoutMock);
                                const pCreated = yield models_1.Property.create({
                                    scope,
                                    name,
                                    rule,
                                    value,
                                    type,
                                    description: `${p.remark}${p.name ? ', ' + p.name : ''}`,
                                    priority: pCounter++,
                                    interfaceId: itf.id,
                                    creatorId: curUserId,
                                    moduleId: mod.id,
                                    repositoryId: repo.id,
                                    parentId: parentId || -1,
                                });
                                for (const subParam of p.parameterList) {
                                    processParam(subParam, scope, pCreated.id);
                                }
                            });
                        }
                    }
                }
            }
            return true;
        });
    }
    static checkAndFix() {
    }
    static checkPasswordMd5() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('  checkPasswordMd5');
            const users = yield models_1.User.findAll();
            if (users.length === 0 || isMd5(users[0].password)) {
                console.log('  users empty or md5 check passed');
                return;
            }
            for (const user of users) {
                if (!isMd5(user.password)) {
                    user.password = md5(md5(user.password));
                    yield user.save();
                    console.log(`handle user ${user.id}`);
                }
            }
        });
    }
    static importRepoFromRAP1DocUrl(orgId, curUserId, docUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const { projectId } = querystring.parse(docUrl.substring(docUrl.indexOf('?') + 1));
            let domain = docUrl;
            if (domain.indexOf('http') === -1) {
                domain = 'http://' + domain;
            }
            domain = domain.substring(0, domain.indexOf('/', domain.indexOf('.')));
            let result = yield rp(`${domain}/api/queryRAPModel.do?projectId=${projectId}`, {
                json: false,
            });
            result = JSON.parse(result);
            result = result.modelJSON;
            const safeEval = require('notevil');
            result = safeEval('(' + result + ')');
            return yield this.importRepoFromRAP1ProjectData(orgId, curUserId, result);
        });
    }
}
exports.default = MigrateService;
function getMethodFromRAP1RequestType(type) {
    switch (type) {
        case 1:
            return 'GET';
        case 2:
            return 'POST';
        case 3:
            return 'PUT';
        case 4:
            return 'DELETE';
        default:
            return 'GET';
    }
}
//# sourceMappingURL=migrate.js.map