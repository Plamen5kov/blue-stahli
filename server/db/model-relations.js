
const defineRelations = (db) => {
	const common = (options) => ({
		...options,
		onDelete: 'CASCADE',
		onUpdate: 'CASCADE',
	});

	
	//belongsTo just means that a FK will be created in the source table
	// db.Afterburner.belongsTo(db.ProductAttributes, common({ foreignKey: 'product_attribute_id' }))

}


module.exports = {
	defineRelations
}