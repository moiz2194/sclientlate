const Notification=require('../model/notifications.js')
const ConnectedUser=require('../model/connecteduser.js')
const getIO = require('../server.js');

const sendnotification=async(Message,to,public_id,url)=>{
const io=getIO.Scan()

    const notification=await Notification.create({public_id,url,to,Message})
    if(to==='all'){
        io.emit('notification', Message,url);
    }else{
        const user=await ConnectedUser.findOne({user_id:to})
        if(user!==null){
            io.to(user.socket_id).emit('notification',Message,url)
           await Notification.create({public_id,url,to,Message})
        }
        
    }
}
module.exports=sendnotification