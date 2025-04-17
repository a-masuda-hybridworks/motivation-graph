// canvas要素を取得
var ctx = document.getElementById('motivationChart').getContext('2d');

var storedMotivationData = localStorage.getItem('yourMotivationData');
var storedTitleData = localStorage.getItem('yourTitleData');
var storedReasonData = localStorage.getItem('yourReasonData');
var storedInfluencerData = localStorage.getItem('yourInfluencerData');
var yourageData = localStorage.getItem('yourageData');

var motivationData = storedMotivationData ? JSON.parse(storedMotivationData) : [];
var titleData = storedTitleData ? JSON.parse(storedTitleData) : [];
var reasonData = storedReasonData ? JSON.parse(storedReasonData) : [];
var influencerData = storedInfluencerData ? JSON.parse(storedInfluencerData) : [];

if(motivationData[0] == null){ motivationData[0] = 0; }

localStorage.setItem('yourMotivationData', JSON.stringify(motivationData));
localStorage.setItem('yourTitleData', JSON.stringify(titleData));
localStorage.setItem('yourReasonData', JSON.stringify(reasonData));
localStorage.setItem('yourInfluencerData', JSON.stringify(influencerData));

function populateTable() {
    const tbody = document.getElementById('data-table-body');
    tbody.innerHTML = '';

    for (let i = 0; i < motivationData.length; i++) {
        if (motivationData[i] === undefined || motivationData[i] === null) continue;
        if (i == 0 && motivationData[0] == 0 && titleData[0] === null && reasonData[0] === null) continue;

        const row = document.createElement('tr');

        const ageCell = document.createElement('td');
        ageCell.textContent = i;
        row.appendChild(ageCell);

        const titleCell = document.createElement('td');
        titleCell.textContent = titleData[i] || "";
        row.appendChild(titleCell);

        const influencerCell = document.createElement('td');
        influencerCell.textContent = influencerData[i] || "";
        row.appendChild(influencerCell);

        const motivationCell = document.createElement('td');
        motivationCell.textContent =
        motivationData[i] !== undefined && motivationData[i] !== null
        ? motivationData[i] + "%"
        : "";
        row.appendChild(motivationCell);

        const reasonCell = document.createElement('td');
        reasonCell.textContent = reasonData[i] || "";
        row.appendChild(reasonCell);

        const detailCell = document.createElement('td');
        const detailButton = document.createElement('button');
        detailButton.textContent = '編集';
        detailCell.classList.add('detail-cell');
        detailButton.classList.add('detail-button');
        detailButton.onclick = function () {
            window.location.href = `edit.html?motivation=${encodeURIComponent(motivationData[i])}&age=${i}&title=${encodeURIComponent(titleData[i])}&reason=${encodeURIComponent(reasonData[i])}&influencer=${encodeURIComponent(influencerData[i] || '')}`;
        };
        detailCell.appendChild(detailButton);
        row.appendChild(detailCell);

        tbody.appendChild(row);
    }
}

populateTable();



// チャートを描画するためのデータ
var chartData = {
    labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50], // 横軸のラベルをi歳形式に変更
    datasets: [{
        label: 'ライフラインチャート',
        spanGaps: true,
        data: motivationData,
        fill: false,
        borderColor: 'rgb(0, 218, 143)',
        tension: 0.1,
        pointRadius: 6,
        pointBackgroundColor: 'rgb(0, 135, 184)'
    }]
};

var chartOptions = {
    scales: {
            y: { 
                min: -100,
                max: 100
            },
            x: {
                min: 0,
                max: 50,
                ticks: {
                    autoSkip: false
            }   
        }
    },
    plugins: {
        tooltip: {
            enable: true,
            mode: 'index',
            intersect: false,
            displayColors: false,
            callbacks: {
                title: function (tooltipItems) {
                    var index = tooltipItems[0].dataIndex;
                    var title = reasonData[index] || '理由なし';
                    
                    return title;
                },
                label: function () {
                    return ` `;
                },
            },

        }
    }
};

/**
 * 登録データの中にモチベーション値が100%以上のデータがある場合グラフy軸最大値変更
 */

for (let i = 0; i < motivationData.length; i++) {
    if (motivationData[i] === undefined || motivationData[i] === null) {
        continue; // データが空ならスキップ
    } else if(motivationData[i] > 100){
        chartOptions.scales.y.max = 120
    }
}


/**
 * チャートの設定
 */
var motivationChart = new Chart(ctx, {
    type: 'line',
    data: chartData,
    options: chartOptions,
});

/**
 * 現在年齢を変更した際のグラフx軸最大値変更(画面リロード時の初期描画対応)
 */
if(yourageData !==""){
    yourageData = Number(yourageData)
};


/**
 * 現在年齢を変更した際のグラフx軸最大値変更
 */

