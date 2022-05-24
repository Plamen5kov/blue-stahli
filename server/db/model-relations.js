
const defineRelations = (db) => {
	db.User.hasMany(db.Experience)
	db.Experience.belongsTo(db.User)

	db.User.belongsToMany(db.Skill, { through: 'SdgGoalsToHumanRightsMap', timestamps: false })
	db.Skill.belongsToMany(db.User, { through: 'SdgGoalsToHumanRightsMap', timestamps: false })

	db.User.hasMany(db.Education)
	db.Education.belongsTo(db.User)

	db.User.hasMany(db.Certification)
	db.Certification.belongsTo(db.User)
}

module.exports = {
	defineRelations
}