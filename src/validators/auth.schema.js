import Joi from "joi";

export const singUpSchema = {
  //email, password, confirmPassword, phone from request body
  body: Joi.object({
    email: Joi.string()
      .email() //{ tlds: { allow: ["com", "org", "eg"] }, maxDomainSegments: 3 }) // top level domains && maxDomainSegments
      .required(),
    password: Joi.string()
      .required()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
      )
      .messages({
        "string.pattern.base":
          "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      }),
    confirmPassword: Joi.string().valid(Joi.ref("password")).required(), // need to be same as password
    phone: Joi.string()
      .required()
      .regex(/^(?:\+20|0020|0)1[0125][0-9]{8}$/)
      .messages({
        "string.pattern.base": "Phone number must be Egyptian phone number",
      }),
  }),
};
