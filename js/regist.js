// ローカルストレージからモチベーションデータを取得
const motivationData = JSON.parse(localStorage.getItem("yourMotivationData")) || [];
const titleData = JSON.parse(localStorage.getItem("yourTitleData")) || [];
const reasonData = JSON.parse(localStorage.getItem("yourReasonData")) || [];

// 年齢のオプションを生成
const ageSelect = document.getElementById("age");
for (let i = 0; i <= 50; i++) {
    if (motivationData[i] == null || motivationData[i] == 0 && reasonData[i] == null && titleData[i] == null) {
        const option = document.createElement("option");
        option.value = i;
        option.textContent = i;
        ageSelect.appendChild(option);
        continue;
    }
}

// モチベーション値のスライダーの値を表示
function updateMotivationValue(value) {
    const motivationValue = document.getElementById("motivationValue");
    motivationValue.textContent = `${value}%`;

    // スライダーの位置に合わせてモチベーション値の位置を変更
    const motivationSlider = document.getElementById("motivation");
    const min = parseInt(motivationSlider.min);
    const max = parseInt(motivationSlider.max);
    const percentage = ((value - min) * 100) / (max - min);
    motivationValue.style.left = `${percentage}%`;
    motivationValue.style.transform = `translateX(-${percentage}%)`;

    // スライダーの背景を更新
    const gradientPercentage = ((value - min) / (max - min)) * 100;
    motivationSlider.style.background = `linear-gradient(to right, #ffd037 0%, #ffd037 ${gradientPercentage}%, #d3d3d3 ${gradientPercentage}%, #d3d3d3 100%)`;
}

// 初期位置を更新
updateMotivationValue(0);

// フォームの送信イベントを処理
document
    .getElementById("registrationForm")
    .addEventListener("submit", function (event) {
        event.preventDefault();

        // エラーメッセージをクリア
        document.getElementById("titleError").textContent = "";
        document.getElementById("reasonError").textContent = "";
        document.getElementById("failureMessage").textContent = "";

        // 入力値を取得
        const age = document.getElementById("age").value;
        const title = document.getElementById("title").value;
        const reason = document.getElementById("reason").value;
        const motivation = document.getElementById("motivation").value;

        let hasError = false;

        // バリデーションチェック
        if (title.trim() === "") {
            alert("出来事は必須です");
            hasError = true;
        } else if (title.length > 50) {
            alert("出来事は50字以内で入力してください");
            hasError = true;
        } else if (reason.length > 255) {
            alert("理由は255字以内で入力してください");
            hasError = true;
        }

        // エラーがない場合にデータをローカルストレージに保存
        if (!hasError) {
            try {
                // ローカルストレージからJSON形式の文字列を取得
                let jsonArray = localStorage.getItem("yourMotivationData");
                let jsonArray2 = localStorage.getItem("yourTitleData");
                let jsonArray3 = localStorage.getItem("yourReasonData");

                // JSON形式から配列に変換（存在しない場合は空の配列）
                let motivationData = jsonArray ? JSON.parse(jsonArray) : [];
                let titleData = jsonArray2 ? JSON.parse(jsonArray2) : [];
                let reasonData = jsonArray3 ? JSON.parse(jsonArray3) : [];

                // データを配列に追加
                motivationData[age] = Number(motivation);
                titleData[age] = title;
                reasonData[age] = reason;

                // ローカルストレージに保存
                localStorage.setItem(
                    "yourMotivationData",
                    JSON.stringify(motivationData)
                );
                localStorage.setItem("yourTitleData", JSON.stringify(titleData));
                localStorage.setItem(
                    "yourReasonData",
                    JSON.stringify(reasonData)
                );

                // 登録完了メッセージ
                alert("データの登録が完了しました");
                // フォームをリセット
                document.getElementById("registrationForm").reset();
                // モチベーション値表示のリセット
                motivationValue.textContent = "0%";
                window.location.href = `main.html`;
            } catch (error) {
                // エラーが発生した場合にメッセージを表示
                document.getElementById("failureMessage").textContent =
                    "データの登録に失敗しました";
            }
        }
    });

// ページ遷移の確認メッセージを表示
function confirmNavigation(event) {
    if (
        !confirm(
            "ページを移動してもよろしいですか？\n※入力中のデータは削除されます。"
        )
    ) {
        event.preventDefault();
    }
}

// 外部リンクに対して確認ダイアログを設定
document.querySelectorAll(".external-link").forEach(function (link) {
    link.addEventListener("click", confirmNavigation);
});

// 戻るボタンのクリックイベントを処理
document
    .querySelector(".return-button")
    .addEventListener("click", function (link) {
        confirmNavigation();
        window.location.href = `main.html`;
    });