const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const User = require('./user');

const UserAccount = sequelize.define(
    'UserAccount',
    {
        accountId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: User,
                key: 'id'
            },
            field: 'ACCOUNT_ID'
        },
        username: {
            type: DataTypes.STRING(32),
            allowNull: false,
            field: 'USERNAME'
        },
        password: {
            type: DataTypes.STRING(60),
            allowNull: false,
            field: 'PASSWORD'
        },
        profilePicture: {
            type: DataTypes.BLOB,
            field: 'PROFILE_PICTURE'
        }
    }, {
    tableName: 'USER_ACCOUNTS',
    timestamps: false, // Disable timestamps (createdAt, updatedAt)
    freezeTableName: true
});

UserAccount.belongsTo(User, {
    foreignKey: 'accountId',
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
});

module.exports = UserAccount ;