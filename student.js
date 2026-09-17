console.log("JavaScript Connected");

// Elements Declaration
let studentId = document.getElementById("studentId");
let saveStudentBtn = document.getElementById("saveStudentBtn");
let searchInput = document.getElementById("searchInput");

// Admission Date Setup
const selectElement = document.getElementById("admissionDate");
if (selectElement) {
    const todayDate = new Date();
    const day = String(todayDate.getDate()).padStart(2, '0');
    const monthVal = String(todayDate.getMonth() + 1).padStart(2, '0');
    const yearVal = todayDate.getFullYear();
    const formattedDate = `${day}/${monthVal}/${yearVal}`;

    const newOption = document.createElement("option");
    newOption.value = formattedDate;
    newOption.textContent = formattedDate;

    selectElement.appendChild(newOption);
    selectElement.value = formattedDate;
}

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
    if (document.getElementById("admissionDate")) document.getElementById("admissionDate").selectedIndex = 0;
    if (document.getElementById("courseName")) document.getElementById("courseName").value = "";
    if (document.getElementById("studentName")) document.getElementById("studentName").value = "";
    if (document.getElementById("fatherName")) document.getElementById("fatherName").value = "";
    if (document.getElementById("mobile")) document.getElementById("mobile").value = "";
    if (document.getElementById("email")) document.getElementById("email").value = "";
    if (document.getElementById("dob")) document.getElementById("dob").value = "";
    if (document.getElementById("houseNo")) document.getElementById("houseNo").value = "";
    if (document.getElementById("areaLocality")) document.getElementById("areaLocality").value = "";
    if (document.getElementById("district")) document.getElementById("district").value = "";
    if (document.getElementById("pin")) document.getElementById("pin").value = "";
    if (document.getElementById("studentPhoto")) document.getElementById("studentPhoto").value = "";
    if (document.getElementById("qualification")) document.getElementById("qualification").value = "";
    if (document.getElementById("steam")) document.getElementById("steam").value = "";
    if (document.getElementById("board")) document.getElementById("board").value = "";
    if (document.getElementById("passingYear")) document.getElementById("passingYear").value = "";
    if (document.getElementById("percentage")) document.getElementById("percentage").value = "";
    if (document.getElementById("editIndex")) document.getElementById("editIndex").value = "-1";
}

