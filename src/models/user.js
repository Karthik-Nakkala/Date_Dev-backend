const mongoose=require('mongoose');
const validator=require('validator');

const userSchema=new mongoose.Schema({
    firstName: {
        type : String,
        required:true,
        minLength:4,
        maxLength:15,
        trim:true,
    },
    lastName: {
        type : String,
        maxLength:15,
        trim:true,
    },
    emailId: {
        type: String,
        required:true,
        unique:true,
        trim:true,
        lowercase:true,
        validate:{
            validator: (value)=>validator.isEmail(value),
            message: 'Please enter a valid email address'
        },
    },
    password: {
        type: String,
        required:true,
        minLength:6,
        trim:true,
        validate:{
            validator:(value)=>validator.isStrongPassword(value,{
                minLength:6,
                minNumbers:1,
            }),
            message:'Password must be at least 6 characters long with at least 1 numbers',
        }
    },
    age: {
        type: Number,
        required:true,
        min:18,
        trim:true,

    },
    gender: {
        type: String,
        required:true,
        lowercase:true,
        validate(value){
            if(!(["male","female","others"].includes(value))){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default:'https://cdn-icons-png.flaticon.com/512/2919/2919906.png'
    },
    skills:{
        type:[String],
    }

},{timestamps:true});

const User = mongoose.model('User',userSchema);

module.exports=User;
