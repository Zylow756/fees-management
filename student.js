console.log("JavaScript Connected");

// Elements Declaration
let studentId = document.getElementById("studentId");
let saveStudentBtn = document.getElementById("saveStudentBtn");
let searchInput = document.getElementById("searchInput");

// Serial Number & Dates Setup
let today = new Date();
let month = today.getMonth() + 1;
let year = today.getFullYear();
let monthText = String(month).padStart(2, "0");

let serialNumber = localStorage.getItem("studentSerial");
if (serialNumber === null) {
    serialNumber = 1;
}

// 1. STUDENT ID GENERATOR FUNCTION
function generateStudentId() {
    let serialText = String(serialNumber).padStart(3, "0");
    let generatedId = "DAS/" + monthText + year + "/" + serialText;
    if (studentId) {
        studentId.value = generatedId;
    }
    return generatedId;
}

generateStudentId();

// 2. CLEAR FORM FUNCTION
function clearForm() {
    document.getElementById("courseName").value ="";
    document.getElementById("studentName").value = "";
    document.getElementById("fatherName").value = "";
    document.getElementById("mobile").value = "";
    document.getElementById("email").value = "";
    document.getElementById("dob").value = "";
    document.getElementById("houseNo").value = "";
    document.getElementById("areaLocality").value = "";
    document.getElementById("district").value = "";
    document.getElementById("pin").value = "";
    document.getElementById("studentPhoto").value = "";
    document.getElementById("qualification").value = "";
    document.getElementById("steam").value = "";
    document.getElementById("board").value = "";
    document.getElementById("passingYear").value = "";
    document.getElementById("percentage").value = "";
    document.getElementById("editIndex").value = "-1";
}

// 3. SAVE / UPDATE BUTTON EVENT
saveStudentBtn.addEventListener("click", function () {

    let coursetype= document.getElementById("courseName").value;

    let studentName = document.getElementById("studentName").value.trim();
    if (studentName === "") {
        alert("Please Enter Student Name");
        return;
    }

    let fatherName = document.getElementById("fatherName").value.trim();
    let mobile = document.getElementById("mobile").value.trim();

    if (!/^\d{10}$/.test(mobile)) {
        alert("Mobile Number must be 10 digits");
        return;
    }

    let email = document.getElementById("email").value.trim();
    let dob = document.getElementById("dob").value;
    let dobFormatted = "";
    if (dob !== "") {
        let dobParts = dob.split("-");
        dobFormatted = dobParts[2] + "/" + dobParts[1] + "/" + dobParts[0];
    }

    let houseNo = document.getElementById("houseNo").value.trim();
    let areaLocality = document.getElementById("areaLocality").value.trim();
    let district = document.getElementById("district").value.trim();
    let pin = document.getElementById("pin").value.trim();

    if (!/^\d{6}$/.test(pin)) {
        alert("Pin Code must be 6 digits");
        return;
    }

    let qualification = document.getElementById("qualification").value;
    let steam = document.getElementById("steam").value;
    let board = document.getElementById("board").value.trim();
    let passingYear = document.getElementById("passingYear").value.trim();
    let percentage = document.getElementById("percentage").value.trim();

    let editIndex = document.getElementById("editIndex").value;
    let photoInput = document.getElementById("studentPhoto");
    let photoFile = photoInput.files[0];

    if (editIndex == "-1" && !photoFile) {
        alert("Please Select Student Photo");
        return;
    }

    let students = JSON.parse(localStorage.getItem("students")) || [];

    function saveToStorage(photoBase64) {
        let studentData = {
            studentId: studentId.value,
            coursetype: courseName,
            studentName: studentName,
            fatherName: fatherName,
            mobile: mobile,
            email: email,
            dob: dobFormatted,
            houseNo: houseNo,
            areaLocality: areaLocality,
            district: district,
            pin: pin,
            photo: photoBase64,
            qualification: qualification,
            steam: steam,
            board: board,
            passingYear: passingYear,
            percentage: percentage
        };

        if (editIndex == "-1") {
            students.push(studentData);
            serialNumber = Number(serialNumber) + 1;
            localStorage.setItem("studentSerial", serialNumber);
        } else {
            students[editIndex] = studentData;
            saveStudentBtn.innerText = "Save Student";
        }

        localStorage.setItem("students", JSON.stringify(students));
        alert("Data Saved/Updated Successfully!");

        clearForm();
        generateStudentId();
        showStudentList();
    }

    if (photoFile) {
        let reader = new FileReader();
        reader.onload = function () {
            saveToStorage(reader.result);
        };
        reader.readAsDataURL(photoFile);
    } else {
        let oldPhoto = students[editIndex].photo;
        saveToStorage(oldPhoto);
    }
});

