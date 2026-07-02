const adminAuth = (req,res,next)=>{
    console.log("Validating Whether You are admin or not!🤨🤨🤨🤨");
    const token="Govindha!";
    const isAuthorized=token==="Govindha!";
    if(!isAuthorized){
         console.log("Hurray! You are theif, Wait I am calling to Inspector chingam!🤬🤬🤬🤬");
         res.status(401).send("Hey fool!😠😠😠😠, You are unauthorized person");
    }
    else{
        console.log("Ok! You are our real Admin🙂🥰🥰");
        next();
    }
}

const userAuth = (req,res,next)=>{
    console.log("Validating Whether You are really an user of this application or not!🤨🤨🤨🤨");
    const token="Govindha!k";
    const isAuthorized=token==="Govindha!";
    if(!isAuthorized){
         console.log("Hurray! You are theif, Wait I am calling to Inspector Lingam!🤬🤬🤬🤬");
         res.status(401).send("Hey fool!😠😠😠😠, You are unauthorized person");
    }
    else{
        console.log("Ok! You are real user of this application🙂🥰🥰");
        next();
    }
}

module.exports={adminAuth,userAuth};