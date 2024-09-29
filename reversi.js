IS_OWNED = "01";
IS_OTHER = "02";
NOT_SELECTED = "09";

let isOddTurn = true;

$(function () {
    $(".square").click(clickSquareEvent);

    initializeEvent();
});

function clickSquareEvent() {
    let square = $(this);

    if (!canSelect(square)) {
        return;
    }

    changeOwner(square);
}

function initializeEvent() {
    changeOwner(getTargetSquare(3,3));
    changeOwner(getTargetSquare(3,4));
    changeOwner(getTargetSquare(4,4));
    changeOwner(getTargetSquare(4,3));
}

function changeOwner(square) {
    putPiece(square, getTurnString());
    changeOwnerOpposite(square);
    changeTurn();
}

function putPiece(targetSquare, owner) {
    targetSquare.text("●").attr("data-owner", owner).addClass("selected");
} 

function getTurnString() {
    if (isOddTurn) {
        return "black";
    }
    return "white";
}

function changeTurn() {
    isOddTurn = !isOddTurn;
}

function getTargetSquare(row, col) {
    return $("[data-row=" + row + "][data-col=" + col + "]");
}

function canSelect(square) {
    if (square.hasClass("selected")) {
        return false;
    }
    return true;
}

function changeOwnerOpposite(square) {
    let row = square.data("row");
    let col = square.data("col");

    changeOwnerOppositeLower(row, col);
}

function changeOwnerOppositeLower(row, col) {
    let endPos = getPosOwnerOppositeLower(row, col);
    if (endPos == null) {
        return;
    }

    let targetCol = col;
    for (let targetRow = row + 1; targetRow < endPos.row; targetRow++) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOwnerOppositeLower(row, col) {
    if (row == 7) {
        return null;
    }

    let targetRow = row + 1;
    let targetCol = col;

    if (getSquareStatus(targetRow, targetCol) != IS_OTHER) {
        return null;
    }

    for (targetRow++; targetRow<=7; targetRow++) {
        let status = getSquareStatus(targetRow, targetCol);
        
        if (status == NOT_SELECTED) {
            return null;
        }

        if (status == IS_OWNED) {
            return {
                row: targetRow, 
                col: targetCol, 
            };
        }
    }
    return null;
}

function getSquareStatus(row, col) {
    let targetSquare = getTargetSquare(row, col);

    if (!targetSquare.hasClass("selected")) {
        return NOT_SELECTED;
    }

    if (getTurnString() == targetSquare.attr("data-owner")) {
        return IS_OWNED
    }

    return IS_OTHER
}