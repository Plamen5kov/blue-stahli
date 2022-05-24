
const defineRelations = (db) => {
	db.User.hasMany(db.Experience, { as: 'experiences' })
	db.Experience.belongsTo(db.User, {
		foreignKey: "UserId",
		as: "user",
	})

	db.User.belongsToMany(db.Skill, { through: 'SdgGoalsToHumanRightsMap', timestamps: false })
	db.Skill.belongsToMany(db.User, { through: 'SdgGoalsToHumanRightsMap', timestamps: false })

	db.User.hasMany(db.Education, { as: 'educations' })
	db.Education.belongsTo(db.User, {
		foreignKey: "UserId",
		as: "user",
	})

	db.User.hasMany(db.Certification, { as: 'certifications' })
	db.Certification.belongsTo(db.User, {
		foreignKey: "UserId",
		as: "user",
	})
}

module.exports = {
	defineRelations
}