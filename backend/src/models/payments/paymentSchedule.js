const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const Card = require('./paymentCard');
const UserAccount = require('../users/userAccount');
const enrolledInstitution = require('../institutions/enrolledInstitution');

const PaymentSchedule = sequelize.define(
    "PaymentSchedule",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        month: {
            type: DataTypes.DECIMAL(2),
            allowNull: false,
            validate: {
                isMonthValid(value) {
                    if (value < 1 || value > 12) {
                        throw new Error('Chosen month is not valid!');
                    }
                },
            },
            field: 'MONTH'
        },
        day: {
            type: DataTypes.DECIMAL(2),
            allowNull: false,
            validate: {
                isDayValid(value) {
                    if (value < 1 || value > 31) {
                        throw new Error('Chosen day is not valid!');
                    }
                },
                isDayMonthValid() {
                    // Validate the combination of day and month
                    const daysInMonth = new Date(2023, this.month, 0).getDate();
                    if (this.day > daysInMonth) {
                        throw new Error(`Invalid day ${this.day} for month ${this.month}.`);
                    }
                }
            },
            field: 'DAY'
        },
        cardId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Card,
                key: 'id'
            },
            field: 'CARD_ID'
        },
        userAccountId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: UserAccount,
                key: 'id'
            },
            field: 'USER_ACCOUNT_ID'
        },
        institutionCUI: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: enrolledInstitution,
                key: 'cui'
            },
            field: 'INSTITUTION_CUI'
        }
    },
    {
        tableName: "PAYMENT_SCHEDULES",
        timestamps: false,
        freezeTableName: true
    }
)

module.exports = PaymentSchedule;