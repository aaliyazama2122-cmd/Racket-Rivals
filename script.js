function restartGame(){

    playerScore = 0;
    enemyScore = 0;

    gameOver = false;
    winner = "";

    isPaused = false;

    confettiActive = false;
    confettiTriggered = false;
    playerWinConfetti = [];

    playerX = 400;
    playerY = 400;

    enemyX = 900;
    enemyY = 400;

    resetShuttle();

    if(restartButton){
        restartButton.remove();
        restartButton = null;
    }

    if(menuButton){
        menuButton.remove();
        menuButton = null;
    }

    pauseMenu.style.display = "none";
    pauseBtn.style.display = "flex";

}

const backgroundImage = new Image();

backgroundImage.src =
"images/court-background.png";

let playerScore = 0;
let enemyScore = 0;
let gameOver = false;
let winner = "";
let restartButton = null;
let menuButton = null;

let isPaused = false;

const playerImage = new Image();
playerImage.src = "images/puppy-left.png";

const enemyImage = new Image();
enemyImage.src = "images/puppy-right.png";

const shuttleImage = new Image();
shuttleImage.src = "images/imagesshuttle.png";

// =========================
// GAME SOUNDS
// =========================

const playerHitSound = new Audio("sounds/player-hit.mp3");
const aiHitSound = new Audio("sounds/ai-hit.mp3");
const pointSound = new Audio("sounds/point.mp3");
const winSound = new Audio("sounds/win.mp3");
const loseSound = new Audio("sounds/lose.mp3");
const buttonSound = new Audio("sounds/button.mp3");

const backgroundMusic = new Audio("sounds/background.mp3");

backgroundMusic.loop = true;
backgroundMusic.volume = 0.35;
backgroundMusic.currentTime = 4;

let musicEnabled = true;
let soundEnabled = true;

function playSound(sound){

    if(!soundEnabled){
        return;
    }

    sound.currentTime = 0;
    sound.play().catch(() => {});

}

function playMusic(){

    if(!musicEnabled){
        return;
    }

    if(parseFloat(musicVolume.value) <= 0){
        return;
    }

    backgroundMusic.volume =
        parseFloat(musicVolume.value);

    backgroundMusic.play().catch(() => {});

}

let shuttleX = 650;
let shuttleY = 250;

let shuttleSpeedX = 0;
let shuttleSpeedY = 0;

let shuttleFlying = false;
let shuttleInHand = true;

let servingPlayer = "player";

let aiHitCooldown = 0;

let shuttleMaxSpeed = 4.5;
let gravity = 0.06;

let aiTargetX = 1050;
let aiReactionTimer = 0;

let playerX = 400;
let playerY = 400;
let moveLeft = false;
let moveRight = false;
let isHitting = false;
let canHit = true;

let enemyX = 900;
let enemyY = 400;
const leftCourt = 300;
const rightCourt = 1380;
const topCourt = 220;
let animationTime = 0;
let boardSwing = 0;

// =========================
// PLAYER WIN CONFETTI
// =========================

let playerWinConfetti = [];
let confettiActive = false;
let confettiTriggered = false;

// Difficulty
let difficulty = "Medium";

let aiSpeed = 3;
let aiReaction = 0.08;
let aiAccuracy = 45;
let aiHitChance = 0.8;

// ===========================
// MAIN ELEMENTS
// ===========================

const startBtn =
document.getElementById("startBtn");

const settingBtn =
document.getElementById("settingBtn");

const settingsPanel =
document.getElementById("settingsPanel");

const closeSettings =
document.getElementById("closeSettingsBtn");

// =========================
// SETTINGS CONTROLS
// =========================

const musicToggle =
document.getElementById("musicToggle");

const soundToggle =
document.getElementById("soundToggle");

const musicVolume =
document.getElementById("musicVolume");


// =========================
// MUSIC TOGGLE
// =========================

musicToggle.onclick = function(){

    musicEnabled = !musicEnabled;

    if(musicEnabled){

        musicToggle.innerText = "ON";
        musicToggle.classList.remove("off");

        playMusic();

    } else {

        musicToggle.innerText = "OFF";
        musicToggle.classList.add("off");

        backgroundMusic.pause();

    }

};


// =========================
// SOUND EFFECT TOGGLE
// =========================

