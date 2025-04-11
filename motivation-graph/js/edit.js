// URLパラメータを取得してオブジェクトに変換する関数
function getQueryParams() {
    const params = {};
    const queryString = window.location.search.substring(1);
    const queries = queryString.split("&");
    for (let i = 0; i < queries.length; i++) {
        const pair = queries[i].split("=");
        params[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1]);
    }
    return params;
}

// URLパラメータを取得し、入力欄にセット
window.onload = function () {
    const params = getQueryParams();
    const ageSelect = document.getElementById("age");

    // ローカルストレージからモチベーションデータを取得
    const motivationData = JSON.parse(localStorage.getItem('yourMotivationData')) || [];

    // 年齢のオプションを生成
    for (let i = 0; i <= 50; i++) {
        if (motivationData[i] == null || i == params.age) {
            const option = document.createElement("option");
            option.value = i;
            option.textContent = i;
            ageSelect.appendChild(option);
        }
    }

    // セレクトボックスの年齢を設定
    if (params.age) {
        document.getElementById("age").value = params.age;
    }

    // 他のパラメータも設定
    if (params.title) {
        document.getElementById("title").value = params.title;
    }
    if (params.reason) {
        document.getElementById("reason").value = params.reason;
    }
    if (params.motivation) {
        document.getElementById("motivation").value = params.motivation;
        updateMotivationValue(params.motivation);
    }

    // リンクパラメータとセレクトボックスの年齢が異なる場合の処理
    const selectedAge = document.getElementById("age").value;
    if (params.age && params.age !== selectedAge) {
        alert(`リンクの年齢パラメータ(${params.age})とセレクトボックスで選択されている年齢(${selectedAge})が異なります。`);
    }
};

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
    const gradientPercentage = (value - min) / (max - min) * 100;
    motivationSlider.style.background = `linear-gradient(to right, #ffd037 0%, #ffd037 ${gradientPercentage}%, #d3d3d3 ${gradientPercentage}%, #d3d3d3 100%)`;
}

// 初期位置を更新
updateMotivationValue(0);

// フォームの送信イベントを処理
document.getElementById("registrationForm").addEventListener("submit", function (event) {
    event.preventDefault(); // デフォルトのフォーム送信を防止

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
        alert("タイトルは必須です");
        hasError = true;
    } else if (title.length > 50) {
        alert("タイトルは50字以内で入力してください");
        hasError = true;
    }

    if (reason.length > 255) {
        alert("理由は255字以内で入力してください");
        hasError = true;
    }

    // エラーがない場合にデータをローカルストレージに保存
    if (!hasError) {
        try {
            // ローカルストレージからJSON形式の文字列を取得
            const jsonArray = localStorage.getItem('yourMotivationData');
            const jsonArray2 = localStorage.getItem('yourTitleData');
            const jsonArray3 = localStorage.getItem('yourReasonData');

            // JSON形式から配列に変換
            const motivationData = JSON.parse(jsonArray) || [];
            const titleData = JSON.parse(jsonArray2) || [];
            const reasonData = JSON.parse(jsonArray3) || [];

            // 年齢が異なる場合の処理
            const originalAge = getQueryParams().age;
            if (originalAge && originalAge !== age) {
                motivationData.splice(originalAge, 1); // 元の年齢のデータを削除
                titleData.splice(originalAge, 1);
                reasonData.splice(originalAge, 1);
            }

            // データを配列に追加
            motivationData[age] = Number(motivation);
            titleData[age] = title;
            reasonData[age] = reason;

            // ローカルストレージに保存
            localStorage.setItem('yourMotivationData', JSON.stringify(motivationData));
            localStorage.setItem('yourTitleData', JSON.stringify(titleData));
            localStorage.setItem('yourReasonData', JSON.stringify(reasonData));

            // 登録完了メッセージ
            alert("データの更新が完了しました");
            // フォームをリセット
            document.getElementById("registrationForm").reset();
            document.getElementById("motivationValue").textContent = "0%"; // モチベーション値表示のリセット
            window.location.href = `main.html`;
        } catch (error) {
            // エラーが発生した場合にメッセージを表示
            document.getElementById("failureMessage").textContent = "データの更新に失敗しました";
        }
    }
});

// ページ遷移の確認メッセージを表示
function confirmNavigation(event) {
    if (!confirm("ページを移動してもよろしいですか？\n※入力中のデータは削除されます。")) {
        event.preventDefault();
    }
}

// 外部リンクに対して確認ダイアログを設定
document.querySelectorAll('.external-link').forEach(function (link) {
    link.addEventListener('click', confirmNavigation);
});

// 削除ボタンのクリックイベントを処理
document.getElementById("deleteButton").addEventListener("click", function () {
    if (confirm("データを削除してもよろしいですか")) {

        const age = document.getElementById("age").value;

        // ローカルストレージからJSON形式の文字列を取得
        const jsonArray = localStorage.getItem('yourMotivationData');
        const jsonArray2 = localStorage.getItem('yourTitleData');
        const jsonArray3 = localStorage.getItem('yourReasonData');
        // JSON形式から配列に変換
        const motivationData = JSON.parse(jsonArray) || [];
        const titleData = JSON.parse(jsonArray2) || [];
        const reasonData = JSON.parse(jsonArray3) || [];

        console.log(age);

        // 年齢が異なる場合の処理
        if (age == 0) {
            motivationData[age] = null;
            titleData[age] = null;
            reasonData[age] = null;
        } else {
            motivationData.splice(age, 1);
            titleData.splice(age, 1);
            reasonData.splice(age, 1);
        }

        // ローカルストレージに保存
        localStorage.setItem('yourMotivationData', JSON.stringify(motivationData));
        localStorage.setItem('yourTitleData', JSON.stringify(titleData));
        localStorage.setItem('yourReasonData', JSON.stringify(reasonData));
        alert("データが削除されました");
        window.location.href = `main.html`;
    }
});

// 戻るボタンのクリックイベントを処理
document.querySelector(".return-button").addEventListener("click", function () {
    confirmNavigation();
    window.location.href = `main.html`;
});

