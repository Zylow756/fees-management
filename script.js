console.log("javascript connected");


let course = document.getElementById("course");

course.addEventListener("change", function() {

    document.getElementById("totalFees").value = course.value;

});


let calculateBtn = document.getElementById("calculateBtn");

calculateBtn.addEventListener("click", function() {


    // Received Fees
    let receivedFees = document.getElementById("receivedFees").value;


    // Received Fees blank check
    if (receivedFees === "") {

        alert("Please Enter Received Fees");

        return;
    }


    // Received Fees number check
    if (isNaN(receivedFees)) {

        alert("Please Enter Valid Fees");

        return;
    }


    // Total Fees
    let totalFees = Number(
        document.getElementById("totalFees").value
    );


    // Discount
    let discount = Number(
        document.getElementById("discount").value
    );


    // Discount negative check
    if (discount < 0) {

        alert("Discount Cannot be negative");

        return;
    }


    // Discount greater than total fees
    if (discount > totalFees) {

        alert("Discount Total Fees se jyada nahi ho sakta");

        return;
    }


    // Final Fees
    let finalFees = totalFees - discount;


    // Received Fees ko number mein convert karo
    receivedFees = Number(receivedFees);


    // Received Fees greater than Final Fees
    if (receivedFees > finalFees) {

        alert("Received Fees Final Fees se jyada nahi ho sakti");

        return;
    }


    // Received Fees negative
    if (receivedFees < 0) {

        alert("Received Fees Cannot be negative");

        return;
    }


    // Balance Fees
    let balanceFees = finalFees - receivedFees;


    // Final Fees show
    document.getElementById("finalFees").value = finalFees;


    // Balance Fees show
    document.getElementById("balanceFees").value = balanceFees;


    // Fees Status
    if (receivedFees < finalFees) {

        document.getElementById("feesStatus").innerHTML = "Fees Due";

    } else {

        document.getElementById("feesStatus").innerHTML = "No Due";

    }


let paymentMode = document.getElementById("paymentMode").value;

if (paymentMode === "installment") {

    let installmentAmount1 = Number(
        document.getElementById("installmentAmount1").value
    );

    let installmentAmount2 = Number(
        document.getElementById("installmentAmount2").value
    );

    let installmentAmount3 = Number(
        document.getElementById("installmentAmount3").value
    );

    let installmentAmount4 = Number(
        document.getElementById("installmentAmount4").value
    );

    let installmentAmount5 = Number(
        document.getElementById("installmentAmount5").value
    );


    // Installment 1 Balance se jyada hai?
if (installmentAmount1 > balanceFees) {

    alert("Installment 1 Balance Fees se jyada nahi ho sakti");

    return;
}


// Installment 2 Balance se jyada hai?
if (installmentAmount2 > balanceFees) {

    alert("Installment 2 Balance Fees se jyada nahi ho sakti");

    return;
}


// Installment 3 Balance se jyada hai?
if (installmentAmount3 > balanceFees) {

    alert("Installment 3 Balance Fees se jyada nahi ho sakti");

    return;
}


// Installment 4 Balance se jyada hai?
if (installmentAmount4 > balanceFees) {

    alert("Installment 4 Balance Fees se jyada nahi ho sakti");

    return;
}


// Installment 5 Balance se jyada hai?
if (installmentAmount5 > balanceFees) {

    alert("Installment 5 Balance Fees se jyada nahi ho sakti");

    return;
}


// Sabhi installment ka total
let installmentTotal =
    installmentAmount1 +
    installmentAmount2 +
    installmentAmount3 +
    installmentAmount4 +
    installmentAmount5;


// Installment Total Balance se jyada hai?
if (installmentTotal > balanceFees) {

    alert(
        "Sabhi Installment ka Total ₹" +
        installmentTotal +
        " hai, lekin Balance Fees sirf ₹" +
        balanceFees +
        " hai."
    );

    return;
}

}
    // Student Name
    let studentName =
        document.getElementById("studentName").value;


    // Course Name
    let courseName =
        course.options[course.selectedIndex].text;


    // Student Result
    document.getElementById("studentResult").innerHTML =

        "Student Name: " + studentName + "<br>" +

        "Course: " + courseName + "<br>" +

        "Total Fees: ₹" + totalFees + "<br>" +

        "Discount: ₹" + discount + "<br>" +

        "Final Fees: ₹" + finalFees + "<br>" +

        "Received Fees: ₹" + receivedFees + "<br>" +

        "Balance Fees: ₹" + balanceFees + "<br>" +

        "Status: " +
        (receivedFees < finalFees ? "Fees Due" : "No Due");

});

let paymentMode = document.getElementById("paymentMode");

let installmentSection = document.getElementById("installmentSection");

paymentMode.addEventListener("change", function() {

    if (paymentMode.value === "installment") {

        installmentSection.style.display = "block";

    } else {

        installmentSection.style.display = "none";

    }

});
 
// Save Student Button
let saveStudentBtn = document.getElementById("saveStudentBtn");

