const prisma = require('../config/prisma')

exports.create = async(req,res) => {
    try{
        const { title , description, price, quantity, categoryId ,images } = req.body
        // console.log(title , description, price, quantity, images)
        const product = await prisma.product.create({
            data: {
                title : title,
                description : description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map( (item) => {
                        asset_id:item.asset_id  
                        public_id:item.public_id    
                        url:item.url          
                        secure_url:item.secure_url   
                    })
                }
            }
        })
        res.send(product)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server category Error"})
    }
}

exports.list = async(req,res) => {
    try{
        const {count} = req.params
        const products = await prisma.product.findMany({
            take:parseInt(count),
            orderBy: {
                createdAt: "desc"
            },
            include:{ 
                category:true,
                images: true
            }
        })
        console.log( typeof count)
        // const list = await prisma.list.findMany()
        res.send(products)

    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server category Error"})
    }
}

exports.read = async(req,res) => {
    try{
        const {id} = req.params
        const products = await prisma.product.findFirst({
            where:{
                id: Number(id)
            },
            include:{ 
                category:true,
                images: true
            }
        })
        console.log( typeof count)
        // const list = await prisma.list.findMany()
        res.send(products)

    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server category Error"})
    }
}

exports.update = async(req,res) => {
    try{
        const { title , description, price, quantity, categoryId ,images } = req.body
        // console.log(title , description, price, quantity, images)

        //delete images and new insert images
        await prisma.image.deleteMany({
            where:{
                productId: Number(req.params.id)
            }
        })

        const product = await prisma.product.update({
            where:{
                id: Number(req.params.id)
            },
            data: {
                title : title,
                description : description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map( (item) => {
                        asset_id:item.asset_id  
                        public_id:item.public_id    
                        url:item.url          
                        secure_url:item.secure_url   
                    })
                }
            }
        })
        res.send(product)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server category Error"})
    }
}

exports.remove = async(req,res) => {
    try{
        const {id} = await req.params
        await prisma.product.delete({
            where:{
                id: Number(id)
            }
        })
        res.send("remove product complete")
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server category Error"})
    }
}

exports.listby = async(req,res) => {
    try{
        const {sort , order, limit} = req.body
        console.log(sort, order, limit )
        const products = await prisma.product.findMany({
            take: limit,
            orderBy: {[sort]:order},
            include:{
                category:true
            }
        })

        res.send(products)
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server category Error"})
    }
}

exports.searchFilter = async(req,res) => {
    try{
        const {query , category , price} = req.body
        //query or Serach products
        if (query){
            console.log('query = ', query)
        }

        if(category){
            console.log('category = ',category)
        }

        if(price){
            console.log('price= ',price)
        }


        res.send("Serach and filter complete")
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server category Error"})
    }
}