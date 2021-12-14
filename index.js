require('dotenv').config()
const { Telegraf } = require('telegraf')
const config = require('./config.js')
const bot = new Telegraf(config.TOKEN)

config.TZ = "Asia/Jakarta";

//database
const db = require('./config/connection')
const collection = require('./config/collection')
const saver = require('./database/filesaver')
const helpcommand = require('./help.js')

//DATABASE CONNECTION 
db.connect((err) => {
    if(err) { console.log('error connection db' + err); }
    else { console.log('db connected'); }
})

//ID Channel/Group
const channelId = `${config.CHANNELJOIN}`;

function today(ctx){
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var hours = today.getHours();
    var minutes = today.getMinutes();
    var seconds = today.getSeconds();
    return today = mm + '/' + dd + '/' + yyyy + ' ' + hours + ':' + minutes + ':' + seconds;
}

function today2(ctx){
    var today2 = new Date();
    var dd2 = String(today2.getDate()).padStart(2, '0');
    var mm2 = String(today2.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy2 = today2.getFullYear();
    var hours2 = today2.getHours();
    var minutes2 = today2.getMinutes();
    var seconds2 = today2.getSeconds();
    return today2 = mm2 + '/' + dd2 + '/' + yyyy2 + '-' + hours2 + ':' + minutes2 + ':' + seconds2;
}

//Function
function first_name(ctx){
    return `${ctx.from.first_name ? ctx.from.first_name : ""}`;
}
function last_name(ctx){
    return `${ctx.from.last_name ? ctx.from.last_name : ""}`;
}
function username(ctx){
    return ctx.from.username ? `@${ctx.from.username}` : "";
}
function fromid(ctx){
    return ctx.from.id ? `[${ctx.from.id}]` : "";
}
function captionbuild(ctx){
    return `${config.CAPTIONLINK}`;
}
function welcomejoin(ctx){
    return `${config.WELCOMEJOINBOT}\n\n${today(ctx)}`;
}
function messagewelcome(ctx){
    return `${config.MESSAGEWELCOMEBOT}\n\n${today(ctx)}`;
}
function messagebanned(ctx){
    return `⚠ YOU ARE BLOCKED DUE TO BOTS ABUSE.`;
}
function messagebotnoaddgroup(ctx){
    return `The bot has not yet entered the owner's channel/group.`;
}

//BOT START
bot.start(async(ctx)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 2_000);
    });
    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        //console.log(msgArray.length);
        let length = msgArray.length
        msgArray.shift()
        let query = msgArray.join(' ')
    
         user = {
            first_name:ctx.from.first_name,
            userId:ctx.from.id
        }
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
            //welcoming message on /start and ifthere is a query available we can send files
            if(length == 1){
                ctx.deleteMessage()
                const profile = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                if(!profile || profile.total_count == 0)
                    return ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                        parse_mode:'HTML',
                        disable_web_page_preview: true
                    })
                    ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                        parse_mode:'HTML',
                        disable_web_page_preview: true
                    })
            }else{
                let query2 = query;
                try{
                    const res2 = await saver.getFile2(query2)
                
                    function captionFunction2() {
                        ctx.reply(`${captionbuild(ctx)}`,{
                            parse_mode:'HTML'
                        })
                    }
                    if(res2.type=='video'){
                        ctx.deleteMessage()
                        let result = `${res2.uniqueId}`.replace(/-/g, '_');
                        let urls = 'https://t.me/c/' + channelId.replace('-100', '') + '/' + res2.messageId

                        if(!res2.caption) {
                            setTimeout(captionFunction2, 1000)
                            return ctx.replyWithVideo(res2.file_id,{caption: `#file${result} #size${res2.file_size}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: res2.type, callback_data: `none`},{text: `sender`, url: `${urls}`}]
                                    ]
                                }
                            });
                        }
                        ctx.replyWithVideo(res2.file_id,{caption: `${res2.caption} \n\n#file${result} #size${res2.file_size}`,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: res2.type, callback_data: `none`},{text: `sender`, url: `${urls}`}]
                                ]
                            }
                        });
                            setTimeout(captionFunction2, 1000)
                    }else if(res2.type=='photo'){
                        ctx.deleteMessage()
                        let result = `${res2.uniqueId}`.replace(/-/g, '_');
                        let urls = 'https://t.me/c/' + channelId.replace('-100', '') + '/' + res2.messageId
                        
                        if(!res2.caption) {
                            setTimeout(captionFunction2, 1000)
                            return ctx.replyWithPhoto(res2.file_id,{caption: `#file${result} #size${res2.file_size}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: res2.type, callback_data: `none`},{text: `sender`, url: `${urls}`}]
                                    ]
                                }
                            });
                        }
                        ctx.replyWithPhoto(res2.file_id,{caption: `${res2.caption} \n\n#file${result} #size${res2.file_size}`,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: res2.type, callback_data: `none`},{text: `sender`, url: `${urls}`}]
                                ]
                            }
                        });
                            setTimeout(captionFunction2, 1000)
                    }else if(res2.type=='document'){
                        ctx.deleteMessage()
                        let result = `${res2.uniqueId}`.replace(/-/g, '_');
                        let urls = 'https://t.me/c/' + channelId.replace('-100', '') + '/' + res2.messageId
                        
                        if(!res2.caption) {
                            setTimeout(captionFunction2, 1000)
                            return ctx.replyWithDocument(res2.file_id,{caption: `#file${result} #size${res2.file_size}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: res2.type, callback_data: `none`},{text: `sender`, url: `${urls}`}]
                                    ]
                                }
                            });
                        }
                        ctx.replyWithDocument(res2.file_id,{caption: `${res2.caption} \n\n#file${result} #size${res2.file_size}`,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: res2.type, callback_data: `none`},{text: `sender`, url: `${urls}`}]
                                ]
                            }
                        });
                            setTimeout(captionFunction2, 1000)
                    }
                }catch(error){
                    ctx.deleteMessage()
                    ctx.reply(`Media not found or has been removed`)
                }
            }
        }else{
            try {
                var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
                var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
                //console.log(member);
                if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                    const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                    await saver.checkBan(`${ctx.from.id}`).then((res) => {
                        //console.log(res);
                        if(res == true) {
                            if(ctx.chat.type == 'private') {
                                ctx.deleteMessage()
                                ctx.reply(`${messagebanned(ctx)}`)
                            }
                        }else{
                            ctx.deleteMessage()
                            if(!profile2 || profile2.total_count == 0)
                                return ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                                    parse_mode:'HTML',
                                    disable_web_page_preview: true
                                })
                                ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                                    parse_mode:'HTML',
                                    disable_web_page_preview: true
                                })
                        }
                    })
                }else{
                    //welcoming message on /start and ifthere is a query available we can send files
                    if(length == 1){
                        const profile3 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                            await saver.checkBan(`${ctx.from.id}`).then((res) => {
                                //console.log(res);
                                if(res == true) {
                                    if(ctx.chat.type == 'private') {
                                        ctx.deleteMessage()
                                        ctx.reply(`${messagebanned(ctx)}`)
                                    }
                                }else{
                                    ctx.deleteMessage()
                                    if(!profile3 || profile3.total_count == 0)
                                        return ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true
                                        })
                                        ctx.replyWithPhoto(profile3.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true
                                        })
                                }
                            })
                        }else{
                            let query2 = query;
                            try{
                                const res2 = await saver.getFile2(query2)
                            
                                function captionFunction2() {
                                    ctx.reply(`${captionbuild(ctx)}`,{
                                        parse_mode:'HTML'
                                    })
                                }
                                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                                    //console.log(res);
                                    if(res == true) {
                                        if(ctx.chat.type == 'private') {
                                            ctx.deleteMessage()
                                            ctx.reply(`${messagebanned(ctx)}`)
                                        }
                                    }else{
                                        if(res2.type=='video'){
                                            ctx.deleteMessage()
                                            let result = `${res2.uniqueId}`.replace(/-/g, '_');
                                            let urls = 'https://t.me/c/' + channelId.replace('-100', '') + '/' + res2.messageId
                                            
                                            if(!res2.caption) {
                                                setTimeout(captionFunction2, 1000)
                                                return ctx.replyWithVideo(res2.file_id,{caption: `#file${result} #size${res2.file_size}`,
                                                    parse_mode:'HTML',
                                                    disable_web_page_preview: true,
                                                    reply_markup:{
                                                        inline_keyboard:[
                                                            [{text: res2.type, callback_data: `none`},{text: `sender`, url: `${urls}`}]
                                                        ]
                                                    }
                                                });
                                            }
                                            ctx.replyWithVideo(res2.file_id,{caption: `${res2.caption} \n\n#file${result} #size${res2.file_size}`,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                reply_markup:{
                                                    inline_keyboard:[
                                                        [{text: res2.type, callback_data: `none`},{text: `sender`, url: `${urls}`}]
                                                    ]
                                                }
                                            });
                                                setTimeout(captionFunction2, 1000)
                                        }else if(res2.type=='photo'){
                                            ctx.deleteMessage()
                                            let result = `${res2.uniqueId}`.replace(/-/g, '_');
                                            let urls = 'https://t.me/c/' + channelId.replace('-100', '') + '/' + res2.messageId
                                            
                                            if(!res2.caption) {
                                                setTimeout(captionFunction2, 1000)
                                                return ctx.replyWithPhoto(res2.file_id,{caption: `#file${result} #size${res2.file_size}`,
                                                    parse_mode:'HTML',
                                                    disable_web_page_preview: true,
                                                    reply_markup:{
                                                        inline_keyboard:[
                                                            [{text: res2.type, callback_data: `none`},{text: `sender`, url: `${urls}`}]
                                                        ]
                                                    }
                                                });
                                            }
                                            ctx.replyWithPhoto(res2.file_id,{caption: `${res2.caption} \n\n#file${result} #size${res2.file_size}`,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                reply_markup:{
                                                    inline_keyboard:[
                                                        [{text: res2.type, callback_data: `none`},{text: `sender`, url: `${urls}`}]
                                                    ]
                                                }
                                            });
                                                setTimeout(captionFunction2, 1000)
                                        }else if(res2.type=='document'){
                                            ctx.deleteMessage()
                                            let result = `${res2.uniqueId}`.replace(/-/g, '_');
                                            let urls = 'https://t.me/c/' + channelId.replace('-100', '') + '/' + res2.messageId
                                            
                                            if(!res2.caption) {
                                                setTimeout(captionFunction2, 1000)
                                                return ctx.replyWithDocument(res2.file_id,{caption: `#file${result} #size${res2.file_size}`,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                reply_markup:{
                                                    inline_keyboard:[
                                                        [{text: res2.type, callback_data: `none`},{text: `sender`, url: `${urls}`}]
                                                    ]
                                                }
                                            });
                                            }
                                            ctx.replyWithDocument(res2.file_id,{caption: `${res2.caption} \n\n#file${result} #size${res2.file_size}`,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                reply_markup:{
                                                    inline_keyboard:[
                                                        [{text: res2.type, callback_data: `none`},{text: `sender`, url: `${urls}`}]
                                                    ]
                                                }
                                            });
                                                setTimeout(captionFunction2, 1000)
                                        }
                                    }
                                })
                            }catch(error){
                                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                                    //console.log(res);
                                    if(res == true) {
                                        if(ctx.chat.type == 'private') {
                                            ctx.reply(`${messagebanned(ctx)}`)
                                        }
                                    }else{
                                        ctx.deleteMessage()
                                        ctx.reply(`Media not found or has been removed`)
                                    }
                                })
                            }
                        }
                    }
                }
            catch(error){
                ctx.deleteMessage()
                ctx.reply(`${messagebotnoaddgroup(ctx)}`)
            }
        }
        //saving user details to the database
        saver.saveUser(user)
    }
})

