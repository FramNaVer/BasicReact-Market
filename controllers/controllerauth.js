const prisma = require('../config/prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//Register
exports.register = async(req,res) =>{

    //same if else
    try{
        const {email, password} = req.body

        //Step1 Validate Data body
        if(!email) {
            return res.status(400).json({message: "Email is required?"})
        }
        if(!password) {
            return res.status(400).json({message: "Password is required?"})
        }

        //step2 check Email in Database already?
        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        })
        if(user){
            return res.status(400).json({message:"Email already exits"})
        }

        //step3 HasPassword
        const hashPassword = await bcrypt.hash(password,10)
        
        //step 4 Create Register user
        await prisma.user.create({
            data:{
                email: email,
                password: hashPassword

            }
        })
        res.send('Create user successfully')

    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error"})
    }
}

exports.login = async(req,res) => { 
     //same if else
    try{
        const {email ,password} =req.body
        
        //step 1 check email
        const user = await prisma.user.findFirst({
            where:{
                email: email
            }
        })
        if(!user || !user.enabled){
            return res.status(400).json({message: "user not found? Or Not enable"})
        }

        //step 2 check password
        const isMacth = await bcrypt.compare(password, user.password)
        if(!isMacth){
            return res.status(400).json({message:"Password Invalid"})
        }

        //step 3 create Payload
        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        }
        // console.log(payload)

        //step 4 generate toekn
        jwt.sign(payload,process.env.SECRET,{
            expiresIn: '1d'
        },(err,token) => {
            if(err){
                return res.status(500).json({message: 'Server error'})
            }
            res.json({payload, token})
        })

    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error"})
    }
}

exports.currentUser = async(req,res) => { 
     //same if else
    try{
        res.send("Server currentUser Complete")
    }catch(err){
        console.log(err)
        res.status(500).json({ message: "Server Error"})
    }
}

// exports.currentAdmin = async(req,res) => {
//     try{
//         res.send("Server currentAdmin complete")
//     }catch(err){
//         console.log(err)
//         res.status(500).json({message: "Server Error"})
//     }
// }