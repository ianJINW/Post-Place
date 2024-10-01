"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcryptjs");
const roles = require("../config/roles");

module.exports = (sequelize, DataTypes) => {
	class User extends Model {
		/**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
		static associate(models) {
			// define association here
			User.hasMany(models.Post, {
				foreignKey: "userId",
				as: "posts"
			});
		}
	}
	User.init(
		{
			email: {
				type: DataTypes.STRING,
				allowNull: false,
				unique: true,
				validate: { isEmail: true, notEmpty: true }
			},
			username: {
				type: DataTypes.STRING,
				unique: true,
				allowNull: false,
				validate: { notEmpty: true }
			},
			password: {
				type: DataTypes.STRING,
				allowNull: false,
				validate: {
					is: /^[a-zA-Z0-9_!@#$%^&*()]*$/,
					notEmpty: true,
					len: [8, 128]
				}
			},
			profileImage: {
				type: DataTypes.STRING,
				defaultValue: "/profileImages/default.jpg"
			},
			role: {
				type: DataTypes.ENUM("admin", "user"),
				allowNull: false,
				defaultValue: "user"
			}
		},
		{
			sequelize,
			modelName: "User",
			hooks: {
				beforeCreate: async user => {
					const salt = await bcrypt.genSalt(10);
					user.password = await bcrypt.hash(user.password, salt);
					console.log("Hashed password during registration:", user.password);
				},
				beforeUpdate: async user => {
					if (user.changed("password")) {
						const salt = await bcrypt.genSalt(10);
						user.password = await bcrypt.hash(user.password, salt);
						console.log("Hashed password during update:", user.password);
					}
				}
			}
		}
	);
	return User;
};
