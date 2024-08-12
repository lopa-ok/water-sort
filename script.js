const colorPalettes = {
    default: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'],
    pastel: ['#FFB3B3', '#B3FFB3', '#B3B3FF', '#FFFFB3'],
    vibrant: ['#FF007F', '#00FF7F', '#007FFF', '#FFFF00']
};

let colors = colorPalettes.default;
let moveLimit = 20;
let moveCounter = 0;
let timer;
let timeElapsed = 0;
const history = [];
const containers = [];

function createContainer(index) {
    const container = document.createElement('div');
    container.className = 'container';
    container.dataset.index = index;
    
    for (let i = 0; i < liquidCount; i++) {
        const liquid = document.createElement('div');
        liquid.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        container.appendChild(liquid);
    }
    
    container.addEventListener('click', handleContainerClick);
    return container;
}

function setupGame() {
    gameContainer.innerHTML = '';
    containers.length = 0;
    history.length = [];
    moveCounter = 0;
    updateMoveCounter();
    setupContainers();
    startTimer();
}

function setupContainers() {
    const difficulty = parseInt(document.getElementById('difficulty-select').value);
    const containerCount = difficulty * 2;
    
    for (let i = 0; i < containerCount; i++) {
        const container = createContainer(i);
        gameContainer.appendChild(container);
        containers.push(container);
    }
}

function handleContainerClick(event) {
    const clickedContainer = event.currentTarget;
    if (clickedContainer.dataset.target !== undefined) {
        const targetContainer = containers[parseInt(clickedContainer.dataset.target)];
        moveLiquid(clickedContainer, targetContainer);
    } else {
        const liquidToMove = getTopLiquid(clickedContainer);
        if (liquidToMove) {
            clickedContainer.dataset.target = getEmptyContainerIndex();
        }
    }
}

function getTopLiquid(container) {
    const liquids = container.querySelectorAll('div');
    for (let i = liquids.length - 1; i >= 0; i--) {
        if (liquids[i].style.backgroundColor) {
            return liquids[i];
        }
    }
    return null;
}

function moveLiquid(source, target) {
    if (moveCounter >= moveLimit) {
        alert('Move limit reached!');
        return;
    }
    
    const liquid = getTopLiquid(source);
    if (liquid && target.children.length < liquidCount) {
        history.push({ source: source.dataset.index, target: target.dataset.index, liquid: liquid.style.backgroundColor });
        target.appendChild(liquid);
        delete source.dataset.target;
        moveCounter++;
        updateMoveCounter();
        checkWinCondition();
    }
}

function getEmptyContainerIndex() {
    for (let i = 0; i < containers.length; i++) {
        if (containers[i].children.length < liquidCount) {
            return i;
        }
    }
    return -1;
}

function checkWinCondition() {
    for (const container of containers) {
        const colors = Array.from(container.querySelectorAll('div')).map(div => div.style.backgroundColor);
        if (colors.every(color => color === colors[0])) {
            stopTimer();
            setTimeout(() => alert('You Win!'), 100);
            break;
        }
    }
}

function updateMoveCounter() {
    document.getElementById('move-counter').innerText = `Moves: ${moveCounter}`;
    document.getElementById('move-limit').innerText = `Move Limit: ${moveLimit}`;
}

function startTimer() {
    timer = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').innerText = `Time: ${timeElapsed}s`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}

function resetGame() {
    setupGame();
}

function undoMove() {
    const lastMove = history.pop();
    if (lastMove) {
        const sourceContainer = containers[lastMove.source];
        const targetContainer = containers[lastMove.target];
        const liquid = getTopLiquid(targetContainer);
        if (liquid && liquid.style.backgroundColor === lastMove.liquid) {
            sourceContainer.appendChild(liquid);
            moveCounter--;
            updateMoveCounter();
        }
    }
}

function changePalette() {
    const palette = document.getElementById('color-select').value;
    colors = colorPalettes[palette];
    resetGame();
}

function giveHint() {
    // Implement a basic hint system (e.g., highlight a potential move)
    alert('Hint functionality not yet implemented.');
}

document.getElementById('reset-btn').addEventListener('click', resetGame);
document.getElementById('undo-btn').addEventListener('click', undoMove);
document.getElementById('color-select').addEventListener('change', changePalette);
document.getElementById('hint-btn').addEventListener('click', giveHint);

setupGame();
