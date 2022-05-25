const express = require('express')
const router = express.Router()

const {
    userInfo
} = require('../controllers/user')

router
    .route('/')
    .get(userInfo)

module.exports = router
