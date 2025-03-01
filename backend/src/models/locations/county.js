const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const County = sequelize.define(
    "County",
    {
        code: {
            type: DataTypes.STRING(2),
            primaryKey: true,
            field: 'CODE'
        },
        name: {
            type: DataTypes.STRING(20),
            allowNull: false,
            field: 'NAME'
        },
        residence: {
            type: DataTypes.STRING(32),
            allowNull: true,
            field: 'RESIDENCE'
        }
    },
    {
        tableName: "COUNTIES",
        timestamps: false,
        freezeTableName: true
    }
)

module.exports = County;