const validator=require('validator');

function validateSignupData(req){

   const {firstName, lastName, emailId, password,age,gender,photoUrl,skills}=req.body;

   if(!firstName || !lastName){
        throw new Error("Name is required");
   }
   else if(firstName.length<4 || (firstName+lastName).length>50){
        throw new Error("Name must be between 4 and 50 characters");
   }
   else if(!validator.isEmail(emailId)){
        throw new Error("Email is not valid");
   }
   else if(!validator.isStrongPassword(password)){
        throw new Error("Please enter strong password");
   }
   else if(age<0){
        throw new Error("Please enter valid age");
   }
   else if(!(["male","female","other"].includes(gender))){
        throw new Error("Gender should be either male,female or other");
   }
   else if(!validator.isURL(photoUrl)){
        throw new Error("Please keep valid image URL");
   }
   else if(skills.length>25){
        throw new Error("Please enter upto only Top 25 skills");
   }

}

module.exports=validateSignupData;