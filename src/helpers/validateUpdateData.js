
function validateUpdateData(req){
    const updateAllowedFields=[
        "firstName",
        "lastName",
        "age",
        "gender",
        "photoUrl",
        "skills"
    ]
    const isUpdationAllowed=Object.keys(req.body).every(filed=>updateAllowedFields.includes(filed));
    return isUpdationAllowed;
}

module.exports=validateUpdateData;