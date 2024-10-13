import dotenv from "dotenv"
import { Configuration, OpenAIApi } from "openai"
import { errorRes, successRes } from "../helpers/response.js"
dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(configuration)

export const genrateImage = async (req, res, next) => {
    try {
        const { prompt } = req.body
        // console.log(openai,"openai")
        const response = await openai.createImage({
            prompt,
            n: 1, size: "1024x1024", response_format: "b64_json"
        })
        console.log(response, "response")
        const generatedImage = response.data.data[0].b64_json
        return successRes(res, 200, "Image created successfully", generatedImage)
    } catch (error) {
        console.error("Error details:", error.response?.data || error.message);
        errorRes(res, 500, error.response?.data?.error?.message || error.message);
    }
}