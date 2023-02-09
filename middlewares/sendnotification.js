const Notification=require('../model/notifications.js')
const sendnotification=async(io,Message,to,public_id,url)=>{
    const notification=await Notification.create({public_id,url,to,Message})
    if(to==='all'){
        io.emit('notification', Message,public_id,url,);
    }else{
        const targetSocket = io.sockets.connected[userId];

        // Broadcast the message to the target socket
        if (targetSocket) {
          targetSocket.emit('notification', Message,public_id,url);
        }
    }
}
module.exports=sendnotification