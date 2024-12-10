

exports.listUsers = async (req, res ) =>{
    try{
        res.send("ListUsers Complete")
    }catch(err){
        console.log(err)
        res.status(500).json({message: "Server Error"})
    }
}