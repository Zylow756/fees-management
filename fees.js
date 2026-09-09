/* ==========================================
   1. Course Fee Configuration
   ========================================== */
const courseFees = {
    "TALLY PRIME": 10000,
    "BIGINNER ACCOUNTING COURSE": 15000,
    "PROFESSONAL ACCOUNTING COURSE": 18000,
    "MASTER ACCOUNTING, FINANCE & AUDIT PROGRAM": 25000
};

/* ==========================================
   2. DOM Elements Selection
   ========================================== */
let feeStudentIdInput = document.getElementById("feeStudentId");
let searchFeeBtn = document.getElementById("searchFeeBtn");
let studentFeeSummary = document.getElementById("studentFeeSummary");

let summaryName = document.getElementById("summaryName");
let summaryCourse = document.getElementById("summaryCourse");
let summaryTotalFee = document.getElementById("summaryTotalFee");
let summaryDiscount = document.getElementById("summaryDiscount");
let discountReason = document.getElementById("discountReason");
let summaryFinalFee = document.getElementById("summaryFinalFee");

let payFeeBtn = document.getElementById("payFeeBtn");
let printReceiptBtn = document.getElementById("printReceiptBtn");
let feeStatusCard = document.getElementById("feeStatusCard");
let displayPaid = document.getElementById("displayPaid");
let displayDue = document.getElementById("displayDue");
let paymentHistorySection = document.getElementById("paymentHistorySection");
let historyTableBody = document.getElementById("historyTableBody");

let currentStudentIndex = -1;

/* ==========================================
   3. Search Student Event
   ========================================== */
if (searchFeeBtn) {
    searchFeeBtn.addEventListener("click", function () {
        let enteredId = feeStudentIdInput ? feeStudentIdInput.value.trim().toUpperCase() : "";

        if (enteredId === "") {
            alert("कृपया Student ID दर्ज करें!");
            return;
        }

        let rawData = localStorage.getItem("students");
        let students = JSON.parse(rawData) || [];

        currentStudentIndex = students.findIndex(function (s) {
            let allValues = Object.values(s).map(v => (v || "").toString().trim().toUpperCase());
            return allValues.includes(enteredId);
        });

        if (currentStudentIndex === -1) {
            alert("इस ID वाला कोई स्टूडेंट नहीं मिला!");
            if (studentFeeSummary) studentFeeSummary.style.display = "none";
            if (feeStatusCard) feeStatusCard.style.display = "none";
            if (paymentHistorySection) paymentHistorySection.style.display = "none";
            return;
        }

        let student = students[currentStudentIndex];
        let sName = student.studentName || student.name || "N/A";
        let sCourse = (student.coursetype || student.courseType || "").toUpperCase();

        let autoTotalFee = (student.feeDetails && student.feeDetails.totalFee)
                           ? Number(student.feeDetails.totalFee)
                           : (courseFees[sCourse] || 15000);

        let savedDiscount = (student.feeDetails && student.feeDetails.discount) ? Number(student.feeDetails.discount) : 0;
        let savedReason = (student.feeDetails && student.feeDetails.discountReason) ? student.feeDetails.discountReason : "None";
        let paidVal = (student.feeDetails && student.feeDetails.paidFee) ? Number(student.feeDetails.paidFee) : 0;
        
        let netPayable = autoTotalFee - savedDiscount;
        let remainingDue = netPayable - paidVal;

        if (summaryName) summaryName.value = sName;
        if (summaryCourse) summaryCourse.value = sCourse || "N/A";
        if (summaryTotalFee) summaryTotalFee.value = autoTotalFee;
        if (summaryDiscount) summaryDiscount.value = savedDiscount;
        if (discountReason) discountReason.value = savedReason;
        if (summaryFinalFee) summaryFinalFee.value = netPayable;

        if (displayPaid) displayPaid.innerText = paidVal;
        if (displayDue) displayDue.innerText = remainingDue;

        if (studentFeeSummary) studentFeeSummary.style.display = "block";
        if (feeStatusCard) feeStatusCard.style.display = "block";

        let txList = (student.feeDetails && student.feeDetails.transactions) ? student.feeDetails.transactions : [];
        renderHistoryTable(txList);

        let existingSlots = (student.feeDetails && student.feeDetails.manualSlots) ? student.feeDetails.manualSlots : null;
        renderManualSlots(existingSlots);
    });
}

/* ==========================================
   4. Discount Calculation Event
   ========================================== */
if (summaryDiscount) {
    summaryDiscount.addEventListener("input", function () {
        let total = Number(summaryTotalFee.value) || 0;
        let discount = Number(summaryDiscount.value) || 0;

        if (discount > total) {
            alert("डिस्काउंट कुल फीस से ज्यादा नहीं हो सकता!");
            summaryDiscount.value = 0;
            summaryFinalFee.value = total;
            return;
        }

        let netFeePayable = total - discount;
        summaryFinalFee.value = netFeePayable;

        let currentPaid = Number(displayPaid.innerText) || 0;
        let remainingDue = netFeePayable - currentPaid;
        displayDue.innerText = remainingDue >= 0 ? remainingDue : 0;

        calculateTotalPlanned();
    });
}

