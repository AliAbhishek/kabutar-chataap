

import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const auth = (req, res, next) => {

    try {
        const token = req.header("Authorization")

        if (!token) {
            return res.json({ message: "Please Authenticate" })
        } else {
            jwt.verify(token, process.env.JWT_SECRET, (err, user) => {

                if (err) {
                    res.json({ message: "wrong token" })
                } else {
                    req.user = user
                    next()

                }

            })
        }



    } catch (error) {
        return res.status(500).json({ status: 500, message: error.message })

    }

}

export default auth

export const authenticateSocket = (socket, next) => {
    // console.log(socket.request.headers,"==================")
    const token = socket.request.headers.authorization
    if (!token) {
        return next(new Error('Authentication error'));
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return next(new Error('Authentication error'));
        }
        socket.request.user = user; // Attach user to socket request
        next();
    });
};
