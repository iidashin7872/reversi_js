let isOddTurn = true;

$(function () {
    $(".square").click(clickSquareEvent);
});

function clickSquareEvent() {
    let square = $(this);
    putPiece(square, getTurnString())
    changeTurn()
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