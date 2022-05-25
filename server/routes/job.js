const express = require('express')
const router = express.Router()

const {
    status
} = require('../controllers/job')

router
    .route('/:id')
    .get(status)

module.exports = router
