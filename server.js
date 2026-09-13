
require("dotenv").config();
const DB_URI = process.env.MONGO_URI;


const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dns = require('dns');

// Windows/ISP DNS Lookup समस्या हल करने के लिए IPv4 फ़ोर्स करें
dns.setDefaultResultOrder('ipv4first');

const app = express();
app.use(cors());
app.use(express.json());

// Direct Shard Strings with Fallback Options

mongoose.connect(DB_URI, {
    family: 4, 
    serverSelectionTimeoutMS: 10000
})
.then(() => console.log('✅ MongoDB Atlas Connected Successfully!'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));



// Student Schema & Model
const studentSchema = new mongoose.Schema({
    rollNo: { type: String, required: true },
    name: { type: String },
    course: { type: String },
    totalFee: { type: Number, default: 0 },
    paidFee: { type: Number, default: 0 },
    dueFee: { type: Number, default: 0 },
    feeDetails: { type: Object, default: {} }
});

const Student = mongoose.models.Student || mongoose.model('Student', studentSchema);

// 1. Get All Students Route
app.get('/api/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.status(200).json({ success: true, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 2. Search Student API Route
app.get('/api/students/:id', async (req, res) => {
    try {
        const studentId = decodeURIComponent(req.params.id).trim();

        const student = await Student.findOne({
            $or: [
                { rollNo: studentId },
                { studentId: studentId },
                { registrationNo: studentId }
            ]
        });

        if (!student) {
            return res.status(404).json({ success: false, message: 'स्टूडेंट नहीं मिला!' });
        }

        res.status(200).json({ success: true, data: student });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 3. Payment Update API Route
app.put('/api/students/:id/pay', async (req, res) => {
    try {
        const studentId = decodeURIComponent(req.params.id).trim();
        const { feeDetails, paidFee, dueFee } = req.body;

        const updatedStudent = await Student.findOneAndUpdate(
            { $or: [{ rollNo: studentId }, { studentId: studentId }] },
            { 
                $set: { 
                    feeDetails: feeDetails,
                    paidFee: paidFee,
                    dueFee: dueFee
                } 
            },
            { new: true }
        );

        if (!updatedStudent) {
            return res.status(404).json({ success: false, message: 'स्टूडेंट नहीं मिला!' });
        }

        res.status(200).json({ success: true, data: updatedStudent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// 4. Test Student Add Route
app.get('/api/test-add', async (req, res) => {
    try {
        const newStudent = new Student({
            rollNo: "DAS/092026/001",
            name: "Rahul Sharma",
            course: "Manual & Computerized Accounting",
            totalFee: 15000,
            paidFee: 5000,
            dueFee: 10000,
            feeDetails: {}
        });
        await newStudent.save();
        res.status(200).json({ success: true, message: "Test Student Created!", data: newStudent });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// Server Start
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});