//TEST BOT
bot.hears(/ping/i,async(ctx)=>{
    if(ctx.chat.type == 'private') {
        await saver.checkBan(`${ctx.from.id}`).then((res) => {
            //console.log(res);
            if(res == true) {
                if(ctx.chat.type == 'private') {
                    ctx.reply(`${messagebanned(ctx)}`)
                }
            }else{
                let chatId = ctx.message.from.id;
                let opts = {
                    reply_to_message_id: ctx.message.message_id,
                    reply_markup:{
                        inline_keyboard: [[{text:'OK',callback_data:'PONG'}]]
                    }
                }
                return bot.telegram.sendMessage(chatId, 'pong' , opts);
            }
        })
    }
})

bot.action('PONG',async(ctx)=>{
    ctx.deleteMessage()
})

//GROUP COMMAND
bot.command('reload',async(ctx)=>{

    var botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
    var memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)
    //console.log(memberstatus);
    group = {
        groupId:ctx.chat.id
    }
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        if(memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
            ctx.reply('Bot restarted')
            saver.saveGroup(group)
        }
        if(ctx.from.username == 'GroupAnonymousBot'){
            ctx.reply('Bot restarted')
            saver.saveGroup(group)
        }
    }
})

bot.command('kick',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function kick() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){    
                        if(memberstatus.can_restrict_members == true){                
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.kickChatMember(ctx.chat.id, args[0]).then(result=>{
                                    //console.log(result)
                                })
                            }
                            await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(result=>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        if(ctx.message.reply_to_message == undefined){
                            let args = ctx.message.text.split(" ").slice(1)
                            await bot.telegram.kickChatMember(ctx.chat.id, args[0]).then(result=>{
                                //console.log(result)
                            })
                        }
                        await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(result=>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.kickChatMember(ctx.chat.id, args[0]).then(result=>{
                                    //console.log(result)
                                })
                            }
                            await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(result=>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        kick()
    })
})

