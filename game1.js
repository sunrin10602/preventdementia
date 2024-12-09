// 게임 시작 시 호출
window.onload = function() {
    startGame();
    updateScoreDisplay();
};

// 점수를 로컬 저장소에서 불러오기, 없으면 0으로 초기화
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;

// 점수 업데이트 및 로컬 저장소 저장
function updateScoreDisplay() {
    document.getElementById('score-display').textContent = `점수: ${score}`;
    localStorage.setItem('score', score);  // 점수를 로컬 저장소에 저장
}

// 홈 버튼 클릭 이벤트 처리
document.getElementById('home-button').addEventListener('click', function() {
    const confirmExit = confirm(`현재까지의 점수는 ${score}점입니다. 정말로 종료하시겠습니까?`);
    if (confirmExit) {
        localStorage.removeItem('score');
        // 홈 화면으로 리다이렉트
        window.location.href = 'index.html'; 
    }
});

// 게임 관련 변수 초기화
const colors = ["빨강", "파랑", "초록", "노랑", "보라", "검정"];
const htmlColors = ["red", "blue", "green", "yellow", "blueviolet", "black"];
let round = 0;
let currentColor = "";
const totalRounds = 3;

// 게임 시작 함수
function startGame() {
    displayQuestion();
}

// 문제 표시 함수
function displayQuestion() {
    if (round >= totalRounds) {
        // 게임이 끝나면 1초 후 랜덤 게임 호출
        setTimeout(() => {
            const nextGame = getRandomGame(); // 랜덤 게임 함수 호출
            window.location.href = nextGame; // 랜덤 게임 호출
        }, 1000);
        return;
    }

    let colorName, colorCode;

    do {
        colorName = colors[Math.floor(Math.random() * colors.length)];
        currentColor = colors[Math.floor(Math.random() * colors.length)];
        colorCode = htmlColors[colors.indexOf(currentColor)];
    } while (colorName === currentColor); // 글자 내용과 색상이 동일한 경우 다시 선택

    const questionElement = document.getElementById("question");
    questionElement.textContent = colorName;
    questionElement.style.color = colorCode;

    round++;
}

// 정답 확인 함수
function checkAnswer() {
    const answerInput = document.getElementById("answer");
    const answer = answerInput.value.trim();

    if (answer === currentColor) {
        score += 10;
        alert('정답입니다!');
        updateScoreDisplay();
        answerInput.style.borderColor = "blue"; // 정답: 파란색 테두리
    } else {
        alert("오답이 있습니다.");
        answerInput.style.borderColor = "red"; // 오답: 빨간색 테두리
    }

    answerInput.value = ""; // 입력 초기화
    setTimeout(displayQuestion, 1000); // 1초 후 다음 문제로 이동
}

// 랜덤 게임 선택 함수
function getRandomGame() {
    const games = ["game.html", "game1.html", "game2.html"];
    const randomIndex = Math.floor(Math.random() * games.length);
    return games[randomIndex];
}