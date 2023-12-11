const express = require('express');
const summariesControllers = require('../controllers/summary-controllers');

const router = express.Router();



router.get('/:pid', summariesControllers.getSummaryById);

router.get('/', summariesControllers.getAllSummaries);

router.get('/user/:uid', summariesControllers.getSummariesByUserId);

// position is important!!!! block all the requests comming to below without token 
// router.use(checkAuth);

router.post('/', summariesControllers.createSummary);

router.post('/auto_generated', summariesControllers.generateTLDR);

router.patch('/:pid', summariesControllers.updateSummary);

router.patch('/mark/:pid', summariesControllers.addMark);

router.delete('/:pid', summariesControllers.deleteSummary);

module.exports = router;