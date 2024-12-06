const express = require('express')
const router = express.Router()
// import router to controllercategory
const {create , list, remove} = require('../controllers/controllercategory')


router.post('/category', create)
router.get('/category', list)
router.delete('/category/:id' , remove)

module.exports = router