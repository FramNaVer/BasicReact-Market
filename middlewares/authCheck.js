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

        if(!user.enabled){
            return res.status(400).json({message:"Accout cannot access"})
        }


        next()
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Token Invaild"})
    }
}

//admin check
exports.adminCheck = async(req, res, next) =>{
    try{
        const {email} = req.user
        

        const adminUser = await prisma.user.findFirst({
            where:{
                email: email
            }
        })
        //console.log(adminUser)
        if(!adminUser || adminUser.role !== "admin"){
            return res.status(403).json({message: "Acess Denide: Admin Only!"})
        }

        next()
    }catch(err){
        console.log(err)
        res.status(500).json({message:"Error Admin access denide"})
    }
}