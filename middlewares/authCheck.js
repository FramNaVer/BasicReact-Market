const jwt = require('jsonwebtoken')
const prisma = require('../config/prisma')

exports.authCheck = async (req, res,  next) =>{
    try{
        //
        const headerToken = req.headers.authorization
        
        //เช็ค token จาก header ส่วนของ fontend ที่ส่งมา
        if(!headerToken){
            return res.status(401).json({message: "No token, Authorization"})
        }
        //ยืนยีน token
        const token = headerToken.split(" ")[1]

        const decode = jwt.verify(token, process.env.SECRET)
        req.user = decode

        // เช็ค user
        const user = await prisma.user.findFirst({
            where:{
                email: req.user.email
            }
        })
        console.log(req.user)
        console.log("Middlewares complete")
        next()
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Token Invaild"})
    }
}