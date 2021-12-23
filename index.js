require('dotenv').config()
const { Telegraf } = require('telegraf')
const bot = new Telegraf(process.env.TOKEN)

process.env.TZ = "Asia/Jakarta";

//database
const db = require('./config/connection')
const collection = require('./config/collection')
const saver = require('./database/filesaver')

//DATABASE CONNECTION 
db.connect((err) => {
    if(err) { console.log('error connection db' + err); }
    else { console.log('db connected'); }
})

//ID Channel/Group
const channelId = `${process.env.CHANNELJOIN}`;

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
    return `${process.env.CAPTIONLINK}`;
}
function welcomejoin(ctx){
    return `${process.env.WELCOMEJOINBOT}\n\n${today(ctx)}`;
}
function messagewelcome(ctx){
    return `${process.env.MESSAGEWELCOMEBOT}\n\n${today(ctx)}`;
}
function messagebanned(ctx){
    return `⚠ YOU ARE BLOCKED DUE TO BOTS ABUSE.`;
}
function messagebotnoaddgroup(ctx){
    return `The bot has not yet entered the owner's channel/group.`;
}

//BOT START
bot.start(async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
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
        if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
            //welcoming message on /start and ifthere is a query available we can send files
            if(length == 1){
                await ctx.deleteMessage()
                const profile = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                if(!profile || profile.total_count == 0)
                    return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                        parse_mode:'HTML',
                        disable_web_page_preview: true
                    })
                    await ctx.replyWithPhoto(profile.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                        parse_mode:'HTML',
                        disable_web_page_preview: true
                    })
            }else{
                let query2 = query;
                try{
                    const res2 = await saver.getFile2(query2)
                
                    async function captionFunction2() {
                        await ctx.reply(`${captionbuild(ctx)}`,{
                            parse_mode:'HTML'
                        })
                    }
                    if(res2.type=='video'){
                        await ctx.deleteMessage()
                        let result = `${res2.uniqueId}`.replace(/-/g, '_');
                        let urls = 'https://t.me/c/' + channelId.replace('-100', '') + '/' + res2.messageId
                        let type = `${res2.type}`;
                        let type2 = type.slice(0,1).toUpperCase() + type.substr(1)
                        
                        if(!res2.caption) {
                            setTimeout(captionFunction2, 1000)
                            return await ctx.replyWithVideo(res2.file_id,{caption: `#size${res2.file_size} \n#file${result}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `${type2}`, callback_data: `none`},{text: `Sender`, url: `${urls}`}]
                                    ]
                                }
                            });
                        }
                        await ctx.replyWithVideo(res2.file_id,{caption: `#size${res2.file_size} \n#file${result} \n\n${res2.caption}`,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `${type2}`, callback_data: `none`},{text: `Sender`, url: `${urls}`}]
                                ]
                            }
                        });
                            setTimeout(captionFunction2, 1000)
                    }else if(res2.type=='photo'){
                        await ctx.deleteMessage()
                        let result = `${res2.uniqueId}`.replace(/-/g, '_');
                        let urls = 'https://t.me/c/' + channelId.replace('-100', '') + '/' + res2.messageId
                        let type = `${res2.type}`;
                        let type2 = type.slice(0,1).toUpperCase() + type.substr(1)
                        
                        if(!res2.caption) {
                            setTimeout(captionFunction2, 1000)
                            return await ctx.replyWithPhoto(res2.file_id,{caption: `#size${res2.file_size} \n#file${result}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `${type2}`, callback_data: `none`},{text: `Sender`, url: `${urls}`}]
                                    ]
                                }
                            });
                        }
                        await ctx.replyWithPhoto(res2.file_id,{caption: `#size${res2.file_size} \n#file${result} \n\n${res2.caption}`,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `${type2}`, callback_data: `none`},{text: `Sender`, url: `${urls}`}]
                                ]
                            }
                        });
                            setTimeout(captionFunction2, 1000)
                    }else if(res2.type=='document'){
                        await ctx.deleteMessage()
                        let result = `${res2.uniqueId}`.replace(/-/g, '_');
                        let urls = 'https://t.me/c/' + channelId.replace('-100', '') + '/' + res2.messageId
                        let type = `${res2.type}`;
                        let type2 = type.slice(0,1).toUpperCase() + type.substr(1)
                        
                        if(!res2.caption) {
                            setTimeout(captionFunction2, 1000)
                            return await ctx.replyWithDocument(res2.file_id,{caption: `#size${res2.file_size} \n#file${result}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `${type2}`, callback_data: `none`},{text: `Sender`, url: `${urls}`}]
                                    ]
                                }
                            });
                        }
                        await ctx.replyWithDocument(res2.file_id,{caption: `#size${res2.file_size} \n#file${result} \n\n${res2.caption}`,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `${type2}`, callback_data: `none`},{text: `Sender`, url: `${urls}`}]
                                ]
                            }
                        });
                            setTimeout(captionFunction2, 1000)
                    }
                }catch(error){
                    await ctx.deleteMessage()
                    await ctx.reply(`Media not found or has been removed`)
                }
            }
        }else{
            try {
                var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
                var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
                //console.log(member);
                if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                    const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            if(ctx.chat.type == 'private') {
                                await ctx.deleteMessage()
                                await ctx.reply(`${messagebanned(ctx)}`)
                            }
                        }else{
                            ctx.deleteMessage()
                            if(!profile2 || profile2.total_count == 0)
                                return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                                    parse_mode:'HTML',
                                    disable_web_page_preview: true
                                })
                                await ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                                    parse_mode:'HTML',
                                    disable_web_page_preview: true
                                })
                        }
                    })
                }else{
                    //welcoming message on /start and ifthere is a query available we can send files
                    if(length == 1){
                        const profile3 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                            await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                //console.log(res);
                                if(res == true) {
                                    if(ctx.chat.type == 'private') {
                                        await ctx.deleteMessage()
                                        await ctx.reply(`${messagebanned(ctx)}`)
                                    }
                                }else{
                                    await ctx.deleteMessage()
                                    if(!profile3 || profile3.total_count == 0)
                                        return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,{
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true
                                        })
                                        await ctx.replyWithPhoto(profile3.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${messagewelcome(ctx)}`,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true
                                        })
                                }
                            })
                        }else{
                            let query2 = query;
                            try{
                                const res2 = await saver.getFile2(query2)
                            
                                async function captionFunction2() {
                                    await ctx.reply(`${captionbuild(ctx)}`,{
                                        parse_mode:'HTML'
                                    })
                                }
                                await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        if(ctx.chat.type == 'private') {
                                            await ctx.deleteMessage()
                                            await ctx.reply(`${messagebanned(ctx)}`)
                                        }
                                    }else{
                                        if(res2.type=='video'){
                                            await ctx.deleteMessage()
                                            let result = `${res2.uniqueId}`.replace(/-/g, '_');
                                            let urls = 'https://t.me/c/' + channelId.replace('-100', '') + '/' + res2.messageId
                                            let type = `${res2.type}`;
                                            let type2 = type.slice(0,1).toUpperCase() + type.substr(1)
                                            
                                            if(!res2.caption) {
                                                setTimeout(captionFunction2, 1000)
                                                return await ctx.replyWithVideo(res2.file_id,{caption: `#size${res2.file_size} \n#file${result}`,
                                                    parse_mode:'HTML',
                                                    disable_web_page_preview: true,
                                                    reply_markup:{
                                                        inline_keyboard:[
                                                            [{text: `${type2}`, callback_data: `none`},{text: `Sender`, url: `${urls}`}]
                                                        ]
                                                    }
                                                });
                                            }
                                            await ctx.replyWithVideo(res2.file_id,{caption: `#size${res2.file_size} \n#file${result} \n\n${res2.caption}`,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                reply_markup:{
                                                    inline_keyboard:[
                                                        [{text: `${type2}`, callback_data: `none`},{text: `Sender`, url: `${urls}`}]
                                                    ]
                                                }
                                            });
                                                setTimeout(captionFunction2, 1000)
                                        }else if(res2.type=='photo'){
                                            await ctx.deleteMessage()
                                            let result = `${res2.uniqueId}`.replace(/-/g, '_');
                                            let urls = 'https://t.me/c/' + channelId.replace('-100', '') + '/' + res2.messageId
                                            let type = `${res2.type}`;
                                            let type2 = type.slice(0,1).toUpperCase() + type.substr(1)
                                            
                                            if(!res2.caption) {
                                                setTimeout(captionFunction2, 1000)
                                                return await ctx.replyWithPhoto(res2.file_id,{caption: `#size${res2.file_size} \n#file${result}`,
                                                    parse_mode:'HTML',
                                                    disable_web_page_preview: true,
                                                    reply_markup:{
                                                        inline_keyboard:[
                                                            [{text: `${type2}`, callback_data: `none`},{text: `Sender`, url: `${urls}`}]
                                                        ]
                                                    }
                                                });
                                            }
                                            await ctx.replyWithPhoto(res2.file_id,{caption: `#size${res2.file_size} \n#file${result} \n\n${res2.caption}`,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                reply_markup:{
                                                    inline_keyboard:[
                                                        [{text: `${type2}`, callback_data: `none`},{text: `Sender`, url: `${urls}`}]
                                                    ]
                                                }
                                            });
                                                setTimeout(captionFunction2, 1000)
                                        }else if(res2.type=='document'){
                                            await ctx.deleteMessage()
                                            let result = `${res2.uniqueId}`.replace(/-/g, '_');
                                            let urls = 'https://t.me/c/' + channelId.replace('-100', '') + '/' + res2.messageId
                                            let type = `${res2.type}`;
                                            let type2 = type.slice(0,1).toUpperCase() + type.substr(1)
                                            
                                            if(!res2.caption) {
                                                setTimeout(captionFunction2, 1000)
                                                return await ctx.replyWithDocument(res2.file_id,{caption: `#size${res2.file_size} \n#file${result}`,
                                                    parse_mode:'HTML',
                                                    disable_web_page_preview: true,
                                                    reply_markup:{
                                                        inline_keyboard:[
                                                            [{text: `${type2}`, callback_data: `none`},{text: `Sender`, url: `${urls}`}]
                                                        ]
                                                    }
                                                });
                                            }
                                            await ctx.replyWithDocument(res2.file_id,{caption: `#size${res2.file_size} \n#file${result} \n\n${res2.caption}`,
                                                parse_mode:'HTML',
                                                disable_web_page_preview: true,
                                                reply_markup:{
                                                    inline_keyboard:[
                                                        [{text: `${type2}`, callback_data: `none`},{text: `Sender`, url: `${urls}`}]
                                                    ]
                                                }
                                            });
                                                setTimeout(captionFunction2, 1000)
                                        }
                                    }
                                })
                            }catch(error){
                                await saver.checkBan(`${ctx.from.id}`).then(async res => {
                                    //console.log(res);
                                    if(res == true) {
                                        if(ctx.chat.type == 'private') {
                                            await ctx.deleteMessage()
                                            await ctx.reply(`${messagebanned(ctx)}`)
                                        }
                                    }else{
                                        await ctx.deleteMessage()
                                        await ctx.reply(`Media not found or has been removed`)
                                    }
                                })
                            }
                        }
                    }
                }
            catch(error){
                await ctx.deleteMessage()
                await ctx.reply(`${messagebotnoaddgroup(ctx)}`)
            }
        }
        //saving user details to the database
        await saver.saveUser(user)
    }
    return next();
})

