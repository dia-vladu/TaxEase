const { DataTypes } = require('sequelize')
const sequelize = require('../../sequelize')
const EnrolledInstitution = require('../institutions/enrolledInstitution');
const Card = require('../payments/paymentCard');
const User = require('../users/user');

const Payment = sequelize.define(
    "Payment",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        paymentDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'PAYMENT_DATE'
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0, // Ensures the amount is positive
            },
            field: 'AMOUNT',
            comment: 'The total payment amount'
        },
        benefitedPersonId: {
            type: DataTypes.STRING(13),
            allowNull: true,
            field: 'BENEFITED_PERSON_ID',
            comment: 'The identification code of the person who benefits from the payment, if not the payer'
        },
        institutionCUI: {
            type: DataTypes.STRING(10),
            allowNull: false,
            references: {
                model: EnrolledInstitution,
                key: 'cui'
            },
            field: 'INSTITUTION_CUI'
        },
        cardId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Card,
                key: 'id'
            },
            field: 'CARD_ID'
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: User,
                key: 'id'
            },
            field: 'USER_ID'
        }
    },
    {
        tableName: "PAYMENTS",
        timestamps: false,
        freezeTableName: true
    }
)

module.exports = Payment;