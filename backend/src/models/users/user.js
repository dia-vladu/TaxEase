const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const User = sequelize.define(
    'User',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        identificationCode: { //CNP
            type: DataTypes.STRING(13),
            allowNull: false,
            unique: {
                name: 'user_identification_code_unique_constraint',
                msg: 'Identification code must be unique.'
            },
            field: 'IDENTIFICATION_CODE'
        },
        surname: {
            type: DataTypes.STRING(32),
            allowNull: false,
            field: 'SURNAME'
        },
        name: {
            type: DataTypes.STRING(32),
            allowNull: false,
            field: 'NAME'
        },
        birthDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: {
                    msg: "Invalid birth date format."
                },
                minAge(value) {
                    const today = new Date();
                    const age = today.getFullYear() - value.getFullYear();
                    if (age < 18) {
                        throw new Error('User must be at least 18 years old.');
                    }
                }
            },
            field: 'BIRTH_DATE'
        },
        email: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: {
                name: 'user_email_unique_constraint',
                msg: 'Email address must be unique.'
            },
            validate: {
                isEmail: {
                    msg: "Accepted email format is: foo@bar.com"
                }
            },
            field: 'EMAIL'
        },
        phoneNumber: {
            type: DataTypes.STRING(10),
            allowNull: true,
            validate: {
                isPhoneNumberFormat(value) {
                    if (value === null) {
                        return;
                    }

                    const phoneRegex = /^\d{10}$/;
                    if (!phoneRegex.test(value)) {
                        throw new Error('Invalid telephone number format.');
                    }
                },
            },
            field: 'PHONE_NUMBER'
        },
        address: {
            type: DataTypes.STRING(64),
            allowNull: true,
            field: 'ADDRESS'
        },
        gender: {
            type: DataTypes.STRING(1),
            allowNull: true,
            field: 'GENDER',
            validate: {
                isIn: [['M', 'F', 'O']]
            }
        }
    }, {
    tableName: 'USERS',
    timestamps: false,
    freezeTableName: true
});

module.exports = User;