//TEST BOT
bot.hears(/ping/i,async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    if(ctx.chat.type == 'private') {    
        await saver.checkBan(`${ctx.from.id}`).then(async res => {
            //console.log(res);
            if(res == true) {
                if(ctx.chat.type == 'private') {
                    await ctx.deleteMessage()
                    await ctx.reply(`${messagebanned(ctx)}`)
                }
            }else{
                await ctx.deleteMessage()
                let chatId = ctx.message.from.id;
                let opts = {
                    reply_markup:{
                        inline_keyboard: [[{text:'OK',callback_data:'PONG'}]]
                    }
                }
                return await bot.telegram.sendMessage(chatId, 'pong' , opts);
            }
        })
    }
    return next();
})

bot.action('PONG',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    await ctx.deleteMessage()
    return next();
})

//GROUP COMMAND
bot.command('reload',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });

    var botStatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.botInfo.id)
    var memberstatus = await bot.telegram.getChatMember(ctx.chat.id, ctx.from.id)
    //console.log(memberstatus);
    group = {
        groupId:ctx.chat.id
    }
    if(ctx.chat.type == 'group' || ctx.chat.type == 'supergroup') {
        if(memberstatus.status == 'creator' || memberstatus.status == 'administrator'){
            await ctx.deleteMessage()
            await ctx.reply('Bot restarted')
            await saver.saveGroup(group)
        }
        if(ctx.from.username == 'GroupAnonymousBot'){
            await ctx.deleteMessage()
            await ctx.reply('Bot restarted')
            await saver.saveGroup(group)
        }
    }
    return next();
})

bot.command('kick',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then(async res=>{
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
                        await ctx.deleteMessage()  
                        if(memberstatus.can_restrict_members == true){                
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.kickChatMember(ctx.chat.id, args[0]).then(async result =>{
                                    //console.log(result)
                                })
                            }
                            await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage()
                        if(ctx.message.reply_to_message == undefined){
                            let args = ctx.message.text.split(" ").slice(1)
                            await bot.telegram.kickChatMember(ctx.chat.id, args[0]).then(async result =>{
                                //console.log(result)
                            })
                        }
                        await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage()
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.kickChatMember(ctx.chat.id, args[0]).then(async result =>{
                                    //console.log(result)
                                })
                            }
                            await bot.telegram.kickChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        kick()
    })
    return next();
})