soundToggle.onclick = function(){

    soundEnabled = !soundEnabled;

    if(soundEnabled){

        soundToggle.innerText = "ON";
        soundToggle.classList.remove("off");

    } else {

        soundToggle.innerText = "OFF";
        soundToggle.classList.add("off");

    }

};


// =========================
// MUSIC VOLUME
// =========================

function updateVolumeTrack(){
    if(musicVolume){
        const val = parseFloat(musicVolume.value) || 0;
        const percent = Math.round(val * 100);
        musicVolume.style.setProperty('--vol-fill', percent + '%');
    }
}
updateVolumeTrack();

musicVolume.addEventListener("input", function(){

    let volume =
        parseFloat(this.value);

    backgroundMusic.volume = volume;
    updateVolumeTrack();

    if(musicEnabled && volume > 0){

        playMusic();

    }

});

settingBtn.onclick = function(){

    playSound(buttonSound);
    settingsPanel.style.display = "flex";
    updateVolumeTrack();

};


closeSettings.onclick = function(){

    playSound(buttonSound);
    settingsPanel.style.display = "none";

};

const menu =
document.getElementById("menu");

const canvas =
document.getElementById("gameCanvas");

const ctx =
canvas.getContext("2d");


// ===========================
// DIFFICULTY SCREEN
// ===========================

const difficultyScreen =
document.getElementById("difficultyScreen");

const easyBtn =
document.getElementById("easyBtn");

const mediumBtn =
document.getElementById("mediumBtn");

const hardBtn =
document.getElementById("hardBtn");


// ===========================
// DIFFICULTY SETTINGS
// ===========================

function setDifficulty(level){

    difficulty = level;

    if(level === "Easy"){

    aiSpeed = 1.8;
    aiReaction = 14;
    aiAccuracy = 60;
    aiHitChance = 0.40;

     }

    if(level === "Medium"){

        aiSpeed = 2.4;
        aiReaction = 8;
        aiAccuracy = 12;
        aiHitChance = 0.88;

    }

    if(level === "Hard"){

        aiSpeed = 3.5;
        aiReaction = 3;
        aiAccuracy = 8;
        aiHitChance = 0.95;

    }

}

setDifficulty("Medium");

ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = "high";


startBtn.onclick = function(){

    playSound(buttonSound);

    playMusic();

    console.log("START WORKS!");

    menu.style.display = "none";

    difficultyScreen.style.display = "flex";

};

function startGameWithDifficulty(level){

    difficultyScreen.style.display = "none";

    canvas.style.display = "block";

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    setDifficulty(level);

    // =========================
    // START WITH SHUTTLE IN HAND
    // =========================

    shuttleFlying = false;
    shuttleInHand = true;

    shuttleSpeedX = 0;
    shuttleSpeedY = 0;

    shuttleX = playerX + 60;
    shuttleY = playerY - 4;

    aiTargetX = 1050;
    aiReactionTimer = 0;

    pauseBtn.style.display = "flex";

    pauseMenu.style.display = "none";

    gameLoop();

}


// ===========================
// DIFFICULTY BUTTONS
// ===========================

easyBtn.addEventListener("click", function(){

    playSound(buttonSound);

    startGameWithDifficulty("Easy");

});

mediumBtn.addEventListener("click", function(){

    playSound(buttonSound);

    startGameWithDifficulty("Medium");

});


hardBtn.addEventListener("click", function(){

    playSound(buttonSound);

    startGameWithDifficulty("Hard");

});

// ===========================
// PAUSE SYSTEM
// ===========================

const pauseBtn =
document.getElementById("pauseBtn");

const pauseMenu =
document.getElementById("pauseMenu");

const resumeBtn =
document.getElementById("resumeBtn");

const homeBtn =
document.getElementById("homeBtn");


// Hide pause button when game is not running

pauseBtn.style.display = "none";


// ===========================
// PAUSE BUTTON
// ===========================

pauseBtn.onclick = function(){

    playSound(buttonSound);

    if(isPaused){

        resumeGame();

    } else {

        pauseGame();

    }

};


// ===========================
// PAUSE GAME
// ===========================

function pauseGame(){

    if(gameOver){
        return;
    }

    isPaused = true;

    pauseMenu.style.display = "flex";

};


