const router = require('express').Router();

const emailContoller = require('../../controller/index.js');

router.post('/enroll', emailContoller.enrollment);
router.post('/createAccount', emailContoller.createAccount);
router.post('/requestLink', emailContoller.requestLink);
router.post('/confirmationCode', emailContoller.confirmationCode);
router.post('/paymentProof', emailContoller.paymentProof);

module.exports = router;