bot.command('ban',async(ctx)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then(async res => {
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
                        await ctx.deleteMessage()
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
                               }).then(async result =>{
                                   //console.log(result)
                                   await ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                       parse_mode: 'HTML'
                                   })
                                   return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                       parse_mode: 'HTML'
                                   })
                               })
                            }
    
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const userId = words.shift();
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";
    
                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: ctx.message.reply_to_message.from.id
                            }).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                    parse_mode: 'HTML',
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage()
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
                            }).then(async result =>{
                                //console.log(result)
                                await ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                                return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                            })
                        }

                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const userId = words.shift();
                        const caption = words.join(" ");
                        const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";

                        await bot.telegram.callApi('banChatMember', {
                        chat_id: ctx.message.chat.id,
                        user_id: ctx.message.reply_to_message.from.id
                        }).then(async result =>{
                            //console.log(result)
                            let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                            let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                            await ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                parse_mode: 'HTML',
                                reply_to_message_id: ctx.message.reply_to_message.message_id
                            })
                            return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                parse_mode: 'HTML'
                            })
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage()
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
                                }).then(async result =>{
                                    //console.log(result)
                                    await ctx.reply(`[${userId}] blocked. ${caption2}`,{
                                        parse_mode: 'HTML'
                                    })
                                    return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                        parse_mode: 'HTML'
                                    })
                                })
                            }
    
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const userId = words.shift();
                            const caption = words.join(" ");
                            const caption2 = caption ? `\n<b>Because:</b> ${caption}` : "";
    
                            await bot.telegram.callApi('banChatMember', {
                            chat_id: ctx.message.chat.id,
                            user_id: ctx.message.reply_to_message.from.id
                            }).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} blocked. ${caption2}`,{
                                    parse_mode: 'HTML',
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(userId, `You have been blocked on ${ctx.message.chat.title} ${caption2}`,{
                                    parse_mode: 'HTML'
                                })
                            })
                        }
                    }
                }
            }
        }
        ban()
    })
    return next();
})

bot.command('unban',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then(async res => {
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
                        await ctx.deleteMessage()
                        if(memberstatus.can_restrict_members == true){
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.unbanChatMember(ctx.chat.id, args[0]).then(async result =>{
                                    //console.log(result)
                                    await ctx.reply(`[${args[0]}] not blocked, can re-enter!`)
                                    return await bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                                })
                            }
                            await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage()
                        if(ctx.message.reply_to_message == undefined){
                            let args = ctx.message.text.split(" ").slice(1)
                            await bot.telegram.unbanChatMember(ctx.chat.id, args[0]).then(async result =>{
                                //console.log(result)
                                await ctx.reply(`[${args[0]}] not blocked, can re-enter!`)
                                return await bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                        await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                            //console.log(result)
                            let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                            let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                            await ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                reply_to_message_id: ctx.message.reply_to_message.message_id
                            })
                            return await bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage()
                            if(ctx.message.reply_to_message == undefined){
                                let args = ctx.message.text.split(" ").slice(1)
                                await bot.telegram.unbanChatMember(ctx.chat.id, args[0]).then(async result =>{
                                    //console.log(result)
                                    await ctx.reply(`[${args[0]}] not blocked, can re-enter!`)
                                    return await bot.telegram.sendMessage(args[0], `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                                })
                            }
                            await bot.telegram.unbanChatMember(ctx.chat.id, ctx.message.reply_to_message.from.id).then(async result =>{
                                //console.log(result)
                                let replyUsername = ctx.message.reply_to_message.from.username ? `@${ctx.message.reply_to_message.from.username}` : `${ctx.message.reply_to_message.from.first_name}`;
                                let replyFromid = ctx.message.reply_to_message.from.id ? `[${ctx.message.reply_to_message.from.id}]` : "";
                                await ctx.reply(`${replyUsername} ${replyFromid} not blocked, can re-enter!`,{
                                    reply_to_message_id: ctx.message.reply_to_message.message_id
                                })
                                return await bot.telegram.sendMessage(ctx.message.reply_to_message.from.id, `You are not blocked, you can re-enter at ${ctx.message.chat.title}`)
                            })
                        }
                    }
                }
            }
        }
        unban()
    })
    return next();
})

bot.command('pin',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then(async res =>{
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
                        await ctx.deleteMessage()
                        if(memberstatus.can_pin_messages == true){
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage()
                        await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                            disable_notification: false,
                        }).then(async result =>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage()
                            await bot.telegram.pinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id,{
                                disable_notification: false,
                            }).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        pin()
    })
    return next();
})

bot.command('unpin',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then( async res=>{
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
                        await ctx.deleteMessage()
                        if(memberstatus.can_pin_messages == true){
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }else if(memberstatus.status == 'creator'){
                        await ctx.deleteMessage()
                        await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                            //console.log(result)
                        })
                    }else{
                        if(ctx.from.username == 'GroupAnonymousBot'){
                            await ctx.deleteMessage()
                            await bot.telegram.unpinChatMessage(ctx.chat.id, ctx.message.reply_to_message.message_id).then(async result =>{
                                //console.log(result)
                            })
                        }
                    }
                }
            }
        }
        unpin()
    })
    return next();
})

bot.command('send',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then(async res =>{
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
                        await ctx.deleteMessage()
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
    
                            return await bot.telegram.sendMessage(group, `${caption}`)
                        }
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return await bot.telegram.sendMessage(group, `${caption}`,{
                            reply_to_message_id: ctx.message.reply_to_message.message_id
                        })
                    }
                    if(ctx.from.username == 'GroupAnonymousBot'){
                        await ctx.deleteMessage()
                        if(ctx.message.reply_to_message == undefined){
                            const str = ctx.message.text;
                            const words = str.split(/ +/g);
                            const command = words.shift().slice(1);
                            const caption = words.join(" ");
    
                            return await bot.telegram.sendMessage(group, `${caption}`)
                        }
                        const str = ctx.message.text;
                        const words = str.split(/ +/g);
                        const command = words.shift().slice(1);
                        const caption = words.join(" ");

                        return await bot.telegram.sendMessage(group, `${caption}`,{
                            reply_to_message_id: ctx.message.reply_to_message.message_id
                        })
                    }
                }
            }
        }
        send()
    })
    return next();
})
//END

//check account
bot.command('getid',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
  
    if(ctx.chat.type == 'private') {       
        const profile4 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
        await saver.checkBan(`${ctx.from.id}`).then(async res => {
            //console.log(res);
            if(res == true) {
                if(ctx.chat.type == 'private') {
                    await ctx.deleteMessage()
                    await ctx.reply(`${messagebanned(ctx)}`)
                }
            }else{
                if(!profile4 || profile4.total_count == 0){
                    await ctx.deleteMessage()
                    await ctx.reply(`<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n<b>Username:</b> ${username(ctx)}\n<b>ID:</b> ${ctx.from.id}`,{
                        parse_mode:'HTML'  
                    })
                }else{
                    await ctx.deleteMessage()
                    await ctx.replyWithPhoto(profile4.photos[0][0].file_id,{caption: `<b>Name:</b> <a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a>\n<b>Username:</b> ${username(ctx)}\n<b>ID:</b> ${ctx.from.id}`,
                        parse_mode:'HTML'
                    })
                }
            }
        })
    }
    return next();
})

