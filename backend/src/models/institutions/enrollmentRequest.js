const { DataTypes } = require('sequelize');
const sequelize = require('../../sequelize');

const EnrollmentRequest = sequelize.define(
    "EnrollmentRequest",
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            field: 'ID'
        },
        institutionCUI: {
            type: DataTypes.STRING(10),
            allowNull: false,
            field: 'INSTITUTION_CUI'
        },
        uploadDate: {
            type: DataTypes.DATEONLY, //default format: YYYY/MM/DD
            allowNull: false,
            validate: {
                isDate: true //only allow date strings
            },
            field: 'UPLOAD_DATE'
        },
        pdfDocument: {
            type: DataTypes.BLOB,
            allowNull: false,
            field: 'PDF'
        }
    },
    {
        tableName: "ENROLLMENT_REQUESTS",
        timestamps: false,
        freezeTableName: true
    }
)

module.exports = EnrollmentRequest;