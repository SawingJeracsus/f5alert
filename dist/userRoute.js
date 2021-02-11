"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var md5_1 = __importDefault(require("md5"));
var path_1 = __importDefault(require("path"));
var User_1 = require("../models/User");
var validateEmail_1 = require("../libs/validateEmail");
var registerSubmit_1 = require("./../letterTemplates/registerSubmit");
var nodemailer_1 = __importDefault(require("nodemailer"));
var config_1 = __importDefault(require("../libs/config"));
var transporter = nodemailer_1.default.createTransport({
    host: config_1.default.SMPT.HOST,
    port: config_1.default.SMPT.PORT,
    secure: true,
    auth: {
        user: config_1.default.SMPT.USER,
        pass: config_1.default.SMPT.PASSWORD
    }
});
// transporter.sendMail({
//     to: "wesage6693@boldhut.com",
//     from: "Razom",
//     subject: "Підтвердження реєстрації",
//     //@ts-ignore
//     html: regEmail`https://google.com`
// })
var userRouter = express_1.default.Router();
userRouter.get('/check/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var login, ref;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                login = req.query.login;
                return [4 /*yield*/, User_1.User.findOne({ login: login })];
            case 1:
                ref = _a.sent();
                !ref ? res.json({
                    code: 200,
                    message: 'Login is unique'
                }) : res.json({
                    code: 405,
                    message: "Login aren't unique!"
                });
                return [2 /*return*/];
        }
    });
}); });
userRouter.get('/check/email', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var email, ref;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                email = req.query.email;
                return [4 /*yield*/, User_1.User.findOne({ email: email })];
            case 1:
                ref = _a.sent();
                !ref ? res.json({
                    code: 200,
                    message: 'Email is unique'
                }) : res.json({
                    code: 405,
                    message: "Email aren't unique!"
                });
                return [2 /*return*/];
        }
    });
}); });
userRouter.get('/login', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, login, password, passwordHash, valid, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, login = _a.login, password = _a.password;
                passwordHash = password ? md5_1.default(password) : "";
                valid = false;
                return [4 /*yield*/, User_1.User.findOne({
                        login: login,
                        password: passwordHash
                    })];
            case 1:
                user = _b.sent();
                valid = true;
                if (!!user) return [3 /*break*/, 3];
                return [4 /*yield*/, User_1.User.findOne({
                        email: login,
                        password: passwordHash
                    })];
            case 2:
                user = _b.sent();
                if (!user) {
                    valid = false;
                }
                _b.label = 3;
            case 3:
                if (valid) {
                    res.json({
                        code: 200,
                        userId: user._id
                    });
                }
                else {
                    res.json({
                        code: 404,
                        message: "Invalid password or login/email"
                    });
                }
                return [2 /*return*/];
        }
    });
}); });
userRouter.post('/create', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, login, password, email, birthDay, redirectOn, errors, validateForExist, validateLength, validEmail, now, passwordHash, tokenEmailActivation_1, user;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, login = _a.login, password = _a.password, email = _a.email, birthDay = _a.birthDay, redirectOn = _a.redirectOn;
                errors = [];
                validateForExist = function (property, name) {
                    if (!property) {
                        errors.push(name + " has not recieved!");
                    }
                };
                validateLength = function (property, length, name) {
                    if (property.length < length) {
                        errors.push(name + " should containe minimum " + length + " charts!");
                    }
                };
                validateForExist(login, 'Login');
                validateForExist(password, 'Password');
                validateForExist(email, 'Email');
                validateForExist(birthDay, 'Birth date');
                typeof login === "string" ? validateLength(login, 6, 'Login') : errors.push("Invalid type of login");
                typeof password === "string" ? validateLength(password, 8, 'Password') : errors.push("Invalid type of password");
                validEmail = typeof email == "string" ? validateEmail_1.validateEmail(email) : errors.push("Invalid type of email");
                if (!validEmail) {
                    errors.push("Invalid format of email!");
                }
                if (!(errors.length !== 0)) return [3 /*break*/, 1];
                res.json({
                    code: 401,
                    errors: errors.length === 1 ? errors[0] : errors
                });
                return [3 /*break*/, 3];
            case 1:
                now = new Date();
                passwordHash = md5_1.default(password);
                tokenEmailActivation_1 = md5_1.default(login + password + Math.floor((Math.random() * 1000)).toString());
                user = new User_1.User({
                    login: login,
                    email: email,
                    password: passwordHash,
                    birthDay: birthDay,
                    create_at: now.toISOString(),
                    token: tokenEmailActivation_1
                });
                return [4 /*yield*/, user.save(function (err) {
                        if (err === null || err === void 0 ? void 0 : err.message) {
                            res.json({
                                code: 402,
                                message: 'Propably bad request!',
                                erorrs: err === null || err === void 0 ? void 0 : err.message
                            });
                        }
                        else {
                            transporter.sendMail({
                                to: email,
                                from: "Razom",
                                subject: "Підтвердження реєстрації",
                                html: registerSubmit_1.regEmail(redirectOn + "/" + tokenEmailActivation_1)
                            });
                            res.json({
                                code: 200,
                                message: "Successfully saved!"
                            });
                        }
                    })];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
userRouter.get('/confirm/:token', function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var token, __dirname, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                token = req.params.token;
                __dirname = path_1.default.resolve();
                return [4 /*yield*/, User_1.User.findOne({ token: token })];
            case 1:
                user = _a.sent();
                if (!user) return [3 /*break*/, 3];
                user.activated = true;
                return [4 /*yield*/, user.save()];
            case 2:
                _a.sent();
                res.json({
                    code: 200,
                    message: "Successfully updated!"
                });
                return [3 /*break*/, 4];
            case 3:
                res.json({
                    code: 404,
                    message: "Can't find user in DB"
                });
                _a.label = 4;
            case 4: return [2 /*return*/];
        }
    });
}); });
exports.default = userRouter;
