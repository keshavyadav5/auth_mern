const express = require('express')
const { signup, login, verifytoken, getUser } = require('../controller/user_controller')
const router = express()


// router.post('/login',)

router.post('/singup',signup)
router.post('/login',login)
router.get('/user',verifytoken,getUser)


module.exports = router