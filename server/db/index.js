const Sequelize = require('sequelize')

const init = () => {
    try {
        const sequelize = new Sequelize(process.env.DB, process.env.DB_USER, process.env.DB_PASSWORD, {
            dialect: 'postgres',
            host: process.env.HOST,
            dialectOptions: { connectTimeout: 10000 },
            logQueryParameters: true,
            benchmark: true,
            logging: false
        })
        loadModelsAndRelations(sequelize)
        return sequelize
    } catch (e) {
        console.log("ERROR CONNECTING TO DB:")
        console.log(e)
    }
}

const loadModelsAndRelations = (sequelize) => {
    require('../models/Users')(sequelize)
}

module.exports = { sequelize: init() }