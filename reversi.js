IS_OWNED = "01";
IS_OTHER = "02";
NOT_SELECTED = "09";

let isOddTurn = true;

$(function () {
    $(".square").click(clickSquareEvent);
    $("#btn-initialize").click(initializeEvent);
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
    $(".square")
        .removeClass("selcted")
        .text("")
        .attr("data-owner", "");

    isOddTurn = true;

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

    for (let elem of $(".square")) {
        if (canSelect($(elem))) {
            $(elem).addClass("can-select");
            $(elem).removeClass("cant-select");
        } else {
            $(elem).removeClass("can-select");
            $(elem).addClass("cant-select");
        }
    }
}

function getTargetSquare(row, col) {
    return $("[data-row=" + row + "][data-col=" + col + "]");
}

function canSelect(square) {
    if (square.hasClass("selected")) {
        return false;
    }

    let row = square.data("row");
    let col = square.data("col");
    if (getPosOwnerOppositeUpper(row, col) != null) {
        return true;
    }
    if (getPosOwnerOppositeLower(row, col) != null) {
        return true;
    }
    if (getPosOwnerOppositeLeft(row, col) != null) {
        return true;
    }
    if (getPosOwnerOppositeRight(row, col) != null) {
        return true;
    }
    if (getPosOwnerOppositeUpperLeft(row, col) != null) {
        return true;
    }
    if (getPosOwnerOppositeUpperRight(row, col) != null) {
        return true;
    }
    if (getPosOwnerOppositeLowerLeft(row, col) != null) {
        return true;
    }
    if (getPosOwnerOppositeLowerRight(row, col) != null) {
        return true;
    }

    return false;
}

function changeOwnerOpposite(square) {
    let row = square.data("row");
    let col = square.data("col");

    changeOwnerOppositeUpper(row, col);
    changeOwnerOppositeLower(row, col);
    changeOwnerOppositeLeft(row, col);
    changeOwnerOppositeRight(row, col);
    changeOwnerOppositeUpperLeft(row, col);
    changeOwnerOppositeUpperRight(row, col);
    changeOwnerOppositeLowerLeft(row, col);
    changeOwnerOppositeLowerRight(row, col);
}

function changeOwnerOppositeUpper(row, col) {
    let endPos = getPosOwnerOppositeUpper(row, col);
    if (endPos == null) {
        return;
    }

    let targetCol = col;
    for (let targetRow = row - 1; endPos.row < targetRow; targetRow--) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOwnerOppositeUpper(row, col) {
    if (row == 0) {
        return null;
    }

    let targetRow = row - 1;
    let targetCol = col;

    if (getSquareStatus(targetRow, targetCol) != IS_OTHER) {
        return null;
    }

    for (targetRow--; 0 <= targetRow; targetRow--) {
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

    for (targetRow++; targetRow <= 7; targetRow++) {
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

function changeOwnerOppositeLeft(row, col) {
    let endPos = getPosOwnerOppositeLeft(row, col);
    if (endPos == null) {
        return;
    }

    let targetRow = row;
    for (let targetCol = col - 1; endPos.col < targetCol; targetCol--) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOwnerOppositeLeft(row, col) {
    if (col == 0) {
        return null;
    }

    let targetRow = row;
    let targetCol = col - 1;

    if (getSquareStatus(targetRow, targetCol) != IS_OTHER) {
        return null;
    }

    for (targetCol--; 0 <= targetCol; targetCol--) {
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

function changeOwnerOppositeRight(row, col) {
    let endPos = getPosOwnerOppositeRight(row, col);
    if (endPos == null) {
        return;
    }

    let targetRow = row;
    for (let targetCol = col + 1; targetCol < endPos.col; targetCol++) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOwnerOppositeRight(row, col) {
    if (col == 7) {
        return null;
    }

    let targetRow = row;
    let targetCol = col + 1;

    if (getSquareStatus(targetRow, targetCol) != IS_OTHER) {
        return null;
    }

    for (targetCol++; targetCol <= 7; targetCol++) {
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

function changeOwnerOppositeUpperLeft(row, col) {
    let endPos = getPosOwnerOppositeUpperLeft(row, col);
    if (endPos == null) {
        return;
    }

    for (let targetRow = row - 1, targetCol = col - 1; endPos.row < targetRow && endPos.col < targetCol; targetRow--, targetCol--) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOwnerOppositeUpperLeft(row, col) {
    if (row == 0 || col == 0) {
        return null;
    }

    let targetRow = row - 1;
    let targetCol = col - 1;

    if (getSquareStatus(targetRow, targetCol) != IS_OTHER) {
        return null;
    }

    for (targetRow--, targetCol--; targetRow >= 0 && targetCol >= 0; targetRow--, targetCol--) {
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

function changeOwnerOppositeUpperRight(row, col) {
    let endPos = getPosOwnerOppositeUpperRight(row, col);
    if (endPos == null) {
        return;
    }

    for (let targetRow = row - 1, targetCol = col + 1; endPos.row < targetRow && targetCol < endPos.col; targetRow--, targetCol++) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOwnerOppositeUpperRight(row, col) {
    if (row == 0 || col == 7) {
        return null;
    }

    let targetRow = row - 1;
    let targetCol = col + 1;

    if (getSquareStatus(targetRow, targetCol) != IS_OTHER) {
        return null;
    }

    for (targetRow--, targetCol++; targetRow >= 0 && targetCol <= 7; targetRow--, targetCol++) {
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

function changeOwnerOppositeLowerLeft(row, col) {
    let endPos = getPosOwnerOppositeLowerLeft(row, col);
    if (endPos == null) {
        return;
    }

    for (let targetRow = row + 1, targetCol = col - 1; targetRow < endPos.row && endPos.col < targetCol; targetRow++, targetCol--) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOwnerOppositeLowerLeft(row, col) {
    if (row == 7 || col == 0) {
        return null;
    }

    let targetRow = row + 1;
    let targetCol = col - 1;

    if (getSquareStatus(targetRow, targetCol) != IS_OTHER) {
        return null;
    }

    for (targetRow++, targetCol--; targetRow <= 7 && targetCol >= 0; targetRow++, targetCol--) {
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

function changeOwnerOppositeLowerRight(row, col) {
    let endPos = getPosOwnerOppositeLowerRight(row, col);
    if (endPos == null) {
        return;
    }

    for (let targetRow = row + 1, targetCol = col + 1; targetRow < endPos.row && targetCol < endPos.col; targetRow++, targetCol++) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOwnerOppositeLowerRight(row, col) {
    if (row == 7 || col == 7) {
        return null;
    }

    let targetRow = row + 1;
    let targetCol = col + 1;

    if (getSquareStatus(targetRow, targetCol) != IS_OTHER) {
        return null;
    }

    for (targetRow++, targetCol++; targetRow <= 7 && targetCol <= 7; targetRow++, targetCol++) {
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