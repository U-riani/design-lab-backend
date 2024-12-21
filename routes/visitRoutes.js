const express = require('express');
const { bookVisit, getAllVisits, getBookedTimes, deleteVisit } = require('../controllers/visitController'); // Adjust the path as necessary

const router = express.Router();

// Route for booking a visit
router.post('/book', bookVisit);

// Route for getting all booked visits
router.get('/all-visits', getAllVisits);

// Route for getting booked times for a specific date
router.get('/booked-times', getBookedTimes); // Add this line

//Delete visit
router.delete('/delete-visit/:id', deleteVisit);

module.exports = router;