function ageChange(){
    if(document.getElementById('your_age')){
        selected_your_age = document.getElementById('your_age').value;
        localStorage.setItem("yourageData", JSON.stringify(selected_your_age));
        if(selected_your_age < 50){
            if(selected_your_age == 20){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
            } else if(selected_your_age == 21){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
            } else if(selected_your_age == 22){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
            } else if(selected_your_age == 23){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
            } else if(selected_your_age == 24){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
            } else if(selected_your_age == 25){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
            } else if(selected_your_age == 26){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26]
            } else if(selected_your_age == 27){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27]
            } else if(selected_your_age == 28){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]
            } else if(selected_your_age == 29){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29]
            } else if(selected_your_age == 30){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
            } else if(selected_your_age == 31){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31]
            } else if(selected_your_age == 32){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 33]
            } else if(selected_your_age == 33){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33]
            } else if(selected_your_age == 34){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34]
            } else if(selected_your_age == 35){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35]
            } else if(selected_your_age == 36){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36]
            } else if(selected_your_age == 37){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37]
            } else if(selected_your_age == 38){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38]
            } else if(selected_your_age == 39){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39]
            } else if(selected_your_age == 40){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40]
            } else if(selected_your_age == 41){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41]
            } else if(selected_your_age == 42){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42]
            } else if(selected_your_age == 43){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43]
            } else if(selected_your_age == 44){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]
            } else if(selected_your_age == 45){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45]
            } else if(selected_your_age == 46){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46]
            } else if(selected_your_age == 47){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47]
            } else if(selected_your_age == 48){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48]
            } else if(selected_your_age == 49){
                chartData.labels= [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49]
            } 
        }
    }
    motivationChart.update();
};


/**
 * PDF出力
 */
const captureAndDownloadPDF = async () => {
    // ファイル名を加工する
    // 「年、月、日」を取得
    const today = new Date();
    const numberYear = today.getFullYear();
    const numberMonth = today.getMonth() + 1;
    const numberDate = today.getDate();
    
//数字から文字列に変更と共に、0埋め表示
    const y = String(numberYear);
    const m = String(numberMonth).padStart(2, "0");
    const d = String(numberDate).padStart(2, "0");
    const result = (y + m + d);

    const pdf_name = `モチベーショングラフ_${result}.pdf`;

    toggleButtonState(false, 'Processing...');
    const { jsPDF } = window.jspdf;

    const content = document.getElementById('content');
    const canvas = await html2canvas(content);
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');

    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = pdfHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 40, position, pdfWidth * 0.6, pdfHeight * 0.6);
    heightLeft -= (pdf.internal.pageSize.getHeight() - position);

    while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, pdfWidth * 0.6, pdfHeight * 0.6);
        heightLeft -= pdf.internal.pageSize.getHeight();
    }

    pdf.save(pdf_name);
    toggleButtonState(true, 'Download PDF');
};

/**
 * Excel出力
 */

async function exportToExcelWithImage() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('モチベーション');

    const name = document.querySelector('input[name="title"]').value || "未入力";
    const age = document.getElementById('your_age').value || "未選択";

    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const dateStr = `出力日：${y}/${m}/${d}`;

    worksheet.getCell('A1').value = `名前：${name}`;
    worksheet.getCell('A2').value = `現在年齢：${age}歳`;
    worksheet.getCell('A3').value = dateStr;

    worksheet.getCell('A1').font = { bold: true, size: 9 };
    worksheet.getCell('A2').font = { bold: true, size: 9 };
    worksheet.getCell('A3').font = { bold: true, size: 9 };

    const canvas = document.getElementById('motivationChart');
    const chartCanvas = await html2canvas(canvas);
    const chartDataUrl = chartCanvas.toDataURL('image/png');
    const imageBlob = await (await fetch(chartDataUrl)).blob();
    const arrayBuffer = await imageBlob.arrayBuffer();

    const imageId = workbook.addImage({ buffer: arrayBuffer, extension: 'png' });
    worksheet.addImage(imageId, { tl: { col: 0, row: 4 }, ext: { width: 600, height: 300 } });

    const rows = [];
    const headers = ["年齢", "出来事", "影響を与えた人物", "幸福度合", "幸福度の理由"];
    rows.push(headers);

    for (let i = 0; i < motivationData.length; i++) {
        if (motivationData[i] === undefined || motivationData[i] === null) continue;
        const row = [];
        row.push(i); // 年齢
        row.push(titleData[i] || ""); // 出来事
        row.push(influencerData[i] || ""); // 影響を与えた人物
        row.push(motivationData[i] !== undefined && motivationData[i] !== null ? motivationData[i] + "%" : "0%"); // ％
        row.push(reasonData[i] || ""); // モチベーションの理由
        rows.push(row);
    }

    const startRow = 24;
    worksheet.columns = [
        { width: 6 }, { width: 28 }, { width: 28 }, { width: 10 }, { width: 50 }
    ];

    rows.forEach((row, rowIndex) => {
        const insertedRow = worksheet.insertRow(startRow + rowIndex, row);
        insertedRow.eachCell((cell, colNumber) => {
            cell.border = {
                top: { style: 'thin' }, left: { style: 'thin' },
                bottom: { style: 'thin' }, right: { style: 'thin' }
            };
            cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
            if (rowIndex === 0) {
                cell.font = { bold: true, size: 9 };
                cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFE2EFDA' } };
            } else {
                cell.font = { size: 9 };
            }
        });
    });

    const fileName = `モチベーショングラフ_${y}${m}${d}.xlsx`;
    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
}


const toggleButtonState = async (isEnabled, text) => {
    const button = document.getElementById('downloadButton');
    button.disabled = !isEnabled;
    button.innerText = text;
}

function showHelp(id) {
    // 一度全部非表示に
    document.querySelectorAll('.help-popup').forEach(p => p.style.display = 'none');
    const overlay = document.getElementById('overlay');
    const target = document.getElementById(id);
    if (target && overlay) {
      overlay.style.display = 'block';
      target.style.display = 'block';
    }
  }

  function closeHelp() {
    document.querySelectorAll('.help-popup').forEach(p => p.style.display = 'none');
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.style.display = 'none';
    }
  }