/* ==========================================
   5. Submit Payment Event (Incremental Slot Filling)
   ========================================== */
if (payFeeBtn) {
    payFeeBtn.addEventListener("click", function () {
        if (currentStudentIndex === -1) {
            alert("पहले स्टूडेंट सर्च करें!");
            return;
        }

        let payingAmount = Number(document.getElementById("payingAmount").value);
        let paymentMode = document.getElementById("paymentMode") ? document.getElementById("paymentMode").value : "Cash";
        let netFeePayable = Number(summaryFinalFee.value);

        if (!payingAmount || payingAmount <= 0) {
            alert("कृपया सही फीस राशि दर्ज करें!");
            return;
        }

        let rawData = localStorage.getItem("students");
        let students = JSON.parse(rawData) || [];
        let student = students[currentStudentIndex];

        let previousPaid = (student.feeDetails && student.feeDetails.paidFee) ? Number(student.feeDetails.paidFee) : 0;
        let newPaidTotal = previousPaid + payingAmount;

        if (newPaidTotal > netFeePayable) {
            alert("जमा की जाने वाली राशि Net Payable Fee से अधिक नहीं हो सकती!");
            return;
        }

        let remainingDue = netFeePayable - newPaidTotal;

        let previousTx = (student.feeDetails && student.feeDetails.transactions) ? student.feeDetails.transactions : [];
        previousTx.push({
            date: new Date().toLocaleDateString() + " " + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            amount: payingAmount,
            mode: paymentMode
        });

        // Current Slots Allocation
        let currentSlots = getManualSlotsData();
        let amountToAllocate = payingAmount;

        for (let i = 0; i < currentSlots.length; i++) {
            if (amountToAllocate <= 0) break;

            let slot = currentSlots[i];
            let planned = Number(slot.amount) || 0;
            let alreadyPaid = Number(slot.paid) || 0;
            let currentDue = planned - alreadyPaid;

            if (currentDue > 0) {
                if (amountToAllocate >= currentDue) {
                    slot.paid = planned;
                    slot.due = 0;
                    slot.status = "Paid";
                    amountToAllocate -= currentDue;
                } else {
                    slot.paid = alreadyPaid + amountToAllocate;
                    slot.due = planned - slot.paid;
                    slot.status = "Partially Paid";
                    amountToAllocate = 0;
                }
            }
        }

        student.feeDetails = {
            totalFee: Number(summaryTotalFee.value),
            discount: Number(summaryDiscount.value),
            discountReason: discountReason ? discountReason.value : "",
            finalFee: netFeePayable,
            paidFee: newPaidTotal,
            dueFee: remainingDue,
            manualSlots: currentSlots,
            transactions: previousTx
        };

        students[currentStudentIndex] = student;
        localStorage.setItem("students", JSON.stringify(students));

        if (displayPaid) displayPaid.innerText = newPaidTotal;
        if (displayDue) displayDue.innerText = remainingDue;
        
        renderHistoryTable(previousTx);
        renderManualSlots(currentSlots);

        alert(`₹${payingAmount} की फीस सफलतापूर्वक जमा हो गई है!`);
        document.getElementById("payingAmount").value = "";
    });
}

/* ==========================================
   6. Print Receipt Event
   ========================================== */
if (printReceiptBtn) {
    printReceiptBtn.addEventListener("click", function () {
        let studentName = summaryName ? summaryName.value : "N/A";
        let studentCourse = summaryCourse ? summaryCourse.value : "N/A";
        let enteredId = feeStudentIdInput ? feeStudentIdInput.value : "N/A";
        let paidVal = displayPaid ? displayPaid.innerText : "0";
        let dueVal = displayDue ? displayDue.innerText : "0";

        let receiptWindow = window.open("", "_blank");
        receiptWindow.document.write(`
            <html>
            <head>
                <title>Fee Receipt - ${studentName}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .receipt-box { border: 2px solid #000; padding: 20px; max-width: 400px; margin: auto; }
                    h2 { text-align: center; margin-bottom: 5px; }
                    p { margin: 5px 0; }
                    hr { border: 1px dashed #000; }
                </style>
            </head>
            <body>
                <div class="receipt-box">
                    <h2>Dhanvii Accounting Institute</h2>
                    <p style="text-align:center;">Fee Payment Receipt</p>
                    <hr>
                    <p><b>Student ID:</b> ${enteredId}</p>
                    <p><b>Student Name:</b> ${studentName}</p>
                    <p><b>Course:</b> ${studentCourse}</p>
                    <hr>
                    <p><b>Total Paid Amount:</b> ₹${paidVal}</p>
                    <p><b>Remaining Balance:</b> ₹${dueVal}</p>
                    <p><b>Date:</b> ${new Date().toLocaleDateString()}</p>
                    <hr>
                    <p style="text-align:center;"><i>Thank You!</i></p>
                </div>
                <script>window.print();<\/script>
            </body>
            </html>
        `);
        receiptWindow.document.close();
    });
}