//remove files with file_id
bot.command('rem', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });

    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text2 = msgArray.join(' ')
        let text = `${text2}`.replace(/_/g, '-');
        console.log(text);
        if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
            await ctx.deleteMessage()
            saver.removeFile(text)
            await ctx.reply('❌ 1 media deleted successfully')
        }
    }
    return next();
})

//remove whole collection(remove all files)
bot.command('clear', async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    if(ctx.chat.type == 'private') {
        if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
            await ctx.deleteMessage()
            await saver.deleteCollection()
            await ctx.reply('❌ All media deleted successfully')
        }
    }
    return next();
})

//removing all files sent by a user
bot.command('remall', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        //console.log(text);
        let id = parseInt(text)
        if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
            await ctx.deleteMessage()
            await saver.removeUserFile(id)
            await ctx.reply('❌ Delete all user media successfully')
        }
    }
    return next();
})

bot.command('sendchat',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    groupDetails = await saver.getGroup().then(async res=>{
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
                    await ctx.deleteMessage()
                    const str = ctx.message.text;
                    const words = str.split(/ +/g);
                    const command = words.shift().slice(1);
                    const userId = words.shift();
                    const caption = words.join(" ");
                    await ctx.reply('Sent!',{
                        reply_to_message_id: ctx.message.message_id
                    })
                    return await bot.telegram.sendMessage(userId, `${caption}`)
                }
            }
        }

        if(ctx.chat.type == 'private') {
            if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
                await ctx.deleteMessage()
                const str = ctx.message.text;
                const words = str.split(/ +/g);
                const command = words.shift().slice(1);
                const userId = words.shift();
                const caption = words.join(" ");
                await ctx.reply('Sent!',{
                    reply_to_message_id: ctx.message.message_id
                })

                return await bot.telegram.sendMessage(userId, `${caption}`)
            }

            sendchat()
        }
    })
    return next();
})

//broadcasting message to bot users(from last joined to first)
bot.command('broadcast',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });

    if(ctx.chat.type == 'private') {
        msg = ctx.message.text
        let msgArray = msg.split(' ')
        msgArray.shift()
        let text = msgArray.join(' ')
        userDetails = await saver.getUser().then(async res =>{
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
                        await saver.updateUser(users)
                        totalFail.push(users)

                    }
                }
                await ctx.reply(`✅ <b>Number of active users:</b> ${userId.length - totalFail.length}\n❌ <b>Total failed broadcasts:</b> ${totalFail.length}`,{
                    parse_mode:'HTML'
                })

            }
            if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
                await ctx.deleteMessage()
                broadcast(text)
                await ctx.reply('Broadcast starts (Message is broadcast from last joined to first).')

            }else{
                await ctx.deleteMessage()
                await ctx.reply(`Commands can only be used by Admin.`) 
            }

        })
    }
    return next();
})

//ban user with user id
bot.command('banchat', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
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
            if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
                await ctx.deleteMessage()
                await saver.banUser(userId).then(async res => {
                    await ctx.reply('❌ Banned')
                })
            }
        }
    }
    return next(); 
})

//unban user with user id
bot.command('unbanchat', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
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
            if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
                await ctx.deleteMessage()
                await saver.unBan(userId).then(async res => {
                    await ctx.reply('✅ Finished')
                })
            }
        }
    }
    return next();
})

