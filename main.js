document.addEventListener('DOMContentLoaded', () => {
    // --- Tab-switching logic ---
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(item => item.classList.remove('active'));
            contents.forEach(item => item.classList.remove('active'));
            tab.classList.add('active');
            document.getElementById(tab.dataset.tab).classList.add('active');
        });
    });

    // --- Pomodoro Timer Logic ---
    const timerDisplay = document.getElementById('timer-display');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const resetBtn = document.getElementById('reset-btn');

    let countdown;
    let timerMode = 'pomodoro'; // 'pomodoro', 'shortBreak', 'longBreak'
    let timeLeft = 1500; // 25 minutes in seconds

    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }

    function startTimer() {
        clearInterval(countdown);
        startBtn.textContent = '계속';
        countdown = setInterval(() => {
            timeLeft--;
            updateTimerDisplay();
            if (timeLeft === 0) {
                clearInterval(countdown);
                alert(timerMode === 'pomodoro' ? '집중 시간이 끝났습니다! 휴식을 취하세요.' : '휴식 시간이 끝났습니다! 다시 집중할 시간입니다.');
                // Basic auto-switching could be added here
            }
        }, 1000);
    }

    function stopTimer() {
        clearInterval(countdown);
    }

    function resetTimer() {
        clearInterval(countdown);
        timeLeft = 1500; // Reset to 25 minutes
        timerMode = 'pomodoro';
        updateTimerDisplay();
        startBtn.textContent = '시작';
    }

    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);

    // --- To-Do List Logic ---
    const todoInput = document.getElementById('todo-item-input');
    const addTodoBtn = document.getElementById('add-todo-btn');
    const todoList = document.getElementById('todo-list');

    function addTodoItem() {
        const todoText = todoInput.value.trim();
        if (todoText === '') return;

        const li = document.createElement('li');
        li.textContent = todoText;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '삭제';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            li.remove();
        });

        li.addEventListener('click', () => {
            li.classList.toggle('completed');
        });

        li.appendChild(deleteBtn);
        todoList.appendChild(li);
        todoInput.value = '';
    }

    addTodoBtn.addEventListener('click', addTodoItem);
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodoItem();
    });

    // --- Quote Logic ---
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');

    const quotes = [
        { text: "가장 큰 위험은 위험 없는 삶이다.", author: "스티븐 코비" },
        { text: "배움은 의무도, 생존도 아니다. 그것은 우리의 가장 큰 특권이다.", author: "데이비드 A. 베드나" },
        { text: "성공의 비결은 시작하는 것이다.", author: "마크 트웨인" },
        { text: "나는 내가 더 노력할수록 운이 더 좋아진다는 것을 발견했다.", author: "토머스 제퍼슨" },
        { text: "오늘 할 수 있는 일을 내일로 미루지 말라.", author: "벤자민 프랭클린" }
    ];

    function showNewQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        quoteText.textContent = quotes[randomIndex].text;
        quoteAuthor.textContent = `- ${quotes[randomIndex].author} -`;
    }

    newQuoteBtn.addEventListener('click', showNewQuote);

    // Initialize
    updateTimerDisplay();
});
