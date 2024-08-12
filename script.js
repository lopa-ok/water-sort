const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
const containerCount = 4;
const liquidCount = 3;

const gameContainer = document.getElementById('game-container');
const containers = [];
const history = [];
let moveCounter = 0;

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
    for (let i = 0; i < containerCount; i++) {
        const container = createContainer(i);
        gameContainer.appendChild(container);
        containers.push(container);
    }
    updateMoveCounter();
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
            setTimeout(() => alert('You Win!'), 100);
            break;
        }
    }
}

function updateMoveCounter() {
    document.getElementById('move-counter').innerText = `Moves: ${moveCounter}`;
}

function resetGame() {
    gameContainer.innerHTML = '';
    containers.length = 0;
    history.length = 0;
    moveCounter = 0;
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

document.getElementById('reset-btn').addEventListener('click', resetGame);
document.getElementById('undo-btn').addEventListener('click', undoMove);

setupGame();
