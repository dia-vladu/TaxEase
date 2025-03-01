const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const EnrolledInstitution = require('../institutions/enrolledInstitution');
const UserAccount = require('../users/userAccount');
const Tax = require('./tax');
const PaymentSchedule = require('../payments/paymentSchedule');

const KnownTax = sequelize.define(
    'KnownTax',
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            field: 'AMOUNT'
        },
        issuanceDate: {
            type: DataTypes.DATE,
            allowNull: false,
            field: 'ISSUANCE_DATE',
            comment: `The date when the tax or fee was officially issued. 
            This date is used to calculate eligibility for bonifications (discounts) or penalties.
            Users can track how much time has passed since issuance and determine if they still
            qualify for benefits.`
        },
        paid: {
            type: DataTypes.STRING(3),
            allowNull: false,
            field: 'PAID',
            get() {
                const value = this.getDataValue('paid');
                return value === 'YES';
            },
            set(value) {
                this.setDataValue('paid', value ? 'YES' : 'NO');
            }
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
        paymentScheduleId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: PaymentSchedule,
                key: 'id'
            },
            field: 'PAYMENT_SCHEDULE_ID',
            comment: 'References a payment schedule for recurring or scheduled payments for the tax.'
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
        taxId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: Tax,
                key: 'id'
            },
            field: 'TAX_ID'
        }
    },
    {
        tableName: "KNOWN_TAXES",
        timestamps: false,
        freezeTableName: true
    });

module.exports = KnownTax;
