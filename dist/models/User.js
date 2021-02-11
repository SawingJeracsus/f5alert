"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
var mongoose_1 = require("mongoose");
var UserSchema = new mongoose_1.Schema({
    tel_id: {
        type: String,
        required: true,
        unique: true
    },
    appState: {
        action: String,
        payload: Object
    },
    apikey: {
        type: String,
        unique: true
    }
});
exports.User = mongoose_1.model('User', UserSchema);
