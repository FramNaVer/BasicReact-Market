const { query } = require("express");
const prisma = require("../config/prisma");

exports.create = async (req, res) => {
    try {
        const { title, description, price, quantity, categoryId, images } =
            req.body;
        // console.log(title , description, price, quantity, images)
        const product = await prisma.product.create({
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => {
                        asset_id: item.asset_id;
                        public_id: item.public_id;
                        url: item.url;
                        secure_url: item.secure_url;
                    }),
                },
            },
        });
        res.send(product);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server category Error" });
    }
};

exports.list = async (req, res) => {
    try {
        const { count } = req.params;
        const products = await prisma.product.findMany({
            take: parseInt(count),
            orderBy: {
                createdAt: "desc",
            },
            include: {
                category: true,
                images: true,
            },
        });
        console.log(typeof count);
        // const list = await prisma.list.findMany()
        res.send(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server category Error" });
    }
};

exports.read = async (req, res) => {
    try {
        const { id } = req.params;
        const products = await prisma.product.findFirst({
            where: {
                id: Number(id),
            },
            include: {
                category: true,
                images: true,
            },
        });
        console.log(typeof count);
        // const list = await prisma.list.findMany()
        res.send(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server category Error" });
    }
};

exports.update = async (req, res) => {
    try {
        const { title, description, price, quantity, categoryId, images } =
            req.body;
        // console.log(title , description, price, quantity, images)

        //delete images and new insert images
        await prisma.image.deleteMany({
            where: {
                productId: Number(req.params.id),
            },
        });

        const product = await prisma.product.update({
            where: {
                id: Number(req.params.id),
            },
            data: {
                title: title,
                description: description,
                price: parseFloat(price),
                quantity: parseInt(quantity),
                categoryId: parseInt(categoryId),
                images: {
                    create: images.map((item) => {
                        asset_id: item.asset_id;
                        public_id: item.public_id;
                        url: item.url;
                        secure_url: item.secure_url;
                    }),
                },
            },
        });
        res.send(product);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server category Error" });
    }
};

exports.remove = async (req, res) => {
    try {
        const { id } = await req.params;
        await prisma.product.delete({
            where: {
                id: Number(id),
            },
        });
        res.send("remove product complete");
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server category Error" });
    }
};

exports.listby = async (req, res) => {
    try {
        const { sort, order, limit } = req.body;
        console.log(sort, order, limit);
        const products = await prisma.product.findMany({
            take: limit,
            orderBy: { [sort]: order },
            include: {
                category: true,
            },
        });

        res.send(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server category Error" });
    }
};

const hnadleQuery = async (req, res, query) => {
    try {
        const products = await prisma.product.findMany({
            where: {
                title: {
                    contains: query,
                    //mode: "insensitive", //ค้นหาโดยไม่สนตัวพิมพ์ใหญ่ พิมพ์เล็ก
                },
            },
            include: {
                category: true,
                images: true,
            },
        });
        res.send(products);
    } catch (err) {
        res.status(500).json({ message: "serve query error" });
    }
};

const handlePrice = async (req, res, priceRange) => {
    try {
        //console.log("Products found:", products);
        const products = await prisma.product.findMany({
            where: {
                price: {
                    gte: priceRange[0], // มากกว่าค่าเเรกใน array
                    lte: priceRange[1]  // น้อยกว่าค่าที่สองใน array EX. มากกว่า 100 เเต่ไม่เกิน 400 [100,400]
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        
        res.send(products)
    } catch (err) {
        //console.error("Error in handlePrice:", err); // Log ข้อผิดพลาด
        res.status(500).json({ message: "serve price error" })
    }
};

const handleCategory = async (req, res, categoryId) => {
    try {
        //console.log("Products found:", products);
        const products = await prisma.product.findMany({
            where: {
                categoryId:{
                    in: categoryId.map((id) => Number(id))
                }
            },
            include: {
                category: true,
                images: true
            }
        })
        
        res.send(products)
    } catch (err) {
        //console.error("Error in handlePrice:", err); // Log ข้อผิดพลาด
        res.status(500).json({ message: "serve price error" })
    }
};

exports.searchFilter = async (req, res) => {
    try {
        
        const { query, category, price} = req.body;
        console.log("Request body:", req.body);

        //query or Serach products
        if (query) {
            console.log("query = ", query);
            await hnadleQuery(req, res, query);
        }
        
        if (category) {
            console.log("category = ", category);
            await handleCategory(req, res, category)
        }

        if (price){
            console.log("price= ", price);
            await handlePrice(req, res, price);
        } 
        //res.send("Serach and filter complete");
        
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Server category Error" });
    }
};
