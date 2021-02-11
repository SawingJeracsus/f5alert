import { ACTIONS } from './actions';
import { User } from './models/User';
import { CONFIG } from './config';
import {Markup, Telegraf} from 'telegraf'
import mongoose from 'mongoose'
import axios from 'axios'

const BOT_TOKEN = CONFIG.BOT_TOKEN 

const bot = new Telegraf(BOT_TOKEN)


type master = {id: string, name:string}
const masterMenu = (masters: master[]) => {
    return Markup.inlineKeyboard(masters.map(master => {
        return [Markup.button.callback(master.name, "master-"+master.id+"-"+master.name)]
    }))
}

const setUpDataBase = async () => {
    await mongoose.connect(
        CONFIG.MONGO_URI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    )
}

class AppState {
    private id: number = 0
    constructor(
        private readonly propsRef: {[key: string]: any}
    ){}
    set(prop: string, value: any){
        this.propsRef[prop] = value
        this.save() 
    }
    setPayload(prop: string, value: any){
        this.propsRef.payload[prop] = value
        this.save()
    }
    get(prop: string){
        return this.propsRef[prop]
    }
    getPayload(prop: string){
        return this.propsRef.payload[prop]
    }
    setID(id: number){this.id = id}

    private async save(){
        const user = await User.findOne({tel_id: this.id.toString()})
        //@ts-ignore
        user.appState = {...this.propsRef}
        user?.save()
    }
}
let appState: AppState
let user: null | {[key: string]: any} = null

bot.use(async (ctx, next) => {
    const id = ctx.message?.from.id

    const userCheck = await User.findOne({tel_id: id?.toString()})
    if(userCheck && id){
        //@ts-ignore
        appState = new AppState({...userCheck?.appState})
        appState.setID(id)
    }
    user = userCheck
    next()
})
bot.command('test', ctx => {
    //@ts-ignore
    axios.get(appState.getPayload('setUpLink')+"/tel_api/loadMasters.php", {params: {apikey: user.apikey}}).then(res => {
        const masters: master[] = JSON.parse(res.data.payload)
        const menu = masterMenu(masters)
        ctx.reply('Тепер ви можете обрати майстра, сповіщення про якого будуть вам надходити.', menu)
        bot.action(masters.map(master => "master-"+master.id), ctx => {
            console.log();
            
        })
    })
})
bot.start(async ctx => {
    if(user){
        ctx.reply('Ви уже користувалися цією командою....')
    }else{
        const id = ctx.message?.from.id

        const newUser = new User({
            tel_id: id,
            appState: {
                action: ACTIONS.WAITING,
                payload: {}
            }
        })
        ctx.reply(`Привіт, я покликаний сповіщати про надходженяя нових ремонтів! 
Щоб розпочати процес налаштування напиши /setup`)
        await newUser.save()
    }

})

bot.command('setup', ctx => {
    ctx.reply("Ок, введіть посилання на ваш екземпляр CRM")
    appState.set('action', ACTIONS.SETUP_LINK)
})
// bot.on('')
bot.on('message', ctx => {
    //@ts-ignore
    const text: string = ctx.message.text

    switch(appState.get('action')){
        case ACTIONS.SETUP_LINK:
            axios.get(text+'/tel_api').then(res => {
                appState.setPayload('setUpLink', text)
                appState.set('action', ACTIONS.SET_UP_LOGIN)
                ctx.reply('Вдалося!, тепер введіть логін!')
            }).catch(error => {               
                ctx.reply("Не валідна посилання(")
            })
        break;
        case ACTIONS.SET_UP_LOGIN:
                appState.setPayload('setUpLogin', text)
                ctx.reply("Тепер введіть ваш пароль")
                appState.set('action', ACTIONS.SET_UP_PASSWORD)
        break;
        case ACTIONS.SET_UP_PASSWORD:
            ctx.reply('Роблю спробу уввійти...')       
            const params = {
                login: appState.getPayload('setUpLogin'),
                password: text
            }
            axios.get(appState.getPayload('setUpLink')+"/tel_api/login.php", {params}).then(res => {
                if(res.data.type === 'success'){
                    ctx.reply("Зв'язок з сервером встановлено!")
                    //@ts-ignore
                    user.apikey = res.data.apikey
                    //@ts-ignore
                    user.save()
                    appState.set('action', ACTIONS.MASTER_SELECT)
                    //@ts-ignore
                    axios.get(appState.getPayload('setUpLink')+"/tel_api/loadMasters.php", {params: {apikey: user.apikey}}).then(res => {
                        const masters: master[] = JSON.parse(res.data.payload)
                        const menu = masterMenu(masters)
                        ctx.reply('Тепер ви можете обрати майстра, сповіщення про якого будуть вам надходити.', menu)
                        bot.action(masters.map(master => "master-"+master.id+"-"+master.name), ctx => {
                            const masterID = ctx.match[0].split('-')[1]
                        })
                    })
                }else{
                    ctx.reply("Невірний логін, або пароль!")
                }
                
            })
        break;
    }
})


bot.launch()
setUpDataBase()
console.log('Bot has started!');    
