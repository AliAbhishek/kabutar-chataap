import { errorRes } from "../helpers/response.js"
import { genrateImage } from "../Services/GenerateAIimage.js"



const generateAIImage={
    generateImage:async(req,res,next)=>{
        try {
            const data = await genrateImage(req, res,next)

        } catch (error) {
            errorRes(res, 500, error.message)

        }
    }
}

export default generateAIImage