// 4. SHOW STUDENT LIST FUNCTION
function showStudentList(filteredStudents = null) {
    let studentList = document.getElementById("studentList");
    let totalCount = document.getElementById("totalCount");
    
    let savedStudents = filteredStudents || JSON.parse(localStorage.getItem("students")) || [];

    if (!filteredStudents && totalCount) {
        let allStudents = JSON.parse(localStorage.getItem("students")) || [];
        totalCount.innerText = allStudents.length;
    }

    studentList.innerHTML = "";

    if (savedStudents.length === 0) {
        studentList.innerHTML = 
        "<p style='text-align:center;'>No Students Found</p>";
        return;
    }

    savedStudents.forEach(function (student, index) {
        studentList.innerHTML +=
            "<div class='studentItem'>" +

            /* 1. STUDENT INFO CARD */
            "<div class='infoCard studentInfo'>" +
            "<h3>Student Information</h3>" +
            "<img src='" + student.photo + "' class='studentPhoto'>" +
            "<p><b>Student ID:</b> " + student.studentId + "</p>" +
            "<p><b>Course Type:</b>" + student.coursetype +"</p>" +

            "<p><b>Student Name:</b> " + student.studentName + "</p>" +
            "<p><b>Father Name:</b> " + student.fatherName + "</p>" +
            "<p><b>Mobile:</b> " + student.mobile + "</p>" +
            "<p><b>Email:</b> " + student.email + "</p>" +
            "<p><b>Date of Birth:</b> " + student.dob + "</p>" +
            "</div>" +

            /* 2. ADDRESS CARD */
            "<div class='infoCard addressInfo'>" +
            "<h3>Student Address</h3>" +
            "<p><b>House No.:</b> " + student.houseNo + "</p>" +
            "<p><b>Area & Locality:</b> " + student.areaLocality + "</p>" +
            "<p><b>District:</b> " + student.district + "</p>" +
            "<p><b>Pin Code:</b> " + student.pin + "</p>" +
            "</div>" +

            /* 3. QUALIFICATION CARD */
            "<div class='infoCard qualificationInfo'>" +
            "<h3>Student Qualification</h3>" +
            "<p><b>Qualification:</b> " + student.qualification + "</p>" +
            "<p><b>Stream:</b> " + student.steam + "</p>" +
            "<p><b>Board/University:</b> " + student.board + "</p>" +
            "<p><b>Passing Year:</b> " + student.passingYear + "</p>" +
            "<p><b>Percentage:</b> " + student.percentage + "%</p>" +
            "</div>" +

            /* BUTTON ACTIONS CONTAINER */
            "<div class ='cardActions'>"+
            "<button class='editBtn btnStyle' onclick='editStudent(" + index + ")'>Edit</button>" +
             "<button class='printBtn btnStyle' onclick='printIDCard(" + index + ")'>Print ID</button>" +
"</div>" +
            "</div>";
    });
} // <-- यहाँ फ़ंक्शन बंद होना छूट गया था

// 5. EDIT STUDENT FUNCTION
function editStudent(index) {
    let savedStudents = JSON.parse(localStorage.getItem("students")) || [];
    let student = savedStudents[index];

    document.getElementById("studentId").value = student.studentId;
    document.getElementById("studentName").value = student.studentName;
    document.getElementById("fatherName").value = student.fatherName;
    document.getElementById("mobile").value = student.mobile;
    document.getElementById("email").value = student.email;
    document.getElementById("houseNo").value = student.houseNo;
    document.getElementById("areaLocality").value = student.areaLocality;
    document.getElementById("district").value = student.district;
    document.getElementById("pin").value = student.pin;
    document.getElementById("qualification").value = student.qualification;
    document.getElementById("steam").value = student.steam;
    document.getElementById("board").value = student.board;
    document.getElementById("passingYear").value = student.passingYear;
    document.getElementById("percentage").value = student.percentage;

    document.getElementById("editIndex").value = index;
    saveStudentBtn.innerText = "Update Student";

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 6. SEARCH FUNCTIONALITY
if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        let query = searchInput.value.toLowerCase().trim();
        let allStudents = JSON.parse(localStorage.getItem("students")) || [];

        let filtered = allStudents.filter(function (student) {
            return student.studentName.toLowerCase().includes(query) ||
                   student.studentId.toLowerCase().includes(query);
        });

        showStudentList(filtered);
    });
}

// Initial Load
showStudentList();

