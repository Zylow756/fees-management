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

let saveStudentBtn =
    document.getElementById("saveStudentBtn");


saveStudentBtn.addEventListener("click", function() {


    // Student Basic Information

    let studentId =
        document.getElementById("studentId").value;

    let studentName =
        document.getElementById("studentName").value;

    let fatherName =
        document.getElementById("fatherName").value;

    let mobile =
        document.getElementById("mobile").value;

    let email =
        document.getElementById("email").value;

    let dob =
        document.getElementById("dob").value;


    // Address

    let houseNo =
        document.getElementById("houseNo").value;

    let areaLocality =
        document.getElementById("areaLocality").value;

    let district =
        document.getElementById("district").value;

    let pin =
        document.getElementById("pin").value;


    // Student Name check

    if (studentName === "") {

        alert("Please Enter Student Name");

        return;
    }


    // Mobile check

    if (mobile === "") {

        alert("Please Enter Mobile Number");

        return;
    }


    // Student Data Object

    let studentData = {

        studentId: studentId,

        studentName: studentName,

        fatherName: fatherName,

        mobile: mobile,

        email: email,

        dob: dob,

        address: {

            houseNo: houseNo,

            areaLocality: areaLocality,

            district: district,

            pin: pin

        }

    };


    // Console mein check

    console.log(studentData);


    // Browser mein Student Details show

    document.getElementById("studentDetails").innerHTML =

        "Student ID: " + studentId + "<br>" +

        "Student Name: " + studentName + "<br>" +

        "Father Name: " + fatherName + "<br>" +

        "Mobile: " + mobile + "<br>" +

        "Email: " + email + "<br>" +

        "Date of Birth: " + dob + "<br>" +

        "House No: " + houseNo + "<br>" +

        "Area & Locality: " + areaLocality + "<br>" +

        "District: " + district + "<br>" +

        "Pin Code: " + pin;


    alert("Student Data Saved Successfully");

});