const Visit = require("../models/Visit"); // Adjust the path to your Visit model

// Create a new visit
const bookVisit = async (req, res) => {
  try {
    const { name, email, phone, message, visitDate, selectedTime } = req.body;

    // Check for existing bookings at the same time
    const existingVisit = await Visit.findOne({ visitDate });
    if (existingVisit) {
      return res
        .status(400)
        .json({ customError: "This time slot is already booked." });
    }

    const newVisit = new Visit({
      name,
      email,
      phone,
      message,
      visitDate,
      selectedTime,
    });

    await newVisit.save();
    return res
      .status(201)
      .json({ message: "Visit booked successfully!", visit: newVisit });
  } catch (error) {
    console.error("Error booking visit:", error);
    return res
      .status(500)
      .json({ customError: "An unexpected error occurred. Please try again." });
  }
};

// Get all booked visits
const getAllVisits = async (req, res) => {
  try {
    // Get the current time
    const currentTime = new Date();

    // Query for visits where visitDate is in the future (greater than or equal to the current time)
    const visits = await Visit.find({ visitDate: { $gte: currentTime } });
    
    return res.status(200).json(visits);
  } catch (error) {
    console.error("Error retrieving visits:", error);
    return res.status(500).json({ customError: "Failed to retrieve visits." });
  }
};

// Fetch booked times for a specific date
const getBookedTimes = async (req, res) => {
  try {
    // Find all visits within the specified date
    const bookedVisits = await Visit.find().select("visitDate selectedTime");

    // Extract booked times from visits

    return res.status(200).json(bookedVisits);
  } catch (error) {
    console.error("Error fetching booked times:", error);
    return res
      .status(500)
      .json({ customError: "Failed to fetch booked times." });
  }
};

const deleteVisit = async (req, res) => {
  try {
    const id = req.params.id
    const visit = await Visit.findByIdAndDelete(id);
    return res.status(200).json(visit);
  } catch (error) {
    console.error("Error deleting visit:", error);
    return res
      .status(500)
      .json({ customError: "Failed to delete visit." });
  }
};

module.exports = {
  bookVisit,
  getAllVisits,
  getBookedTimes,
  deleteVisit
};