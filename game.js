document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    let score, scoreText, highscore, highscoreText, player, gravity, gameSpeed;
    let obstacles = [];
    let keys = {};
    let initialSpawnTimer = 200;
    let spawnTimer = initialSpawnTimer;
    let gameState = 'pre-start'; // 'pre-start', 'running', 'game-over'

    // Frame-rate independence
    let lastTime = 0;

    // --- Event Listeners ---
    document.addEventListener('keydown', (evt) => { 
        if (evt.code === 'Space' || evt.code === 'ArrowUp') {
            evt.preventDefault();
            keys[evt.code] = true; 
        }
    });
    document.addEventListener('keyup', (evt) => { keys[evt.code] = false; });
    canvas.addEventListener('touchstart', handleInteraction, { passive: false });
    canvas.addEventListener('click', handleInteraction);
    window.addEventListener('resize', resizeCanvas);
    window.addEventListener('showgametab', resizeCanvas); // Custom event when tab is shown

    function handleInteraction(e) {
        e.preventDefault();
        
        if (gameState === 'running') {
            player.Jump();
        } else { // 'pre-start' or 'game-over'
            const rect = canvas.getBoundingClientRect();
            const clickEvent = e.type === 'touchstart' ? e.touches[0] : e;
            const x = clickEvent.clientX - rect.left;
            const y = clickEvent.clientY - rect.top;
            const btn = getButtonCoords();
            if (x >= btn.x && x <= btn.x + btn.w && y >= btn.y && y <= btn.y + btn.h) {
                Start();
            }
        }
    }

    function getButtonCoords() {
        const btnW = 200, btnH = 60;
        const btnX = (canvas.width - btnW) / 2;
        let btnY = (gameState === 'game-over') ? canvas.height / 2 + 40 : (canvas.height - btnH) / 2;
        return { x: btnX, y: btnY, w: btnW, h: btnH };
    }


    // --- Classes ---
    class Player {
        constructor(x, y, w, h) {
            this.x = x; this.y = y; this.w = w; this.h = h;
            this.dy = 0; this.jumpForce = 12;
            this.originalHeight = h; this.grounded = false; this.jumpTimer = 0;
        }

        Animate(deltaTime) {
            if ((keys['Space'] || keys['ArrowUp']) && this.grounded) { this.Jump(); }

            this.jumpTimer += deltaTime * 60;
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
            if (this.grounded && this.jumpTimer > 2) {
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
            ctx.fillStyle = '#8b4513'; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#a0522d'; ctx.fillRect(this.x + 4, this.y, this.w - 8, 4);
            ctx.fillRect(this.x, this.y + this.h - 4, this.w, 4);
        }
    }

    class Text { constructor(t, x, y, a, c, s) { this.t = t; this.x = x; this.y = y; this.a = a; this.c = c; this.s = s; } Draw() { ctx.fillStyle = this.c; ctx.font = this.s + "px 'Jua', sans-serif"; ctx.textAlign = this.a; ctx.fillText(this.t, this.x, this.y); } }

    function SpawnObstacle() {
        let size = RandomIntInRange(25, 60);
        let yPos = canvas.height - size - 30;
        obstacles.push(new Obstacle(canvas.width + size, yPos, size, size));
    }

    function RandomIntInRange(min, max) { return Math.round(Math.random() * (max - min) + min); }

    function Start() {
        gameState = 'running';
        gameSpeed = 4.5; gravity = 0.6; score = 0; obstacles = [];
        highscore = localStorage.getItem('capy-highscore') || 0;
        player = new Player(25, 0, 50, 40);
        lastTime = performance.now();
        resizeCanvas();
        requestAnimationFrame(Update);
    }

    function GameOver() {
        gameState = 'game-over';
        localStorage.setItem('capy-highscore', highscore);
        DrawGameOver();
    }

    function Update(currentTime) {
        if (gameState !== 'running') return;
        const deltaTime = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        requestAnimationFrame(Update);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        DrawGround();

        spawnTimer -= deltaTime * 60;
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
                    GameOver();
                    return;
                }
                o.Update(deltaTime);
            }
        }

        player.Animate(deltaTime);

        score++; scoreText.t = "점수: " + score;
        if (score > highscore) { highscore = score; highscoreText.t = "최고점수: " + highscore; }

        scoreText.Draw(); highscoreText.Draw();
        gameSpeed += 0.003 * deltaTime * 60;
    }

    function DrawGround() {
        ctx.fillStyle = '#d2b48c'; ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; ctx.fillRect(0, canvas.height - 30, canvas.width, 5);
    }

    function DrawStyledButton(text) {
        const btn = getButtonCoords();
        ctx.fillStyle = '#e9967a'; ctx.strokeStyle = '#d2691e'; ctx.lineWidth = 4;
        
        ctx.beginPath();
        ctx.roundRect(btn.x, btn.y, btn.w, btn.h, [20]);
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = 'white'; ctx.font = "bold 24px 'Jua', sans-serif";
        ctx.textAlign = 'center'; ctx.fillText(text, canvas.width / 2, btn.y + 38);
    }

    function DrawPreStart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        DrawGround();
        DrawStyledButton('게임 시작');
    }

    function DrawGameOver() {
        ctx.fillStyle = 'rgba(255, 250, 240, 0.7)'; ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#d2691e'; ctx.font = "bold 60px 'Jua', sans-serif";
        ctx.textAlign = 'center'; ctx.fillText('게임 오버!', canvas.width / 2, canvas.height / 2 - 60);
        ctx.fillStyle = '#5d4037'; ctx.font = "30px 'Jua', sans-serif";
        ctx.fillText('최종 점수: ' + score, canvas.width / 2, canvas.height / 2);
        DrawStyledButton('다시 시작');
    }

    function resizeCanvas() {
        const container = canvas.parentElement;
        if (container.clientWidth > 0) {
            canvas.width = container.clientWidth;
            canvas.height = 400;

            scoreText = new Text("점수: " + (score || 0), 25, 45, "left", "#5d4037", "24");
            highscoreText = new Text("최고점수: " + (highscore || 0), canvas.width - 25, 45, "right", "#a0522d", "24");

            if (gameState === 'pre-start') DrawPreStart();
            else if (gameState === 'game-over') DrawGameOver();
            else DrawGround();
        }
    }
    
    resizeCanvas();
});