SQUARE_STATUS_IS_OWNED = "01";
SQUARE_STATUS_IS_OTHER = "02";
SQUARE_STATUS_NOT_SELECTED = "09";

toastr.options = {
    tapToDismiss: false, 
    timeOut: 0,
    extendedTimeOut: 0,  
};

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

    toastr.remove();

    changeOwner(square);

    if (isGameEnd()) {
        toastEndMessage("ゲームが終了しました.");
        return;
    }

    if (isPass()) {
        toastr.remove();
        toastr.error(getTurnString() + "には置けるマスがありません.");
    
        changeTurn();

        if (isPass()) {
            toastr.error(getTurnString() + "には置けるマスがありません.");
            toastEndMessage("置けるマスがなくなりました");
        } else {
            setTimeout(function () {
                toastr.info(getTurnString() + "の番です.");
            }, 1000);
        }
        return;
    }

    toastr.info(getTurnString() + "の番です.");
}

function initializeEvent() {
    toastr.remove();

    $(".square")
        .removeClass("selected")
        .text("")
        .attr("data-owner", "");

    isOddTurn = true;

    changeOwner(getTargetSquare(3,4));
    changeOwner(getTargetSquare(3,3));
    changeOwner(getTargetSquare(4,3));
    changeOwner(getTargetSquare(4,4));

    toastr.info(getTurnString() + "の番です.");
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

    if (getPosOppositeUpper(row, col) != null) {
        return true;
    }
    if (getPosOppositeLower(row, col) != null) {
        return true;
    }
    if (getPosOppositeLeft(row, col) != null) {
        return true;
    }
    if (getPosOppositeRight(row, col) != null) {
        return true;
    }
    if (getPosOppositeUpperLeft(row, col) != null) {
        return true;
    }
    if (getPosOppositeUpperRight(row, col) != null) {
        return true;
    }
    if (getPosOppositeLowerLeft(row, col) != null) {
        return true;
    }
    if (getPosOppositeLowerRight(row, col) != null) {
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
    let endPos = getPosOppositeUpper(row, col);
    if (endPos == null) {
        return;
    }

    let targetCol = col;
    for (let targetRow = row - 1; endPos.row < targetRow; targetRow--) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOppositeUpper(row, col) {
    if (row == 0) {
        return null;
    }

    let targetRow = row - 1;
    let targetCol = col;

    if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
        return null;
    }

    for (targetRow--; 0 <= targetRow; targetRow--) {
        let status = getSquareStatus(targetRow, targetCol);
        
        if (status == SQUARE_STATUS_NOT_SELECTED) {
            return null;
        }

        if (status == SQUARE_STATUS_IS_OWNED) {
            return {
                row: targetRow, 
                col: targetCol, 
            };
        }
    }
    return null;
}

function changeOwnerOppositeLower(row, col) {
    let endPos = getPosOppositeLower(row, col);
    if (endPos == null) {
        return;
    }

    let targetCol = col;
    for (let targetRow = row + 1; targetRow < endPos.row; targetRow++) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOppositeLower(row, col) {
    if (row == 7) {
        return null;
    }

    let targetRow = row + 1;
    let targetCol = col;

    if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
        return null;
    }

    for (targetRow++; targetRow <= 7; targetRow++) {
        let status = getSquareStatus(targetRow, targetCol);
        
        if (status == SQUARE_STATUS_NOT_SELECTED) {
            return null;
        }

        if (status == SQUARE_STATUS_IS_OWNED) {
            return {
                row: targetRow, 
                col: targetCol, 
            };
        }
    }
    return null;
}

function changeOwnerOppositeLeft(row, col) {
    let endPos = getPosOppositeLeft(row, col);
    if (endPos == null) {
        return;
    }

    let targetRow = row;
    for (let targetCol = col - 1; endPos.col < targetCol; targetCol--) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOppositeLeft(row, col) {
    if (col == 0) {
        return null;
    }

    let targetRow = row;
    let targetCol = col - 1;

    if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
        return null;
    }

    for (targetCol--; 0 <= targetCol; targetCol--) {
        let status = getSquareStatus(targetRow, targetCol);
        
        if (status == SQUARE_STATUS_NOT_SELECTED) {
            return null;
        }

        if (status == SQUARE_STATUS_IS_OWNED) {
            return {
                row: targetRow,
                col: targetCol,
            };
        }
    }
    return null;
}

function changeOwnerOppositeRight(row, col) {
    let endPos = getPosOppositeRight(row, col);
    if (endPos == null) {
        return;
    }

    let targetRow = row;
    for (let targetCol = col + 1; targetCol < endPos.col; targetCol++) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOppositeRight(row, col) {
    if (col == 7) {
        return null;
    }

    let targetRow = row;
    let targetCol = col + 1;

    if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
        return null;
    }

    for (targetCol++; targetCol <= 7; targetCol++) {
        let status = getSquareStatus(targetRow, targetCol);

        if (status == SQUARE_STATUS_NOT_SELECTED) {
            return null;
        }

        if (status == SQUARE_STATUS_IS_OWNED) {
            return {
                row: targetRow,
                col: targetCol,
            };
        }
    }
    return null;
}

function changeOwnerOppositeUpperLeft(row, col) {
    let endPos = getPosOppositeUpperLeft(row, col);
    if (endPos == null) {
        return;
    }

    for (let targetRow = row - 1, targetCol = col - 1; endPos.row < targetRow && endPos.col < targetCol; targetRow--, targetCol--) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOppositeUpperLeft(row, col) {
    if (row == 0 || col == 0) {
        return null;
    }

    let targetRow = row - 1;
    let targetCol = col - 1;

    if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
        return null;
    }

    for (targetRow--, targetCol--; targetRow >= 0 && targetCol >= 0; targetRow--, targetCol--) {
        let status = getSquareStatus(targetRow, targetCol);

        if (status == SQUARE_STATUS_NOT_SELECTED) {
            return null;
        }

        if (status == SQUARE_STATUS_IS_OWNED) {
            return {
                row: targetRow,
                col: targetCol,
            };
        }
    }
    return null;
}

function changeOwnerOppositeUpperRight(row, col) {
    let endPos = getPosOppositeUpperRight(row, col);
    if (endPos == null) {
        return;
    }

    for (let targetRow = row - 1, targetCol = col + 1; endPos.row < targetRow && targetCol < endPos.col; targetRow--, targetCol++) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOppositeUpperRight(row, col) {
    if (row == 0 || col == 7) {
        return null;
    }

    let targetRow = row - 1;
    let targetCol = col + 1;

    if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
        return null;
    }

    for (targetRow--, targetCol++; targetRow >= 0 && targetCol <= 7; targetRow--, targetCol++) {
        let status = getSquareStatus(targetRow, targetCol);

        if (status == SQUARE_STATUS_NOT_SELECTED) {
            return null;
        }

        if (status == SQUARE_STATUS_IS_OWNED) {
            return {
                row: targetRow,
                col: targetCol,
            };
        }
    }
    return null;
}

function changeOwnerOppositeLowerLeft(row, col) {
    let endPos = getPosOppositeLowerLeft(row, col);
    if (endPos == null) {
        return;
    }

    for (let targetRow = row + 1, targetCol = col - 1; targetRow < endPos.row && endPos.col < targetCol; targetRow++, targetCol--) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOppositeLowerLeft(row, col) {
    if (row == 7 || col == 0) {
        return null;
    }

    let targetRow = row + 1;
    let targetCol = col - 1;

    if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
        return null;
    }

    for (targetRow++, targetCol--; targetRow <= 7 && targetCol >= 0; targetRow++, targetCol--) {
        let status = getSquareStatus(targetRow, targetCol);

        if (status == SQUARE_STATUS_NOT_SELECTED) {
            return null;
        }

        if (status == SQUARE_STATUS_IS_OWNED) {
            return {
                row: targetRow,
                col: targetCol,
            };
        }
    }
    return null;
}

function changeOwnerOppositeLowerRight(row, col) {
    let endPos = getPosOppositeLowerRight(row, col);
    if (endPos == null) {
        return;
    }

    for (let targetRow = row + 1, targetCol = col + 1; targetRow < endPos.row && targetCol < endPos.col; targetRow++, targetCol++) {
        let targetSquare = getTargetSquare(targetRow, targetCol);
        putPiece(targetSquare, getTurnString());
    }
}

function getPosOppositeLowerRight(row, col) {
    if (row == 7 || col == 7) {
        return null;
    }

    let targetRow = row + 1;
    let targetCol = col + 1;

    if (getSquareStatus(targetRow, targetCol) != SQUARE_STATUS_IS_OTHER) {
        return null;
    }

    for (targetRow++, targetCol++; targetRow <= 7 && targetCol <= 7; targetRow++, targetCol++) {
        let status = getSquareStatus(targetRow, targetCol);

        if (status == SQUARE_STATUS_NOT_SELECTED) {
            return null;
        }

        if (status == SQUARE_STATUS_IS_OWNED) {
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
        return SQUARE_STATUS_NOT_SELECTED;
    }

    if (getTurnString() == targetSquare.attr("data-owner")) {
        return SQUARE_STATUS_IS_OWNED
    }

    return SQUARE_STATUS_IS_OTHER
}

function isGameEnd() {
    if ($(".square.selected").length == 64) {
        return true;
    }
    return false;
}

function toastEndMessage(message) {
    let countBlack = $("[data-owner=black]").length;
    let countWhite = $("[data-owner=white]").length;

    let judgeString = "black:" + countBlack + "<br/>" + "white:" + countWhite + "<br/>";
    
    if (countBlack == countWhite) {
        toastr.success(message + "<br/>" + judgeString + "引き分けです.")
    } else if (countBlack < countWhite) {
        toastr.success(message + "<br/>" + judgeString + "Whiteの勝利です.")
    } else {
        toastr.success(message + "<br/>" + judgeString + "Blackの勝利です.")
    }
}

function isPass() {
    if ($(".square.can-select").length == 0) {
        return true;
    }
    return false;
}