// ===========================
// RESUME GAME
// ===========================

resumeBtn.onclick = function(){

    playSound(buttonSound);

    resumeGame();

};


function resumeGame(){

    isPaused = false;

    pauseMenu.style.display = "none";

    gameLoop();

};


// ===========================
// MAIN MENU BUTTON
// ===========================

homeBtn.onclick = function(){

    playSound(buttonSound);

    goToHome();

};


// ===========================
// GO BACK TO HOME
// ===========================

function goToHome(){

    isPaused = false;

    // Hide pause menu
    pauseMenu.style.display = "none";

    // Hide pause button
    pauseBtn.style.display = "none";


    // Reset game

    playerScore = 0;

    enemyScore = 0;

    gameOver = false;

    winner = "";

    playerX = 400;
    playerY = 400;

    enemyX = 900;
    enemyY = 400;

    resetShuttle();


    // Remove game-over buttons

    if(restartButton){

        restartButton.remove();

        restartButton = null;

    }

    if(menuButton){

        menuButton.remove();

        menuButton = null;

    }


    // Show main menu

    canvas.style.display = "none";

    menu.style.display = "block";

    difficultyScreen.style.display = "none";

}

CanvasRenderingContext2D.prototype.roundRect = function(x,y,w,h,r){

    this.beginPath();

    this.moveTo(x+r,y);

    this.arcTo(x+w,y,x+w,y+h,r);

    this.arcTo(x+w,y+h,x,y+h,r);

    this.arcTo(x,y+h,x,y,r);

    this.arcTo(x,y,x+w,y,r);

    this.closePath();

    return this;

}

