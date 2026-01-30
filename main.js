document.addEventListener('DOMContentLoaded', () => {
    // --- Tab Navigation --- //
    const factBtn = document.getElementById('fact-btn');
    const gameBtn = document.getElementById('game-btn');
    const factContainer = document.getElementById('fact-container');
    const gameContainer = document.getElementById('game-container');

    factBtn.addEventListener('click', () => {
        factBtn.classList.add('active');
        gameBtn.classList.remove('active');
        factContainer.style.display = 'block';
        gameContainer.style.display = 'none';
    });

    gameBtn.addEventListener('click', () => {
        gameBtn.classList.add('active');
        factBtn.classList.remove('active');
        gameContainer.style.display = 'block';
        factContainer.style.display = 'none';
    });

    // --- Capybara Facts --- //
    const factElement = document.getElementById('fact');
    const getFactBtn = document.getElementById('get-fact-btn');

    const capybaraFacts = [
        "카피바라는 지구상에서 가장 큰 설치류입니다.",
        "그들은 매우 사회적인 동물이며, 최대 100마리까지 무리를 지어 생활합니다.",
        "카피바라는 뛰어난 수영 실력을 가지고 있으며, 물 속에서 5분 이상 숨을 참을 수 있습니다.",
        "위험을 감지하면 개처럼 짖어서 무리에게 경고합니다.",
        "그들의 식단은 주로 수생 식물과 풀으로 이루어져 있습니다.",
        "카피바라는 다른 동물들과 아주 잘 지내는 것으로 유명하며, 종종 '자연의 의자'라고 불립니다.",
        "그들은 하루에 최대 8kg의 풀을 먹을 수 있습니다.",
        "카피바라는 남아메리카의 대부분 지역에서 발견됩니다.",
        "앞니가 계속 자라기 때문에, 나무껍질 등을 씹어서 닳게 만들어야 합니다.",
        "카피바라의 임신 기간은 약 5개월이며, 한 번에 1~8마리의 새끼를 낳습니다."
    ];

    function getRandomFact() {
        const randomIndex = Math.floor(Math.random() * capybaraFacts.length);
        return capybaraFacts[randomIndex];
    }

    getFactBtn.addEventListener('click', () => {
        factElement.textContent = getRandomFact();
    });
});
