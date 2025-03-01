const { DataTypes } = require('sequelize')
const sequelize = require('../../sequelize')
const EnrolledInstitution = require('../institutions/enrolledInstitution');

const Tax = sequelize.define(
    "Tax",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        name: {
            type: DataTypes.STRING(64),
            allowNull: false,
            field: 'NAME'
        },
        treasuryAccount: {
            type: DataTypes.STRING(13),
            allowNull: false,
            field: 'TREASURY_ACCOUNT'
        },
        iban: {
            type: DataTypes.STRING(24),
            allowNull: false,
            unique: 'tax_iban_unique_constraint',
            field: 'IBAN'
        },
        institutionCUI:{
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: EnrolledInstitution,
                key: 'cui'
            },
            field: 'INSTITUTION_CUI',
            onDelete: 'CASCADE'
        }
    },
    {
        tableName: "TAXES",
        timestamps: false,
        freezeTableName: true
    }
)

module.exports = Tax;