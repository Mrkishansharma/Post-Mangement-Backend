const {Router} = require('express');

require('dotenv').config();

const {UserModel} = require('../Model/user.model');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const userRouter = Router();

userRouter.post('/register', async (req,res)=>{
    
    const {name,email,gender,password,age,city,is_married} = req.body;
    
    bcrypt.hash(password, 2, async (err,hash) =>{
        try {

            const user = new UserModel({
                name,email,gender,password:hash,age,city,is_married
            })

            await user.save()

            res.status(200).send(user);

        } catch (error) {
            res.status(400).send({error:error.message})
        }
    })
})

userRouter.post('/login', async (req,res)=>{
    const {email,password} = req.body;

    try {

        const user = await UserModel.findOne({email});
        if(user){
            bcrypt.compare(password, user.password, (err,result) => {
                if(result){
                    res.status(200).send({
                        "msg":"login successfull",
                        "token":jwt.sign({userId:user._id}, process.env.SecurityKey, {expiresIn:"45m"})
                    })
                }else{
                    res.status(400).send({error:"Invalid Password"})
                }
            })
        }else{
            res.status(404).send({error:"User Not Found"})
        }
        
    } catch (error) {
        res.status(400).send({error:error.message})
    }

})

module.exports = {userRouter}