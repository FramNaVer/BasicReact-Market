//imports ....
const express = require('express')
const router = express.Router()
//import auth form controllerauth
const {register , login, currentUser} = require('../controllers/controllerauth')

router.post('/register',register)
router.post('/login', login)
router.post('/current-user',currentUser)
router.post('/current-admin',currentUser)

module.exports = router