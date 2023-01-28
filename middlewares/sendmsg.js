const qrcode = require('qrcode-terminal');
const fs = require("fs")
const { Client, LegacySessionAuth, LocalAuth } = require('whatsapp-web.js');


const client =new Client({
    puppeteer: {
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox'
        ]
        
    },
    authStrategy: new LocalAuth()
})
client.on('authenticated', (session) => {

});
 
 

client.initialize();
client.on("qr", qr => {
    qrcode.generate(qr, {small: true} );
})
client.on("ready",()=>{
    const chatid= '923114224475' +"@c.us";
    const message=`Hello,\nThis is a reminder that your monthly fees of malnad pg is pending and please pay it as soon as possible.\nRegards\nMadhu Prakash T P\nMalnad Paying Guest`;
    client.sendMessage(chatid,message)
})
const sendmsg=(phone,otp)=>{
    const chatid=phone+"@c.us";
    const message=otp;
    console.log(chatid,message)
    client.sendMessage(chatid,message)
}

module.exports=sendmsg