import Joi from 'joi';

export const createContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).required().messages({
        'string.min': 'Name should have at least {#limit} characters',
        'string.max': 'Name should have at most {#limit} characters',
        'any.required': 'Name is required',
    }),
    phoneNumber: Joi.string().min(3).max(20).required().messages({
        'string.min': 'Phone number should have at least {#limit} characters',
        'string.max': 'Phone number should have at most {#limit} characters',
        'any.required': 'Phone number is required',
    }),
    email: Joi.string().email().optional().messages({
        'string.email': 'Invalid email format',
    }),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string()
        .valid('work', 'home', 'personal')
        .required()
        .messages({
            'any.only': 'Contact type must be one of: work, home, personal',
            'any.required': 'Contact type is required',
        }),
});

export const updateContactSchema = Joi.object({
    name: Joi.string().min(3).max(20).optional(),
    phoneNumber: Joi.string().min(3).max(20).optional(),
    email: Joi.string().email().optional(),
    isFavourite: Joi.boolean().optional(),
    contactType: Joi.string().valid('work', 'home', 'personal').optional(),
})
    .or('name', 'phoneNumber', 'email', 'isFavourite', 'contactType')
    .messages({
        'object.missing': 'At least one field must be updated',
    });