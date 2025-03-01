const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const validateRoEmail = (value) => {
    const regex = /^[a-zA-Z0-9._%+-]+@([a-zA-Z0-9-]+\.)+ro$/i;
    if (!regex.test(value)) {
        throw new Error('Email format is invalid. Only .ro email addresses are allowed.');
    }
};

const Institution = sequelize.define(
    "Institution",
    {
        cui: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            field: 'CUI'
        },
        name: {
            type: DataTypes.STRING(128),
            allowNull: false,
            field: 'NAME'
        },
        adminEmail: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: 'admin_email_unique_constraint',
            validate: {
                isEmail: {
                    msg: "Invalid format."
                },
                validateRoEmail
            },
            field: 'ADMIN_EMAIL'
        }
    },
    {
        tableName: "INSTITUTIONS",
        timestamps: false,
        freezeTableName: true
    }
)

module.exports = Institution;