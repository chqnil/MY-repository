document.addEventListener('DOMContentLoaded', () => {
    const tabs = document.querySelectorAll('.tab-link');
    const contents = document.querySelectorAll('.tab-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Deactivate all tabs and content
            tabs.forEach(item => item.classList.remove('active'));
            contents.forEach(item => item.classList.remove('active'));

            // Activate the clicked tab and its content
            const target = document.querySelector(`#${tab.dataset.tab}`);
            tab.classList.add('active');
            target.classList.add('active');

            // **If the game tab is now active, dispatch an event**
            if (tab.dataset.tab === 'game') {
                window.dispatchEvent(new Event('showgametab'));
            }
        });
    });

    // Capybara Facts Logic
    const factText = document.getElementById('fact-text');
    const newFactBtn = document.getElementById('new-fact-btn');

    const capybaraFacts = [
        "카피바라는 세계에서 가장 큰 설치류입니다.",
        "카피바라는 '초원의 지배자'라는 뜻의 투피족 언어에서 유래했습니다.",
        "카피바라는 수영과 잠수를 매우 잘하며, 발에 작은 물갈퀴가 있습니다.",
        "카피바라는 다른 동물들과 매우 사교적이며, '움직이는 의자' 역할을 하기도 합니다.",
        "카피바라의 앞니는 평생 동안 계속 자랍니다.",
        "카피바라는 채식주의자이며 주로 풀과 수생 식물을 먹습니다.",
        "카피바라는 위협을 느끼면 물 속으로 뛰어들어 숨을 수 있습니다.",
        "카피바라는 일본 온천에서 목욕하는 것을 즐기는 것으로 유명합니다.",
        "카피바라는 하루에 15~20시간을 먹거나 쉬면서 보냅니다.",
        "카피바라는 등을 토닥여주면 쉽게 잠에 빠져드는 온순한 성격을 가지고 있습니다."
    ];

    newFactBtn.addEventListener('click', () => {
        let randomIndex = Math.floor(Math.random() * capybaraFacts.length);
        let randomFact = capybaraFacts[randomIndex];
        // Prevent showing the same fact twice in a row
        if (factText.textContent === randomFact) {
            randomIndex = (randomIndex + 1) % capybaraFacts.length;
            randomFact = capybaraFacts[randomIndex];
        }
        factText.textContent = randomFact;
    });
});