// PRINT ID CARD FUNCTION (UPDATED DESIGN)
function printIDCard(index) {
    let savedStudents = JSON.parse(localStorage.getItem("students")) || [];
    let student = savedStudents[index];

    // लोगो का URL (अपनी पसंद की इमेज का लिंक या बेस64 यहाँ डालें)
    let logoUrl = student.instituteLogo || "https://via.placeholder.com/60?text=LOGO"; 

    let printWindow = window.open("", "", "width=850,height=650");
    printWindow.document.write(`
        <html>
        <head>
            <title>ID Card - ${student.studentName}</title>
            <style>
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    min-height: 100vh;
                    background-color: #f0f2f5;
                }
                .idCardContainer {
                    width: 330px;
                    height: 500px;
                    background: #ffffff;
                    border-radius: 12px;
                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
                    border: 1px solid #1f3c56;
                    overflow: hidden;
                    position: relative;
                    display: flex;
                    flex-direction: column;
                }
                /* Header Design */
                .cardHeader {
                    background: linear-gradient(135deg, #1f3c56 0%, #112333 100%);
                    color: #ffffff;
                    padding: 12px 10px;
                    text-align: center;
                    border-bottom: 3px solid #f39c12;
                }
                .logoBox {
                    margin-bottom: 4px;
                }
                .logoBox img {
                    height: 45px;
                    width: auto;
                    object-fit: contain;
                }
                .instName {
                    font-size: 15px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    color: #ffffff;
                }
                .instTagline {
                    font-size: 9px;
                    color: #f39c12;
                    letter-spacing: 0.5px;
                }
                .cardBadge {
                    background: #f39c12;
                    color: #1f3c56;
                    font-size: 10px;
                    font-weight: bold;
                    padding: 2px 10px;
                    border-radius: 10px;
                    display: inline-block;
                    margin-top: 5px;
                    text-transform: uppercase;
                }
                /* Photo Section */
                .photoArea {
                    text-align: center;
                    margin-top: 15px;
                }
                .photoArea img {
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 3px solid #1f3c56;
                    box-shadow: 0 3px 6px rgba(0,0,0,0.16);
                }
                .studentNameHeader {
                    font-size: 16px;
                    font-weight: bold;
                    color: #1f3c56;
                    margin-top: 8px;
                    text-transform: uppercase;
                }
                /* Student Details Table */
                .cardBody {
                    padding: 12px 20px;
                    flex-grow: 1;
                }
                .detailsTable {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 12px;
                }
                .detailsTable td {
                    padding: 4px 0;
                    color: #333333;
                }
                .detailsTable td.label {
                    font-weight: bold;
                    color: #1f3c56;
                    width: 38%;
                }
                /* Footer / Signature */
                .cardFooter {
                    background: #f8f9fa;
                    border-top: 1px solid #e9ecef;
                    padding: 8px 15px;
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                }
                .footerAddress {
                    font-size: 8px;
                    color: #6c757d;
                    max-width: 60%;
                    line-height: 1.2;
                }
                .signatureBox {
                    text-align: center;
                }
                .signLine {
                    border-top: 1px dashed #1f3c56;
                    width: 80px;
                    margin-top: 15px;
                }
                .signText {
                    font-size: 9px;
                    color: #1f3c56;
                    font-weight: bold;
                    margin-top: 2px;
                }
                @media print {
                    body {
                        background: none;
                    }
                    .idCardContainer {
                        box-shadow: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="idCardContainer">
                <!-- Header Section -->
                <div class="cardHeader">
                    <div class="logoBox">
                        <!-- logo image path update -->
                        <img src="${logoUrl}" alt="Logo" onerror="this.style.display='none'">
                    </div>
                    <div class="instName">Dhanvii Accounting Institute</div>
                    <div class="instTagline">Skill & Professional Training Center</div>
                    <div><span class="cardBadge">Student Identity Card</span></div>
                </div>

                <!-- Photo Section -->
                <div class="photoArea">
                    <img src="${student.photo}" alt="Student Photo">
                    <div class="studentNameHeader">${student.studentName}</div>
                </div>

                <!-- Body Section -->
                <div class="cardBody">
                    <table class="detailsTable">
                        <tr>
                            <td class="label"> Studnet ID:</td>
                            <td><b>${student.studentId}</b></td>
                        </tr>

                        <tr>
                        <td class="label"> Course Type:</td>
                        <td>${student.coursetype}</td>
                        
                        <tr>
                            <td class="label">Father's Name:</td>
                            <td>${student.fatherName}</td>
                        </tr>
                        
                        <tr>
                            <td class="label">Contact No:</td>
                            <td>${student.mobile}</td>
                        </tr>
                        
                    </table>
                </div>

                <!-- Footer Section -->
                <div class="cardFooter">
                    <div class="footerAddress">
                        <b>Dhanvii Accounting Institute</b><br>
                        267,Ganesh Nagar<br>
                        Kota, Rajasthan<br>
                        Ph: +91 8824248824, 8955989444
                    </div>
                    <div class="signatureBox">
                        <div class="signLine"></div>
                        <div class="signText">Auth. Signatory</div>
                    </div>
                </div>
            </div>

            <script>
                window.onload = function() {
                    window.print();
                    window.onafterprint = function() { window.close(); };
                };
            <\/script>
        </body>
        </html>
    `);
    printWindow.document.close();
}