// 3. SAVE / UPDATE BUTTON EVENT
if (saveStudentBtn) {
    saveStudentBtn.addEventListener("click", function () {
        let coursetype = document.getElementById("courseName") ? document.getElementById("courseName").value : "";

        let studentName = document.getElementById("studentName") ? document.getElementById("studentName").value.trim() : "";
        if (studentName === "") {
            alert("Please Enter Student Name");
            return;
        }

        let fatherName = document.getElementById("fatherName") ? document.getElementById("fatherName").value.trim() : "";
        let mobile = document.getElementById("mobile") ? document.getElementById("mobile").value.trim() : "";

        if (!/^\d{10}$/.test(mobile)) {
            alert("Mobile Number must be 10 digits");
            return;
        }

        let email = document.getElementById("email") ? document.getElementById("email").value.trim() : "";
        let dob = document.getElementById("dob") ? document.getElementById("dob").value : "";
        let dobFormatted = "";
        if (dob !== "") {
            let dobParts = dob.split("-");
            dobFormatted = dobParts[2] + "/" + dobParts[1] + "/" + dobParts[0];
        }

        let houseNo = document.getElementById("houseNo") ? document.getElementById("houseNo").value.trim() : "";
        let areaLocality = document.getElementById("areaLocality") ? document.getElementById("areaLocality").value.trim() : "";
        let district = document.getElementById("district") ? document.getElementById("district").value.trim() : "";
        let pin = document.getElementById("pin") ? document.getElementById("pin").value.trim() : "";

        if (!/^\d{6}$/.test(pin)) {
            alert("Pin Code must be 6 digits");
            return;
        }

        let qualification = document.getElementById("qualification") ? document.getElementById("qualification").value : "";
        let steam = document.getElementById("steam") ? document.getElementById("steam").value : "";
        let board = document.getElementById("board") ? document.getElementById("board").value.trim() : "";
        let passingYear = document.getElementById("passingYear") ? document.getElementById("passingYear").value.trim() : "";
        let percentage = document.getElementById("percentage") ? document.getElementById("percentage").value.trim() : "";

        let editIndex = document.getElementById("editIndex") ? document.getElementById("editIndex").value : "-1";
        let photoInput = document.getElementById("studentPhoto");
        let photoFile = photoInput && photoInput.files ? photoInput.files[0] : null;

        if (editIndex == "-1" && !photoFile) {
            alert("Please Select Student Photo");
            return;
        }

        let students = JSON.parse(localStorage.getItem("students")) || [];

        async function saveToStorage(photoBase64) {

    let studentData = {

        studentId: studentId ? studentId.value : "",

        admissionDate:
            document.getElementById("admissionDate")
                ? document.getElementById("admissionDate").value
                : "",

        coursetype: coursetype,

        studentName: studentName,

        fatherName: fatherName,

        dob: dobFormatted,

        mobile: mobile,

        email: email,

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


    console.log("📤 Sending Student to MongoDB:");
    console.log(studentData);


    try {

        const response = await fetch(
            "http://localhost:5000/api/students",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(studentData)
            }
        );


        const result = await response.json();


        console.log("📥 Server Response:");
        console.log(result);


        if (!response.ok || !result.success) {

            alert(
                "❌ Student Save Error: " +
                (result.message || "Unknown error")
            );

            return;
        }


        alert("✅ Student MongoDB में Successfully Save हो गया!");


        // Serial number आगे बढ़ाएँ
        serialNumber = Number(serialNumber) + 1;

        localStorage.setItem(
            "studentSerial",
            serialNumber
        );


          clearForm();

        generateStudentId();

        showStudentList();

    } catch (error) {

        console.error("❌ MongoDB Save Error:", error);

        alert("❌ MongoDB Server से connect नहीं हो सका!");

    }
}


        if (photoFile) {
            let reader = new FileReader();
            reader.onload = function () {
                saveToStorage(reader.result);
            };
            reader.readAsDataURL(photoFile);
        } else {
            let oldPhoto = students[editIndex] ? students[editIndex].photo : "";
            saveToStorage(oldPhoto);
        }
    });
}

// 4. SHOW STUDENT LIST FUNCTION

async function loadStudentsFromMongoDB() {
    try {
        const response = await fetch("http://localhost:5000/api/students");

        const students = await response.json();

        console.log("📥 MongoDB Students:", students);
        window.mongoStudents = students.data;

        if (!response.ok) {
            console.error("❌ MongoDB Students Load Error:", students);
            return;
        }

        showStudentList(students.data);

    } catch (error) {
        console.error("❌ MongoDB Server Error:", error);
    }
}


