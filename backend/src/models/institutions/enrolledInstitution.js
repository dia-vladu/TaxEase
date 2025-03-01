const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');
const EnrollmentRequest = require('./enrollmentRequest');
const County = require('../locations/county');

const EnrolledInstitution = sequelize.define(
    'EnrolledInstitution',
    {
        cui: {
            type: DataTypes.STRING(10),
            primaryKey: true,
            field: 'CUI'
        },
        name: {
            type: DataTypes.STRING(64),
            allowNull: false,
            field: 'NAME'
        },
        phoneNumber: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                isPhoneNumberFormat(value) {
                    const phoneRegex = /^\d{10}$/;
                    if (!phoneRegex.test(value)) {
                        throw new Error('Invalid phone number format.');
                    }
                },
            },
            field: 'PHONE_NUMBER'
        },
        publicEmail: {
            type: DataTypes.STRING(64),
            allowNull: false,
            unique: 'institution_public_email_unique_constraint',
            validate: {
                isEmailFormat(value) {
                    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
                    if (!emailRegex.test(value)) {
                        throw new Error('Invalid email format. Only ".com" and ".ro" domains are allowed.');
                    }
                },
            },
            field: 'PUBLIC_EMAIL'
        },
        address: {
            type: DataTypes.STRING(128),
            allowNull: false,
            field: 'ADDRESS'
        },
        officialSiteLink: {
            type: DataTypes.STRING(64),
            validate: { // Accepts both http and https
                isUrl: {
                    msg: "The link must be a valid URL starting with http or https"
                }
            },
            field: 'OFFICIAL_SITE_LINK'
        },
        locality: {
            type: DataTypes.STRING(32),
            allowNull: false,
            field: 'LOCALITY'
        },
        bonificationPercentage: {
            type: DataTypes.DECIMAL(3, 0),
            allowNull: false,
            field: 'BONIFICATION_PERCENTAGE',
            validate: {
                min: 0,
                max: 100
            }
        },
        penaltyPercentage: {
            type: DataTypes.DECIMAL(3, 0),
            allowNull: false,
            field: 'PENALTY_PERCENTAGE',
            validate: {
                min: 0,
                max: 100
            }
        },
        requestId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: EnrollmentRequest,
                key: 'id'
            },
            field: 'REQUEST_ID'
        },
        countyCode: {
            type: DataTypes.STRING(2),
            allowNull: false,
            references: {
                model: County,
                key: 'code'
            },
            field: 'COUNTY_CODE',
            onDelete: 'CASCADE'
        }
    }, {
    tableName: 'ENROLLED_INSTITUTIONS',
    timestamps: false,
    freezeTableName: true
});

module.exports = EnrolledInstitution;