/* ==========================================
   7. Render Transaction Table
   ========================================== */
function renderHistoryTable(transactions) {
    if (!historyTableBody) return;
    historyTableBody.innerHTML = "";

    if (!transactions || transactions.length === 0) {
        if (paymentHistorySection) paymentHistorySection.style.display = "none";
        return;
    }

    transactions.forEach(function (tx, index) {
        let row = `
            <tr>
                <td>${index + 1}</td>
                <td>${tx.date}</td>
                <td>₹${tx.amount}</td>
                <td>${tx.mode}</td>
            </tr>
        `;
        historyTableBody.innerHTML += row;
    });

    if (paymentHistorySection) paymentHistorySection.style.display = "block";
}

/* ==========================================
   8. Render Manual Installment Slots
   ========================================== */
function renderManualSlots(existingSlots = null) {
    let tbody = document.getElementById("manualSlotTableBody");
    if (!tbody) return;

    tbody.innerHTML = "";

    for (let i = 1; i <= 6; i++) {
        let defaultDate = "";
        let defaultAmt = 0;
        let slotPaid = 0;
        let slotDue = 0;
        let status = "Pending";

        if (existingSlots && existingSlots[i - 1]) {
            defaultDate = existingSlots[i - 1].dueDate || "";
            defaultAmt = Number(existingSlots[i - 1].amount) || 0;
            slotPaid = Number(existingSlots[i - 1].paid) || 0;
            
            slotDue = defaultAmt - slotPaid;
            if (slotDue < 0) slotDue = 0;
            
            if (defaultAmt > 0 && slotPaid >= defaultAmt) {
                status = "Paid";
            } else if (slotPaid > 0 && slotPaid < defaultAmt) {
                status = "Partially Paid";
            } else {
                status = "Pending";
            }
        }

        let statusColor = status === 'Paid' ? 'green' : (status === 'Partially Paid' ? 'blue' : 'orange');

        let row = `
            <tr>
                <td><b>Slot ${i}</b></td>
                <td><input type="date" class="manual-date" id="slotDate_${i}" value="${defaultDate}"></td>
                <td>₹<input type="number" class="manual-amt" id="slotAmt_${i}" value="${defaultAmt}" placeholder="0" style="width: 90px;" oninput="calculateTotalPlanned()"></td>
                <td style="color: green; font-weight: bold;">₹<span id="slotPaid_${i}">${slotPaid}</span></td>
                <td style="color: red; font-weight: bold;">₹<span id="slotDue_${i}">${slotDue}</span></td>
                <td><span id="slotStatus_${i}" style="font-weight:bold; color: ${statusColor};">${status}</span></td>
            </tr>
        `;
        tbody.innerHTML += row;
    }
    calculateTotalPlanned();
}

/* ==========================================
   9. Calculate Total Planned & Balance Check
   ========================================== */
function calculateTotalPlanned() {
    let netFeePayable = Number(document.getElementById("summaryFinalFee")?.value) || 0;
    
    let totalSlotPlanned = 0;
    for (let i = 1; i <= 6; i++) {
        let amtInput = document.getElementById(`slotAmt_${i}`);
        if (amtInput) {
            totalSlotPlanned += Number(amtInput.value) || 0;
        }
    }

    let finalFeeCheckSpan = document.getElementById("finalFeeCheck");
    let totalPlannedSpan = document.getElementById("totalPlannedAmount");
    let remainingSpan = document.getElementById("remainingToPlan");

    if (finalFeeCheckSpan) finalFeeCheckSpan.innerText = netFeePayable;
    if (totalPlannedSpan) totalPlannedSpan.innerText = totalSlotPlanned;

    if (remainingSpan) {
        let balanceToPlan = netFeePayable - totalSlotPlanned;
        
        if (balanceToPlan === 0) {
            remainingSpan.style.color = "green";
            remainingSpan.innerText = "0 (Fully Planned)";
        } else if (balanceToPlan < 0) {
            remainingSpan.style.color = "red";
            remainingSpan.innerText = `Exceeded Net Fee by ₹${Math.abs(balanceToPlan)}`;
        } else {
            remainingSpan.style.color = "orange";
            remainingSpan.innerText = balanceToPlan;
        }
    }
}

/* ==========================================
   10. Collect Manual Slots Data
   ========================================== */
function getManualSlotsData() {
    let slots = [];
    for (let i = 1; i <= 6; i++) {
        let dateVal = document.getElementById(`slotDate_${i}`)?.value || "";
        let amtVal = Number(document.getElementById(`slotAmt_${i}`)?.value) || 0;
        let paidVal = Number(document.getElementById(`slotPaid_${i}`)?.innerText) || 0;
        let statusVal = document.getElementById(`slotStatus_${i}`)?.innerText || "Pending";

        let dueVal = amtVal - paidVal;
        if (dueVal < 0) dueVal = 0;

        slots.push({
            slotNo: i,
            dueDate: dateVal,
            amount: amtVal,
            paid: paidVal,
            due: dueVal,
            status: statusVal
        });
    }
    return slots;
}