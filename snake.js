const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 20;
const canvasSize = canvas.width;
let snake = [];
snake[0] = { x: 9 * box, y: 10 * box };
let food = {
    x: Math.floor(Math.random() * 19 + 1) * box,
    y: Math.floor(Math.random() * 19 + 1) * box
};
let score = 0;
let highScore = localStorage.getItem("highScore") || 0; // Load high score from local storage
let direction;
let game;

document.addEventListener("keydown", setDirection);

function setDirection(event) {
    if (event.keyCode == 37 && direction != "RIGHT") direction = "LEFT";
    else if (event.keyCode == 38 && direction != "DOWN") direction = "UP";
    else if (event.keyCode == 39 && direction != "LEFT") direction = "RIGHT";
    else if (event.keyCode == 40 && direction != "UP") direction = "DOWN";
}

function collision(newHead, array) {
    for (let i = 0; i < array.length; i++) {
        if (newHead.x == array[i].x && newHead.y == array[i].y) return true;
    }
    return false;
}

function draw() {
    ctx.clearRect(0, 0, canvasSize, canvasSize);

    for (let i = 0; i < snake.length; i++) {
        ctx.fillStyle = (i == 0) ? "green" : "white";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
        ctx.strokeStyle = "red";
        ctx.strokeRect(snake[i].x, snake[i].y, box, box);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction == "LEFT") snakeX -= box;
    if (direction == "UP") snakeY -= box;
    if (direction == "RIGHT") snakeX += box;
    if (direction == "DOWN") snakeY += box;

    if (snakeX == food.x && snakeY == food.y) {
        score++;
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore); // Save high score to local storage
        }
        food = {
            x: Math.floor(Math.random() * 19 + 1) * box,
            y: Math.floor(Math.random() * 19 + 1) * box
        }
    } else {
        snake.pop();
    }

    let newHead = { x: snakeX, y: snakeY };

    if (snakeX < 0 || snakeY < 0 || snakeX >= canvasSize || snakeY >= canvasSize || collision(newHead, snake)) {
        clearInterval(game);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasSize, canvasSize);
        ctx.fillStyle = "red";
        ctx.font = "50px Changa one";
        ctx.fillText("Game Over", 100, 250);
        ctx.fillStyle = "white";
        ctx.font = "20px Changa one";
        ctx.fillText("Score: " + score, 180, 280);
        ctx.fillText("High Score: " + highScore, 150, 310); // Display high score
        ctx.fillStyle = "green";
        ctx.fillRect(150, 330, 200, 50);
        ctx.fillStyle = "white";
        ctx.fillText("Try Again", 200, 365);
        canvas.addEventListener("click", tryAgain);
    }

    snake.unshift(newHead);

    ctx.fillStyle = "white";
    ctx.font = "25px Changa one";
    ctx.fillText("Score: " + score, 10, 30);
}

function tryAgain() {
    snake = [];
    snake[0] = { x: 9 * box, y: 10 * box };
    direction = null;
    score = 0;
    clearInterval(game);
    game = setInterval(draw, 100);
    canvas.removeEventListener("click", tryAgain);
}

game = setInterval(draw, 100);