function showStudentList(filteredStudents = null) {
    let studentList = document.getElementById("studentList");
    let totalCount = document.getElementById("totalCount");

    if (!studentList) return;

    let savedStudents = filteredStudents || window.mongoStudents || JSON.parse(localStorage.getItem("students")) || [];
    if (!filteredStudents && totalCount) {
       totalCount.innerText = savedStudents.length;
    }

    studentList.innerHTML = "";

    if (savedStudents.length === 0) {
        studentList.innerHTML = "<p style='text-align:center;'>No Students Found</p>";
        return;
    }

    savedStudents.forEach(function (student, index) {
        studentList.innerHTML +=
            "<div class='studentItem'>" +

            /* 1. STUDENT INFO CARD */
            "<div class='infoCard studentInfo'>" +
            "<h3>Student Information</h3>" +
            "<img src='" + (student.photo || '') + "' class='studentPhoto'>" +
            "<p><b>Student ID:</b> " + (student.studentId || '') + "</p>" +
            "<p><b>Course Type:</b> " + (student.coursetype || 'N/A') + "</p>" +
            "<p><b>Admission Date :</b>" + (student.admissionDate || 'N/A') + "</p>" +
            "<p><b>Student Name:</b> " + (student.studentName || '') + "</p>" +
            "<p><b>Father Name:</b> " + (student.fatherName || '') + "</p>" +
            "<p><b>Mobile:</b> " + (student.mobile || '') + "</p>" +
            "<p><b>Email:</b> " + (student.email || '') + "</p>" +
            "<p><b>Date of Birth:</b> " + (student.dob || '') + "</p>" +
            "</div>" +

            /* 2. ADDRESS CARD */
            "<div class='infoCard addressInfo'>" +
            "<h3>Student Address</h3>" +
            "<p><b>House No.:</b> " + (student.houseNo || '') + "</p>" +
            "<p><b>Area & Locality:</b> " + (student.areaLocality || '') + "</p>" +
            "<p><b>District:</b> " + (student.district || '') + "</p>" +
            "<p><b>Pin Code:</b> " + (student.pin || '') + "</p>" +
            "</div>" +

            /* 3. QUALIFICATION CARD */
            "<div class='infoCard qualificationInfo'>" +
            "<h3>Student Qualification</h3>" +
            "<p><b>Qualification:</b> " + (student.qualification || '') + "</p>" +
            "<p><b>Stream:</b> " + (student.steam || '') + "</p>" +
            "<p><b>Board/University:</b> " + (student.board || '') + "</p>" +
            "<p><b>Passing Year:</b> " + (student.passingYear || '') + "</p>" +
            "<p><b>Percentage:</b> " + (student.percentage || '') + "%</p>" +
            "</div>" +

            /* BUTTON ACTIONS CONTAINER */
            "<div class='cardActions'>" +
            "<button class='editBtn btnStyle' onclick='editStudent(" + index + ")'>Edit</button>" +
            "<button class='printBtn btnStyle' onclick='printIDCard(" + index + ")'>Print ID</button>" +
            "</div>" +
            "</div>";
    });
}

