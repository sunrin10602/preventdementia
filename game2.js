window.onload = function() {
    showAnswerScreen();
    updateScoreDisplay();
};

let answerColors = [];
let draggableBoxes = [];
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

// 정답 화면 표시 함수
function showAnswerScreen() {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'black'];
    answerColors = [];

    // 3개의 색상을 중복 없이 선택
    for (let i = 0; i < 3; i++) {
        let color;
        do {
            color = colors[Math.floor(Math.random() * colors.length)];
        } while (answerColors.includes(color));
        answerColors.push(color);
    }

    // 정답 색상을 화면에 표시
    answerColors.forEach((color, index) => {
        document.getElementById(`box${index + 1}`).style.backgroundColor = color;
    });

    // 일정 시간 후 게임 화면으로 넘어감
    setTimeout(showGameScreen, Math.random() * 1000 + 1000);
}

// 게임 화면 표시 및 드래그 가능한 박스 설정
function showGameScreen() {
    const shuffledColors = shuffle([...answerColors]);
    draggableBoxes = shuffledColors.map((color, index) => {
        const box = document.getElementById(`drag-box${index + 1}`);
        box.style.backgroundColor = color;
        box.setAttribute('data-color', color);
        return box;
    });

    document.getElementById('answer-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'flex';

    // 드래그 이벤트 활성화
    makeDraggable();
}

// 배열을 무작위로 섞는 함수
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 드래그 가능하게 만드는 함수
function makeDraggable() {
    draggableBoxes.forEach(box => {
        box.addEventListener('dragstart', handleDragStart);
        box.addEventListener('dragover', handleDragOver);
        box.addEventListener('dragenter', handleDragEnter);
        box.addEventListener('dragleave', handleDragLeave);
        box.addEventListener('drop', handleDrop);
        box.addEventListener('dragend', handleDragEnd);
    });
}

// 드래그 시작 이벤트
function handleDragStart(e) {
    e.dataTransfer.setData('text', e.target.id);
}

// 드래그 오버 이벤트
function handleDragOver(e) {
    e.preventDefault();
}

// 드래그 대상에 진입 시 스타일 변경
function handleDragEnter(e) {
    e.target.style.border = '2px solid #000';
}

// 드래그 대상에서 나갈 때 스타일 변경
function handleDragLeave(e) {
    e.target.style.border = 'none';
}

// 드래그하여 놓았을 때 색상 변경 및 순서 변경
function handleDrop(e) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text');
    const draggedBox = document.getElementById(draggedId);
    const targetBox = e.target;

    // 순서 변경
    const draggedIndex = draggedBox.style.order;
    draggedBox.style.order = targetBox.style.order;
    targetBox.style.order = draggedIndex;

    // 색상 변경
    const draggedColor = draggedBox.style.backgroundColor;
    draggedBox.style.backgroundColor = targetBox.style.backgroundColor;
    targetBox.style.backgroundColor = draggedColor;
}

// 드래그 종료 시 스타일 초기화
function handleDragEnd(e) {
    e.target.style.border = 'none';
}

// 정답 확인 함수
document.getElementById('check-answer').addEventListener('click', checkAnswer);
function checkAnswer() {
    const currentOrder = draggableBoxes.map(box => box.style.backgroundColor);
    if (JSON.stringify(currentOrder) === JSON.stringify(answerColors)) {
        score += 10;
        alert('정답입니다!');
        updateScoreDisplay();
        redirectToRandomGame();
    } else {
        alert('오답입니다.');
    }
}

// 랜덤 게임 리다이렉션 함수
function redirectToRandomGame() {
    const games = ["game.html", "game1.html", "game2.html"];
    const randomIndex = Math.floor(Math.random() * games.length);
    window.location.href = games[randomIndex];
}