saveStudentBtn.addEventListener("click", async function() {

loadStudentReport()
    // Student Basic Information
    let studentId = document.getElementById("studentId").value;
    let studentName = document.getElementById("studentName").value;
    let fatherName = document.getElementById("fatherName").value;
    let mobile = document.getElementById("mobile").value;
    let email = document.getElementById("email").value;
    let dob = document.getElementById("dob").value;

    // Course & Fee Information
    let courseName = course.options[course.selectedIndex]?.text || "";
    let totalFees = Number(document.getElementById("totalFees").value) || 0;
    let receivedFees = Number(document.getElementById("receivedFees").value) || 0;
    let balanceFees = Number(document.getElementById("balanceFees").value) || 0;

    // Validation
    if (studentName === "") {
        alert("Please Enter Student Name");
        return;
    }

    if (mobile === "") {
        alert("Please Enter Mobile Number");
        return;
    }

    // Backend Schema के अनुसार Object बनाएँ
    let studentData = {
        name: studentName,
        rollNo: studentId, // studentId को rollNo की तरह भेज रहे हैं
        course: courseName,
        admissionMonth: new Date().toLocaleString('default', { month: 'long' }), // चालू महीना
        totalFee: totalFees,
        paidFee: receivedFees,
        dueFee: balanceFees
    };

    try {
        // API के जरिए MongoDB Atlas को डाटा भेजें
        let response = await fetch('http://localhost:5000/api/students', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(studentData)
        });

        let result = await response.json();

        if (result.success) {
            alert("✅ Student Data MongoDB Atlas में सफलतापूर्वक सेव हो गया!");

            // Screen पर भी Show करें
            document.getElementById("studentDetails").innerHTML =
                "Student ID: " + studentId + "<br>" +
                "Student Name: " + studentName + "<br>" +
                "Mobile: " + mobile + "<br>" +
                "Course: " + courseName + "<br>" +
                "Paid Fee: ₹" + receivedFees + "<br>" +
                "Due Fee: ₹" + balanceFees;
        } else {
            alert("❌ Server Error: " + result.message);
        }

    } catch (error) {
        console.error("Error:", error);
        alert("❌ Server से कनेक्ट नहीं हो सका! (कृपया चेक करें कि node server.js चालू है)");
    }
});
// Fee Update Button (fee.html के लिए)
let updateFeeBtn = document.getElementById("updateFeeBtn") || calculateBtn;

if (updateFeeBtn) {
    loadStudentReport();
    
    updateFeeBtn.addEventListener("click", async function () {
        
        // फ़ीस की जानकारी लें
        let studentName = document.getElementById("studentName") ? document.getElementById("studentName").value : "";
        let totalFees = Number(document.getElementById("totalFees").value) || 0;
        let receivedFees = Number(document.getElementById("receivedFees").value) || 0;
        let balanceFees = Number(document.getElementById("balanceFees").value) || 0;
        let selectedCourse = course ? course.options[course.selectedIndex]?.text : "";

        if (!studentName) {
            alert("कृपया छात्र का नाम भरें!");
            return;
        }

        // अपडेट करने के लिए डेटा पैकेज
        let feeData = {
            name: studentName,
            course: selectedCourse,
            totalFee: totalFees,
            paidFee: receivedFees,
            dueFee: balanceFees
        };

        try {
            // बैकएंड को डेटा भेजें (POST/PUT)
            let response = await fetch('http://localhost:5000/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feeData)
            });

            let result = await response.json();

            if (result.success) {
                alert("✅ " + studentName + " की फ़ीस सफलतापूर्वक अपडेट हो गई!");
            } else {
                alert("❌ एरर: " + result.message);
            }
        } catch (error) {
            console.error("Error updating fee:", error);
            alert("❌ सर्वर से कनेक्ट नहीं हो सका!");
        }
    });
}
// MongoDB Atlas से सभी Students का डेटा लाकर टेबल में दिखाने वाला फ़ंक्शन
async function loadStudentReport() {
    let tableBody = document.getElementById("studentTableBody");
    if (!tableBody) return; // अगर पेज पर टेबल नहीं है तो कोड रुक जाएगा

    try {
        let response = await fetch('http://localhost:5000/api/students');
        let result = await response.json();

        if (result.success) {
            let students = result.data;
            tableBody.innerHTML = ""; // पुरानी टेबल खाली करें

            if (students.length === 0) {
                tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">कोई डेटा उपलब्ध नहीं है</td></tr>`;
                return;
            }

            // प्रत्येक छात्र के लिए Row बनाएँ
            students.forEach(student => {
                let statusColor = student.dueFee > 0 ? "red" : "green";
                let statusText = student.dueFee > 0 ? "Due" : "Paid";

                let row = `
                    <tr>
                        <td>${student.rollNo || '-'}</td>
                        <td><b>${student.name}</b></td>
                        <td>${student.course || '-'}</td>
                        <td>₹${student.totalFee || 0}</td>
                        <td style="color: green;">₹${student.paidFee || 0}</td>
                        <td style="color: red;">₹${student.dueFee || 0}</td>
                        <td style="color: ${statusColor}; font-weight: bold;">${statusText}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        }
    } catch (error) {
        console.error("डेटा लोड करने में त्रुटि:", error);
    }
}

// पेज लोड होते ही और फ़ॉर्म सेव होते ही रिपोर्ट अपने-आप अपडेट हो जाए
window.addEventListener("DOMContentLoaded", loadStudentReport);