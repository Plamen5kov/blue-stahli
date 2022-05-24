const { init } = require('./connect')
const sequelize = init(
	process.env.DB,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	process.env.DB_DIALECT,
	process.env.HOST
)
const { defineRelations } = require('./model-relations')

require('../models/Certifications')(sequelize)
require('../models/Education')(sequelize)
require('../models/Experience')(sequelize)
require('../models/Skills')(sequelize)
require('../models/Users')(sequelize)

sequelize
	.authenticate()
	.then(async () => {
		defineRelations(sequelize.models)
	})
	.catch((err) => {
		console.error(err);
	});

module.exports = sequelize;