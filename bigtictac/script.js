const gameBoard = document.querySelector('.game-board');
const winnerBoard = document.querySelector('.game-board .winner');
const startGameBtn = document.querySelector('.input-window .btn');
const inputWindow = document.querySelector('.input-window');
const leftSidebar = document.querySelector('.left-sidebar');
const rightSidebar = document.querySelector('.right-sidebar');
const restartBtn = document.querySelectorAll('.menu .btn')[0];
const clearScoreBtn = document.querySelectorAll('.menu .btn')[1];
const changeRowsBtn = document.querySelectorAll('.menu .btn')[2];
const closeMenuBtn = document.querySelectorAll('.menu .btn')[3];
const openMenuBtn = document.querySelector('.left-sidebar .btn');
const menu = document.querySelector('.menu');

startGameBtn.addEventListener('click', startNewRow);
gameBoard.addEventListener('click', ticTac);
restartBtn.addEventListener('click', restart);
clearScoreBtn.addEventListener('click', clearScore);
changeRowsBtn.addEventListener('click', changeRows);
openMenuBtn.addEventListener('click', openMenu);
closeMenuBtn.addEventListener('click', closeMenu);
document.addEventListener('DOMContentLoaded', startGame);

let result = [];
let move = 0;



function startGame (event) {
    setScore();
    if (localStorage.getItem('blocks') === null) {
        inputWindow.classList.add('active');
        return;
    }

    move = localStorage.getItem('move');
    result = JSON.parse(localStorage.getItem('blocks'));
    row = localStorage.getItem('rows');
    
    setTurn();
    createBlocks();
}

function startNewRow (event) {

    let row = document.querySelector('.input-window input').value * 1;
    if (row < 3 || row > 15) return;

    inputWindow.classList.remove('active');
    document.querySelector('.input-window input').value = '';
    localStorage.setItem('rows', row);

    removeBlocks();
    createBlocks();
}

function createBlocks () {
    let row = localStorage.getItem('rows') * 1;

    gameBoard.style = 'height : ' + 50 * row + 'px';
    gameBoard.style = 'width : ' + 50 * row + 'px';
    // gameBoard.style = 'zoom : calc(' + 50 + ')';

    if (localStorage.getItem('blocks') !== null) {
        result = JSON.parse(localStorage.getItem('blocks'));
    }
    
    for(let i=0; i<row; i++){
        if (!result[i]) result[i] = [];
        for(let j=0; j<row;j++){
            const div = document.createElement('div');
            div.classList.add('block');
            div.setAttribute('data-src', i + '-' + j);
            div.style = 'opacity: 0';
            gameBoard.appendChild(div);
            if (result[i][j]) div.innerText = result[i][j];
            else result[i].push('');
        }
    }

    let colorNumber = Math.round(Math.random() * 360);
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((block, i) => {
        setTimeout(() => {
            block.style = 'opacity: 1';
            block.style = 'background: hsl(' +
            colorNumber + ', 90%, 80%';
        }, i * 30);
    })

    leftSidebar.classList.add('active');
    rightSidebar.classList.add('active');
}

function restart (event) {
    winnerBoard.classList.remove('active');

    setTimeout(removeBlocks, 1000); 
    setTimeout(createBlocks, 2000); 
    closeMenu();
}

function changeRows() {
    menu.classList.remove('active');
    winnerBoard.classList.remove('active');
    setTimeout(() => {
        inputWindow.classList.add('active');
    }, 2000);
    gameBoard.classList.toggle('hide-gameboard');
    setTimeout(removeBlocks, 1000);
}

function openMenu () {
    menu.classList.add('active');
    leftSidebar.classList.remove('active');
    rightSidebar.classList.remove('active');
    gameBoard.classList.toggle('hide-gameboard'); 
}

function closeMenu () {
    if (winnerBoard.classList[1] !== 'active') {
        rightSidebar.classList.add('active');
    }
    leftSidebar.classList.add('active');
    menu.classList.remove('active');
    gameBoard.classList.toggle('hide-gameboard');
}

function removeBlocks () {
    result = [];
    move = 0;
    setTurn();
    localStorage.setItem('move', move);
    localStorage.removeItem('blocks');
    const blocks = document.querySelectorAll('.block');
    blocks.forEach((block, i) => {
        setTimeout(() => {
            block.remove();
        }, i * 3);
    });
}

function clearScore () {
    localStorage.setItem('X', 0);
    localStorage.setItem('O', 0);
    document.querySelector('.X').innerText = 0;
    document.querySelector('.O').innerText = 0;
    closeMenu();
}

function setScore () {
    if (localStorage.getItem('X') === null) {
        localStorage.setItem('X', 0);
        localStorage.setItem('O', 0);
    } else {
        document.querySelector('.X').innerText = localStorage.getItem('X');
        document.querySelector('.O').innerText = localStorage.getItem('O');
    }
}

function setTurn () {
    const turn = rightSidebar.children[0];
    if (move % 2 == 0) {
        turn.innerText = 'X';
    } else {
        turn.innerText = 'O';
    }

    turn.classList.add('animate-font');
    setTimeout(() => {
        turn.classList.remove('animate-font');
    }, 1000);
    
}

function ticTac (event) {
    if (winnerBoard.classList[1] == ('active')) return;
    let row = localStorage.getItem('rows') * 1;
    let rowsColums = event.target.getAttribute('data-src').split('-');
    let v =  rowsColums[1]*1;
    let h = rowsColums[0]*1;

    if (result[h][v] == 'X' || result[h][v] === 'O') return;

    let char;
    if (move % 2 == 0) {
        char = 'X';
        event.target.innerText = char; 

    } else {
        char = 'O';
        event.target.innerText = char;
    }

    event.target.classList.add('bounce-font');
    setTimeout(() => {
        event.target.classList.remove('bounce-font');
    }, 1000);

    if (move === row*row - 1) {
        winner('');
        return;
    }

    move++;
    result[h][v] = char;
    
    localStorage.setItem('move', move);
    localStorage.setItem('blocks', JSON.stringify(result));
    setTurn();
    checkHorizontal(char, h);
    checkVertical(char, v);
    if (v - h == 0) chekDiagonalToRight(char);
    if (v + h + 1 == row) chekDiagonalToLeft (char);
}

function checkHorizontal (char, h) {
    for(let i=0; i<result.length; i++){
        if (result[h][i] !== char) return;
    }

    winner(char);
}

function checkVertical (char, v) {
    for (let i = 0; i < result.length; i++) {
        if (result[i][v] !== char) return;
    }
    winner(char);
}

function chekDiagonalToRight(char) {
    for (let i = 0; i < result.length; i++) {
        if (result[i][i] !== char) return;
    }
    winner(char);
}

function chekDiagonalToLeft (char) {
    for (i = 0; i < result.length; i++) {
        if (result[i][result.length - 1 - i] !== char) return;
    }
    winner(char);
}

function winner (char) {
    if (char != '') {
        winnerBoard.children[0].innerHTML = char;
        winnerBoard.children[1].innerHTML = 'Wins!';
        let score = localStorage.getItem(char);
        score++;
        document.querySelector('.'+char).innerText = score;
        localStorage.setItem(char, score);
    } else {
        winnerBoard.children[0].innerHTML = char;
        winnerBoard.children[1].innerHTML = 'Oops!';
    }
    winnerBoard.classList.add('active');
    localStorage.removeItem('blocks');
    rightSidebar.classList.remove('active');
}