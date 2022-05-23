const express = require('express')
const router = express.Router()

const {
    getContent
} = require('../controllers/content-provider')

router
    .route('/')
    .get(getContent)

module.exports = router
