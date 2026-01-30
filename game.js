document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    let score, scoreText, highscore, highscoreText, player, gravity, gameSpeed;
    let obstacles = [];
    let keys = {};
    let initialSpawnTimer = 200;
    let spawnTimer = initialSpawnTimer;
    let gameState = 'pre-start';

    // Frame-rate independence
    let lastTime = 0;

    // --- Event Listeners ---
    document.addEventListener('keydown', (evt) => { keys[evt.code] = true; });
    document.addEventListener('keyup', (evt) => { keys[evt.code] = false; });
    canvas.addEventListener('touchstart', handleInteraction, { passive: false });
    canvas.addEventListener('click', handleInteraction);
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('showgametab', resizeCanvas);

    function handleInteraction(e) {
        e.preventDefault();
        if (gameState === 'running') {
            player.Jump();
        } else if (gameState === 'pre-start') {
            const rect = canvas.getBoundingClientRect();
            const clickEvent = e.type === 'touchstart' ? e.touches[0] : e;
            const x = clickEvent.clientX - rect.left;
            const y = clickEvent.clientY - rect.top;
            const buttonX = (canvas.width - 200) / 2;
            const buttonY = (canvas.height - 50) / 2;
            if (x >= buttonX && x <= buttonX + 200 && y >= buttonY && y <= buttonY + 50) {
                Start();
            }
        }
    }

    // --- Classes ---
    class Player {
        constructor(x, y, w, h) {
            this.x = x; this.y = y; this.w = w; this.h = h;
            this.dy = 0; this.jumpForce = 12;
            this.originalHeight = h; this.grounded = false; this.jumpTimer = 0;
        }

        Animate(deltaTime) {
            if (keys['Space'] && this.grounded) { this.Jump(); }
            this.jumpTimer += deltaTime * 60; // Scale timer by delta
            this.y += this.dy * deltaTime * 60;

            const groundHeight = canvas.height - 30;
            if (this.y + this.h < groundHeight) {
                this.dy += gravity * deltaTime * 60;
                this.grounded = false;
            } else {
                this.dy = 0;
                this.grounded = true;
                this.y = groundHeight - this.h;
            }
            this.Draw();
        }

        Jump() {
            if (this.grounded && this.jumpTimer > 2) { // Keep jump cooldown simple
                this.dy = -this.jumpForce;
                this.jumpTimer = 0;
            }
        }

        Draw() {
            ctx.save();
            ctx.fillStyle = '#9d6b53'; const bodyY = this.y + 10; const bodyH = this.h - 10;
            ctx.fillRect(this.x, bodyY, this.w, bodyH);
            ctx.fillStyle = '#7a523a'; ctx.fillRect(this.x + 10, bodyY + bodyH, 10, 10); ctx.fillRect(this.x + this.w - 20, bodyY + bodyH, 10, 10);
            ctx.fillStyle = '#b58a70'; ctx.fillRect(this.x + (this.w - 25), this.y, 25, 25);
            ctx.fillStyle = '#9d6b53'; ctx.fillRect(this.x + this.w - 20, this.y - 5, 8, 8);
            ctx.fillStyle = '#000000'; ctx.fillRect(this.x + this.w - 15, this.y + 5, 5, 5);
            ctx.fillStyle = '#7a523a'; ctx.fillRect(this.x + this.w - 5, this.y + 15, 5, 5);
            ctx.restore();
        }
    }

    class Obstacle {
        constructor(x, y, w, h) {
            this.x = x; this.y = y; this.w = w; this.h = h;
            this.dx = -gameSpeed;
        }
        Update(deltaTime) { 
            this.dx = -gameSpeed;
            this.x += this.dx * deltaTime * 60;
            this.Draw(); 
        }
        Draw() {
            ctx.fillStyle = '#664028'; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#855a40'; ctx.fillRect(this.x + 5, this.y, this.w - 10, 5);
            ctx.fillRect(this.x, this.y + this.h - 5, this.w, 5);
        }
    }

    class Text { constructor(t, x, y, a, c, s) { this.t = t; this.x = x; this.y = y; this.a = a; this.c = c; this.s = s; } Draw() { ctx.fillStyle = this.c; ctx.font = this.s + "px 'Noto Sans KR', sans-serif"; ctx.textAlign = this.a; ctx.fillText(this.t, this.x, this.y); } }

    function SpawnObstacle() { let size = RandomIntInRange(20, 50); obstacles.push(new Obstacle(canvas.width + size, canvas.height - size - 30, size, size)); }
    function RandomIntInRange(min, max) { return Math.round(Math.random() * (max - min) + min); }

    function Start() {
        gameState = 'running';
        gameSpeed = 4.5; gravity = 0.6; score = 0; obstacles = [];
        highscore = localStorage.getItem('highscore') || 0;
        player = new Player(25, 0, 50, 40);
        lastTime = performance.now(); // Reset lastTime on start
        resizeCanvas(); 
        requestAnimationFrame(Update);
    }

    function GameOver() {
        gameState = 'game-over';
        localStorage.setItem('highscore', highscore);
        setTimeout(() => { gameState = 'pre-start'; resizeCanvas(); }, 1500);
    }

    function Update(currentTime) {
        if (gameState !== 'running') return;
        const deltaTime = (currentTime - lastTime) / 1000; // Time in seconds
        lastTime = currentTime;

        requestAnimationFrame(Update);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        DrawGround();

        spawnTimer -= deltaTime * 60; // Scale spawn timer
        if (spawnTimer <= 0) {
            SpawnObstacle();
            spawnTimer = initialSpawnTimer - gameSpeed * 8;
            if (spawnTimer < 60) spawnTimer = 60;
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            let o = obstacles[i];
            if (o.x + o.w < 0) { obstacles.splice(i, 1); }
            else { 
                if (player.x < o.x + o.w && player.x + player.w > o.x && player.y < o.y + o.h && player.y + player.h > o.y) {
                    GameOver(); return;
                }
                o.Update(deltaTime); 
            }
        }

        player.Animate(deltaTime);
        score++; scoreText.t = "점수: " + score;
        if (score > highscore) { highscore = score; highscoreText.t = "최고점수: " + highscore; }
        scoreText.Draw(); highscoreText.Draw();
        gameSpeed += 0.003 * deltaTime * 60; // Scale speed increase
    }

    function DrawGround() { ctx.fillStyle = '#78a860'; ctx.fillRect(0, canvas.height - 30, canvas.width, 30); }

    function DrawPreStart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        DrawGround();
        const btnW = 200, btnH = 50, btnX = (canvas.width - btnW) / 2, btnY = (canvas.height - btnH) / 2;
        ctx.fillStyle = '#c5a987'; ctx.fillRect(btnX, btnY, btnW, btnH);
        ctx.fillStyle = 'white'; ctx.font = "20px 'Noto Sans KR', sans-serif"; ctx.textAlign = 'center';
        ctx.fillText('게임 시작', canvas.width / 2, btnY + 32);
    }

    function resizeCanvas() {
        const container = canvas.parentElement;
        if (container.clientWidth > 0) {
            const newWidth = container.clientWidth;
            canvas.width = newWidth;
            // Responsive aspect ratio
            if (newWidth <= 768) {
                canvas.height = newWidth; // 1:1 ratio for mobile
            } else {
                canvas.height = newWidth * 0.5; // Wider ratio for desktop
            }

            scoreText = new Text("점수: " + (score || 0), 25, 35, "left", "#212121", "20");
            highscoreText = new Text("최고점수: " + (highscore || 0), canvas.width - 25, 35, "right", "#212121", "20");
            if (gameState === 'pre-start') { DrawPreStart(); }
        }
    }

    resizeCanvas(); 
});
