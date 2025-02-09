import Joi from "joi";

export const RegisterSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  password: Joi.string()
    .min(6)
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
  confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .label("confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
  address: Joi.string().required(),
});

export const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(6)
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

export const option = {
  abortearly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

export const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),  
})

export const resendResetPasswordOtpSchema = Joi.object({
    email: Joi.string().email().required(),  
})

export const resetPasswordSchema = Joi.object({
    email: Joi.string().email().required(),  
    code: Joi.string().length(6).required(),
    new_password: Joi.string()
    .min(6)
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
    confirmPassword: Joi.string()
    .valid(Joi.ref("new_password"))
    .required()
    .label("confirm password")
    .messages({ "any.only": "{{#label}} does not match" }),
})

export const updateAdminSchema = Joi.object({
  phone: Joi.string().optional(),
  address: Joi.string().optional(),
  email: Joi.string().email().required(),  
})


