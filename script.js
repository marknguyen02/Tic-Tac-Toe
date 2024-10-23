let board = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
]

/* Global environment */

const cellContainer = document.getElementById("cellContainer");
const selectElement = document.getElementById("difficultyOptions");
const initialColor = cellContainer.children[0].children[0].style.color;
const noticeElement = document.getElementById("notice");

function handleCellClick(i, j) {
    if (board[i][j] == "") {
        board[i][j] = "X";
        
        fillCell(i, j, "X");
        fillValidCells();
        checkAndNotifyWinner();

        if (!isFull(board) && evaluate(board) == 0) {
            executeMove();
            fillValidCells();
            checkAndNotifyWinner();
        }
    }
}

function reset() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            board[i][j] = "";
            fillCell(i, j, "");
            cellContainer.children[i].children[j].style.color = initialColor;
        }
    }
    hideNotice();
}

function checkAndNotifyWinner() {
    let score = evaluate(board);
    let message;
    if (score != 0) {
        if (score == 1) {
            message = "You lost to the AI!"
        } else {
            message = "Congratulations!\nYou're the winner."
        }
        showNotice(message);
    }
    if (isFull(board)) {
        message = 'Match drawn!'
        showNotice(message);
    }
}

function fillCell(x0, y0, marker) {
    cellContainer.children[x0].children[y0].innerHTML = marker;
}

function showNotice(message) {
    noticeElement.innerText = message;
    noticeElement.style.display = 'flex';
    cellContainer.style.pointerEvents = 'none';
}

function hideNotice() {
    noticeElement.style.display = 'none';
    cellContainer.style.pointerEvents = 'auto';
}

function executeMove() {
    let difficulty = selectElement.value;
    if (difficulty == "easy") {
        executeRandomMove();
    } else if (difficulty == "medium") {
        executeSmartMove();
    } else {
        executeBestMove();
    }
}

function executeBestMove() {
    let bestScore = -Infinity;
    let nextMove;
    let bestDepth = Infinity;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == "") {
                board[i][j] = "O";
                let currentState = minimax(board, false, 0);
                board[i][j] = "";
                if (currentState.score > bestScore || 
                    (currentState.score == bestScore && currentState.depth < bestDepth)) {
                    bestScore = currentState.score;
                    bestDepth = currentState.depth;
                    nextMove = {i, j};
                }
            }
        }
    }

    board[nextMove.i][nextMove.j] = "O";
    fillCell(nextMove.i, nextMove.j, "O");
}

function executeSmartMove() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                board[i][j] = 'O';
                if (evaluate(board) == 1) {
                    fillCell(i, j, 'O');
                    return;
                }
                board[i][j] = '';
            }
        }
    }

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == '') {
                board[i][j] = 'X';
                if (evaluate(board) == -1) {
                    board[i][j] = 'O';
                    fillCell(i, j, 'O');
                    return;
                }
                board[i][j] = '';
            }
        }
    }
    executeRandomMove();
}


function executeRandomMove() {
    cells = [];
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == "") {
                cells.push({i, j});
            }
        }
    }

    let index = Math.floor(Math.random() * cells.length);
    x0 = cells[index].i;
    y0 = cells[index].j;
    board[x0][y0] = "O";
    fillCell(x0, y0, "O");

}

/* Minimax algorithm */

function minimax(board, isMaximize, depth) {
    let currentScore = evaluate(board);
    if (currentScore != 0 || isFull(board)) {
        return {score: currentScore, depth: depth};
    }

    if (isMaximize) {
        let bestState = { score: -Infinity, depth: Infinity };
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == "") {
                    board[i][j] = "O";
                    let currentState = minimax(board, false, depth + 1);
                    board[i][j] = "";
                    if (currentState.score > bestState.score || 
                        (currentState.score == bestState.score && currentState.depth < bestState.depth)) {
                        bestState = currentState;
                    }
                }
            }
        }
        return bestState;
    }

    let bestState = { score: Infinity, depth: Infinity };
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == "") {
                board[i][j] = "X";
                let currentState = minimax(board, true, depth + 1);
                board[i][j] = "";
                if (currentState.score < bestState.score || 
                    (currentState.score == bestState.score && currentState.depth < bestState.depth)) {
                    bestState = currentState;
                }
            }
        }
    }
    return bestState;
}

function fillValidCells() {
    let color = "blue";
    for (let i = 0; i < 3; i++) {
        if (board[i][0] != "" && board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
            cellContainer.children[i].children[0].style.color = color;
            cellContainer.children[i].children[1].style.color = color;
            cellContainer.children[i].children[2].style.color = color;
            return;
        }
    }

    for (let j = 0; j < 3; j++) {
        if (board[0][j] != "" && board[0][j] == board[1][j] && board[1][j] == board[2][j]) {
            cellContainer.children[0].children[j].style.color = color;
            cellContainer.children[1].children[j].style.color = color;
            cellContainer.children[2].children[j].style.color = color;
            return;
        }
    }

    if (board[1][1] != "") {
        if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
            cellContainer.children[0].children[0].style.color = color;
            cellContainer.children[1].children[1].style.color = color;
            cellContainer.children[2].children[2].style.color = color;
            return;
        }

        if (board[2][0] == board[1][1] && board[1][1] == board[0][2]) {
            cellContainer.children[2].children[0].style.color = color;
            cellContainer.children[1].children[1].style.color = color;
            cellContainer.children[0].children[2].style.color = color;
            return;        
        }
    }
}

function evaluate(board) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] != "" && board[i][0] == board[i][1] && board[i][1] == board[i][2]) {
            return board[i][0] == "O" ? 1 : -1;
        }
        if (board[0][i] != "" && board[0][i] == board[1][i] && board[1][i] == board[2][i]) {
            return board[0][i] == "O" ? 1 : -1;
        }
    }

    if (board[1][1] != "") {
        if (board[0][0] == board[1][1] && board[1][1] == board[2][2]) {
            return board[0][0] == "O" ? 1 : -1;
        }

        if (board[2][0] == board[1][1] && board[1][1] == board[0][2]) {
            return board[2][0] == "O" ? 1 : -1;
        }
    }
    
    return 0;
}

function isFull(board) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[i][j] == "") {
                return false;
            }
        }
    }

    return true;
}