function drawGame(){

    ctx.drawImage(
    backgroundImage,
    0,
    0,
    canvas.width,
    canvas.height
);
    
    
        // Left Puppy

        ctx.fillStyle =
"rgba(0,0,0,0.15)";

ctx.beginPath();

ctx.ellipse(
    playerX,
    playerY + 45,
    40,
    15,
    0,
    0,
    Math.PI * 2
);

ctx.fill();

   let playerBounce =
Math.sin(animationTime) * 5;

let hitOffset = 0;

if(isHitting){

    hitOffset = 20;

}

ctx.drawImage(
    playerImage,
    playerX - 72 + hitOffset,
    playerY - 72 + playerBounce,
    145,
    145
);

    // Right Puppy

    ctx.beginPath();

ctx.ellipse(
    enemyX,
    enemyY + 45,
    40,
    15,
    0,
    0,
    Math.PI * 2
);

ctx.fill();

  let enemyBounce =
Math.sin(animationTime + 1) * 5;

ctx.drawImage(
    enemyImage,
    enemyX - 72,
    enemyY - 72 + enemyBounce,
    145,
    145
);

// =========================
// CUTE HANGING SCORE BOARDS
// =========================

// ---------- LEFT BOARD ----------

// strings
ctx.strokeStyle = "#ffffff";
ctx.lineWidth = 5;

ctx.beginPath();
ctx.moveTo(260,0);
ctx.lineTo(260,55);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(360,0);
ctx.lineTo(360,55);
ctx.stroke();

// shadow
ctx.fillStyle="rgba(0,0,0,.12)";
ctx.save();

ctx.translate(310,94);
ctx.rotate(Math.sin(boardSwing)*0.025);

ctx.translate(-310,-94);

ctx.beginPath();
ctx.roundRect(218,38,185,112,25);
ctx.fill();

// board
ctx.fillStyle="#ffd7e8";
ctx.beginPath();
ctx.roundRect(218,38,185,112,25);
ctx.fill();

ctx.strokeStyle="#ff8fc0";
ctx.lineWidth=4;
ctx.stroke();


// hearts
ctx.fillStyle="#ff8fc0";
ctx.font="20px Arial";
ctx.fillText("♥",248,86);
ctx.fillText("♥",372,86);

// title
ctx.fillStyle="#ff5ea8";
ctx.font="bold 26px 'Press Start 2P'";
ctx.textAlign = "center";
ctx.fillText("YOU",310,82);

// score box
ctx.fillStyle="white";
ctx.beginPath();
ctx.roundRect(257,102,105,40,18);
ctx.fill();

// score
ctx.fillStyle="#ff5ea8";
ctx.font="bold 38px Arial";
ctx.fillText(playerScore,310,133);
ctx.restore();



// ---------- RIGHT BOARD ----------

// strings
ctx.strokeStyle="#ffffff";
ctx.lineWidth=5;

ctx.beginPath();
ctx.moveTo(canvas.width-360,0);
ctx.lineTo(canvas.width-360,55);
ctx.stroke();

ctx.beginPath();
ctx.moveTo(canvas.width-260,0);
ctx.lineTo(canvas.width-260,55);
ctx.stroke();

// shadow
ctx.fillStyle="rgba(0,0,0,.12)";
ctx.save();

ctx.translate(canvas.width-310,94);
ctx.rotate(-Math.sin(boardSwing)*0.025);

ctx.translate(-(canvas.width-310),-94);
ctx.beginPath();
ctx.roundRect(canvas.width-402,38,185,112,25);
ctx.fill();

// board
ctx.fillStyle="#ffd7e8";
ctx.beginPath();
ctx.roundRect(canvas.width-402,38,185,112,25);
ctx.fill();

ctx.strokeStyle="#ff8fc0";
ctx.lineWidth=4;
ctx.stroke();


// hearts
ctx.fillStyle="#ff8fc0";
ctx.font="20px Arial";
ctx.fillText("♥",canvas.width-372,86);
ctx.fillText("♥",canvas.width-248,86);

// title
ctx.fillStyle="#ff5ea8";
ctx.font="bold 26px 'Press Start 2P'";
ctx.textAlign = "center";
ctx.fillText("AI",canvas.width-310,82);

// score box
ctx.fillStyle="white";
ctx.beginPath();
ctx.roundRect(canvas.width-362,102,105,40,18);
ctx.fill();

// score
ctx.fillStyle="#ff5ea8";
ctx.font="bold 38px Arial";
ctx.fillText(enemyScore,canvas.width-310,133);
ctx.restore();

ctx.textAlign="left";

// PLAYER WIN CONFETTI
// Draw BEFORE the result card
// so the card stays on top.

updateAndDrawPlayerConfetti();

if(gameOver){


    // dark overlay
    ctx.fillStyle="rgba(255,255,255,0.35)";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // popup
    ctx.fillStyle="#ffe3ef";
    ctx.strokeStyle="#ff9cc8";
    ctx.lineWidth=6;

    ctx.beginPath();
    ctx.roundRect(
        canvas.width/2-220,
        canvas.height/2-180,
        440,
        170,
        30
    );
    ctx.fill();
    ctx.stroke();

    // title
    ctx.fillStyle="#ff5ea8";
    ctx.font="bold 40px Arial";
    ctx.textAlign="center";
    ctx.fillText(
        winner,
        canvas.width/2,
        canvas.height/2-90
    );

    // subtitle
    ctx.fillStyle="#777";
    ctx.font="22px Arial";
    ctx.fillText(
        "Great Match!",
        canvas.width/2,
        canvas.height/2-45
    );

    ctx.textAlign="left";
}

}

document.addEventListener("keydown", (event) => {

    if(event.key === "ArrowLeft"){
        moveLeft = true;
    }

    if(event.key === "ArrowRight"){
        moveRight = true;
    }

    if(event.code === "Space"){

        event.preventDefault();

        // =========================
        // SERVE / HIT SHUTTLE
        // =========================

        if(shuttleInHand && !shuttleFlying && !gameOver){

            shuttleInHand = false;
            shuttleFlying = true;

            // Start exactly near the player's racket
            shuttleX = playerX + 60;
            shuttleY = playerY - 4;

            // Smooth serve
            shuttleSpeedX = 2.8;
            shuttleSpeedY = -4.6;

            canHit = false;

        }

        // Player animation
        isHitting = true;

    }

});

document.addEventListener("keyup", (event) => {

    if(event.key === "ArrowLeft"){
        moveLeft = false;
    }

    if(event.key === "ArrowRight"){
        moveRight = false;
    }

    if(event.code === "Space"){
        isHitting = false;
        canHit = true;
    }

});

