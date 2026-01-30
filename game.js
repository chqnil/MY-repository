document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');

    let score, scoreText, highscore, highscoreText, player, gravity, gameSpeed;
    let obstacles = [];
    let keys = {};
    let initialSpawnTimer = 200;
    let spawnTimer = initialSpawnTimer;
    let gameState = 'pre-start'; // 'pre-start', 'running', 'game-over'

    // --- Event Listeners ---
    document.addEventListener('keydown', (evt) => { keys[evt.code] = true; });
    document.addEventListener('keyup', (evt) => { keys[evt.code] = false; });
    canvas.addEventListener('click', handleCanvasClick);

    // --- Classes ---
    class Player {
        constructor(x, y, w, h) {
            this.x = x; this.y = y; this.w = w; this.h = h;
            this.dy = 0; this.jumpForce = 15; this.originalHeight = h;
            this.grounded = false; this.jumpTimer = 0;
        }

        Animate() {
            if ((keys['Space'] || keys['KeyW']) && this.grounded) {
                this.Jump();
            }
            this.jumpTimer++;
            this.y += this.dy;

            const groundHeight = canvas.height - 30;
            if (this.y + this.h < groundHeight) {
                this.dy += gravity;
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
            ctx.translate(this.x, this.y);
            // Body, Head, Ear, Eye, Legs drawing logic...
            ctx.fillStyle = '#9d6b53'; ctx.fillRect(0, 10, this.w, this.h - 10);
            ctx.fillStyle = '#b58a70'; ctx.fillRect(this.w - 20, 0, 25, 25);
            ctx.fillStyle = '#9d6b53'; ctx.fillRect(this.w - 15, -5, 8, 8);
            ctx.fillStyle = '#000000'; ctx.fillRect(this.w - 10, 5, 5, 5);
            ctx.fillStyle = '#7a523a'; ctx.fillRect(10, this.h, 10, 10);
            ctx.fillRect(this.w - 20, this.h, 10, 10);
            ctx.restore();
        }
    }

    class Obstacle {
        constructor(x, y, w, h) {
            this.x = x; this.y = y; this.w = w; this.h = h;
            this.dx = -gameSpeed;
        }

        Update() { this.x += this.dx; this.Draw(); this.dx = -gameSpeed; }

        Draw() {
            ctx.fillStyle = '#664028'; ctx.fillRect(this.x, this.y, this.w, this.h);
            ctx.fillStyle = '#855a40'; ctx.fillRect(this.x + 5, this.y, this.w - 10, 5);
            ctx.fillRect(this.x, this.y + this.h - 5, this.w, 5);
        }
    }

    class Text {
        constructor(t, x, y, a, c, s) {
            this.t = t; this.x = x; this.y = y;
            this.a = a; this.c = c; this.s = s;
        }
        Draw() {
            ctx.fillStyle = this.c;
            ctx.font = this.s + "px 'Noto Sans KR', sans-serif";
            ctx.textAlign = this.a;
            ctx.fillText(this.t, this.x, this.y);
        }
    }

    // --- Game Functions ---
    function SpawnObstacle() {
        let size = RandomIntInRange(20, 50); // Obstacle size also adjusted
        let obstacle = new Obstacle(canvas.width + size, canvas.height - size - 30, size, size);
        obstacles.push(obstacle);
    }

    function RandomIntInRange(min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    function Start() {
        gameState = 'running';
        gameSpeed = 3; gravity = 1; score = 0; obstacles = [];
        highscore = localStorage.getItem('highscore') || 0;
        player = new Player(25, 0, 40, 30); // Player size changed here
        scoreText = new Text("점수: " + score, 25, 25, "left", "#212121", "20");
        highscoreText = new Text("최고점수: " + highscore, canvas.width - 25, 25, "right", "#212121", "20");
        requestAnimationFrame(Update);
    }

    function GameOver() {
        gameState = 'game-over';
        localStorage.setItem('highscore', highscore);
        setTimeout(() => { gameState = 'pre-start'; DrawPreStart(); }, 2000);
    }

    function Update() {
        if (gameState !== 'running') return;
        requestAnimationFrame(Update);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        DrawGround();

        spawnTimer--;
        if (spawnTimer <= 0) {
            SpawnObstacle();
            spawnTimer = initialSpawnTimer - gameSpeed * 8;
            if (spawnTimer < 60) spawnTimer = 60;
        }

        for (let i = obstacles.length - 1; i >= 0; i--) {
            let o = obstacles[i];
            if (o.x + o.w < 0) {
                obstacles.splice(i, 1);
            } else {
                if (player.x < o.x + o.w && player.x + player.w > o.x &&
                    player.y < o.y + o.h && player.y + player.h > o.y) {
                    GameOver();
                    return;
                }
                o.Update();
            }
        }

        player.Animate();
        score++;
        scoreText.t = "점수: " + score;
        if (score > highscore) {
            highscore = score;
            highscoreText.t = "최고점수: " + highscore;
        }
        scoreText.Draw();
        highscoreText.Draw();
        gameSpeed += 0.003;
    }

    function DrawGround() {
        ctx.fillStyle = '#78a860';
        ctx.fillRect(0, canvas.height - 30, canvas.width, 30);
    }

    function DrawPreStart() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        DrawGround();
        const buttonWidth = 200;
        const buttonHeight = 50;
        const buttonX = (canvas.width - buttonWidth) / 2;
        const buttonY = (canvas.height - buttonHeight) / 2;

        ctx.fillStyle = '#c5a987';
        ctx.fillRect(buttonX, buttonY, buttonWidth, buttonHeight);

        ctx.fillStyle = 'white';
        ctx.font = "20px 'Noto Sans KR', sans-serif";
        ctx.textAlign = 'center';
        ctx.fillText('게임 시작', canvas.width / 2, buttonY + 32);
    }

    function handleCanvasClick(event) {
        if (gameState === 'pre-start') {
            const rect = canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            const buttonWidth = 200;
            const buttonHeight = 50;
            const buttonX = (canvas.width - buttonWidth) / 2;
            const buttonY = (canvas.height - buttonHeight) / 2;

            if (x >= buttonX && x <= buttonX + buttonWidth && y >= buttonY && y <= buttonY + buttonHeight) {
                Start();
            }
        }
    }

    // Initial Draw
    DrawPreStart();
});
