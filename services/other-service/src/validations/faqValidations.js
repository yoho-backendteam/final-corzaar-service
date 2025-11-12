import Joi from 'joi';

export const faqValidation = Joi.object({
    question: Joi.string().required().messages({
        'string.empty': 'Question is required',
        'any.required': 'Question is required'
    }),
    answer: Joi.string().required().messages({
        'string.empty': 'Answer is required',
        'any.required': 'Answer is required'
    }),
    category: Joi.string().required().messages({
        'string.empty': 'Category is required',
        'any.required': 'Category is required'
    }),
    assignedTo: Joi.string().valid('user', 'merchant').default('user'),
});


