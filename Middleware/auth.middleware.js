const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth = (req,res,next) => {
    const authToken = req.headers.authorization

    if(!authToken){
        return res.status(400).send({"error":"Token Not Found"})
    }

    const token = authToken.split(' ')[1]

    try {
        var decoded = jwt.verify(token, process.env.SecurityKey);
        if(decoded){

            req.body.userId = decoded.userId;

            next()
        }else{
            res.status(400).send({error:"something went wrong"})
        }
        
    } catch (error) {
        res.status(400).send({error:error.message})
    }


    
}

module.exports = { auth }