module.exports = {
  enrollment: require("./email/enrollmentEmail"),
  createAccount: require("./email/createAccountEmail"),
  requestLink: require("./email/enrollmentLinkEmail"),
  confirmationCode: require("./email/confirmationCodeEmail"),
  paymentProof: require("./email/paymentProofEmail"),
};
