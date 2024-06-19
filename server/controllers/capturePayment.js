const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const mongoose = require("mongoose");

// Capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
    const { courses } = req.body;
    const userId = req.user.id;
    if (courses.length === 0) {
        return res.json({ success: false, message: "Please Provide Course ID" });
    }

    let total_amount = 0;

    for (const course_id of courses) {
        let course;
        try {
            // Find the course by its ID
            course = await Course.findById(course_id);

            // If the course is not found, return an error
            if (!course) {
                return res
                    .status(200)
                    .json({ success: false, message: "Could not find the Course" });
            }

            // Check if the user is already enrolled in the course
            const uid = new mongoose.Types.ObjectId(userId);
            if (course.studentsEnrolled.includes(uid)) {
                return res
                    .status(200)
                    .json({ success: false, message: "Student is already Enrolled" });
            }

            // Add the price of the course to the total amount
            total_amount += course.price;
        } catch (error) {
            console.log(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    const options = {
        amount: total_amount * 100,
        currency: "INR",
        receipt: Math.random(Date.now()).toString(),
    };

    try {
        // Initiate the payment using Razorpay
        const paymentResponse = await instance.orders.create(options);
        console.log(paymentResponse);
        res.json({
            success: true,
            data: paymentResponse,
        });
    } catch (error) {
        console.log(error);
        res
            .status(500)
            .json({ success: false, message: "Could not initiate order." });
    }
};
