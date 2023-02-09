const mongoose=require('mongoose');
const uri='mongodb+srv://pride:pride@cluster0.iicgiei.mongodb.net/?retryWrites=true&w=majority';
const connecttomongo=()=>
{
    mongoose.connect(uri).then((data)=>{
        console.log('Connected to databse successfully '+ data.Connection.name)
    }).catch((err)=>{
        console.log(err);
    })
};
module.exports=connecttomongo;
