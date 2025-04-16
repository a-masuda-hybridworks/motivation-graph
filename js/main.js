// canvas要素を取得
var ctx = document.getElementById('motivationChart').getContext('2d');

// ローカルストレージから既存のデータを取得
var storedMotivationData = localStorage.getItem('yourMotivationData');
var storedTitleData = localStorage.getItem('yourTitleData');
var storedReasonData = localStorage.getItem('yourReasonData');
var yourageData = localStorage.getItem('yourageData');

// JSON形式から配列に変換、データが存在しない場合は空の配列を使用
var motivationData = storedMotivationData ? JSON.parse(storedMotivationData) : [];
var titleData = storedTitleData ? JSON.parse(storedTitleData) : [];
var reasonData = storedReasonData ? JSON.parse(storedReasonData) : [];

// JSON形式から数値型に変換

// モチベーションデータが空の時はデータポイントとして0を用意（デザイン調整）
if(motivationData[0] == null){
    motivationData[0] = 0;
}

// 更新された配列をローカルストレージに保存
localStorage.setItem('yourMotivationData', JSON.stringify(motivationData));
localStorage.setItem('yourTitleData', JSON.stringify(titleData));
localStorage.setItem('yourReasonData', JSON.stringify(reasonData));

/**
 * テーブルにデータを表示する関数
*/
function populateTable() {
    const tbody = document.getElementById('data-table-body');
    tbody.innerHTML = ''; // 既存の行をクリア

    for (let i = 0; i < motivationData.length; i++) {
        if (motivationData[i] === undefined || motivationData[i] === null) {
            continue; // データが空ならスキップ
        }

        // 初期データポイント:0は表の内容として表示しない
        if (i == 0 ) {
            if(motivationData[0] == 0 && titleData[0] === null && reasonData[0] === null){
                continue;//スキップ
            }
        }

        const row = document.createElement('tr');

        const ageCell = document.createElement('td');
        ageCell.textContent = i;

        if (motivationData.length == i + 1) {
            ageCell.classList.add('first-td');
        }
        row.appendChild(ageCell);

        const titleCell = document.createElement('td');

        if (titleData[i] !== undefined) {
            titleCell.textContent = titleData[i];
        }
        row.appendChild(titleCell);

        const motivationCell = document.createElement('td');
        if (motivationData[i] !== undefined) {
            motivationCell.innerHTML = motivationData[i]; // HTML内容を表示
        }
        row.appendChild(motivationCell);

        const reasonCell = document.createElement('td');
        if (reasonData[i] !== undefined) {
            reasonCell.innerHTML = reasonData[i]; // HTML内容を表示
        }
        row.appendChild(reasonCell);

        // 編集ボタン用セル
        const detailCell = document.createElement('td');
        const detailButton = document.createElement('button');
        detailButton.textContent = '編集';

        detailCell.classList.add('detail-cell');
        detailButton.classList.add('detail-button');
        if (motivationData.length == i + 1) {
            detailCell.id = 'last-td';
        }
        // ボタンクリック時の処理
        detailButton.onclick = function () {
            const age = i;
            const motivation = motivationData[i];
            const title = titleData[i];
            const reason = reasonData[i];
            // 詳細ページにリダイレクト、クエリパラメータとしてデータを送信
            window.location.href = `edit.html?motivation=${encodeURIComponent(motivation)}&age=${age}&title=${encodeURIComponent(title)}&reason=${encodeURIComponent(reason)}`;
        };

        detailCell.appendChild(detailButton);
        row.appendChild(detailCell);
        tbody.appendChild(row);
    }
}

// 作成したテーブルを表示
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

    //名前と年齢の取得
    const name = document.querySelector('input[name="title"]').value || "未入力";
    const age = document.getElementById('your_age').value || "未選択";

    //名前・年齢をA1とA2に書き込む
    worksheet.getCell('A1').value = `名前：${name}`;
    worksheet.getCell('A2').value = `現在年齢：${age}歳`;
    worksheet.getCell('A1').font = { bold: true };
    worksheet.getCell('A2').font = { bold: true };

    // === 1. グラフを画像として取得・貼り付け ===
    const canvas = document.getElementById('motivationChart');
    const chartCanvas = await html2canvas(canvas);
    const chartDataUrl = chartCanvas.toDataURL('image/png');
    const imageBlob = await (await fetch(chartDataUrl)).blob();
    const arrayBuffer = await imageBlob.arrayBuffer();

    const imageId = workbook.addImage({
        buffer: arrayBuffer,
        extension: 'png',
    });

    // グラフ画像をA1から表示（大きめで）
    worksheet.addImage(imageId, {
        tl: { col: 0, row: 3 },
        ext: { width: 600, height: 300 },
    });

    // === 2. 表データを画像の下に挿入 ===
    const table = document.querySelector("#table table");
    const rows = [];
    const headers = [];

    // 最後の列（編集）を除外
    table.querySelectorAll("thead th").forEach((th, index, arr) => {
        if (index < arr.length - 1) {
            headers.push(th.innerText);
        }
    });
    rows.push(headers);

    table.querySelectorAll("tbody tr").forEach(tr => {
        const row = [];
        const cells = tr.querySelectorAll("td");
        cells.forEach((td, index) => {
            if (index < cells.length - 1) {
                row.push(td.innerText);
            }
        });
        rows.push(row);
    });

    // 表の開始行を画像の高さに合わせて調整（約20行分）
    const startRow = 23;

    // ✅ ここで列幅を設定
    worksheet.columns = [
        { width: 10, alignment: { wrapText: true } },  // 年齢
        { width: 25, alignment: { wrapText: true } },  // 出来事
        { width: 10, alignment: { wrapText: true } },  // %
        { width: 40, alignment: { wrapText: true } }, // 理由
    ];

    worksheet.pageSetup = {
        paperSize: 9,              // A4
        orientation: 'portrait', // 横向き印刷
        fitToPage: true,          // 1ページに収める
        fitToWidth: 1,
        fitToHeight: 0,           // 高さは制限しない
        horizontalCentered: true,
        margins: {
            left: 0.3, right: 0.3,
            top: 0.5, bottom: 0.5,
            header: 0.1, footer: 0.1
        }
    };

    rows.forEach((row, rowIndex) => {
        const insertedRow = worksheet.insertRow(startRow + rowIndex, row);

         // 各セルに罫線を追加
        insertedRow.eachCell((cell) => {
        cell.border = {
            top:    { style: 'thin' },
            left:   { style: 'thin' },
            bottom: { style: 'thin' },
            right:  { style: 'thin' }
            };

            // 共通の中央揃え
        cell.alignment = {
            vertical: 'middle',
            horizontal: 'center',
            wrapText: true
        };

        // === ヘッダー行の装飾（1行目） ===
        if (rowIndex === 0) {
            cell.font = { bold: true };
            cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFE2EFDA' }  // 薄い緑
            };
          } 
        });
    });

    // === ファイル名に日付を含めて保存 ===
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const fileName = `モチベーショングラフ_${y}${m}${d}.xlsx`;

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), fileName);
}

const toggleButtonState = async (isEnabled, text) => {
    const button = document.getElementById('downloadButton');
    button.disabled = !isEnabled;
    button.innerText = text;
}


