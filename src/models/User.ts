import {Schema, model} from 'mongoose'

const UserSchema = new Schema({
    tel_id: {
        type: String,
        required: true,
        unique: true
    },
    appState: {
        action: String,
        payload: Object
    }
})

export const User = model('User', UserSchema)