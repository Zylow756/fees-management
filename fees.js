/* ==========================================
   Dhanvii Fee & Student Management System
   Complete & Safe Main Script (fees.js)
   ========================================== */

// 1. Global Variables & DOM Elements Selection
let currentStudentData = null;

const courseFees = {
    "TALLY PRIME": 10000,
    "BEGINNER ACCOUNTING COURSE": 15000,
    "PROFESSIONAL ACCOUNTING COURSE": 18000,
    "MASTER ACCOUNTING, FINANCE & AUDIT PROGRAM": 25000
};

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

/* ==========================================
   2. Search Student Event (Async API Fetch)
   ========================================== */
if (searchFeeBtn) {
    searchFeeBtn.onclick = async function (e) {
        if (e) e.preventDefault();

        if (!feeStudentIdInput) feeStudentIdInput = document.getElementById("feeStudentId");
        let enteredId = feeStudentIdInput ? feeStudentIdInput.value.trim().toUpperCase() : "";

        if (!enteredId) {
            alert("कृपया Student ID / Roll No दर्ज करें!");
            return;
        }

        try {
            let encodedId = encodeURIComponent(enteredId);
let response = await fetch(`http://localhost:5000/api/students/${encodedId}`);
                alert(`सर्वर एरर (Status: ${response.status}) - ID की जांच करें।`);
                return;
            }

            let result = await response.json();
            if (!result.success || !result.data) {
                alert("इस ID वाला कोई स्टूडेंट नहीं मिला!");
                hideSummarySections();
                return;
            }

            currentStudentData = result.data;
            populateStudentFeeDetails(currentStudentData);

        } catch (error) {
            console.error("API Search Error:", error);
            alert("सर्वर से कनेक्ट नहीं हो सका! सुनिश्चित करें कि terminal में 'node server.js' चालू है।");
        }
    };
}

function hideSummarySections() {
    if (studentFeeSummary) studentFeeSummary.style.display = "none";
    if (feeStatusCard) feeStatusCard.style.display = "none";
    if (paymentHistorySection) paymentHistorySection.style.display = "none";
}

/* ==========================================
   3. Populate Student & Fee Data
   ========================================== */
function populateStudentFeeDetails(student) {
    let sName = student.name || student.studentName || "N/A";
    let sCourse = (student.course || student.courseType || "").toUpperCase();

    let autoTotalFee = (student.feeDetails && student.feeDetails.totalFee)
        ? Number(student.feeDetails.totalFee)
        : (courseFees[sCourse] || student.totalFee || 15000);

    let savedDiscount = (student.feeDetails && student.feeDetails.discount) ? Number(student.feeDetails.discount) : 0;
    let savedReason = (student.feeDetails && student.feeDetails.discountReason) ? student.feeDetails.discountReason : "";
    let paidVal = (student.feeDetails && student.feeDetails.paidFee) ? Number(student.feeDetails.paidFee) : (student.paidFee || 0);

    let netPayable = autoTotalFee - savedDiscount;
    let remainingDue = netPayable - paidVal;

    if (summaryName) summaryName.value = sName;
    if (summaryCourse) summaryCourse.value = sCourse || "N/A";
    if (summaryTotalFee) summaryTotalFee.value = autoTotalFee;
    if (summaryDiscount) summaryDiscount.value = savedDiscount;
    if (discountReason) discountReason.value = savedReason;
    if (summaryFinalFee) summaryFinalFee.value = netPayable;

    if (displayPaid) displayPaid.innerText = paidVal;
    if (displayDue) displayDue.innerText = remainingDue >= 0 ? remainingDue : 0;

    if (studentFeeSummary) studentFeeSummary.style.display = "block";
    if (feeStatusCard) feeStatusCard.style.display = "block";

    let txList = (student.feeDetails && student.feeDetails.transactions) ? student.feeDetails.transactions : [];
    renderHistoryTable(txList);

    let existingSlots = (student.feeDetails && student.feeDetails.manualSlots) ? student.feeDetails.manualSlots : null;
    renderManualSlots(existingSlots);
}

/* ==========================================
   4. Discount Live Calculation Event
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

        let currentPaid = displayPaid ? (Number(displayPaid.innerText) || 0) : 0;
        let remainingDue = netFeePayable - currentPaid;
        if (displayDue) displayDue.innerText = remainingDue >= 0 ? remainingDue : 0;

        calculateTotalPlanned();
    });
}

/* ==========================================
   5. Submit Payment Event (API Update)
   ========================================== */