bot.command('ban',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function ban() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        if(memberstatus.can_restrict_members == true){
                            if(ctx.message.reply_to_message == undefined){

                                const str = ctx.message.text;
                                const words = str.split(/ +/g);
                                const command = words.shift().slice(1);
                                const userId = words.shift();
                                const caption = words.join(" ");
                                const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                                await bot.telegram.callApi('banChatMember', {
                                chat_id: ctx.message.chat.id,
                                user_id: userId
                                }).then(result=>{
                                    //console.log(result)
                                    ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                        parse_mode: 'HTML',
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    return bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`)
                                })
                            }

                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: ctx.message.reply_to_message.from.id
                            }).then(result=>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                    parse_mode: 'HTML',
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        if(ctx.message.reply_to_message == undefined){

                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const userId = words.shift();
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: userId
                            }).then(result=>{
                                //console.log(result)
                                ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                    parse_mode: 'HTML',
                                    reply_to_message_id: ctx.message.message_id
                                })
                                return bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`)
                             })
                        }

                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");
                        const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                        await bot.telegram.callApi('banChatMember', {
                        chat_id: ctx.message.chat.id,
                        user_id: ctx.message.reply_to_message.from.id
                        }).then(result=>{
                            //console.log(result)
                            let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                            let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                            ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                parse_mode: 'HTML',
                                reply_to_message_id: ctx.message.reply_to_message.message_id
                            })
                            return bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`)
                         })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            if(ctx.message.reply_to_message == undefined){

                                const str = ctx.message.text;
                                const words = str.split(/ +/g);
                                const command = words.shift().slice(1);
                                const userId = words.shift();
                                const caption = words.join(" ");
                                const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";
    
                                await bot.telegram.callApi('banChatMember', {
                                chat_id: ctx.message.chat.id,
                                user_id: userId
                                }).then(result=>{
                                    //console.log(result)
                                    ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                        parse_mode: 'HTML',
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    return bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`)
                                })
                            }
    
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";
    
                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: ctx.message.reply_to_message.from.id
                            }).then(result=>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                    parse_mode: 'HTML',
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`)
                            })
                        }
                    }
                }
            }
        }
        ban()
    })
})

bot.command('unban',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function unban() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        if(memberstatus.can_restrict_members == true){
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.unbanChatMember(ctx.chat.id, args[0]).then(result=>{
                                    //console.log(result)
                                    ctx.reply(`[${args[0]}] not blocked, can re-enter!`,{
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    return bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                                })
                            }
                            await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(result=>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        if(ctx.message.reply_to_message == undefined){
                            let args = ctx.message.text.split(" ").slice(1)
                            await bot.telegram.unbanChatMember(ctx.chat.id, args[0]).then(result=>{
                                //console.log(result)
                                ctx.reply(`[${args[0]}] not blocked, can re-enter!`,{
                                    reply_to_message_id: ctx.message.message_id
                                })
                                return bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                        await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(result=>{
                            //console.log(result)
                            let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                            let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                            ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                reply_to_message_id: ctx.message.reply_to_message.message_id
                            })
                            return bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.unbanChatMember(ctx.chat.id, args[0]).then(result=>{
                                    //console.log(result)
                                    ctx.reply(`[${args[0]}] not blocked, can re-enter!`,{
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    return bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                                })
                            }
                            await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(result=>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                    }
                }
            }
        }
        unban()
    })
})

bot.command('pin',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function pin() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        if(memberstatus.can_pin_messages == true){
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(result=>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                            disable_notification: false,
                        }).then(result=>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(result=>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        pin()
    })
})

bot.command('unpin',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function unpin() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'administrator'){
                        if(memberstatus.can_pin_messages == true){
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(result=>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(result=>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(result=>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        unpin()
    })
})

bot.command('send',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function send() {
            for (const group of groupId) {
                var botStatus = await bot.telegram.getChatMember(group, ctx.botInfo.id)
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
                    if(memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
    
                            return bot.telegram.sendMessage(group, `${caption}`)
                        }
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return bot.telegram.sendMessage(group, `${caption}`,{
                            reply_to_message_id: ctx.message.reply_to_message.message_id
                        })
                    }
                    if(ctx.from.username == 'GroupAnonymousBot'){
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
    
                            return bot.telegram.sendMessage(group, `${caption}`)
                        }
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return bot.telegram.sendMessage(group, `${caption}`,{
                            reply_to_message_id: ctx.message.reply_to_message.message_id
                        })
                    }
                }
            }
        }
        send()
    })
})
//END

//check account
bot.command('getid',async(ctx)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 2_000);
    });
  
    if(ctx.chat.type == 'private') {
        const profile4 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
        await saver.checkBan(`${ctx.from.id}`).then((res) => {
            //console.log(res);
            if(res == true) {
                if(ctx.chat.type == 'private') {
                    ctx.reply(`${messagebanned(ctx)}`)
                }
            }else{
                if(!profile4 || profile4.total_count == 0){
                    ctx.reply(`<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n<b>Username:</b> ${username(ctx)}\n<b>ID:</b> ${ctx.from.id}`,{
                        parse_mode:'HTML'  
                    })
                }else{
                    ctx.replyWithPhoto(profile4.photos[0][0].file_id,{caption: `<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n<b>Username:</b> ${username(ctx)}\n<b>ID:</b> ${ctx.from.id}`,
                        parse_mode:'HTML'
                    })
                }
            }
        })
    }
})

//remove files with file_id
bot.command('rem', (ctx) => {

    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text2 = msgArray.join(' ')
        let text = `${text2}`.replace(/_/g, '-');
        console.log(text);
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
            saver.removeFile(text)
            ctx.reply('❌ 1 media deleted successfully')
        }
    }
})

//remove whole collection(remove all files)
bot.command('clear',(ctx)=>{

    if(ctx.chat.type == 'private') {
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
            saver.deleteCollection()
            ctx.reply('❌ All media deleted successfully')
        }
    }
})

//removing all files sent by a user
bot.command('remall', (ctx) => {

    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        //console.log(text);
        let id = parseInt(text)
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
            saver.removeUserFile(id)
            ctx.reply('❌ Delete all user media successfully')
        }
    }
})

bot.command('sendchat',async(ctx)=>{
    groupDetails = await saver.getGroup().then((res)=>{
        n = res.length
        groupId = []
        for (i = n-1; i >=0; i--) {
            groupId.push(res[i].groupId)
        }
        async function sendchat() {
            for (const group of groupId) {
                var memberstatus = await bot.telegram.getChatMember(group, ctx.from.id)
                //console.log(memberstatus);

                if(memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
                    const str = ctx.message.text;
                    const words = str.split(/ +/g);
                    const command = words.shift().slice(1);
                    const userId = words.shift();
                    const caption = words.join(" ");
                    ctx.reply('Sent!',{
                        reply_to_message_id: ctx.message.message_id
                    })
                    return bot.telegram.sendMessage(userId, `${caption}`)
                }
            }
        }

        if(ctx.chat.type == 'private') {
            if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
                const str = ctx.message.text;
                const words = str.split(/ +/g);
                const command = words.shift().slice(1);
                const userId = words.shift();
                const caption = words.join(" ");
                ctx.reply('Sent!',{
                    reply_to_message_id: ctx.message.message_id
                })

                return bot.telegram.sendMessage(userId, `${caption}`)
            }

            sendchat()
        }
    })
})

//broadcasting message to bot users(from last joined to first)
bot.command('broadcast',async(ctx)=>{

    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        userDetails = await saver.getUser().then((res)=>{
            n = res.length
            userId = []
            for (i = n-1; i >=0; i--) {
                userId.push(res[i].userId)
            }

            //broadcasting
            totalBroadCast = 0
            totalFail = []

            //creating function for broadcasting and to know bot user status
            async function broadcast(text) {
                for (const users of userId) {
                    try {
                        await bot.telegram.sendMessage(users, String(text),{
                            parse_mode:'HTML',
                            disable_web_page_preview: true
                          }
                        )
                    } catch (err) {
                        saver.updateUser(users)
                        totalFail.push(users)

                    }
                }
                ctx.reply(`✅ <b>Number of active users:</b> ${userId.length - totalFail.length}\n❌ <b>Total failed broadcasts:</b> ${totalFail.length}`,{
                    parse_mode:'HTML'
                })

            }
            if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
                broadcast(text)
                ctx.reply('Broadcast starts (Message is broadcast from last joined to first).')

            }else{
                ctx.reply(`Commands can only be used by Admin.`) 
            }

        })
    }
})

//ban user with user id
bot.command('banchat', (ctx) => {
    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        //console.log(text)
        userId = {
            id: text
        }

        if(ctx.chat.type == 'private') {
            if(ctx.from.id == config.ADMIN|| ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2){
                saver.banUser(userId).then((res) => {
                    ctx.reply('❌ Banned')
                })
            }
        }
    }
    
})

//unban user with user id
bot.command('unbanchat', (ctx) => {
    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        //console.log(text)
        userId = {
            id: text
        }

        if(ctx.chat.type == 'private') {
            if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
                saver.unBan(userId).then((res) => {
                    ctx.reply('✅ Finished')
                })
            }
        }
    }
})

//saving documents to db and generating link
bot.on('document', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 2_000);
    });
    await next();
  
    if(ctx.chat.type == 'private') {
        document = ctx.message.document
    }

    if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
        if(document.file_name == undefined){
            if(ctx.chat.type == 'private'){
                await saver.checkFile(`${document.file_unique_id}`).then(async res => {
                    let result = `${document.file_unique_id}`.replace(/-/g, '_');
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists. #file${result}`)
                    }else{
                        await ctx.reply(`✔️ Thank you for sending.\nSearch #file${result}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                        if(ctx.message.caption == undefined){
                            const data1 = await ctx.reply(`#document #file${result} #size${document.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                chat_id: config.LOG_CHANNEL,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                disable_notification: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${document.file_unique_id}`}]
                                    ]
                                }
                            })
                            if(ctx.chat.type == 'private') {
                                fileDetails1 = {
                                    file_name: today2(ctx),
                                    userId:ctx.from.id,
                                    file_id: document.file_id,
                                    caption: ctx.message.caption,
                                    file_size: document.file_size,
                                    uniqueId: document.file_unique_id,
                                    messageId: data1.message_id,
                                    type: 'document'
                                }
                                saver.saveFile(fileDetails1)
                            }
                            return;
                        }
                        const data2 = await ctx.reply(`${ctx.message.caption}\n\n#document #file${result} #size${document.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                            chat_id: config.LOG_CHANNEL,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            disable_notification: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${document.file_unique_id}`}]
                                ]
                            }
                        })
                        if(ctx.chat.type == 'private') {
                            fileDetails1 = {
                                file_name: today2(ctx),
                                userId:ctx.from.id,
                                file_id: document.file_id,
                                caption: ctx.message.caption,
                                file_size: document.file_size,
                                uniqueId: document.file_unique_id,
                                messageId: data2.message_id,
                                type: 'document'
                            }
                            saver.saveFile(fileDetails1)
                        }
                    }
                })
            }
        }else{
            if(ctx.chat.type == 'private'){
                await saver.checkFile(`${document.file_unique_id}`).then(async res => {
                    let result = `${document.file_unique_id}`.replace(/-/g, '_');
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists. #file${result}`)
                    }else{
                        await ctx.reply(`✔️ Thank you for sending.\nSearch #file${result}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                        if(ctx.message.caption == undefined){
                            const data1 = await ctx.reply(`#document #file${result} #size${document.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                chat_id: config.LOG_CHANNEL,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                disable_notification: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${document.file_unique_id}`}]
                                    ]
                                }
                            })
                            if(ctx.chat.type == 'private') {
                                var exstension = document.file_name;
                                var regex = /\.[A-Za-z0-9]+$/gm
                                var doctext = exstension.replace(regex, '');
                                fileDetails2 = {
                                    file_name: doctext,
                                    userId:ctx.from.id,
                                    file_id: document.file_id,
                                    caption: ctx.message.caption,
                                    file_size: document.file_size,
                                    uniqueId: document.file_unique_id,
                                    messageId: data1.message_id,
                                    type: 'document'
                                }
                                saver.saveFile(fileDetails2)
                            }
                            return;
                        }
                        const data2 = await ctx.reply(`${ctx.message.caption}\n\n#document #file${result} #size${document.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                            chat_id: config.LOG_CHANNEL,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            disable_notification: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${document.file_unique_id}`}]
                                ]
                            }
                        })
                        if(ctx.chat.type == 'private') {
                            var exstension = document.file_name;
                            var regex = /\.[A-Za-z0-9]+$/gm
                            var doctext = exstension.replace(regex, '');
                            fileDetails2 = {
                                file_name: doctext,
                                userId:ctx.from.id,
                                file_id: document.file_id,
                                caption: ctx.message.caption,
                                file_size: document.file_size,
                                uniqueId: document.file_unique_id,
                                messageId: data2.message_id,
                                type: 'document'
                            }
                            saver.saveFile(fileDetails2)
                        }
                    }
                })
            }
        }
    }else{
        //try{
            var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member);
            if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                    //console.log(res);
                    if(res == true) {
                        if(ctx.chat.type == 'private') {
                            ctx.reply(`${messagebanned(ctx)}`)
                        }
                    }else{
                      if(ctx.chat.type == 'private') {
                        if(!profile2 || profile2.total_count == 0)
                            return ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                                parse_mode:'HTML',
                                disable_web_page_preview: true
                            })
                            ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true
                            })
                       }
                    }
                })
            }else{
                if(ctx.chat.type == 'private') {
                    document = ctx.message.document
                }
                
                if(document.file_name == undefined){
                    if(ctx.chat.type == 'private'){
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            let result = `${document.file_unique_id}`.replace(/-/g, '_');
                            //console.log(res);
                            if(res == true) {
                                ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${document.file_unique_id}`).then(async res => {
                                    let result = `${document.file_unique_id}`.replace(/-/g, '_');
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File already exists. #file${result}`)
                                    }else{
                                        await ctx.reply(`✔️ Thank you for sending.\nSearch #file${result}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(ctx.message.caption == undefined){
                                            const data1 = await ctx.reply(`#document #file${result} #size${document.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                                chat_id: config.LOG_CHANNEL,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                disable_notification: true,
                                                reply_markup:{
                                                    inline_keyboard:[
                                                        [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${document.file_unique_id}`}]
                                                    ]
                                                }
                                            })
                                            if(ctx.chat.type == 'private') {
                                                fileDetails1 = {
                                                    file_name: today2(ctx),
                                                    userId:ctx.from.id,
                                                    file_id: document.file_id,
                                                    caption: ctx.message.caption,
                                                    file_size: document.file_size,
                                                    uniqueId: document.file_unique_id,
                                                    messageId: data1.message_id,
                                                    type: 'document'
                                                }
                                                saver.saveFile(fileDetails1)
                                            }
                                            return;
                                        }
                                        const data2 = await ctx.reply(`${ctx.message.caption}\n\n#document #file${result} #size${document.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                            chat_id: config.LOG_CHANNEL,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            disable_notification: true,
                                            reply_markup:{
                                                inline_keyboard:[
                                                    [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${document.file_unique_id}`}]
                                                ]
                                            }
                                        })
                                        if(ctx.chat.type == 'private') {
                                            fileDetails1 = {
                                                file_name: today2(ctx),
                                                userId:ctx.from.id,
                                                file_id: document.file_id,
                                                caption: ctx.message.caption,
                                                file_size: document.file_size,
                                                uniqueId: document.file_unique_id,
                                                messageId: data2.message_id,
                                                type: 'document'
                                            }
                                            saver.saveFile(fileDetails1)
                                        }
                                    }
                                })
                            }
                        })
                    }
                }else{
                    if(ctx.chat.type == 'private'){
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${document.file_unique_id}`).then(async res => {
                                    let result = `${document.file_unique_id}`.replace(/-/g, '_');
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File already exists. #file${result}`)
                                    }else{
                                        await ctx.reply(`✔️ Thank you for sending.\nSearch #file${result}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(ctx.message.caption == undefined){
                                            const data1 = await ctx.reply(`#document #file${result} #size${document.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                                chat_id: config.LOG_CHANNEL,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                disable_notification: true,
                                                reply_markup:{
                                                    inline_keyboard:[
                                                        [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${document.file_unique_id}`}]
                                                    ]
                                                }
                                            })
                                            if(ctx.chat.type == 'private') {
                                                var exstension = document.file_name;
                                                var regex = /\.[A-Za-z0-9]+$/gm
                                                var doctext = exstension.replace(regex, '');
                                                fileDetails2 = {
                                                    file_name: doctext,
                                                    userId:ctx.from.id,
                                                    file_id: document.file_id,
                                                    caption: ctx.message.caption,
                                                    file_size: document.file_size,
                                                    uniqueId: document.file_unique_id,
                                                    messageId: data1.message_id,
                                                    type: 'document'
                                                }
                                                saver.saveFile(fileDetails2)
                                            }
                                            return;
                                        }
                                        const data2 = await ctx.reply(`${ctx.message.caption}\n\n#document #file${result} #size${document.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                            chat_id: config.LOG_CHANNEL,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            disable_notification: true,
                                            reply_markup:{
                                                inline_keyboard:[
                                                    [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${document.file_unique_id}`}]
                                                ]
                                            }
                                        })
                                        if(ctx.chat.type == 'private') {
                                            var exstension = document.file_name;
                                            var regex = /\.[A-Za-z0-9]+$/gm
                                            var doctext = exstension.replace(regex, '');
                                            fileDetails2 = {
                                                file_name: doctext,
                                                userId:ctx.from.id,
                                                file_id: document.file_id,
                                                caption: ctx.message.caption,
                                                file_size: document.file_size,
                                                uniqueId: document.file_unique_id,
                                                messageId: data2.message_id,
                                                type: 'document'
                                            }
                                            saver.saveFile(fileDetails2)
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            }
            
        //}
        //catch(error){
        //    ctx.reply(`${messagebotnoaddgroup(ctx)}`)
        //}
    }

})

//video files
bot.on('video', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 2_000);
    });
    await next();
  
    if(ctx.chat.type == 'private') {
        video = ctx.message.video
    }

    if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
        if(video.file_name == undefined){
            if(ctx.chat.type == 'private'){
                await saver.checkFile(`${video.file_unique_id}`).then(async res => {
                    let result = `${video.file_unique_id}`.replace(/-/g, '_');
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists. #file${result}`)
                    }else{
                        await ctx.reply(`✔️ Thank you for sending.\nSearch #file${result}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                        if(ctx.message.caption == undefined){
                            const data1 = await ctx.reply(`#video #file${result} #size${video.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                chat_id: config.LOG_CHANNEL,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                disable_notification: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${video.file_unique_id}`}]
                                    ]
                                }
                            })
                            if(ctx.chat.type == 'private') {
                                fileDetails1 = {
                                    file_name: today2(ctx),
                                    userId:ctx.from.id,
                                    file_id: video.file_id,
                                    caption: ctx.message.caption,
                                    file_size: video.file_size,
                                    uniqueId: video.file_unique_id,
                                    messageId: data1.message_id,
                                    type: 'video'
                                }
                                saver.saveFile(fileDetails1)
                            }
                            return;
                        }
                        const data2 = await ctx.reply(`${ctx.message.caption}\n\n#video #file${result} #size${video.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                            chat_id: config.LOG_CHANNEL,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            disable_notification: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${video.file_unique_id}`}]
                                ]
                            }
                        })
                        if(ctx.chat.type == 'private') {
                            fileDetails1 = {
                                file_name: today2(ctx),
                                userId:ctx.from.id,
                                file_id: video.file_id,
                                caption: ctx.message.caption,
                                file_size: video.file_size,
                                uniqueId: video.file_unique_id,
                                messageId: data2.message_id,
                                type: 'video'
                            }
                            saver.saveFile(fileDetails1)
                        }
                    }
                })
            }
        }else{
            if(ctx.chat.type == 'private'){
                await saver.checkFile(`${video.file_unique_id}`).then(async res => {
                    let result = `${video.file_unique_id}`.replace(/-/g, '_');
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists. #file${result}`)
                    }else{
                        await ctx.reply(`✔️ Thank you for sending.\nSearch #file${result}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                        if(ctx.message.caption == undefined){
                            const data1 = await ctx.reply(`#video #file${result} #size${video.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                chat_id: config.LOG_CHANNEL,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                disable_notification: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${video.file_unique_id}`}]
                                    ]
                                }
                            })
                            if(ctx.chat.type == 'private') {
                                var exstension = video.file_name;
                                var regex = /\.[A-Za-z0-9]+$/gm
                                var vidtext = exstension.replace(regex, '');
                                fileDetails2 = {
                                    file_name: vidtext,
                                    userId:ctx.from.id,
                                    file_id: video.file_id,
                                    caption: ctx.message.caption,
                                    file_size: video.file_size,
                                    uniqueId: video.file_unique_id,
                                    messageId: data1.message_id,
                                    type: 'video'
                                }
                                saver.saveFile(fileDetails2)
                            }
                            return;
                        }
                        const data2 = await ctx.reply(`${ctx.message.caption}\n\n#video #file${result} #size${video.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                            chat_id: config.LOG_CHANNEL,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            disable_notification: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${video.file_unique_id}`}]
                                ]
                            }
                        })
                        if(ctx.chat.type == 'private') {
                            var exstension = video.file_name;
                            var regex = /\.[A-Za-z0-9]+$/gm
                            var vidtext = exstension.replace(regex, '');
                            fileDetails2 = {
                                file_name: vidtext,
                                userId:ctx.from.id,
                                file_id: video.file_id,
                                caption: ctx.message.caption,
                                file_size: video.file_size,
                                uniqueId: video.file_unique_id,
                                messageId: data2.message_id,
                                type: 'video'
                            }
                            saver.saveFile(fileDetails2)
                        }
                    }
                })
            }
        }
    }else{
        //try{
            var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member);
            if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                    //console.log(res);
                    if(res == true) {
                        if(ctx.chat.type == 'private') {
                            ctx.reply(`${messagebanned(ctx)}`)
                        }
                    }else{
                      if(ctx.chat.type == 'private') {
                        if(!profile2 || profile2.total_count == 0)
                            return ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                                parse_mode:'HTML',
                                disable_web_page_preview: true
                            })
                            ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true
                            })
                       }
                    }
                })
            }else{
                if(ctx.chat.type == 'private') {
                    video = ctx.message.video
                }
                
                if(video.file_name == undefined){
                    if(ctx.chat.type == 'private'){
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            let result = `${video.file_unique_id}`.replace(/-/g, '_');
                            //console.log(res);
                            if(res == true) {
                                ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${video.file_unique_id}`).then(async res => {
                                    let result = `${video.file_unique_id}`.replace(/-/g, '_');
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File already exists. #file${result}`)
                                    }else{
                                        await ctx.reply(`✔️ Thank you for sending.\nSearch #file${result}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(ctx.message.caption == undefined){
                                            const data1 = await ctx.reply(`#video #file${result} #size${video.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                                chat_id: config.LOG_CHANNEL,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                disable_notification: true,
                                                reply_markup:{
                                                    inline_keyboard:[
                                                        [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${video.file_unique_id}`}]
                                                    ]
                                                }
                                            })
                                            if(ctx.chat.type == 'private') {
                                                fileDetails1 = {
                                                    file_name: today2(ctx),
                                                    userId:ctx.from.id,
                                                    file_id: video.file_id,
                                                    caption: ctx.message.caption,
                                                    file_size: video.file_size,
                                                    uniqueId: video.file_unique_id,
                                                    messageId: data1.message_id,
                                                    type: 'video'
                                                }
                                                saver.saveFile(fileDetails1)
                                            }
                                            return;
                                        }
                                        const data2 = await ctx.reply(`${ctx.message.caption}\n\n#video #file${result} #size${video.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                            chat_id: config.LOG_CHANNEL,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            disable_notification: true,
                                            reply_markup:{
                                                inline_keyboard:[
                                                    [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${video.file_unique_id}`}]
                                                ]
                                            }
                                        })
                                        if(ctx.chat.type == 'private') {
                                            fileDetails1 = {
                                                file_name: today2(ctx),
                                                userId:ctx.from.id,
                                                file_id: video.file_id,
                                                caption: ctx.message.caption,
                                                file_size: video.file_size,
                                                uniqueId: video.file_unique_id,
                                                messageId: data2.message_id,
                                                type: 'video'
                                            }
                                            saver.saveFile(fileDetails1)
                                        }
                                    }
                                })
                            }
                        })
                    }
                }else{
                    if(ctx.chat.type == 'private'){
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${video.file_unique_id}`).then(async res => {
                                    let result = `${video.file_unique_id}`.replace(/-/g, '_');
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File already exists. #file${result}`)
                                    }else{
                                        await ctx.reply(`✔️ Thank you for sending.\nSearch #file${result}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(ctx.message.caption == undefined){
                                            const data1 = await ctx.reply(`#video #file${result} #size${video.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                                chat_id: config.LOG_CHANNEL,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                disable_notification: true,
                                                reply_markup:{
                                                    inline_keyboard:[
                                                        [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${video.file_unique_id}`}]
                                                    ]
                                                }
                                            })
                                            if(ctx.chat.type == 'private') {
                                                var exstension = video.file_name;
                                                var regex = /\.[A-Za-z0-9]+$/gm
                                                var vidtext = exstension.replace(regex, '');
                                                fileDetails2 = {
                                                    file_name: vidtext,
                                                    userId:ctx.from.id,
                                                    file_id: video.file_id,
                                                    caption: ctx.message.caption,
                                                    file_size: video.file_size,
                                                    uniqueId: video.file_unique_id,
                                                    messageId: data1.message_id,
                                                    type: 'video'
                                                }
                                                saver.saveFile(fileDetails2)
                                            }
                                            return;
                                        }
                                        const data2 = await ctx.reply(`${ctx.message.caption}\n\n#video #file${result} #size${video.file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                            chat_id: config.LOG_CHANNEL,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            disable_notification: true,
                                            reply_markup:{
                                                inline_keyboard:[
                                                    [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${video.file_unique_id}`}]
                                                ]
                                            }
                                        })
                                        if(ctx.chat.type == 'private') {
                                            var exstension = video.file_name;
                                            var regex = /\.[A-Za-z0-9]+$/gm
                                            var vidtext = exstension.replace(regex, '');
                                            fileDetails2 = {
                                                file_name: vidtext,
                                                userId:ctx.from.id,
                                                file_id: video.file_id,
                                                caption: ctx.message.caption,
                                                file_size: video.file_size,
                                                uniqueId: video.file_unique_id,
                                                messageId: data2.message_id,
                                                type: 'video'
                                            }
                                            saver.saveFile(fileDetails2)
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            }
            
        //}
        //catch(error){
        //    ctx.reply(`${messagebotnoaddgroup(ctx)}`)
        //}
    }

})

//photo files
bot.on('photo', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 2_000);
    });
    await next();
  
    if(ctx.chat.type == 'private') {
        photo = ctx.message.photo
    }

    if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
        if(photo[1].file_name == undefined){
            if(ctx.chat.type == 'private'){
                await saver.checkFile(`${photo[1].file_unique_id}`).then(async res => {
                    let result = `${photo[1].file_unique_id}`.replace(/-/g, '_');
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists. #file${result}`)
                    }else{
                        await ctx.reply(`✔️ Thank you for sending.\nSearch #file${result}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                        if(ctx.message.caption == undefined){
                            const data1 = await ctx.reply(`#photo #file${result} #size${photo[1].file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                chat_id: config.LOG_CHANNEL,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                disable_notification: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${photo[1].file_unique_id}`}]
                                    ]
                                }
                            })
                            if(ctx.chat.type == 'private') {
                                fileDetails1 = {
                                    file_name: today2(ctx),
                                    userId:ctx.from.id,
                                    file_id: photo[1].file_id,
                                    caption: ctx.message.caption,
                                    file_size: photo[1].file_size,
                                    uniqueId: photo[1].file_unique_id,
                                    messageId: data1.message_id,
                                    type: 'photo'
                                }
                                saver.saveFile(fileDetails1)
                            }
                            return;
                        }
                        const data2 = await ctx.reply(`${ctx.message.caption}\n\n#photo #file${result} #size${photo[1].file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                            chat_id: config.LOG_CHANNEL,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            disable_notification: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${photo[1].file_unique_id}`}]
                                ]
                            }
                        })
                        if(ctx.chat.type == 'private') {
                            fileDetails1 = {
                                file_name: today2(ctx),
                                userId:ctx.from.id,
                                file_id: photo[1].file_id,
                                caption: ctx.message.caption,
                                file_size: photo[1].file_size,
                                uniqueId: photo[1].file_unique_id,
                                messageId: data2.message_id,
                                type: 'photo'
                            }
                            saver.saveFile(fileDetails1)
                        }
                    }
                })
            }
        }else{
            if(ctx.chat.type == 'private'){
                await saver.checkFile(`${photo[1].file_unique_id}`).then(async res => {
                    let result = `${photo[1].file_unique_id}`.replace(/-/g, '_');
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists. #file${result}`)
                    }else{
                        await ctx.reply(`✔️ Thank you for sending.\nSearch #file${result}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                        if(ctx.message.caption == undefined){
                            const data1 = await ctx.reply(`#photo #file${result} #size${photo[1].file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                chat_id: config.LOG_CHANNEL,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                disable_notification: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${photo[1].file_unique_id}`}]
                                    ]
                                }
                            })
                            if(ctx.chat.type == 'private') {
                                var exstension = photo[1].file_name;
                                var regex = /\.[A-Za-z0-9]+$/gm
                                var photext = exstension.replace(regex, '');
                                fileDetails2 = {
                                    file_name: photext,
                                    userId:ctx.from.id,
                                    file_id: photo[1].file_id,
                                    caption: ctx.message.caption,
                                    file_size: photo[1].file_size,
                                    uniqueId: photo[1].file_unique_id,
                                    messageId: data1.message_id,
                                    type: 'photo'
                                }
                                saver.saveFile2(fileDetails2)
                            }
                            return;
                        }
                        const data2 = await ctx.reply(`${ctx.message.caption}\n\n#photo #file${result} #size${photo[1].file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                            chat_id: config.LOG_CHANNEL,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            disable_notification: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${photo[1].file_unique_id}`}]
                                ]
                            }
                        })
                        if(ctx.chat.type == 'private') {
                            var exstension = photo[1].file_name;
                            var regex = /\.[A-Za-z0-9]+$/gm
                            var photext = exstension.replace(regex, '');
                            fileDetails2 = {
                                file_name: photext,
                                userId:ctx.from.id,
                                file_id: photo[1].file_id,
                                caption: ctx.message.caption,
                                file_size: photo[1].file_size,
                                uniqueId: photo[1].file_unique_id,
                                messageId: data2.message_id,
                                type: 'photo'
                            }
                            saver.saveFile2(fileDetails2)
                        }
                    }
                })
            }
        }
    }else{
        //try{
            var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member);
            if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                await saver.checkBan(`${ctx.from.id}`).then((res) => {
                    //console.log(res);
                    if(res == true) {
                        if(ctx.chat.type == 'private') {
                            ctx.reply(`${messagebanned(ctx)}`)
                        }
                    }else{
                      if(ctx.chat.type == 'private') {
                        if(!profile2 || profile2.total_count == 0)
                            return ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                                parse_mode:'HTML',
                                disable_web_page_preview: true
                            })
                            ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true
                            })
                       }
                    }
                })
            }else{
                if(ctx.chat.type == 'private') {
                    photo = ctx.message.photo
                }
                
                if(photo[1].file_name == undefined){
                    if(ctx.chat.type == 'private'){
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            let result = `${photo[1].file_unique_id}`.replace(/-/g, '_');
                            //console.log(res);
                            if(res == true) {
                                ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${photo[1].file_unique_id}`).then(async res => {
                                    let result = `${photo[1].file_unique_id}`.replace(/-/g, '_');
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File already exists. #file${result}`)
                                    }else{
                                        await ctx.reply(`✔️ Thank you for sending.\nSearch #file${result}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(ctx.message.caption == undefined){
                                            const data1 = await ctx.reply(`#photo #file${result} #size${photo[1].file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                                chat_id: config.LOG_CHANNEL,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                disable_notification: true,
                                                reply_markup:{
                                                    inline_keyboard:[
                                                        [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${photo[1].file_unique_id}`}]
                                                    ]
                                                }
                                            })
                                            if(ctx.chat.type == 'private') {
                                                fileDetails1 = {
                                                    file_name: today2(ctx),
                                                    userId:ctx.from.id,
                                                    file_id: photo[1].file_id,
                                                    caption: ctx.message.caption,
                                                    file_size: photo[1].file_size,
                                                    uniqueId: photo[1].file_unique_id,
                                                    messageId: data1.message_id,
                                                    type: 'photo'
                                                }
                                                saver.saveFile(fileDetails1)
                                            }
                                            return;
                                        }
                                        const data2 = await ctx.reply(`${ctx.message.caption}\n\n#photo #file${result} #size${photo[1].file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                            chat_id: config.LOG_CHANNEL,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            disable_notification: true,
                                            reply_markup:{
                                                inline_keyboard:[
                                                    [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${photo[1].file_unique_id}`}]
                                                ]
                                            }
                                        })
                                        if(ctx.chat.type == 'private') {
                                            fileDetails1 = {
                                                file_name: today2(ctx),
                                                userId:ctx.from.id,
                                                file_id: photo[1].file_id,
                                                caption: ctx.message.caption,
                                                file_size: photo[1].file_size,
                                                uniqueId: photo[1].file_unique_id,
                                                messageId: data2.message_id,
                                                type: 'photo'
                                            }
                                            saver.saveFile(fileDetails1)
                                        }
                                    }
                                })
                            }
                        })
                    }
                }else{
                    if(ctx.chat.type == 'private'){
                        await saver.checkBan(`${ctx.from.id}`).then(async res => {
                            //console.log(res);
                            if(res == true) {
                                ctx.reply(`${messagebanned(ctx)}`)
                            }else{
                                await saver.checkFile(`${photo[1].file_unique_id}`).then(async res => {
                                    let result = `${photo[1].file_unique_id}`.replace(/-/g, '_');
                                    //console.log(res);
                                    if(res == true) {
                                        await ctx.reply(`File already exists. #file${result}`)
                                    }else{
                                        await ctx.reply(`✔️ Thank you for sending.\nSearch #file${result}`,{
                                            parse_mode: 'HTML',
                                            disable_web_page_preview: true,
                                            reply_to_message_id: ctx.message.message_id
                                        })
                                        if(ctx.message.caption == undefined){
                                            const data1 = await ctx.reply(`#photo #file${result} #size${photo[1].file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                                chat_id: config.LOG_CHANNEL,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                disable_notification: true,
                                                reply_markup:{
                                                    inline_keyboard:[
                                                        [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${photo[1].file_unique_id}`}]
                                                    ]
                                                }
                                            })
                                            if(ctx.chat.type == 'private') {
                                                var exstension = photo[1].file_name;
                                                var regex = /\.[A-Za-z0-9]+$/gm
                                                var photext = exstension.replace(regex, '');
                                                fileDetails2 = {
                                                    file_name: photext,
                                                    userId:ctx.from.id,
                                                    file_id: photo[1].file_id,
                                                    caption: ctx.message.caption,
                                                    file_size: photo[1].file_size,
                                                    uniqueId: photo[1].file_unique_id,
                                                    messageId: data1.message_id,
                                                    type: 'photo'
                                                }
                                                saver.saveFile2(fileDetails2)
                                            }
                                            return;
                                        }
                                        const data2 = await ctx.reply(`${ctx.message.caption}\n\n#photo #file${result} #size${photo[1].file_size} \n<b>sendFrom : </b><a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>`, {
                                            chat_id: config.LOG_CHANNEL,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            disable_notification: true,
                                            reply_markup:{
                                                inline_keyboard:[
                                                    [{text: `View file`, url: `https://t.me/${config.BOTUSERNAME}?start=${photo[1].file_unique_id}`}]
                                                ]
                                            }
                                        })
                                        if(ctx.chat.type == 'private') {
                                            var exstension = photo[1].file_name;
                                            var regex = /\.[A-Za-z0-9]+$/gm
                                            var photext = exstension.replace(regex, '');
                                            fileDetails2 = {
                                                file_name: photext,
                                                userId:ctx.from.id,
                                                file_id: photo[1].file_id,
                                                caption: ctx.message.caption,
                                                file_size: photo[1].file_size,
                                                uniqueId: photo[1].file_unique_id,
                                                messageId: data2.message_id,
                                                type: 'photo'
                                            }
                                            saver.saveFile2(fileDetails2)
                                        }
                                    }
                                })
                            }
                        })
                    }
                }
            }
            
        //}
        //catch(error){
        //    ctx.reply(`${messagebotnoaddgroup(ctx)}`)
        //}
    }

})

bot.command('stats',async(ctx)=>{
    stats = await saver.getUser().then((res)=>{
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
            ctx.reply(`📊 Total users: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
        
    })
    stats = await saver.getMedia().then((res)=>{
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
            ctx.reply(`📊 Total media: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }

    })
    stats = await saver.getBan().then((res)=>{
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
            ctx.reply(`📊 Total users violate: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
        
    })
    stats = await saver.getGroup().then((res)=>{
        if(ctx.from.id == config.ADMIN || ctx.from.id == config.ADMIN1 || ctx.from.id == config.ADMIN2 || ctx.from.id == config.ADMIN3 || ctx.from.id == config.ADMIN4){
            ctx.reply(`📊 Total registered groups: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
        
    })
})
 
//nginx config
bot.launch({
    webhook:{
       domain:`${config.domain}`,
       port:`${config.PORT}`
    }
})
