"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Post extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			// define association here
			Post.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user"
			});
		}
	}
	Post.init(
		{
			content: {
				type: DataTypes.TEXT,
				allowNull: true
			},
			mediaType: {
				type: DataTypes.STRING,
				allowNull: true
			},
			mediaPath: {
				type: DataTypes.STRING,
				allowNull: true
			},
			userId: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "Post"
		}
	);
	return Post;
};
