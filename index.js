const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');

const {connection} = require('./db');
const { userRouter } = require('./Routes/user.routes');
const { auth } = require('./Middleware/auth.middleware');
const { postRouter } = require('./Routes/post.routes');

app.use(cors());
app.use(express.json());


app.use('/users',userRouter);

app.use(auth)

app.use('/posts',postRouter)

app.listen(process.env.port, async (req,res)=>{
    try {
        await connection
        console.log('DB connected');
    } catch (error) {
        console.log(error);
    }
    console.log('server is running');
})

