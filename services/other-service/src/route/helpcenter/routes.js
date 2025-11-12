import express from "express"
import { createArticle, deleteArticle, getAllArticles, getAllArticlesCategory, updateArticle } from "../../controllers/helpcenter/index.js"

export const route = express.Router()

route.post('/add',createArticle)
route.get('/getrole',getAllArticles)
route.get('/get/rolecategory',getAllArticlesCategory)
route.put('/update/:id',updateArticle)
route.delete('/delete/:id',deleteArticle)