function gameLoop(){

    if(isPaused){

        return;

    }

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    

    animationTime += 0.1;
    boardSwing += 0.04;
   

    if(moveLeft){
    playerX -= 5;
}

if(moveRight){
    playerX += 5;
}

if(playerX < 320){
    playerX = 320;
}

if(playerX > 700){
    playerX = 700;
}

// ===========================
// AI MOVEMENT
// ===========================

if(shuttleFlying && !gameOver){

    aiReactionTimer--;

    if(aiReactionTimer <= 0){

        // Only react when shuttle is coming toward AI
        if(shuttleSpeedX > 0 && shuttleX > 700){

            // Predict where shuttle will be shortly
            let predictedX =
                shuttleX + shuttleSpeedX * 18;

            // Small Easy-mode mistake
            predictedX +=
                (Math.random() - 0.5) * aiAccuracy;

            // Keep AI on its side
            if(predictedX < 900){
                predictedX = 900;
            }

            if(predictedX > 1180){
                predictedX = 1180;
            }

            aiTargetX = predictedX;

        } else {

            // Return to a comfortable position
            aiTargetX = 1050;

        }

        aiReactionTimer = aiReaction;

    }

}


// Move AI smoothly toward target

if(enemyX < aiTargetX){

    enemyX += aiSpeed;

}

if(enemyX > aiTargetX){

    enemyX -= aiSpeed;

}


// Keep AI inside its court

if(enemyX < 900){

    enemyX = 900;

}

if(enemyX > 1180){

    enemyX = 1180;

}

// =========================
// SHUTTLE PHYSICS
// =========================

// Shuttle stays in player's hand
if(shuttleInHand && !shuttleFlying && !gameOver){

    shuttleX = playerX - 28;
    shuttleY = playerY - 5;

}


// Shuttle is flying
if(shuttleFlying && !gameOver){

    // Horizontal movement
    shuttleX += shuttleSpeedX;

    // Vertical movement
    shuttleY += shuttleSpeedY;

    // Gentle gravity
    shuttleSpeedY += gravity;

    // Tiny air resistance
    shuttleSpeedX *= 0.999;

}

// =========================
// PLAYER HIT
// =========================

let dx = shuttleX - playerX;
let dy = shuttleY - playerY;

let distance =
Math.sqrt(dx * dx + dy * dy);

if(
    shuttleFlying &&
    distance < 125 &&
    isHitting &&
    canHit &&
    shuttleSpeedX < 0
){

    // Smooth player return
    shuttleSpeedX = 2.8;
    shuttleSpeedY = -4.6;

    canHit = false;

    playSound(playerHitSound);

}

// =========================
// AI HIT
// =========================

// AI racket position
// The racket is to the LEFT and slightly ABOVE the puppy
let aiRacketX = enemyX - 45;
let aiRacketY = enemyY - 20;

// Distance between shuttle and AI racket
let racketDX = shuttleX - aiRacketX;
let racketDY = shuttleY - aiRacketY;

let racketDistance = Math.sqrt(
    racketDX * racketDX +
    racketDY * racketDY
);

if(aiHitCooldown > 0){

    aiHitCooldown--;

}

// Shuttle must actually be close to the racket
let shuttleNearRacket =
    racketDistance < 55;

// Shuttle must be coming downward
let shuttleDescending =
    shuttleSpeedY > 0;

if(
    shuttleFlying &&
    shuttleSpeedX > 0 &&
    shuttleNearRacket &&
    shuttleDescending &&
    aiHitCooldown <= 0
){

    // Easy AI has a chance to miss
    if(Math.random() < aiHitChance){

    // Send shuttle back toward player
    shuttleSpeedX = -2.8;

    // Smooth upward hit
    shuttleSpeedY = -4.6;

    // Play AI hit sound
    playSound(aiHitSound);

    // Short cooldown prevents double-hitting
    aiHitCooldown = 30;

    // Player is now allowed to hit
    canHit = true;

    }

}

if(shuttleY > canvas.height - 180){

    if(shuttleX < canvas.width / 2){

        enemyScore++;

        playSound(pointSound);

    } else {

        playerScore++;

        playSound(pointSound);

    }

    resetShuttle();

}

   // =========================
// KEEP SHUTTLE IN PLAYER'S HAND
// =========================

if(shuttleInHand){

    shuttleX = playerX + 60;
    shuttleY = playerY - 4;

}

    drawGame();

if(!gameOver){

    ctx.drawImage(
        shuttleImage,
        shuttleX - 15,
        shuttleY - 15,
        30,
        30
    );

}

requestAnimationFrame(
    gameLoop
);

if(playerScore >= 5 && !gameOver){

    gameOver = true;
    winner = "YOU WIN!";

    // Play victory sound
    playSound(winSound);

    // START PLAYER WIN CONFETTI
    startPlayerWinConfetti();

    showGameOverButtons();

}

if(enemyScore >= 5 && !gameOver){

    gameOver = true;
    winner = "COMPUTER WINS!";

    playSound(loseSound);

    showGameOverButtons();

}
}