// 5. EDIT STUDENT FUNCTION
function editStudent(index) {
    let savedStudents = JSON.parse(localStorage.getItem("students")) || [];
    let student = savedStudents[index];

    if (document.getElementById("studentId")) document.getElementById("studentId").value = student.studentId || "";
    if (document.getElementById("courseName")) document.getElementById("courseName").value = student.coursetype || "";
    if (document.getElementById("studentName")) document.getElementById("studentName").value = student.studentName || "";
    if (document.getElementById("fatherName")) document.getElementById("fatherName").value = student.fatherName || "";
    if (document.getElementById("mobile")) document.getElementById("mobile").value = student.mobile || "";
    if (document.getElementById("email")) document.getElementById("email").value = student.email || "";
    if (document.getElementById("houseNo")) document.getElementById("houseNo").value = student.houseNo || "";
    if (document.getElementById("areaLocality")) document.getElementById("areaLocality").value = student.areaLocality || "";
    if (document.getElementById("district")) document.getElementById("district").value = student.district || "";
    if (document.getElementById("pin")) document.getElementById("pin").value = student.pin || "";
    if (document.getElementById("qualification")) document.getElementById("qualification").value = student.qualification || "";
    if (document.getElementById("steam")) document.getElementById("steam").value = student.steam || "";
    if (document.getElementById("board")) document.getElementById("board").value = student.board || "";
    if (document.getElementById("passingYear")) document.getElementById("passingYear").value = student.passingYear || "";
    if (document.getElementById("percentage")) document.getElementById("percentage").value = student.percentage || "";

    if (document.getElementById("editIndex")) document.getElementById("editIndex").value = index;
    if (saveStudentBtn) saveStudentBtn.innerText = "Update Student";

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// 6. SEARCH FUNCTIONALITY
if (searchInput) {
    searchInput.addEventListener("keyup", function () {
        let query = searchInput.value.toLowerCase().trim();
        let allStudents = JSON.parse(localStorage.getItem("students")) || [];

        let filtered = allStudents.filter(function (student) {
            return (student.studentName && student.studentName.toLowerCase().includes(query)) ||
                (student.studentId && student.studentId.toLowerCase().includes(query));
        });

        showStudentList(filtered);
    });
}

// Initial Load
showStudentList();

// 7. PRINT ID CARD FUNCTION
function printIDCard(index) {
    let savedStudents = JSON.parse(localStorage.getItem("students")) || [];
    let student = savedStudents[index];
    let logoUrl = student.instituteLogo || "https://via.placeholder.com/60?text=LOGO";

    let printWindow = window.open("", "", "width=850,height=650");
    printWindow.document.write(`
        <html>
        <head>
            <title>ID Card - ${student.studentName}</title>
            <style>
                * { box-sizing: border-box; margin: 0; padding: 0; }
                body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; justify-content: center; align-items: center; min-height: 100vh; background-color: #f0f2f5; }
                .idCardContainer { width: 330px; height: 500px; background: #ffffff; border-radius: 12px; box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15); border: 1px solid #1f3c56; overflow: hidden; position: relative; display: flex; flex-direction: column; }
                .cardHeader { background: linear-gradient(135deg, #1f3c56 0%, #112333 100%); color: #ffffff; padding: 12px 10px; text-align: center; border-bottom: 3px solid #f39c12; }
                .logoBox { margin-bottom: 4px; }
                .logoBox img { height: 45px; width: auto; object-fit: contain; }
                .instName { font-size: 15px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; color: #ffffff; }
                .instTagline { font-size: 9px; color: #f39c12; letter-spacing: 0.5px; }
                .cardBadge { background: #f39c12; color: #1f3c56; font-size: 10px; font-weight: bold; padding: 2px 10px; border-radius: 10px; display: inline-block; margin-top: 5px; text-transform: uppercase; }
                .photoArea { text-align: center; margin-top: 15px; }
                .photoArea img { width: 100px; height: 100px; border-radius: 50%; object-fit: cover; border: 3px solid #1f3c56; box-shadow: 0 3px 6px rgba(0,0,0,0.16); }
                .studentNameHeader { font-size: 16px; font-weight: bold; color: #1f3c56; margin-top: 8px; text-transform: uppercase; }
                .cardBody { padding: 12px 20px; flex-grow: 1; }
                .detailsTable { width: 100%; border-collapse: collapse; font-size: 12px; }
                .detailsTable td { padding: 4px 0; color: #333333; }
                .detailsTable td.label { font-weight: bold; color: #1f3c56; width: 38%; }
                .cardFooter { background: #f8f9fa; border-top: 1px solid #e9ecef; padding: 8px 15px; display: flex; justify-content: space-between; align-items: flex-end; }
                .footerAddress { font-size: 8px; color: #6c757d; max-width: 60%; line-height: 1.2; }
                .signatureBox { text-align: center; }
                .signLine { border-top: 1px dashed #1f3c56; width: 80px; margin-top: 15px; }
                .signText { font-size: 9px; color: #1f3c56; font-weight: bold; margin-top: 2px; }
                @media print { body { background: none; } .idCardContainer { box-shadow: none; } }
            </style>
        </head>
        <body>
            <div class="idCardContainer">
                <div class="cardHeader">
                    <div class="logoBox">
                        <img src="${logoUrl}" alt="Logo" onerror="this.style.display='none'">
                    </div>
                    <div class="instName">Dhanvii Accounting Institute</div>
                    <div class="instTagline">Skill & Professional Training Center</div>
                    <div><span class="cardBadge">Student Identity Card</span></div>
                </div>

                <div class="photoArea">
                    <img src="${student.photo}" alt="Student Photo">
                    <div class="studentNameHeader">${student.studentName}</div>
                </div>

                <div class="cardBody">
                    <table class="detailsTable">
                        <tr>
                            <td class="label">Student ID:</td>
                            <td><b>${student.studentId}</b></td>
                        </tr>
                        <tr>
                            <td class="label">Admission Date:</td>
                            <td>${student.admissionDate || ''}</td>
                        </tr>
                        <tr>
                            <td class="label">Course Type:</td>
                            <td>${student.coursetype || ''}</td>
                        </tr>
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

                <div class="cardFooter">
                    <div class="footerAddress">
                        <b>Dhanvii Accounting Institute</b><br>
                        267, Near Khade Ganesh Ji Mandir Road<br>
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

// 8. ADMISSION FORM SUBMIT HANDLER (Backend / API Integration)
let admissionForm = document.getElementById("admissionForm");

if (admissionForm) {
    admissionForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        let nameVal = document.getElementById("studentName") ? document.getElementById("studentName").value : "";
        let rollVal = document.getElementById("studentId") || document.getElementById("rollNo") ? (document.getElementById("studentId") || document.getElementById("rollNo")).value : "";
        let courseVal = document.getElementById("course") ? document.getElementById("course").value : "";

        let totalFeeVal = Number(document.getElementById("totalFees")?.value || document.getElementById("totalFee")?.value || 0);
        let paidFeeVal = Number(document.getElementById("receivedFees")?.value || document.getElementById("paidFee")?.value || 0);
        let dueFeeVal = Number(document.getElementById("balanceFees")?.value || document.getElementById("dueFee")?.value || (totalFeeVal - paidFeeVal));

        if (!nameVal) {
            alert("कृपया छात्र का नाम भरें!");
            return;
        }

        let studentData = {
            name: nameVal,
            rollNo: rollVal,
            course: courseVal,
            totalFee: totalFeeVal,
            paidFee: paidFeeVal,
            dueFee: dueFeeVal
        };

        try {
            let response = await fetch('http://localhost:5000/api/students', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(studentData)
            });

            let result = await response.json();

            if (result.success) {
                alert("✅ छात्र का रिकॉर्ड और फ़ीस डेटा सफलतापूर्वक सेव हो गया!");
                admissionForm.reset();
                if (typeof loadStudentReport === 'function') {
                    loadStudentReport();
                }
            } else {
                alert("❌ एरर: " + result.message);
            }
        } catch (error) {
            console.error("Error saving student:", error);
            alert("❌ सर्वर से कनेक्ट नहीं हो सका!");
        }
    });
}

// 9. LOAD STUDENT REPORT FUNCTION
async function loadStudentReport() {
    let tableBody = document.getElementById("studentTableBody");
    if (!tableBody) return;

    try {
        let response = await fetch('http://localhost:5000/api/students');
        let result = await response.json();

        if (result.success && result.data.length > 0) {
            tableBody.innerHTML = "";

            result.data.forEach(student => {
                let dueColor = student.dueFee > 0 ? "red" : "green";

                let row = `
                    <tr>
                        <td>${student.rollNo || '-'}</td>
                        <td><b>${student.name}</b></td>
                        <td>${student.course || '-'}</td>
                        <td>₹${student.totalFee || 0}</td>
                        <td style="color: green;">₹${student.paidFee || 0}</td>
                        <td style="color: ${dueColor};">₹${student.dueFee || 0}</td>
                    </tr>
                `;
                tableBody.innerHTML += row;
            });
        } else {
            tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;">डेटाबेस में अभी कोई स्टूडेंट दर्ज नहीं है।</td></tr>`;
        }
    } catch (error) {
        console.error("Data load error:", error);
        tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">सर्वर कनेक्ट नहीं हुआ (node server.js चेक करें)</td></tr>`;
    }
}

// Page load initialization
window.addEventListener("DOMContentLoaded", loadStudentReport);

loadStudentsFromMongoDB();
