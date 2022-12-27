
const { register , login , setAvatar , getAllUser } = require('../controllers/user.controller')
const router = require('express').Router()

router.post('/register', register)
router.post('/login',login)
router.post('/setavatar/:id',setAvatar)
router.get('/getalluser/:id',getAllUser)

module.exports = router