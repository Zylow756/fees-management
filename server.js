require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dns = require("dns");

// IPv4 force
dns.setDefaultResultOrder("ipv4first");

const app = express();

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json({ limit: "10mb" }));


// ===============================
// MongoDB Connection
// ===============================
const DB_URI = process.env.MONGO_URI;

if (!DB_URI) {
    console.error("❌ MONGO_URI .env file में नहीं मिला!");
    process.exit(1);
}

mongoose.connect(DB_URI, {
    family: 4,
    serverSelectionTimeoutMS: 10000
})
.then(() => {
    console.log("✅ MongoDB Atlas Connected Successfully!");
    console.log("📦 DATABASE:", mongoose.connection.name);
})
.catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
});


// ===============================
// Student Schema
// ===============================
const studentSchema = new mongoose.Schema({

    studentId: {
        type: String,
        required: true
    },

    admissionDate: {
        type: String,
        default: ""
    },

    coursetype: {
        type: String,
        default: ""
    },

    studentName: {
        type: String,
        required: true
    },

    fatherName: {
        type: String,
        default: ""
    },

    dob: {
        type: String,
        default: ""
    },

    mobile: {
        type: String,
        default: ""
    },

    email: {
        type: String,
        default: ""
    },

    houseNo: {
        type: String,
        default: ""
    },

    areaLocality: {
        type: String,
        default: ""
    },

    district: {
        type: String,
        default: ""
    },

    pin: {
        type: String,
        default: ""
    },

    photo: {
        type: String,
        default: ""
    },

    qualification: {
        type: String,
        default: ""
    },

    steam: {
        type: String,
        default: ""
    },

    board: {
        type: String,
        default: ""
    },

    passingYear: {
        type: String,
        default: ""
    },

    percentage: {
        type: String,
        default: ""
    },

    totalFee: {
        type: Number,
        default: 0
    },

    paidFee: {
        type: Number,
        default: 0
    },

    dueFee: {
        type: Number,
        default: 0
    },

    feeDetails: {
        type: Object,
        default: {}
    }

});

// ===============================
// Student Model
// ===============================
const Student =
    mongoose.models.Student ||
    mongoose.model("Student", studentSchema);

    console.log("DATABASE:", mongoose.connection.name);
console.log("COLLECTION:", Student.collection.name);

// ======================================================
// 0. SAVE NEW STUDENT
// ======================================================

app.post("/api/students", async (req, res) => {

    try {

       const {
    studentId,
    studentName,
    admissionDate,
    coursetype,
    fatherName,
    dob,
    mobile,
    email,
    houseNo,
    areaLocality,
    district,
    pin,
    photo,
    qualification,
    steam,
    board,
    passingYear,
    percentage
} = req.body;

        console.log("📝 New Student:", req.body);

        if (!studentName || !studentId) {
            return res.status(400).json({
                success: false,
                message: "Student name और Student ID जरूरी है"
            });
        }

        const student = new Student({
    studentId: studentId,
    studentName: studentName,
    admissionDate: admissionDate || "",
    coursetype: coursetype || "",
    fatherName: fatherName || "",
    dob: dob || "",
    mobile: mobile || "",
    email: email || "",
    houseNo: houseNo || "",
    areaLocality: areaLocality || "",
    district: district || "",
    pin: pin || "",
    photo: photo || "",
    qualification: qualification || "",
    steam: steam || "",
    board: board || "",
    passingYear: passingYear || "",
    percentage: percentage || ""
});
        const savedStudent = await student.save();

        console.log("✅ Student Saved:", savedStudent);

        res.status(201).json({
            success: true,
            message: "Student successfully saved",
            data: savedStudent
        });

    } catch (error) {

        console.error("❌ Save Student Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});
// ======================================================
// 1. GET ALL STUDENTS
// ======================================================
app.get("/api/students", async (req, res) => {

    try {

        const students = await Student.find().sort({
            _id: -1
        });

        res.status(200).json({
            success: true,
            data: students
        });

    } catch (error) {

        console.error("❌ Get Students Error:", error);

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// ======================================================
// 2. SEARCH STUDENT BY ID / ROLL NO
// ======================================================
app.get("/api/students/:studentId", async (req, res) => {

    try {

        const studentId =
            decodeURIComponent(req.params.studentId).trim();

        console.log("🔍 Searching Student ID:", studentId);

       const student = await Student.findOne({
    $or: [
        { rollNo: studentId },
        { studentId: studentId }
    ]

        });

        if (!student) {

            console.log("❌ Student not found:", studentId);

            return res.status(404).json({
                success: false,
                message: "Student not found"
            });

        }

        console.log("✅ Student found:", student);

        res.status(200).json({
            success: true,
            data: student
        });

    } catch (error) {

        console.error("❌ Student Search Error:", error);

        res.status(500).json({
            success: false,
            message: "Server error",
            error: error.message
        });

    }

});


// ======================================================
// 3. PAYMENT UPDATE API
// ======================================================
app.put("/api/students/:id/pay", async (req, res) => {

    try {

        const studentId =
            decodeURIComponent(req.params.id).trim();

        const {
            feeDetails,
            paidFee,
            dueFee
        } = req.body;

        console.log("💰 Payment Update Request:");
        console.log("Student ID:", studentId);
        console.log("Paid Fee:", paidFee);
        console.log("Due Fee:", dueFee);

        const updatedStudent =
            await Student.findOneAndUpdate(

                {
                    $or: [
                        {
                            rollNo: studentId
                        },
                        {
                            studentId: studentId
                        }
                    ]
                },

                {
                    $set: {
                        feeDetails: feeDetails || {},
                        paidFee: Number(paidFee) || 0,
                        dueFee: Number(dueFee) || 0
                    }
                },

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!updatedStudent) {

            console.log(
                "❌ Payment Student not found:",
                studentId
            );

            return res.status(404).json({
                success: false,
                message: "स्टूडेंट नहीं मिला!"
            });

        }


        console.log(
            "✅ Payment Updated:",
            updatedStudent.rollNo
        );


        res.status(200).json({
            success: true,
            message: "Payment successfully update हो गया!",
            data: updatedStudent
        });


    } catch (error) {

        console.error(
            "❌ Payment Update Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

});


// ======================================================
// 4. SERVER START
// ======================================================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {

    console.log(
        `🚀 Server running on port ${PORT}`
    );

});