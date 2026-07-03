const mongoose=require('mongoose');

const connectDb = async()=>{
    await mongoose.connect('mongodb+srv://24f3002922_db_user:Mke1ABkd2k6cql17@namasthenodejs.lpgbutj.mongodb.net/Date_Dev');
}

module.exports=connectDb;


