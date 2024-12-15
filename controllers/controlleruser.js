// const  Prisma  = require("@prisma/client")
const prisma = require("../config/prisma")

exports.listUsers = async (req, res ) =>{
    try{
        const users = await prisma.user.findMany({
            select:{
                id:true,
                email:true,
                role:true,
                enabled:true,
                address:true
            }
        })
        res.json(users)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server Error"})
    }
}

exports.changeStatus = async (req, res ) =>{
    try{
        const {id, enabled} = req.body
        console.log(id, enabled)

        const user = await prisma.user.update({
            where:{id:Number(id)},
            data:{enabled:enabled}
        })
        res.send("Update Status success")
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server Error"})
    }
}

exports.changeRole = async (req, res ) =>{
    try{
        const {id, role} = req.body
        //console.log(id, enabled)
        const user = await prisma.user.update({
            where:{id:Number(id)},
            data:{role:role}
        })
        res.send("Update Role success")
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server Error"})
    }
}

exports.userCart = async (req, res ) =>{
    try{
        const {cart} = req.body
        console.log(cart)
        console.log(req.user.id)

        const user = await prisma.user.findFirst({
            where:{
                id:Number(req.user.id)
            }
        })
        //console.log(user)   

        //del old cart item
        await prisma.productOnCart.deleteMany({
            where:{
                cart: {orderById: user.id}
            }
        })
        // del old cart 
        await prisma.cart.deleteMany({
            where:{
                orderById:user.id
            }
        })
        //เตรียม สินค้า
        let products = cart.map((item)=> ({
            productId: item.id,
            count: item.count,
            price: item.price
        }))

        //คำนวณผลรวมสินค้า
        let cartTotal = products.reduce((sum, item)=> sum+item.price * item.count, 0)
        

        //New Cart
        const newCart = await prisma.cart.create({
            data:{
                products:{ // รับจาก ** เตรียมสินค้า **
                    create: products
                },
                cartTotal:cartTotal,
                orderById:user.id
            }
        })


        console.log(newCart)
        console.log("User Add Cart success")
        
        res.send("UserCart complete")
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server Error"})
    }
}

exports.getUserCart = async (req, res ) =>{
    try{
        const cart = await prisma.cart.findFirst({
            where:{
                orderById: Number(req.user.id)
            },
            include:{
                products:{
                    include:{
                        product:true
                    }
                }
            }
        })
        //console.log(cart)

        res.json({
            products: cart.products,
            cartTotal: cart.cartTotal
        })
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server Error"})
    }
}

exports.emptyCart = async (req, res ) =>{
    try{
        const cart = await prisma.cart.findFirst({
            where:{
                orderById: Number(req.user.id)
            }
        })
        if(!cart){
            return res.status(400).json({message:"No Cart"})
        }

        await prisma.productOnCart.deleteMany({
            where:{
                cartId: cart.id
            }
        })

        const result = await prisma.cart.deleteMany({
            where:{
                orderById:Number(req.user.id)
            }
        })
        console.log(result)

        res.json({
            message: "Cart Empty Success",
            deletedCount:result.count
        })
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server Error"})
    }
}

exports.saveAddress = async (req, res ) =>{
    try{
        const {address} = req.body
        const addressUser = await prisma.user.update({
            where:{
                id: Number(req.user.id)
            },
            data:{
                address:address,
            }
        })
        console.log(address)
        res.json({
            OK: true,
            message:"Update Success"
        })
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server Error"})
    }
}

exports.saveOrder = async (req, res ) =>{
    try{
        //step 1 Get UserCart
        const userCart = await prisma.cart.findFirst({
            where:{
                orderById:Number(req.user.id)
            },
            include:{
                products:true
            }
        })
        // Check Empty
        if(!userCart || userCart.products.length === 0){
            return res.status(400).json({OK: false, message:"Cart is Empty"})
        }

        // Check Quantity
        for(const item of userCart.products){
            //console.log(item)
            const product = await prisma.product.findUnique({
                where:{
                    id:item.productId
                },
                select:{
                    quantity:true,
                    title:true
                }
            })
            // console.log(item)
            // console.log(product)
            if(!product || item.count > product.quantity){
                return res.status(400).json({
                    OK:false,
                    message: `Sorry Require Product ${product?.title || "product"} out of stock`
                })
            }
        }

        //Creat New Order
        const order = await prisma.order.create({
            data:{
                products:{
                    create:
                        userCart.products.map((item)=>({
                            productId: item.productId,
                            count:item.count,
                            price:item.price,
                        }))
                    
                },
                orderedBy:{
                    connect:{
                        id:req.user.id
                    }
                },
                cartTotal: userCart.cartTotal
            }
        })

        //Update product
        const update = userCart.products.map((item)=>({
            where:{
                id:item.productId
            },
            data:{
                quantity: {
                    decrement:item.count
                },
                sold:{
                    increment:item.count
                }
            }
        }))
        console.log(update)

        await Promise.all(
            update.map((updated)=> prisma.product.update)
        )

        await prisma.cart.deleteMany({
            where:{
                orderById: Number(req.user.id)
            }
        })
        res.json({OK: true,order})
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server Error"})
    }
}

exports.getOrder = async (req, res ) =>{
    try{
        res.send("get Order complete")
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server Error"})
    }
}