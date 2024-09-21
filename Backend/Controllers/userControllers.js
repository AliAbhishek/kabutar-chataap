import { errorRes } from "../helpers/response.js"
import { userServices } from "../Services/userServices.js"



const userController = {
    registration: async (req, res) => {
        try {
            const data = await userServices.registration(req, res)

        } catch (error) {
            errorRes(res, 500, error.message)

        }

    },
    login: async (req, res) => {
        try {
            const data = await userServices.login(req, res)

        } catch (error) {
            errorRes(res, 500, error.message)

        }

    },

    search: async(req,res)=>{
        try {
            const data = await userServices.search(req, res)

        } catch (error) {
            errorRes(res, 500, error.message)

        }
    }
}

export default userController