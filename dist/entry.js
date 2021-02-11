"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var actions_1 = require("./actions");
var User_1 = require("./models/User");
var config_1 = require("./config");
var telegraf_1 = require("telegraf");
var mongoose_1 = __importDefault(require("mongoose"));
var axios_1 = __importDefault(require("axios"));
var BOT_TOKEN = config_1.CONFIG.BOT_TOKEN;
var bot = new telegraf_1.Telegraf(BOT_TOKEN);
var masterMenu = function (masters) {
    return telegraf_1.Markup.inlineKeyboard(masters.map(function (master) {
        return [telegraf_1.Markup.button.callback(master.name, "master-" + master.id + "-" + master.name)];
    }));
};
var setUpDataBase = function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, mongoose_1.default.connect(config_1.CONFIG.MONGO_URI, {
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                    useCreateIndex: true
                })];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); };
var AppState = /** @class */ (function () {
    function AppState(propsRef) {
        this.propsRef = propsRef;
        this.id = 0;
    }
    AppState.prototype.set = function (prop, value) {
        this.propsRef[prop] = value;
        this.save();
    };
    AppState.prototype.setPayload = function (prop, value) {
        this.propsRef.payload[prop] = value;
        this.save();
    };
    AppState.prototype.get = function (prop) {
        return this.propsRef[prop];
    };
    AppState.prototype.getPayload = function (prop) {
        return this.propsRef.payload[prop];
    };
    AppState.prototype.setID = function (id) { this.id = id; };
    AppState.prototype.save = function () {
        return __awaiter(this, void 0, void 0, function () {
            var user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, User_1.User.findOne({ tel_id: this.id.toString() })
                        //@ts-ignore
                    ];
                    case 1:
                        user = _a.sent();
                        //@ts-ignore
                        user.appState = __assign({}, this.propsRef);
                        user === null || user === void 0 ? void 0 : user.save();
                        return [2 /*return*/];
                }
            });
        });
    };
    return AppState;
}());
var appState;
var user = null;
bot.use(function (ctx, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, userCheck;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                id = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.from.id;
                return [4 /*yield*/, User_1.User.findOne({ tel_id: id === null || id === void 0 ? void 0 : id.toString() })];
            case 1:
                userCheck = _b.sent();
                if (userCheck && id) {
                    //@ts-ignore
                    appState = new AppState(__assign({}, userCheck === null || userCheck === void 0 ? void 0 : userCheck.appState));
                    appState.setID(id);
                }
                user = userCheck;
                next();
                return [2 /*return*/];
        }
    });
}); });
bot.command('test', function (ctx) {
    //@ts-ignore
    axios_1.default.get(appState.getPayload('setUpLink') + "/tel_api/loadMasters.php", { params: { apikey: user.apikey } }).then(function (res) {
        var masters = JSON.parse(res.data.payload);
        var menu = masterMenu(masters);
        ctx.reply('Тепер ви можете обрати майстра, сповіщення про якого будуть вам надходити.', menu);
        bot.action(masters.map(function (master) { return "master-" + master.id; }), function (ctx) {
            console.log();
        });
    });
});
bot.start(function (ctx) { return __awaiter(void 0, void 0, void 0, function () {
    var id, newUser;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (!user) return [3 /*break*/, 1];
                ctx.reply('Ви уже користувалися цією командою....');
                return [3 /*break*/, 3];
            case 1:
                id = (_a = ctx.message) === null || _a === void 0 ? void 0 : _a.from.id;
                newUser = new User_1.User({
                    tel_id: id,
                    appState: {
                        action: actions_1.ACTIONS.WAITING,
                        payload: {}
                    }
                });
                ctx.reply("\u041F\u0440\u0438\u0432\u0456\u0442, \u044F \u043F\u043E\u043A\u043B\u0438\u043A\u0430\u043D\u0438\u0439 \u0441\u043F\u043E\u0432\u0456\u0449\u0430\u0442\u0438 \u043F\u0440\u043E \u043D\u0430\u0434\u0445\u043E\u0434\u0436\u0435\u043D\u044F\u044F \u043D\u043E\u0432\u0438\u0445 \u0440\u0435\u043C\u043E\u043D\u0442\u0456\u0432! \n\u0429\u043E\u0431 \u0440\u043E\u0437\u043F\u043E\u0447\u0430\u0442\u0438 \u043F\u0440\u043E\u0446\u0435\u0441 \u043D\u0430\u043B\u0430\u0448\u0442\u0443\u0432\u0430\u043D\u043D\u044F \u043D\u0430\u043F\u0438\u0448\u0438 /setup");
                return [4 /*yield*/, newUser.save()];
            case 2:
                _b.sent();
                _b.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); });
bot.command('setup', function (ctx) {
    ctx.reply("Ок, введіть посилання на ваш екземпляр CRM");
    appState.set('action', actions_1.ACTIONS.SETUP_LINK);
});
// bot.on('')
bot.on('message', function (ctx) {
    //@ts-ignore
    var text = ctx.message.text;
    switch (appState.get('action')) {
        case actions_1.ACTIONS.SETUP_LINK:
            axios_1.default.get(text + '/tel_api').then(function (res) {
                appState.setPayload('setUpLink', text);
                appState.set('action', actions_1.ACTIONS.SET_UP_LOGIN);
                ctx.reply('Вдалося!, тепер введіть логін!');
            }).catch(function (error) {
                ctx.reply("Не валідна посилання(");
            });
            break;
        case actions_1.ACTIONS.SET_UP_LOGIN:
            appState.setPayload('setUpLogin', text);
            ctx.reply("Тепер введіть ваш пароль");
            appState.set('action', actions_1.ACTIONS.SET_UP_PASSWORD);
            break;
        case actions_1.ACTIONS.SET_UP_PASSWORD:
            ctx.reply('Роблю спробу уввійти...');
            var params = {
                login: appState.getPayload('setUpLogin'),
                password: text
            };
            axios_1.default.get(appState.getPayload('setUpLink') + "/tel_api/login.php", { params: params }).then(function (res) {
                if (res.data.type === 'success') {
                    ctx.reply("Зв'язок з сервером встановлено!");
                    //@ts-ignore
                    user.apikey = res.data.apikey;
                    //@ts-ignore
                    user.save();
                    appState.set('action', actions_1.ACTIONS.MASTER_SELECT);
                    //@ts-ignore
                    axios_1.default.get(appState.getPayload('setUpLink') + "/tel_api/loadMasters.php", { params: { apikey: user.apikey } }).then(function (res) {
                        var masters = JSON.parse(res.data.payload);
                        var menu = masterMenu(masters);
                        ctx.reply('Тепер ви можете обрати майстра, сповіщення про якого будуть вам надходити.', menu);
                        bot.action(masters.map(function (master) { return "master-" + master.id + "-" + master.name; }), function (ctx) {
                            var masterID = ctx.match[0].split('-')[1];
                        });
                    });
                }
                else {
                    ctx.reply("Невірний логін, або пароль!");
                }
            });
            break;
    }
});
bot.launch();
setUpDataBase();
console.log('Bot has started!');