function resetShuttle(){

    // Put shuttle back in player's hand
    shuttleInHand = true;
    shuttleFlying = false;

    shuttleX = playerX + 60;
    shuttleY = playerY - 4;

    shuttleSpeedX = 0;
    shuttleSpeedY = 0;

    aiTargetX = 1050;

    aiReactionTimer = 0;

    aiHitCooldown = 0;

    canHit = true;

}

// =========================
// PLAYER WIN CONFETTI EFFECT
// =========================

function startPlayerWinConfetti(){

    // Make sure it only triggers once
    if(confettiTriggered){
        return;
    }

    confettiTriggered = true;
    confettiActive = true;
    playerWinConfetti = [];

    const piecesPerSide = 24;

    // LEFT SIDE
    for(let i = 0; i < piecesPerSide; i++){

        playerWinConfetti.push(
            createConfettiPiece("left")
        );

    }

    // RIGHT SIDE
    for(let i = 0; i < piecesPerSide; i++){

        playerWinConfetti.push(
            createConfettiPiece("right")
        );

    }

}


// CREATE ONE CONFETTI PIECE

function createConfettiPiece(side){

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const life = 65 + Math.random() * 25;

    let startX;

    if(side === "left"){
        startX = -15;
    }else{
        startX = canvas.width + 15;
    }

    // Keep particles around the result card area
    const startY =
        centerY - 100 + Math.random() * 220;

    // Stop close to the sides of the result card
    let targetX;

    if(side === "left"){

        targetX =
            centerX -
            250 -
            Math.random() * 100;

    }else{

        targetX =
            centerX +
            250 +
            Math.random() * 100;

    }

    const targetY =
        centerY -
        80 +
        Math.random() * 170;


    // Calculate smooth inward movement
    let vx =
        (targetX - startX) / life;

    let vy =
        (targetY - startY) / life;


    // Add a little randomness
    vx *= 0.9 + Math.random() * 0.25;
    vy *= 0.8 + Math.random() * 0.4;


    const shapes = [
        "rectangle",
        "circle",
        "heart",
        "sparkle"
    ];

    const colors = [
        "#ffb6d9",
        "#ffd6e8",
        "#ff8fc0",
        "#ffffff"
    ];


    return {

        x: startX,
        y: startY,

        vx: vx,
        vy: vy,

        gravity: 0.035,

        size: 5 + Math.random() * 7,

        rotation:
            Math.random() * Math.PI * 2,

        rotationSpeed:
            (Math.random() - 0.5) * 0.18,

        life: life,
        maxLife: life,

        shape:
            shapes[
                Math.floor(
                    Math.random() * shapes.length
                )
            ],

        color:
            colors[
                Math.floor(
                    Math.random() * colors.length
                )
            ]

    };

}


// UPDATE + DRAW CONFETTI

