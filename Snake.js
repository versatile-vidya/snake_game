//Defining HTML Elements
const board = document.getElementById('game-board');
const instruction = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('Highscore');

const gridSize = 20;
let direction = 'down';
let snake = [{x:10,y:10}];
let food = generateFood();
let gameInterval;
let gameSpeedDelay = 200;
let gameStarted = false;
let highScore = 0;
//Draw game map, food, snake
function draw(){
    board.innerHTML='';
    drawsnake();
    drawFood();
    updateScore();

}

function drawsnake(){
    snake.forEach((segment)=>{
        const snakeElement=createGameElement('div','snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    });
    
}

function createGameElement(tag, className){
    const element = document.createElement(tag);
    element.className = className;
    return element;

}

function setPosition(element,position){
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// draw();

function drawFood(){
    if(gameStarted){
        const foodElement = createGameElement('div','food');
        setPosition(foodElement,food);
        board.appendChild(foodElement);
    }

}

function generateFood(){
    const x = Math.floor(Math.random() * gridSize) + 1;
    const y = Math.floor(Math.random() * gridSize) + 1;
    return{x, y};

}


function move(){
    const head = {...snake[0]};
    switch(direction){
        case 'right':
            head.x++;
            break;
        case 'up':
            head.y--;
            break;
        case 'left':
            head.x--;
            break;
        case 'down':
            head.y++;
            break;
    }
    snake.unshift(head);
    // snake.pop();
    if(head.x===food.x && food.y===head.y){
        food = generateFood();
        increaseSpeed();
        clearInterval(gameInterval);
        gameInterval = setInterval(()=>{
        move();
        checkCollision();
        draw();},gameSpeedDelay);
    }
    else{
        snake.pop();
    }
    
}

// setInterval(()=>{
//     move();
//     draw();
// },200);


function startGame(){
    gameStarted = true;
    instruction.style.display = 'none';
    logo.style.display = 'none';
    gameInterval = setInterval(()=>{
        move();
        checkCollision();
        draw();
    },gameSpeedDelay);

}

//keypress event listener
function handleKeyPress(event){
    if((!gameStarted && event.code === 'Space') || 
    (!gameStarted && event.key === ' ')){
        startGame();
    }
    else{
        switch(event.key){
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break;
            // case 'W':
            //     direction = 'up';
            //         break;
            // case 'S':
            //     direction = 'down';
            //     break;
            // case 'A':
            //     direction = 'left';
            //     break;
            // case 'D':
            //     direction = 'right';
            //     break;
            }
    }

}

document.addEventListener('keydown',handleKeyPress);

function increaseSpeed(){
    console.log(gameSpeedDelay);
    if(gameSpeedDelay > 150){
        gameSpeedDelay -= 5;
    }else if(gameSpeedDelay > 100){
        gameSpeedDelay -= 3;
    }else if(gameSpeedDelay > 50){
        gameSpeedDelay -= 2;
    }else if(gameSpeedDelay > 25){
        gameSpeedDelay -= 1;
    }
}

function checkCollision(){
    const head = snake[0];
    if(head.x < 1 || head.x > gridSize || head.y < 1 || head.y > gridSize){
        resetGame();

    }

    for(let i = 1;i < snake.length;i++){
        if(head.x === snake[i].x && head.y === snake[i].y){
            resetGame();
        }
    }
}

function resetGame(){
    updateHighscore();
    stopGame();
    snake = [{x:10,y:10}];
    food = generateFood();
    direction = 'down';
    gameSpeedDelay = 200;
    updateScore();
}

function updateScore(){
    const currentScore = snake.length-1;
    score.textContent = currentScore.toString().padStart(3,'0');
}

function stopGame(){
    clearInterval(gameInterval);
    gameStarted = false;
    instruction.style.display = 'block';
    logo.style.display = 'block';
}

function updateHighscore(){
    const currentScore = snake.length-1;
    if(currentScore > highScore){
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3,'0');

    }
    highScoreText.style.display = 'block';

}   