if (payFeeBtn) {
    payFeeBtn.onclick = async function (e) {
        if (e) e.preventDefault();

        if (!currentStudentData) {
            alert("पहले स्टूडेंट सर्च करें!");
            return;
        }

        let payingAmountInput = document.getElementById("payingAmount");
        let payingAmount = payingAmountInput ? Number(payingAmountInput.value) : 0;
        let paymentModeElem = document.getElementById("paymentMode");
        let paymentMode = paymentModeElem ? paymentModeElem.value : "Cash";
        let netFeePayable = Number(summaryFinalFee.value);

        if (!payingAmount || payingAmount <= 0) {
            alert("कृपया सही फीस राशि दर्ज करें!");
            return;
        }

        let previousPaid = (currentStudentData.feeDetails && currentStudentData.feeDetails.paidFee) ? Number(currentStudentData.feeDetails.paidFee) : 0;
        let newPaidTotal = previousPaid + payingAmount;

        if (newPaidTotal > netFeePayable) {
            alert("जमा की जाने वाली राशि Net Payable Fee से अधिक नहीं हो सकती!");
            return;
        }

        let remainingDue = netFeePayable - newPaidTotal;
        let previousTx = (currentStudentData.feeDetails && currentStudentData.feeDetails.transactions) ? currentStudentData.feeDetails.transactions : [];

        let nextReceiptNo = "R-" + (100 + previousTx.length + 1);
        let currentDate = new Date().toLocaleDateString('en-IN') + " " + new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

        previousTx.push({
            receiptNo: nextReceiptNo,
            date: currentDate,
            amount: payingAmount,
            mode: paymentMode
        });

        // Allocation to slots
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

        let updatedFeeDetails = {
            totalFee: Number(summaryTotalFee.value),
            discount: Number(summaryDiscount.value),
            discountReason: discountReason ? discountReason.value : "",
            finalFee: netFeePayable,
            paidFee: newPaidTotal,
            dueFee: remainingDue,
            manualSlots: currentSlots,
            transactions: previousTx
        };

        try {
            let response = await fetch(`http://localhost:5000/api/students/${currentStudentData.rollNo || currentStudentData.id}/pay`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    feeDetails: updatedFeeDetails,
                    paidFee: newPaidTotal,
                    dueFee: remainingDue
                })
            });

            let resData = await response.json();

            if (resData.success) {
                currentStudentData.feeDetails = updatedFeeDetails;
                if (displayPaid) displayPaid.innerText = newPaidTotal;
                if (displayDue) displayDue.innerText = remainingDue;

                renderHistoryTable(previousTx);
                renderManualSlots(currentSlots);

                alert(`रसीद नं. ${nextReceiptNo} - ₹${payingAmount} की फीस सफलतापूर्वक जमा हो गई है!`);
                if (payingAmountInput) payingAmountInput.value = "";
                showStudentReport(); // Refresh bottom table
            } else {
                alert("पेमेंट सेव करने में त्रुटि: " + resData.message);
            }
        } catch (error) {
            console.error("Payment API Error:", error);
            alert("सर्वर से संपर्क करने में समस्या हुई।");
        }
    };
}

/* ==========================================
   6. Print Receipt Event
   ========================================== */
