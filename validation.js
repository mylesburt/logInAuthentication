//Validation
const Joi = require("@hapi/joi");

//Register validation
const registerValidation = (data) => {
  const validationSchema = Joi.object({
    name: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return validationSchema.validate(data);
};

const loginValidation = (data) => {
  const validationSchema = Joi.object({
    email: Joi.string().min(6).required().email(),
    password: Joi.string().min(6).required(),
  });
  return validationSchema.validate(data);
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = registerValidation;

//   //Validating user data
//   const { error } = validationSchema.validate(req.body);
//   if (error) return;
//   res.status(400).send(error.details[0].message);
