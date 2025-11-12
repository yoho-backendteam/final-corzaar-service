import Joi from "joi";

export const createInstituteReviewValidation = Joi.object({
    instituteId: Joi.string().required(),
    reviews: Joi.array()
        .items(
            Joi.object({
                studentId: Joi.string().required(),
                studentname: Joi.string().min(1).max(40).required(),
                rating: Joi.number().min(1).max(5).required(),
                commentText: Joi.string().min(1).max(300).required(),
                createdAt: Joi.date().optional(),
            })
        )
        .min(1)
        .required(),
});

export const updateInstituteReviewValidation = Joi.object({
    studentId: Joi.string().optional(),
    studentname: Joi.string().min(1).max(40).optional(),
    rating: Joi.number().min(1).max(5).optional(),
    commentText: Joi.string().min(1).max(300).optional(),
    createdAt: Joi.date().optional(),
}).min(1);
