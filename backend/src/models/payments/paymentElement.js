const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const Payment = require('./payment');
const KnownTax = require('../taxes/knownTax');
const Fee = require('../taxes/fee');
const Tax = require('../taxes/tax');

const PaymentElement = sequelize.define(
    "PaymentElement",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        paymentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Payment,
                key: 'id'
            },
            field: 'PAYMENT_ID'
        },
        knownTaxId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: KnownTax,
                key: 'id'
            },
            field: 'KNOWN_TAX_ID'
        },
        taxId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Tax,
                key: 'id'
            },
            field: 'TAX_ID'
        },
        feeId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: Fee,
                key: 'id'
            },
            field: 'FEE_ID'
        }
    },
    {
        tableName: "PAYMENT_ELEMENTS",
        timestamps: false,
        freezeTableName: true
    }
)

PaymentElement.belongsTo(KnownTax, { foreignKey: 'knownTaxId' });
PaymentElement.belongsTo(Tax, { foreignKey: 'taxId' });
PaymentElement.belongsTo(Fee, { foreignKey: 'feeId' });

module.exports = PaymentElement;