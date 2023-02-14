const Notification=require('../model/notifications.js')
const io=require('../server.js')
const sendnotification=async(Message,to,public_id,url)=>{
    const notification=await Notification.create({public_id,url,to,Message})
    if(to==='all'){
        io.emit('notification', Message,url);
    }else{
        const targetSocket = io.sockets.connected[to];

        // Broadcast the message to the target socket
        if (targetSocket) {
          targetSocket.emit('notification', Message,url);
        }
    }
}
module.exports=sendnotification