//document files
bot.on('document', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 2_000);
    });    
  
    if(ctx.chat.type == 'private') {
        if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
            document = ctx.message.document
            
            if(document.file_name == undefined){
                fileDetail = {
                    file_name: today2(ctx),
                    userId: ctx.from.id,
                    file_id: document.file_id,
                    caption: ctx.message.caption,
                    file_size: document.file_size,
                    uniqueId: document.file_unique_id,
                }

                await saver.checkFile(`${fileDetail.uniqueId}`).then(async res => {
                    let result = `${fileDetail.uniqueId}`.replace(/-/g, '_');
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists. #file${result}`)
                    }else{
                        await ctx.reply(`Thank you for sending.\nSearch #file${result}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                        if(fileDetail.caption == undefined){
                            const data = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#document #size${fileDetail.file_size} \n#file${result}`, {
                                chat_id: process.env.LOG_CHANNEL,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                disable_notification: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail.uniqueId}`}]
                                    ]
                                }
                            })
                            fileDetails1 = {
                                file_name: fileDetail.file_name,
                                userId: ctx.from.id,
                                file_id: fileDetail.file_id,
                                caption: fileDetail.caption,
                                file_size: fileDetail.file_size,
                                uniqueId: fileDetail.uniqueId,
                                messageId: data.message_id,
                                type: 'document'
                            }
                            await saver.saveFile(fileDetails1)
                            return;
                        }
                        const data1 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#document #size${fileDetail.file_size} \n#file${result} \n\n${fileDetail.caption}`, {
                            chat_id: process.env.LOG_CHANNEL,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            disable_notification: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail.uniqueId}`}]
                                ]
                            }
                        })
                        fileDetails2 = {
                            file_name: fileDetail.file_name,
                            userId: ctx.from.id,
                            file_id: fileDetail.file_id,
                            caption: fileDetail.caption,
                            file_size: fileDetail.file_size,
                            uniqueId: fileDetail.uniqueId,
                            messageId: data1.message_id,
                            type: 'document'
                        }
                        await saver.saveFile2(fileDetails2)
                    }
                })
            }else{
                var exstension = document.file_name;
                var regex = /\.[A-Za-z0-9]+$/gm
                var doctext = exstension.replace(regex, '');
                fileDetail2 = {
                    file_name: doctext,
                    userId:ctx.from.id,
                    file_id: document.file_id,
                    caption: ctx.message.caption,
                    file_size: document.file_size,
                    uniqueId: document.file_unique_id,
                }

                await saver.checkFile(`${fileDetail2.uniqueId}`).then(async res => {
                    let result = `${fileDetail2.uniqueId}`.replace(/-/g, '_');
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists. #file${result}`)
                    }else{
                        await ctx.reply(`Thank you for sending.\nSearch #file${result}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                        if(fileDetail2.caption == undefined){
                            const data2 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#document #size${fileDetail2.file_size} \n#file${result}`, {
                                chat_id: process.env.LOG_CHANNEL,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                disable_notification: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail2.uniqueId}`}]
                                    ]
                                }
                            })
                            fileDetails3 = {
                                file_name: fileDetail2.file_name,
                                userId: ctx.from.id,
                                file_id: fileDetail2.file_id,
                                caption: fileDetail2.caption,
                                file_size: fileDetail2.file_size,
                                uniqueId: fileDetail2.uniqueId,
                                messageId: data2.message_id,
                                type: 'document'
                            }
                            await saver.saveFile3(fileDetails3)
                            return;
                        }
                        const data3 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#document #size${document.file_size} \n#file${result} \n\n${fileDetail2.caption}`, {
                            chat_id: process.env.LOG_CHANNEL,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            disable_notification: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail2.uniqueId}`}]
                                ]
                            }
                        })
                        fileDetails4 = {
                            file_name: fileDetail2.file_name,
                            userId:ctx.from.id,
                            file_id: fileDetail2.file_id,
                            caption: fileDetail2.caption,
                            file_size: fileDetail2.file_size,
                            uniqueId: fileDetail2.unique_Id,
                            messageId: data3.message_id,
                            type: 'document'
                        }
                        await saver.saveFile4(fileDetails4)
                    }
                })
            }
        }else{
            var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member);
            if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                await saver.checkBan(`${ctx.from.id}`).then(async res => {
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`${messagebanned(ctx)}`)
                    }else{
                        if(!profile2 || profile2.total_count == 0)
                            return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                                parse_mode:'HTML',
                                disable_web_page_preview: true
                            })
                            await ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true
                            })
                    }
                })
            }else{
                document2 = ctx.message.document

                if(document2.file_name == undefined){
                    fileDetail3 = {
                        file_name: today2(ctx),
                        userId:ctx.from.id,
                        file_id: document2.file_id,
                        caption: ctx.message.caption,
                        file_size: document2.file_size,
                        uniqueId: document2.file_unique_id,
                    }

                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                        let result = `${fileDetail3.file_uniqueId}`.replace(/-/g, '_');
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`${messagebanned(ctx)}`)
                        }else{
                            await saver.checkFile(`${fileDetail3.uniqueId}`).then(async res => {
                                let result = `${fileDetail3.uniqueId}`.replace(/-/g, '_');
                                //console.log(res);
                                if(res == true) {
                                    await ctx.reply(`File already exists. #file${result}`)
                                }else{
                                    await ctx.reply(`Thank you for sending.\nSearch #file${result}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    if(fileDetail3.caption == undefined){
                                        const data4 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#document #size${fileDetail3.file_size} \n#file${result}`, {
                                            chat_id: process.env.LOG_CHANNEL,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            disable_notification: true,
                                            reply_markup:{
                                                inline_keyboard:[
                                                    [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${document2.file_unique_id}`}]
                                                ]
                                            }
                                        })
                                        fileDetails1 = {
                                            file_name: fileDetail3.file_name,
                                            userId:ctx.from.id,
                                            file_id: fileDetail3.file_id,
                                            caption: fileDetail3.caption,
                                            file_size: fileDetail3.file_size,
                                            uniqueId: fileDetail3.file_unique_id,
                                            messageId: data4.message_id,
                                            type: 'document'
                                        }
                                        await saver.saveFile(fileDetails1)
                                        return;
                                    }
                                    const data5 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#document #size${fileDetail3.file_size} \n#file${result} \n\n${fileDetail3.caption}`, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        parse_mode:'HTML',
                                        disable_web_page_preview: true,
                                        disable_notification: true,
                                        reply_markup:{
                                            inline_keyboard:[
                                                [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail3.uniqueId}`}]
                                            ]
                                        }
                                    })
                                    fileDetails2 = {
                                        file_name: fileDetail3.file_name,
                                        userId:ctx.from.id,
                                        file_id: fileDetail3.file_id,
                                        caption: fileDetail3.caption,
                                        file_size: fileDetail3.file_size,
                                        uniqueId: fileDetail3.uniqueId,
                                        messageId: data5.message_id,
                                        type: 'document'
                                    }
                                    await saver.saveFile2(fileDetails2)
                                }
                            })
                        }
                    })
                }else{
                    var exstension2 = document2.file_name;
                    var regex2 = /\.[A-Za-z0-9]+$/gm
                    var doctext2 = exstension2.replace(regex2, '');
                    fileDetail4 = {
                        file_name: doctext2,
                        userId:ctx.from.id,
                        file_id: document2.file_id,
                        caption: ctx.message.caption,
                        file_size: document2.file_size,
                        uniqueId: document2.file_unique_id,
                    }

                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`${messagebanned(ctx)}`)
                        }else{
                            await saver.checkFile(`${fileDetail4.uniqueId}`).then(async res => {
                                let result = `${fileDetail4.uniqueId}`.replace(/-/g, '_');
                                //console.log(res);
                                if(res == true) {
                                    await ctx.reply(`File already exists. #file${result}`)
                                }else{
                                    await ctx.reply(`Thank you for sending.\nSearch #file${result}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    if(fileDetail4.caption == undefined){
                                        const data6 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#document #size${fileDetail4.file_size} \n#file${result}`, {
                                            chat_id: process.env.LOG_CHANNEL,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            disable_notification: true,
                                            reply_markup:{
                                                inline_keyboard:[
                                                    [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail4.uniqueId}`}]
                                                ]
                                            }
                                        })
                                        fileDetails3 = {
                                            file_name: fileDetail4.file_name,
                                            userId:ctx.from.id,
                                            file_id: fileDetail4.file_id,
                                            caption: fileDetail4.caption,
                                            file_size: fileDetail4.file_size,
                                            uniqueId: fileDetail4.uniqueId,
                                            messageId: data6.message_id,
                                            type: 'document'
                                        }
                                        await saver.saveFile3(fileDetails3)
                                        return;
                                    }
                                    const data7 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#document #size${fileDetail4.file_size} \n#file${result} \n\n${fileDetail4.caption}`, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        parse_mode:'HTML',
                                        disable_web_page_preview: true,
                                        disable_notification: true,
                                        reply_markup:{
                                            inline_keyboard:[
                                                [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail4.uniqueId}`}]
                                            ]
                                        }
                                    })
                                    fileDetails4 = {
                                        file_name: fileDetail4.file_name,
                                        userId:ctx.from.id,
                                        file_id: fileDetail4.file_id,
                                        caption: fileDetail4.caption,
                                        file_size: fileDetail4.file_size,
                                        uniqueId: fileDetail4.uniqueId,
                                        messageId: data7.message_id,
                                        type: 'document'
                                    }
                                    await saver.saveFile4(fileDetails4)
                                }
                            })
                        }
                    })
                }
            }
        }
    }
    return next();
})

//video files
bot.on('video', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 2_000);
    });
  
    if(ctx.chat.type == 'private') {
        if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
            video = ctx.message.video

            if(video.file_name == undefined){
                var exstension = video.file_name;
                var regex = /\.[A-Za-z0-9]+$/gm
                var vidtext = exstension.replace(regex, '');
            
                const file_name2 = `${vidtext}`;
                const caption2 = `` ? `\n${ctx.message.caption}` : ``;
            
                await saver.checkFile(`${video.file_unique_id}`).then(async res => {
                    let result = `${video.file_unique_id}`.replace(/-/g, '_');
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists. #file${result}`)
                    }else{
                        await ctx.reply(`Thank you for sending.\nSearch #file${result}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
            
                        const data = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#video #size${video.file_size} \n#file${result} ${caption2}`, {
                            chat_id: process.env.LOG_CHANNEL,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            disable_notification: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`}]
                                ]
                            }
                        })
                        fileDetails1 = {
                            file_name: file_name2,
                            userId: ctx.from.id,
                            file_id: video.file_id,
                            caption: ctx.message.caption,
                            file_size: video.file_size,
                            uniqueId: video.file_unique_id,
                            messageId: data.message_id,
                            type: 'video'
                        }
                        await saver.saveFile(fileDetails1)
                    }
                })
                return;
            }
            
            const file_name3 = `${today2(ctx)}`;
            const caption3 = `` ? `\n${ctx.message.caption}` : ``;
            
            await saver.checkFile(`${video.file_unique_id}`).then(async res => {
                let result = `${video.file_unique_id}`.replace(/-/g, '_');
                //console.log(res);
                if(res == true) {
                    await ctx.reply(`File already exists. #file${result}`)
                }else{
                    await ctx.reply(`Thank you for sending.\nSearch #file${result}`,{
                        parse_mode: 'HTML',
                        disable_web_page_preview: true,
                        reply_to_message_id: ctx.message.message_id
                    })
            
                    const data2 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#video #size${video.file_size} \n#file${result} ${caption3}`, {
                        chat_id: process.env.LOG_CHANNEL,
                        parse_mode:'HTML',
                        disable_web_page_preview: true,
                        disable_notification: true,
                        reply_markup:{
                            inline_keyboard:[
                                [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${video.file_unique_id}`}]
                            ]
                        }
                    })
                    fileDetails2 = {
                        file_name: file_name3,
                        userId: ctx.from.id,
                        file_id: video.file_id,
                        caption: ctx.message.caption,
                        file_size: video.file_size,
                        uniqueId: video.file_unique_id,
                        messageId: data2.message_id,
                        type: 'video'
                    }
                    await saver.saveFile(fileDetails2)
                }
            })
        }else{
            var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member);
            if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                await saver.checkBan(`${ctx.from.id}`).then(async res => {
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`${messagebanned(ctx)}`)
                    }else{
                        if(!profile2 || profile2.total_count == 0)
                            return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                                parse_mode:'HTML',
                                disable_web_page_preview: true
                            })
                            await ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true
                            })
                    }
                })
            }else{
                video2 = ctx.message.video

                if(video2.file_name == undefined){
                    fileDetail3 = {
                        file_name: today2(ctx),
                        userId:ctx.from.id,
                        file_id: video2.file_id,
                        caption: ctx.message.caption,
                        file_size: video2.file_size,
                        uniqueId: video2.file_unique_id,
                    }

                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                        let result = `${fileDetail3.file_uniqueId}`.replace(/-/g, '_');
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`${messagebanned(ctx)}`)
                        }else{
                            await saver.checkFile(`${fileDetail3.uniqueId}`).then(async res => {
                                let result = `${fileDetail3.uniqueId}`.replace(/-/g, '_');
                                //console.log(res);
                                if(res == true) {
                                    await ctx.reply(`File already exists. #file${result}`)
                                }else{
                                    await ctx.reply(`Thank you for sending.\nSearch #file${result}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    if(fileDetail3.caption == undefined){
                                        const data4 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#video #size${fileDetail3.file_size} \n#file${result}`, {
                                            chat_id: process.env.LOG_CHANNEL,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            disable_notification: true,
                                            reply_markup:{
                                                inline_keyboard:[
                                                    [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${video2.file_unique_id}`}]
                                                ]
                                            }
                                        })
                                        fileDetails1 = {
                                            file_name: fileDetail3.file_name,
                                            userId:ctx.from.id,
                                            file_id: fileDetail3.file_id,
                                            caption: fileDetail3.caption,
                                            file_size: fileDetail3.file_size,
                                            uniqueId: fileDetail3.file_unique_id,
                                            messageId: data4.message_id,
                                            type: 'video'
                                        }
                                        await saver.saveFile(fileDetails1)
                                        return;
                                    }
                                    const data5 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#video #size${fileDetail3.file_size} \n#file${result} \n\n${fileDetail3.caption}`, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        parse_mode:'HTML',
                                        disable_web_page_preview: true,
                                        disable_notification: true,
                                        reply_markup:{
                                            inline_keyboard:[
                                                [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail3.uniqueId}`}]
                                            ]
                                        }
                                    })
                                    fileDetails2 = {
                                        file_name: fileDetail3.file_name,
                                        userId:ctx.from.id,
                                        file_id: fileDetail3.file_id,
                                        caption: fileDetail3.caption,
                                        file_size: fileDetail3.file_size,
                                        uniqueId: fileDetail3.uniqueId,
                                        messageId: data5.message_id,
                                        type: 'video'
                                    }
                                    await saver.saveFile2(fileDetails2)
                                }
                            })
                        }
                    })
                }else{
                    var exstension2 = video2.file_name;
                    var regex2 = /\.[A-Za-z0-9]+$/gm
                    var vidtext2 = exstension2.replace(regex2, '');
                    fileDetail4 = {
                        file_name: vidtext2,
                        userId:ctx.from.id,
                        file_id: video2.file_id,
                        caption: ctx.message.caption,
                        file_size: video2.file_size,
                        uniqueId: video2.file_unique_id,
                    }

                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`${messagebanned(ctx)}`)
                        }else{
                            await saver.checkFile(`${fileDetail4.uniqueId}`).then(async res => {
                                let result = `${fileDetail4.uniqueId}`.replace(/-/g, '_');
                                //console.log(res);
                                if(res == true) {
                                    await ctx.reply(`File already exists. #file${result}`)
                                }else{
                                    await ctx.reply(`Thank you for sending.\nSearch #file${result}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    if(fileDetail4.caption == undefined){
                                        const data6 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#video #size${fileDetail4.file_size} \n#file${result}`, {
                                            chat_id: process.env.LOG_CHANNEL,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            disable_notification: true,
                                            reply_markup:{
                                                inline_keyboard:[
                                                    [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail4.uniqueId}`}]
                                                ]
                                            }
                                        })
                                        fileDetails3 = {
                                            file_name: fileDetail4.file_name,
                                            userId:ctx.from.id,
                                            file_id: fileDetail4.file_id,
                                            caption: fileDetail4.caption,
                                            file_size: fileDetail4.file_size,
                                            uniqueId: fileDetail4.uniqueId,
                                            messageId: data6.message_id,
                                            type: 'video'
                                        }
                                        await saver.saveFile3(fileDetails3)
                                        return;
                                    }
                                    const data7 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#video #size${fileDetail4.file_size} \n#file${result} \n\n${fileDetail4.caption}`, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        parse_mode:'HTML',
                                        disable_web_page_preview: true,
                                        disable_notification: true,
                                        reply_markup:{
                                            inline_keyboard:[
                                                [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail4.uniqueId}`}]
                                            ]
                                        }
                                    })
                                    fileDetails4 = {
                                        file_name: fileDetail4.file_name,
                                        userId:ctx.from.id,
                                        file_id: fileDetail4.file_id,
                                        caption: fileDetail4.caption,
                                        file_size: fileDetail4.file_size,
                                        uniqueId: fileDetail4.uniqueId,
                                        messageId: data7.message_id,
                                        type: 'video'
                                    }
                                    await saver.saveFile4(fileDetails4)
                                }
                            })
                        }
                    })
                }
            }
        }
    }
    return next();
})

//photo files
bot.on('photo', async(ctx, next) => {
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 2_000);
    });    
  
    if(ctx.chat.type == 'private') {
        if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
            photo = ctx.message.photo[1]
            
            if(photo.file_name == undefined){
                fileDetail = {
                    file_name: today2(ctx),
                    userId: ctx.from.id,
                    file_id: photo.file_id,
                    caption: ctx.message.caption,
                    file_size: photo.file_size,
                    uniqueId: photo.file_unique_id,
                }

                await saver.checkFile(`${fileDetail.uniqueId}`).then(async res => {
                    let result = `${fileDetail.uniqueId}`.replace(/-/g, '_');
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists. #file${result}`)
                    }else{
                        await ctx.reply(`Thank you for sending.\nSearch #file${result}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                        if(fileDetail.caption == undefined){
                            const data = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#photo #size${fileDetail.file_size} \n#file${result}`, {
                                chat_id: process.env.LOG_CHANNEL,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                disable_notification: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail.uniqueId}`}]
                                    ]
                                }
                            })
                            fileDetails1 = {
                                file_name: fileDetail.file_name,
                                userId: ctx.from.id,
                                file_id: fileDetail.file_id,
                                caption: fileDetail.caption,
                                file_size: fileDetail.file_size,
                                uniqueId: fileDetail.uniqueId,
                                messageId: data.message_id,
                                type: 'photo'
                            }
                            await saver.saveFile(fileDetails1)
                            return;
                        }
                        const data1 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#photo #size${fileDetail.file_size} \n#file${result} \n\n${fileDetail.caption}`, {
                            chat_id: process.env.LOG_CHANNEL,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            disable_notification: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail.uniqueId}`}]
                                ]
                            }
                        })
                        fileDetails2 = {
                            file_name: fileDetail.file_name,
                            userId: ctx.from.id,
                            file_id: fileDetail.file_id,
                            caption: fileDetail.caption,
                            file_size: fileDetail.file_size,
                            uniqueId: fileDetail.uniqueId,
                            messageId: data1.message_id,
                            type: 'photo'
                        }
                        await saver.saveFile2(fileDetails2)
                    }
                })
            }else{
                var exstension = photo.file_name;
                var regex = /\.[A-Za-z0-9]+$/gm
                var photext = exstension.replace(regex, '');
                fileDetail2 = {
                    file_name: photext,
                    userId:ctx.from.id,
                    file_id: photo.file_id,
                    caption: ctx.message.caption,
                    file_size: photo.file_size,
                    uniqueId: photo.file_unique_id,
                }

                await saver.checkFile(`${fileDetail2.uniqueId}`).then(async res => {
                    let result = `${fileDetail2.uniqueId}`.replace(/-/g, '_');
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`File already exists. #file${result}`)
                    }else{
                        await ctx.reply(`Thank you for sending.\nSearch #file${result}`,{
                            parse_mode: 'HTML',
                            disable_web_page_preview: true,
                            reply_to_message_id: ctx.message.message_id
                        })
                        if(fileDetail2.caption == undefined){
                            const data2 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#photo #size${fileDetail2.file_size} \n#file${result}`, {
                                chat_id: process.env.LOG_CHANNEL,
                                parse_mode:'HTML',
                                disable_web_page_preview: true,
                                disable_notification: true,
                                reply_markup:{
                                    inline_keyboard:[
                                        [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail2.uniqueId}`}]
                                    ]
                                }
                            })
                            fileDetails3 = {
                                file_name: fileDetail2.file_name,
                                userId: ctx.from.id,
                                file_id: fileDetail2.file_id,
                                caption: fileDetail2.caption,
                                file_size: fileDetail2.file_size,
                                uniqueId: fileDetail2.uniqueId,
                                messageId: data2.message_id,
                                type: 'photo'
                            }
                            await saver.saveFile3(fileDetails3)
                            return;
                        }
                        const data3 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#photo #size${photo.file_size} \n#file${result} \n\n${fileDetail2.caption}`, {
                            chat_id: process.env.LOG_CHANNEL,
                            parse_mode:'HTML',
                            disable_web_page_preview: true,
                            disable_notification: true,
                            reply_markup:{
                                inline_keyboard:[
                                    [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail2.uniqueId}`}]
                                ]
                            }
                        })
                        fileDetails4 = {
                            file_name: fileDetail2.file_name,
                            userId:ctx.from.id,
                            file_id: fileDetail2.file_id,
                            caption: fileDetail2.caption,
                            file_size: fileDetail2.file_size,
                            uniqueId: fileDetail2.unique_Id,
                            messageId: data3.message_id,
                            type: 'photo'
                        }
                        await saver.saveFile4(fileDetails4)
                    }
                })
            }
        }else{
            var botStatus = await bot.telegram.getChatMember(channelId, ctx.botInfo.id)
            var member = await bot.telegram.getChatMember(channelId, ctx.from.id)
            //console.log(member);
            if(member.status == 'restricted' || member.status == 'left' || member.status == 'kicked'){
                const profile2 = await bot.telegram.getUserProfilePhotos(ctx.from.id)
                await saver.checkBan(`${ctx.from.id}`).then(async res => {
                    //console.log(res);
                    if(res == true) {
                        await ctx.reply(`${messagebanned(ctx)}`)
                    }else{
                        if(!profile2 || profile2.total_count == 0)
                            return await ctx.reply(`<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,{
                                parse_mode:'HTML',
                                disable_web_page_preview: true
                            })
                            await ctx.replyWithPhoto(profile2.photos[0][0].file_id,{caption: `<a href="tg://user?id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n\n${welcomejoin(ctx)}`,
                                parse_mode:'HTML',
                                disable_web_page_preview: true
                            })
                    }
                })
            }else{
                photo2 = ctx.message.photo[1]

                if(photo2.file_name == undefined){
                    fileDetail3 = {
                        file_name: today2(ctx),
                        userId:ctx.from.id,
                        file_id: photo2.file_id,
                        caption: ctx.message.caption,
                        file_size: photo2.file_size,
                        uniqueId: photo2.file_unique_id,
                    }

                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                        let result = `${fileDetail3.file_uniqueId}`.replace(/-/g, '_');
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`${messagebanned(ctx)}`)
                        }else{
                            await saver.checkFile(`${fileDetail3.uniqueId}`).then(async res => {
                                let result = `${fileDetail3.uniqueId}`.replace(/-/g, '_');
                                //console.log(res);
                                if(res == true) {
                                    await ctx.reply(`File already exists. #file${result}`)
                                }else{
                                    await ctx.reply(`Thank you for sending.\nSearch #file${result}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    if(fileDetail3.caption == undefined){
                                        const data4 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#photo #size${fileDetail3.file_size} \n#file${result}`, {
                                            chat_id: process.env.LOG_CHANNEL,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            disable_notification: true,
                                            reply_markup:{
                                                inline_keyboard:[
                                                    [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${photo2.file_unique_id}`}]
                                                ]
                                            }
                                        })
                                        fileDetails1 = {
                                            file_name: fileDetail3.file_name,
                                            userId:ctx.from.id,
                                            file_id: fileDetail3.file_id,
                                            caption: fileDetail3.caption,
                                            file_size: fileDetail3.file_size,
                                            uniqueId: fileDetail3.file_unique_id,
                                            messageId: data4.message_id,
                                            type: 'photo'
                                        }
                                        await saver.saveFile(fileDetails1)
                                        return;
                                    }
                                    const data5 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#photo #size${fileDetail3.file_size} \n#file${result} \n\n${fileDetail3.caption}`, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        parse_mode:'HTML',
                                        disable_web_page_preview: true,
                                        disable_notification: true,
                                        reply_markup:{
                                            inline_keyboard:[
                                                [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail3.uniqueId}`}]
                                            ]
                                        }
                                    })
                                    fileDetails2 = {
                                        file_name: fileDetail3.file_name,
                                        userId:ctx.from.id,
                                        file_id: fileDetail3.file_id,
                                        caption: fileDetail3.caption,
                                        file_size: fileDetail3.file_size,
                                        uniqueId: fileDetail3.uniqueId,
                                        messageId: data5.message_id,
                                        type: 'photo'
                                    }
                                    await saver.saveFile2(fileDetails2)
                                }
                            })
                        }
                    })
                }else{
                    var exstension2 = photo2.file_name;
                    var regex2 = /\.[A-Za-z0-9]+$/gm
                    var photext2 = exstension2.replace(regex2, '');
                    fileDetail4 = {
                        file_name: photext2,
                        userId:ctx.from.id,
                        file_id: photo2.file_id,
                        caption: ctx.message.caption,
                        file_size: photo2.file_size,
                        uniqueId: photo2.file_unique_id,
                    }

                    await saver.checkBan(`${ctx.from.id}`).then(async res => {
                        //console.log(res);
                        if(res == true) {
                            await ctx.reply(`${messagebanned(ctx)}`)
                        }else{
                            await saver.checkFile(`${fileDetail4.uniqueId}`).then(async res => {
                                let result = `${fileDetail4.uniqueId}`.replace(/-/g, '_');
                                //console.log(res);
                                if(res == true) {
                                    await ctx.reply(`File already exists. #file${result}`)
                                }else{
                                    await ctx.reply(`Thank you for sending.\nSearch #file${result}`,{
                                        parse_mode: 'HTML',
                                        disable_web_page_preview: true,
                                        reply_to_message_id: ctx.message.message_id
                                    })
                                    if(fileDetail4.caption == undefined){
                                        const data6 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#photo #size${fileDetail4.file_size} \n#file${result}`, {
                                            chat_id: process.env.LOG_CHANNEL,
                                            parse_mode:'HTML',
                                            disable_web_page_preview: true,
                                            disable_notification: true,
                                            reply_markup:{
                                                inline_keyboard:[
                                                    [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail4.uniqueId}`}]
                                                ]
                                            }
                                        })
                                        fileDetails3 = {
                                            file_name: fileDetail4.file_name,
                                            userId:ctx.from.id,
                                            file_id: fileDetail4.file_id,
                                            caption: fileDetail4.caption,
                                            file_size: fileDetail4.file_size,
                                            uniqueId: fileDetail4.uniqueId,
                                            messageId: data6.message_id,
                                            type: 'photo'
                                        }
                                        await saver.saveFile3(fileDetails3)
                                        return;
                                    }
                                    const data7 = await ctx.reply(`<a href="tg://openmessage?user_id=${ctx.from.id}">${first_name(ctx)} ${last_name(ctx)}</a> \n#photo #size${fileDetail4.file_size} \n#file${result} \n\n${fileDetail4.caption}`, {
                                        chat_id: process.env.LOG_CHANNEL,
                                        parse_mode:'HTML',
                                        disable_web_page_preview: true,
                                        disable_notification: true,
                                        reply_markup:{
                                            inline_keyboard:[
                                                [{text: `View File`, url: `https://t.me/${process.env.BOTUSERNAME}?start=${fileDetail4.uniqueId}`}]
                                            ]
                                        }
                                    })
                                    fileDetails4 = {
                                        file_name: fileDetail4.file_name,
                                        userId:ctx.from.id,
                                        file_id: fileDetail4.file_id,
                                        caption: fileDetail4.caption,
                                        file_size: fileDetail4.file_size,
                                        uniqueId: fileDetail4.uniqueId,
                                        messageId: data7.message_id,
                                        type: 'photo'
                                    }
                                    await saver.saveFile4(fileDetails4)
                                }
                            })
                        }
                    })
                }
            }
        }
    }
    return next();
})

bot.command('stats',async(ctx, next)=>{
    await new Promise((resolve, reject) =>{
        setTimeout(()=>{
            return resolve("Result");
        }, 1_000);
    });
    
    await ctx.deleteMessage()
    stats = await saver.getUser().then(async res=>{
        if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
            await ctx.reply(`📊 Total users: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
        
    })
    stats = await saver.getMedia().then(async res=>{
        if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
            await ctx.reply(`📊 Total media: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }

    })
    stats = await saver.getBan().then(async res=>{
        if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
            await ctx.reply(`📊 Total users violate: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
        
    })
    stats = await saver.getGroup().then(async res=>{
        if(ctx.from.id == process.env.ADMIN || ctx.from.id == process.env.ADMIN1 || ctx.from.id == process.env.ADMIN2 || ctx.from.id == process.env.ADMIN3 || ctx.from.id == process.env.ADMIN4){
            await ctx.reply(`📊 Total registered groups: <b>${res.length}</b>`,{parse_mode:'HTML'})
        }
        
    })
    return next();
})
 
//heroku config
domain = `${process.env.DOMAIN}.herokuapp.com`
bot.launch({
    webhook:{
       domain:domain,
        port:Number(process.env.PORT) 
    }
})
