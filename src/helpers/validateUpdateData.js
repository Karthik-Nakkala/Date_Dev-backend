function validateUpdateData(req) {
  const updateAllowedFields = [
    "firstName",
    "lastName",
    "emailId",
    "age",
    "photoUrl",
    "gender",
    "skills",
    "verified",
    "bio",
    "company",
    "location",
    "openForWars",
    "role",
    "connections",
    "hackathons",
    "projects",
  ];
  const isUpdationAllowed = Object.keys(req.body).every((filed) =>
    updateAllowedFields.includes(filed),
  );
  return isUpdationAllowed;
}

module.exports = validateUpdateData;
