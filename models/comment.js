"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
	class Comment extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			// define association here
			Comment.belongsTo(models.User, {
				foreignKey: "userId",
				as: "user"
			});

			Comment.belongsTo(models.Post, {
				foreignKey: "postId",
				as: "post"
			});
		}
	}
	Comment.init(
		{
			comment: {
				type: DataTypes.TEXT,
				allowNull: false
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
			},
			postId: {
				type: DataTypes.INTEGER,
				allowNull: false
			}
		},
		{
			sequelize,
			modelName: "Comment"
		}
	);
	return Comment;
};
