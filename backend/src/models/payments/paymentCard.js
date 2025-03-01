const { DataTypes } = require("sequelize");
const sequelize = require("../../sequelize");

const PaymentCard = sequelize.define(
    "PaymentCard",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: "ID", // Primary key of the card
        },
        cardNumber: {
            type: DataTypes.STRING(16),
            allowNull: false,
            unique: "card_unique_constraint",
            validate: {
                isNumeric: true, // Ensures it only contains numbers
                len: [16, 16], // Ensures it's exactly 16 digits
            },
            field: "CARD_NUMBER",
        },
        expiryDate: {
            type: DataTypes.DATE,
            allowNull: false,
            validate: {
                isDate: true, // Ensures it’s a valid date
                isFuture(value) {
                    if (new Date(value) <= new Date()) {
                        throw new Error("Expiration date must be in the future.");
                    }
                },
            },
            field: "EXPIRATION_DATE",
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            },
            field: "USER_ID",
        },
    },
    {
        tableName: "PAYMENT_CARDS",
        timestamps: false,
        freezeTableName: true,
    }
);

module.exports = PaymentCard;
