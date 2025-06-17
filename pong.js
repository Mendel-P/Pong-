const canvas = document.getElementById("pongCanvas");
const ctx = canvas.getContext("2d");

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
var playerouts = 0;
//variable if it should be time or times
var time = "times"

// Paddle settings
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const PADDLE_MARGIN = 10;
const PADDLE_SPEED = 6;

// Ball settings
const BALL_SIZE = 18;
const BALL_SPEED = 6;

// Player Paddle
let leftPaddle = {
    x: PADDLE_MARGIN,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

// AI Paddle
let rightPaddle = {
    x: WIDTH - PADDLE_MARGIN - PADDLE_WIDTH,
    y: HEIGHT / 2 - PADDLE_HEIGHT / 2,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dy: 0
};

// Ball
let ball = {
    x: WIDTH / 2 - BALL_SIZE / 2,
    y: HEIGHT / 2 - BALL_SIZE / 2,
    size: BALL_SIZE,
    dx: BALL_SPEED * (Math.random() > 0.5 ? 1 : -1),
    dy: BALL_SPEED * (Math.random() * 2 - 1)
};

// Mouse controls for left paddle
canvas.addEventListener("mousemove", function (e) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = e.clientY - rect.top;
    leftPaddle.y = mouseY - leftPaddle.height / 2;
    // Clamp
    if (leftPaddle.y < 0) leftPaddle.y = 0;
    if (leftPaddle.y + leftPaddle.height > HEIGHT) leftPaddle.y = HEIGHT - leftPaddle.height;
});

// Draw everything
function draw() {
    // Clear
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Draw net
    ctx.fillStyle = "#FFD700";
    for (let i = 0; i < HEIGHT; i += 32) {
        ctx.fillRect(WIDTH / 2 - 2, i, 4, 16);
    }

    // Draw paddles
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
    ctx.fillRect(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);

    // Draw ball
    ctx.fillStyle = "#fff";
    ctx.beginPath();
    ctx.arc(ball.x + ball.size / 2, ball.y + ball.size / 2, ball.size / 2, 0, Math.PI * 2);
    ctx.fill();
}

// Update game objects
function update() {
    // Move ball
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top/bottom
    if (ball.y < 0) {
        ball.y = 0;
        ball.dy *= -1;
    }
    if (ball.y + ball.size > HEIGHT) {
        ball.y = HEIGHT - ball.size;
        ball.dy *= -1;
    }

    // Ball collision with left paddle
    if (
        ball.x <= leftPaddle.x + leftPaddle.width &&
        ball.x >= leftPaddle.x &&
        ball.y + ball.size > leftPaddle.y &&
        ball.y < leftPaddle.y + leftPaddle.height
    ) {
        ball.x = leftPaddle.x + leftPaddle.width;
        ball.dx *= -1;
        // Add randomness
        ball.dy += (Math.random() - 0.5) * 2;
    }

    // Ball collision with right paddle
    if (
        ball.x + ball.size >= rightPaddle.x &&
        ball.x + ball.size <= rightPaddle.x + rightPaddle.width &&
        ball.y + ball.size > rightPaddle.y &&
        ball.y < rightPaddle.y + rightPaddle.height
    ) {
        ball.x = rightPaddle.x - ball.size;
        ball.dx *= -1;
        // Add randomness
        ball.dy += (Math.random() - 0.5) * 2;
    }

    // Ball out of bounds (left/right) - reset ball
    if (ball.x < 0 || ball.x + ball.size > WIDTH) {
        playerouts ++
        if (playerouts === 1)
        { time = "time"; }
        else { time = "times"; }
        alert("you have gotten out " + playerouts + " " + time )
        resetBall();
    }

    // Basic AI for right paddle
    let target = ball.y + ball.size / 2 - rightPaddle.height / 2;
    if (rightPaddle.y < target) {
        rightPaddle.y += PADDLE_SPEED;
        if (rightPaddle.y > target) rightPaddle.y = target;
    } else if (rightPaddle.y > target) {
        rightPaddle.y -= PADDLE_SPEED;
        if (rightPaddle.y < target) rightPaddle.y = target;
    }
    // Clamp
    if (rightPaddle.y < 0) rightPaddle.y = 0;
    if (rightPaddle.y + rightPaddle.height > HEIGHT) rightPaddle.y = HEIGHT - rightPaddle.height;
}

function resetBall() {
    ball.x = WIDTH / 2 - BALL_SIZE / 2;
    ball.y = HEIGHT / 2 - BALL_SIZE / 2;
    ball.dx = BALL_SPEED * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = BALL_SPEED * (Math.random() * 2 - 1);
}

// Main loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start game
loop();