if (printReceiptBtn) {
    printReceiptBtn.onclick = function (e) {
        if (e) e.preventDefault();

        if (!currentStudentData) {
            alert("पहले स्टूडेंट सर्च करें!");
            return;
        }

        let txList = (currentStudentData.feeDetails && currentStudentData.feeDetails.transactions) ? currentStudentData.feeDetails.transactions : [];

        if (txList.length === 0) {
            alert("इस स्टूडेंट का कोई पेमेंट रिकॉर्ड नहीं मिला!");
            return;
        }

        let lastTx = txList[txList.length - 1];
        let studentName = summaryName ? summaryName.value : "N/A";
        let studentCourse = summaryCourse ? summaryCourse.value : "N/A";
        let enteredId = feeStudentIdInput ? feeStudentIdInput.value : "N/A";
        let totalPaidVal = displayPaid ? displayPaid.innerText : "0";
        let dueVal = displayDue ? displayDue.innerText : "0";

        let receiptWindow = window.open("", "_blank");
        receiptWindow.document.write(`
            <html>
            <head>
                <title>Fee Receipt - ${lastTx.receiptNo}</title>
                <style>
                    body { font-family: Arial, sans-serif; padding: 20px; }
                    .receipt-box { border: 2px solid #000; padding: 20px; max-width: 420px; margin: auto; }
                    h2 { text-align: center; margin-bottom: 2px; color: #1a4d2e; }
                    .sub-head { text-align: center; margin-top: 0; font-size: 14px; color: #555; }
                    p { margin: 6px 0; font-size: 14px; }
                    hr { border: 1px dashed #000; margin: 10px 0; }
                    .flex-justify { display: flex; justify-content: space-between; }
                </style>
            </head>
            <body>
                <div class="receipt-box">
                    <h2>Dhanvii Accounting Institute</h2>
                    <p class="sub-head">Fee Payment Receipt</p>
                    <hr>
                    <div class="flex-justify">
                        <span><b>Receipt No:</b> ${lastTx.receiptNo}</span>
                        <span><b>Date:</b> ${lastTx.date}</span>
                    </div>
                    <p><b>Student ID:</b> ${enteredId}</p>
                    <p><b>Student Name:</b> ${studentName}</p>
                    <p><b>Course:</b> ${studentCourse}</p>
                    <hr>
                    <p><b>Deposited Amount:</b> <span style="font-size: 16px;"><b>₹${lastTx.amount}</b></span> (${lastTx.mode})</p>
                    <p><b>Total Paid Till Date:</b> ₹${totalPaidVal}</p>
                    <p><b>Remaining Balance:</b> ₹${dueVal}</p>
                    <hr>
                    <p style="text-align:center;"><i>Thank You for Payment!</i></p>
                </div>
                <script>window.print();<\/script>
            </body>
            </html>
        `);
        receiptWindow.document.close();
    };
}

/* ==========================================
   7. Render Transaction History Table
   ========================================== */
function renderHistoryTable(transactions) {
    if (!historyTableBody) return;
    
    historyTableBody.innerHTML = "";

    if (paymentHistorySection) {
        paymentHistorySection.style.display = "block";
    }

    if (!transactions || transactions.length === 0) {
        historyTableBody.innerHTML = `
            <tr>
                <td colspan="4" style="text-align: center; color: #777;">
                    कोई पेमेंट हिस्ट्री उपलब्ध नहीं है।
                </td>
            </tr>
        `;
        return;
    }

    transactions.forEach(function (tx, index) {
        let rNo = tx.receiptNo || ("R-" + (101 + index));
        let txDate = tx.date || "N/A";
        let txAmount = tx.amount || 0;
        let txMode = tx.mode || "Cash";

        let row = `
            <tr>
                <td><b>${rNo}</b></td>
                <td>${txDate}</td>
                <td style="color: green; font-weight: bold;">₹${txAmount}</td>
                <td><span class="badge" style="background:#e8f5e9; padding:3px 8px; border-radius:4px; font-weight:bold; color:#2e7d32;">${txMode}</span></td>
            </tr>
        `;
        historyTableBody.innerHTML += row;
    });
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
   9. Calculate Total Planned & Balance
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
   10. Collect Slots Data
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

/* ==========================================
   11. Show Bottom Student Report Table
   ========================================== */
function showStudentReport() {
    let tbody = document.getElementById("studentTableBody");
    if (!tbody) return;

    fetch('http://localhost:5000/api/students')
        .then(res => res.json())
        .then(result => {
            if (result.success && result.data && result.data.length > 0) {
                tbody.innerHTML = "";

                result.data.forEach(student => {
                    tbody.innerHTML += `
                        <tr>
                            <td>${student.rollNo || '-'}</td>
                            <td><b>${student.name}</b></td>
                            <td>${student.course || '-'}</td>
                            <td>₹${student.totalFee || 0}</td>
                            <td style="color:green; font-weight:bold;">₹${student.paidFee || 0}</td>
                            <td style="color:red; font-weight:bold;">₹${student.dueFee || 0}</td>
                        </tr>
                    `;
                });
            } else {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center;">डेटाबेस में अभी कोई डेटा नहीं है। कृपया पहले फ़ॉर्म भरकर स्टूडेंट सेव करें।</td></tr>`;
            }
        })
        .catch(err => {
            console.error("Report Fetch Error:", err);
            if (tbody) {
                tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; color:red;">सर्वर चालू नहीं है (Terminal में 'node server.js' चलाएँ)</td></tr>`;
            }
        });
}

window.addEventListener("load", showStudentReport);