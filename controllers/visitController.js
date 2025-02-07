const Visit = require("../models/Visit"); // Adjust the path to your Visit model
const { sendMail } = require("./mailController");

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

    // Convert visitDate to Georgian time
    const visitDateObj = new Date(visitDate);
    const georgianTimeFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Tbilisi", // Georgian time zone
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const endGeorgianTimeFormatter = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Tbilisi", // Georgian time zone
      hour: "2-digit",
      minute: "2-digit",
    });
    const georgianTime = georgianTimeFormatter.format(visitDateObj);

    // Calculate end time by adding 30 minutes for each "selectedTime" unit
    const endTimeObj = new Date(visitDateObj);
    endTimeObj.setMinutes(endTimeObj.getMinutes() + selectedTime * 30);

    const endGeorgianTime = endGeorgianTimeFormatter.format(endTimeObj);

    await sendMail(
      "maisuradzemariami09.07@gmail.com",
      "Design-lab Reservation",
      `${georgianTime} - ${endGeorgianTime} \nName:  ${name} \nMail:  ${email} \n+Tel:  ${phone}\n\nMessage:  ${message}`
    ); 
    await sendMail(
      "q.urotadze@yahoo.com",
      "Design-lab Reservation",
      `${georgianTime} - ${endGeorgianTime} \nName:  ${name} \nMail:  ${email} \n+Tel:  ${phone}\n\nMessage:  ${message}`
    ); 
    await sendMail(
      "designersunion.geo@gmail.com",
      "Design-lab Reservation",
      `${georgianTime} - ${endGeorgianTime} \nName:  ${name} \nMail:  ${email} \n+Tel:  ${phone}\n\nMessage:  ${message}`
    ); 

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
    const id = req.params.id;
    const visit = await Visit.findByIdAndDelete(id);
    return res.status(200).json(visit);
  } catch (error) {
    console.error("Error deleting visit:", error);
    return res.status(500).json({ customError: "Failed to delete visit." });
  }
};

module.exports = {
  bookVisit,
  getAllVisits,
  getBookedTimes,
  deleteVisit,
};
