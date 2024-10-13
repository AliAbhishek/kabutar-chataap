import express from "express"
import auth from "../middlewares/UserAuthenticate.js"
import generateAIImage from "../Controllers/GenerateAiImage.js"


const generateImage = express.Router()

generateImage.use(auth)

generateImage.post("/",generateAIImage.generateImage)







export default generateImage

