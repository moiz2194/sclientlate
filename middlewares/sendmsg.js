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
    const message=`App is ready`;
    client.sendMessage(chatid,message)
})
const sendmsg=(phone,otp)=>{
    const chatid=phone+"@c.us";
    const message=`Your Otp for pride App is : ${otp}`;
    console.log(chatid,message)
    client.sendMessage(chatid,message)
}

module.exports=sendmsg