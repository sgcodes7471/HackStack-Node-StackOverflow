import jwt from 'jsonwebtoken'
const authMiddleware = async ( req, res, next)=>{
    try {
        const authToken = req.cookies?.AccessToken || req.headers['AccessToken']?.replace("Bearer " , '')
        if(!authToken)
            throw new Error(401 , "No Token")
        jwt.verify(authToken , process.env.ACCESS_TOKEN_SECRET , (error,info)=>{
            if(!info)
                throw new Error(401, "Validation failed")
            req.user = info
            next()
        })

    } catch (error) {
        return res.status(error.status || 500).json({
            "error":true,
            "message":'Something went wrong'
        })
    }
}

export default authMiddleware