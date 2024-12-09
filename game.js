// 게임 시작 시 호출
window.onload = function() {
    startGame();
    updateScoreDisplay();
};

// 점수 업데이트 및 로컬 스토리지 저장
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

// 점수를 로컬 저장소에서 불러오기, 없으면 0으로 초기화
let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;

// 게임 시작 함수
function startGame() {
    const gameBoard = document.getElementById('number-table');
    gameBoard.style.display = 'table';  // 테이블 표시

    const numbers = generateRandomNumbers();  // 랜덤 숫자 생성
    let index = 0;

    const tbody = gameBoard.createTBody();  // 테이블 본문 생성

    for (let i = 0; i < 5; i++) {
        const row = tbody.insertRow();
        for (let j = 0; j < 5; j++) {
            const cell = row.insertCell();
            cell.textContent = numbers[index++];
        }
    }
}

// 랜덤 숫자 생성 함수
function generateRandomNumbers() {
    const pairs = [];
    const numbers = [];

    // 3개의 서로 다른 숫자를 랜덤으로 생성
    while (pairs.length < 3) {
        const num = Math.floor(Math.random() * 90) + 10; // 10 ~ 99
        if (!pairs.includes(num)) pairs.push(num);
    }

    // 각 숫자를 2번씩 배열에 추가
    for (let pair of pairs) {
        numbers.push(pair, pair);
    }

    // 나머지 자리에는 10~99 범위의 다른 숫자들을 추가
    while (numbers.length < 25) {
        const num = Math.floor(Math.random() * 90) + 10;
        if (!numbers.includes(num)) numbers.push(num);
    }

    // 숫자들을 랜덤하게 섞어서 반환
    return numbers.sort(() => Math.random() - 0.5);
}

// 정답 확인 함수
function checkAnswers() {
    const inputs = document.querySelectorAll('.answer-input');
    const answers = Array.from(inputs).map(input => parseInt(input.value));
    const uniqueAnswers = new Set(answers);
    const tableNumbers = Array.from(document.querySelectorAll('#number-table td')).map(td => parseInt(td.textContent));

    // 중복된 숫자가 있는지 확인
    if (answers.length !== uniqueAnswers.size) {
        alert('중복된 숫자가 있습니다. 다시 입력해 주세요.');
        inputs.forEach(input => input.style.borderColor = 'red');
        return;
    }

    // 입력한 값들이 테이블에서 2번 등장하는지 확인
    if (uniqueAnswers.size === 3 && Array.from(uniqueAnswers).every(num => tableNumbers.filter(n => n === num).length === 2)) {
        score += 10;
        alert('정답입니다!');
        updateScoreDisplay();
        inputs.forEach(input => input.style.borderColor = 'blue');
    } else {
        inputs.forEach(input => {
            const value = parseInt(input.value);
            if (tableNumbers.filter(n => n === value).length === 2) {
                input.style.borderColor = 'blue';
            } else {
                input.style.borderColor = 'red';
            }
        });
    }

    // 게임 종료 후 랜덤 게임 호출
    setTimeout(() => {
        const nextGame = getRandomGame(); // 랜덤 게임 함수 호출
        window.location.href = nextGame; // 랜덤 게임 호출
    }, 1000);
}

// 랜덤 게임 선택 함수
function getRandomGame() {
    const games = ["game.html", "game1.html", "game2.html"];
    const randomIndex = Math.floor(Math.random() * games.length);
    return games[randomIndex];
}