const {Router} = require('express');

require('dotenv').config();

const { PostModel } = require('../Model/post.model');

const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const postRouter = Router();


postRouter.post('/add', async (req,res)=>{
    const payload = req.body

    try {
        const post = new PostModel(payload);
        await post.save()
        res.status(200).send(post)
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})

postRouter.get('/',async (req,res)=>{
    const {userId} = req.body;
    let {min,max,page, device, device1, device2} = req.query;
    const limit = 3
    if(!min) min = -Infinity
    if(!max) max = Infinity

    try {
        if(device || device1 || device2){
            const posts = await PostModel.find( { $and: [ { no_of_comments:{$gte:min} }, { no_of_comments:{$lte:max}}, {device:{$in:[device,device1,device2]}}], 
                userId } ).skip(limit*(page-1)).limit(limit)
                
        }else{
            const posts = await PostModel.find( { $and: [ { no_of_comments:{$gte:min} }, { no_of_comments:{$lte:max}}], 
                userId } ).skip(limit*(page-1)).limit(limit)
            res.status(200).send(posts)
        }

    } catch (error) {
        res.status(400).send({error:error.message})
    }
})

postRouter.get('/top',async (req,res)=>{
    const {userId} = req.body;

    let {min,max,page, device, device1, device2} = req.query;
    const limit = 3
    if(!min) min = -Infinity
    if(!max) max = Infinity

    try {
        if(device || device1 || device2){
            const posts = await PostModel.find( { $and: [ { no_of_comments:{$gte:min} }, { no_of_comments:{$lte:max}}, {device:{$in:[device,device1,device2]}}], userId } ).sort({no_of_comments:-1}).skip(limit*(page-1)).limit(limit)
            res.status(200).send(posts)
            
        }else{
            const posts = await PostModel.find( { $and: [ { no_of_comments:{$gte:min} }, { no_of_comments:{$lte:max}}], userId } ).sort({no_of_comments:-1}).skip(limit*(page-1)).limit(limit)
            res.status(200).send(posts)

        }
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})


postRouter.patch('/update/:ID', async (req,res)=>{
    const {userId} = req.body
    const {ID} = req.params
    const payload = req.body

    try {

        const post = await PostModel.findById({_id:ID})
        if(post.userId === userId){
            await PostModel.findByIdAndUpdate({_id:ID},payload)
            const updatedPost = await PostModel.findById({_id:ID})
            res.status(200).send(updatedPost)
        }else{
            res.status(400).send({"error":"You can able to update post of other user"})
        }
        
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})
postRouter.delete('/delete/:ID', async (req,res)=>{
    const {userId} = req.body
    const {ID} = req.params

    try {

        const post = await PostModel.findById({_id:ID})
        if(post.userId === userId){
            await PostModel.findByIdAndDelete({_id:ID})

            res.status(200).send({"msg":`${ID} post successfully Deleted`})
        }else{
            res.status(400).send({"error":"You can able to update post of other user"})
        }
        
    } catch (error) {
        res.status(400).send({error:error.message})
    }
})


module.exports = {postRouter}