function updateAndDrawPlayerConfetti(){

    if(!confettiActive){
        return;
    }


    for(
        let i = playerWinConfetti.length - 1;
        i >= 0;
        i--
    ){

        const p =
            playerWinConfetti[i];


        // Movement
        p.vy += p.gravity;

        p.x += p.vx;
        p.y += p.vy;

        p.rotation += p.rotationSpeed;

        p.life--;


        // Fade out near the end
        const alpha =
            Math.max(
                0,
                p.life / p.maxLife
            );


        // Remove finished particles
        if(p.life <= 0){

            playerWinConfetti.splice(i, 1);

            continue;

        }


        // Draw
        ctx.save();

        ctx.globalAlpha = alpha;

        ctx.translate(
            p.x,
            p.y
        );

        ctx.rotate(
            p.rotation
        );

        ctx.fillStyle =
            p.color;


        // -------------------------
        // RECTANGLE
        // -------------------------

        if(p.shape === "rectangle"){

            ctx.fillRect(
                -p.size / 2,
                -p.size,
                p.size * 0.7,
                p.size * 1.8
            );

        }


        // -------------------------
        // CIRCLE
        // -------------------------

        else if(p.shape === "circle"){

            ctx.beginPath();

            ctx.arc(
                0,
                0,
                p.size / 2,
                0,
                Math.PI * 2
            );

            ctx.fill();

        }


        // -------------------------
        // HEART
        // -------------------------

        else if(p.shape === "heart"){

            const s =
                p.size / 7;

            ctx.beginPath();

            ctx.moveTo(
                0,
                5 * s
            );

            ctx.bezierCurveTo(
                -8 * s,
                -1 * s,
                -8 * s,
                -8 * s,
                -3 * s,
                -8 * s
            );

            ctx.bezierCurveTo(
                0,
                -8 * s,
                0,
                -4 * s,
                0,
                -4 * s
            );

            ctx.bezierCurveTo(
                0,
                -4 * s,
                0,
                -8 * s,
                3 * s,
                -8 * s
            );

            ctx.bezierCurveTo(
                8 * s,
                -8 * s,
                8 * s,
                -1 * s,
                0,
                5 * s
            );

            ctx.fill();

        }


        // -------------------------
        // SPARKLE
        // -------------------------

        else if(p.shape === "sparkle"){

            const s =
                p.size;

            ctx.beginPath();

            ctx.moveTo(
                0,
                -s
            );

            ctx.lineTo(
                s * 0.3,
                -s * 0.3
            );

            ctx.lineTo(
                s,
                0
            );

            ctx.lineTo(
                s * 0.3,
                s * 0.3
            );

            ctx.lineTo(
                0,
                s
            );

            ctx.lineTo(
                -s * 0.3,
                s * 0.3
            );

            ctx.lineTo(
                -s,
                0
            );

            ctx.lineTo(
                -s * 0.3,
                -s * 0.3
            );

            ctx.closePath();

            ctx.fill();

        }


        ctx.restore();

    }


    // Stop when every particle is gone
    if(playerWinConfetti.length === 0){

        confettiActive = false;

    }

}

function showGameOverButtons(){

restartButton=document.createElement("button");

restartButton.innerText="Restart";

document.body.appendChild(restartButton);

restartButton.style.position="absolute";
restartButton.style.left="50%";
restartButton.style.top="55%";
restartButton.style.transform="translateX(-50%)";
restartButton.style.width="180px";
restartButton.style.height="58px";
restartButton.style.borderRadius="30px";
restartButton.style.border="3px solid #ff8fc0";
restartButton.style.background="#ffd7e8";
restartButton.style.color="#ff4f9f";
restartButton.style.fontSize="22px";
restartButton.style.fontWeight="bold";
restartButton.style.cursor="pointer";
restartButton.style.zIndex="9999";
restartButton.style.boxShadow="0 8px 18px rgba(0,0,0,.15)";

restartButton.onmouseover=()=>{
restartButton.style.background="#ffe9f3";
}

restartButton.onmouseout=()=>{
restartButton.style.background="#ffd7e8";
}

restartButton.onclick=()=>{
restartGame();
};

menuButton=document.createElement("button");

menuButton.innerText="Main Menu";

document.body.appendChild(menuButton);

menuButton.style.position="absolute";
menuButton.style.left="50%";
menuButton.style.top="64%";
menuButton.style.transform="translateX(-50%)";
menuButton.style.width="180px";
menuButton.style.height="58px";
menuButton.style.borderRadius="30px";
menuButton.style.border="3px solid #ff8fc0";
menuButton.style.background="#ffd7e8";
menuButton.style.color="#ff4f9f";
menuButton.style.fontSize="22px";
menuButton.style.fontWeight="bold";
menuButton.style.cursor="pointer";
menuButton.style.zIndex="9999";
menuButton.style.boxShadow="0 8px 18px rgba(0,0,0,.15)";

menuButton.onmouseover=()=>{
menuButton.style.background="#ffe9f3";
}

menuButton.onmouseout=()=>{
menuButton.style.background="#ffd7e8";
}

menuButton.onclick=()=>{
location.reload();
};

}