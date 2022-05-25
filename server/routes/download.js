const express = require('express')
const router = express.Router()

const {
    download
} = require('../controllers/download')

router
    .route('/')
    .get(download)

module.exports = router
