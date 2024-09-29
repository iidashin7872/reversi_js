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
    changeOwner(getTargeSquare(3,3));
    changeOwner(getTargeSquare(3,4));
    changeOwner(getTargeSquare(4,4));
    changeOwner(getTargeSquare(4,3));
}

function changeOwner(square) {
    putPiece(square, getTurnString());
    changeTurn();
}

function putPiece(targetSquare, owner) {
    targetSquare.text("●").attr("data-owner", owner).addclass("selected");
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

function getTargeSquare(row, col) {
    return $("[data-row=" + row + "][data-col=" + col + "]");
}

function canSelect(square) {
    if (square.hasClass("selected")) {
        return false;
    }
    return true;
}