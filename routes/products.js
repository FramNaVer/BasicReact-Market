const express = require('express')
const router = express.Router()

//improt Controllerproducts
const {create, list, update, listby, remove, searchFilter, read} = require('../controllers/controllerproducts')


router.post('/product',create)
router.get('/products/:count',list)
router.put('/product/:id', update)
router.get('/product/:id', read)
router.delete('/product/:id',remove)
router.post('/productby',listby)
router.post('/search/filters',searchFilter)



module.exports = router