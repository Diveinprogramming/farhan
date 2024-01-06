const userModel = require("../models/userModel")


const protect = async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        try{
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET)

            req.user = await userModel.findById(decoded.id).select('-password')
            next()
        }
        catch (error){
            console.log(error)
            res.status(401).json({ "message" : "Un Authorized !"})
           
        }
    }

    if(!token){
        res.status(401).json({ "message" : "Empty Token !"})
    }
}

module.exports = { protect }