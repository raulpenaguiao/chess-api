let url="https://lichess.org/api/puzzle/daily"
const displayHTML = document.querySelector("#display");
const boardHTML = document.querySelector("#board");
let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
let numbers = ['1', '2', '3', '4', '5', '6', '7', '8']

const pieceParser = {
    "Rook" : "4",
    "King" : "8",
    "Queen" : "7",
    "Bishop" : "6",
    "Knight" : "2",
    "Pawn" : "9"
};

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}


const squareIndexer = new Array(0);
for(let i = 0; i<8; i++){
    for(let j=0; j<8; j++){
        squareIndexer.push(letters[j] + numbers[i]);
    }
}
const squareIndexerInverted = {};
squareIndexer.forEach((item, index) => {
    squareIndexerInverted[item] = index;
});
let possibleMoves = {
    rook : {},
    bishop : {},
    knight : {},
    queen : {},
    king : {},
    whitePawn : {},
    blackPawn : {},
}, possibleArrivals = {
    rook : {},
    bishop : {},
    knight : {},
    queen : {},
    king : {},
    whitePawn : {},
    blackPawn : {},
};
for(let i = 0; i<8; i++){
    for(let j=0; j<8; j++){
        possibleMoves.rook[letters[j] + numbers[i]] = [];
        possibleArrivals.rook[letters[j] + numbers[i]] = [];
        possibleMoves.bishop[letters[j] + numbers[i]] = [];
        possibleArrivals.bishop[letters[j] + numbers[i]] = [];
        possibleMoves.knight[letters[j] + numbers[i]] = [];
        possibleArrivals.knight[letters[j] + numbers[i]] = [];
        possibleMoves.whitePawn[letters[j] + numbers[i]] = [];
        possibleArrivals.whitePawn[letters[j] + numbers[i]] = [];
        possibleMoves.blackPawn[letters[j] + numbers[i]] = [];
        possibleArrivals.blackPawn[letters[j] + numbers[i]] = [];
        possibleMoves.queen[letters[j] + numbers[i]] = [];
        possibleArrivals.queen[letters[j] + numbers[i]] = [];
        possibleMoves.king[letters[j] + numbers[i]] = [];
        possibleArrivals.king[letters[j] + numbers[i]] = [];
    }
}
//Moves from rooks
for(let i = 0; i<8; i++){
    for(let j=0; j<8; j++){
        for(let k = 0; k < 8; k++){
            if(k !== j){
                possibleMoves.rook[letters[j] + numbers[i]].push(letters[k] + numbers[i]);
                possibleArrivals.rook[letters[k] + numbers[i]].push(letters[j] + numbers[i]);
            }
            if(k !== i){
                possibleMoves.rook[letters[j] + numbers[i]].push(letters[j] + numbers[k]);
                possibleArrivals.rook[letters[j] + numbers[k]].push(letters[j] + numbers[i]);
            }
        }
    }
}
//Moves from bishops
for(let i = 0; i<8; i++){
    for(let j=0; j<8; j++){
        for(let k = -8; k < 8; k++){
            if(k!== 0 && j - k < 8 && j - k >= 0 && i - k < 8 && i - k >= 0){
                possibleMoves.bishop[letters[j] + numbers[i]].push(letters[j-k] + numbers[i-k]);
                possibleArrivals.bishop[letters[j-k] + numbers[i-k]].push(letters[j] + numbers[i]);
            }
            if(k!== 0 && j - k < 8 && j - k >= 0 && i + k < 8 && i + k >= 0){
                possibleMoves.bishop[letters[j] + numbers[i]].push(letters[j-k] + numbers[i+k]);
                possibleArrivals.bishop[letters[j-k] + numbers[i+k]].push(letters[j] + numbers[i]);
            }
        }
    }
}
//Moves from queens
for(let i = 0; i<8; i++){
    for(let j=0; j<8; j++){
        possibleMoves.queen[letters[j] + numbers[i]] = possibleMoves.rook[letters[j] + numbers[i]].concat(possibleMoves.bishop[letters[j] + numbers[i]]);
        possibleArrivals.queen[letters[j] + numbers[i]] = possibleArrivals.rook[letters[j] + numbers[i]].concat(possibleArrivals.bishop[letters[j] + numbers[i]]);
    }
}
//Moves from knights
for(let i = 0; i<8; i++){
    for(let j=0; j<8; j++){
        const knightJumps = [[-1, 2], [1, -2], [2, -1], [-2, 1], [-1, -2], [1, 2], [-2, -1], [2, 1]];
        knightJumps.forEach(item =>{
            let x = i + item[0];
            let y = j + item[1];
            if(0<= x && x < 8 && 0 <= y && y < 8){
                possibleMoves.knight[letters[j] + numbers[i]].push(letters[y] + numbers[x]);
                possibleArrivals.knight[letters[y] + numbers[x]].push(letters[j] + numbers[i]);
            }
        })
    }
}
//Moves from kings
for(let i = 0; i<8; i++){
    for(let j=0; j<8; j++){
        const kingJumps = [[1, 1], [1, 0], [1, -1], [0, 1], [0, -1], [-1, 1], [-1, 0], [-1, -1]];
        kingJumps.forEach(item =>{
            let x = i + item[0];
            let y = j + item[1];
            if(0<= x && x < 8 && 0 <= y && y < 8){
                possibleMoves.king[letters[j] + numbers[i]].push(letters[y] + numbers[x]);
                possibleArrivals.king[letters[y] + numbers[x]].push(letters[j] + numbers[i]);
            }
        })
    }
}
//Captures from blackPawns
for(let i = 0; i<8; i++){
    for(let j=0; j<8; j++){
        const blackPawnCaptures = [[-1, 1], [-1, -1]];
        blackPawnCaptures.forEach(item =>{
            let x = i + item[0];
            let y = j + item[1];
            if(0<= x && x < 8 && 0 <= y && y < 8){
                possibleMoves.blackPawn[letters[j] + numbers[i]].push(letters[y] + numbers[x]);
                possibleArrivals.blackPawn[letters[y] + numbers[x]].push(letters[j] + numbers[i]);
            }
        })
    }
}
//Captures from whitePawns
for(let i = 0; i<8; i++){
    for(let j=0; j<8; j++){
        const whitePawnCaptures = [[1, 1], [1, -1]];
        whitePawnCaptures.forEach(item =>{
            let x = i + item[0];
            let y = j + item[1];
            if(0<= x && x < 8 && 0 <= y && y < 8){
                possibleMoves.whitePawn[letters[j] + numbers[i]].push(letters[y] + numbers[x]);
                possibleArrivals.whitePawn[letters[y] + numbers[x]].push(letters[j] + numbers[i]);
            }
        })
    }
}


//Place squares in the DOM
let placeSquares = function(disp, side="white"){
    disp.innerHTML = ""
    let letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']
    let numbers = ['8', '7', '6', '5', '4', '3', '2', '1']
    if(side === "black" || side === 1){
        letters.reverse()
        numbers.reverse()
    }
    for(let i = 0; i<8; i++){
        for(let j=0; j<8; j++){
            if((i+j)%2 === 0){
                disp.innerHTML += '<div class="boardSquare white" id="' + letters[j] + numbers[i] + '"></div>';
            } else{
                disp.innerHTML += '<div class="boardSquare black" id="' + letters[j] + numbers[i] + '"></div>';
            }
        }
    }
}
placeSquares(boardHTML)
class Board{
    constructor(){
        this.squares = {};
        for(let i = 0; i<8; i++){
            for(let j=0; j<8; j++){
                this.squares[letters[j] + numbers[i]] = undefined;
            }
        }
        for(let i = 0; i<8; i++){
            this.squares[letters[i] + "2"] = "whitePawn";
            this.squares[letters[i] + "7"] = "blackPawn";
        }
        this.squares.a1 = "whiteRook";
        this.squares.b1 = "whiteKnight";
        this.squares.c1 = "whiteBishop";
        this.squares.d1 = "whiteQueen";
        this.squares.e1 = "whiteKing";
        this.squares.f1 = "whiteBishop";
        this.squares.g1 = "whiteKnight";
        this.squares.h1 = "whiteRook";
        this.squares.a8 = "blackRook";
        this.squares.b8 = "blackKnight";
        this.squares.c8 = "blackBishop";
        this.squares.d8 = "blackQueen";
        this.squares.e8 = "blackKing";
        this.squares.f8 = "blackBishop";
        this.squares.g8 = "blackKnight";
        this.squares.h8 = "blackRook";
    }
    move(move, player){
        //This function does NOT check if a move is legal
        let str = move;
        if(str[str.length-1] === "+" || str[str.length-1] === "#" ){
            str = str.substring(0, str.length-1);
        }
        if(str === "O-O"){//Short Castels
            if(player === "white"){
                this.squares.e1 = undefined;
                this.squares.f1 = "whiteRook"
                this.squares.g1 = "whiteKing"
                this.squares.h1 = undefined; 
            } else{
                this.squares.e8 = undefined;
                this.squares.f8 = "blackRook"
                this.squares.g8 = "blackKing"
                this.squares.h8 = undefined;
            }
        }
        if(str === "O-O-O"){//Long castels
            if(player === "white"){
                this.squares.e1 = undefined;
                this.squares.d1 = "whiteRook"
                this.squares.c1 = "whiteKing"
                this.squares.a1 = undefined;
            } else{
                this.squares.e8 = undefined;
                this.squares.d8 = "blackRook"
                this.squares.c8 = "blackKing"
                this.squares.a8 = undefined;
            }
        }
        let piece = "";
        let squareFrom = "";
        let squareTo = str.substring(str.length-2, str.length);
        if(str[0] === "Q"){//It's a queen
            piece = "Queen";
            let count = 0;
            let squaresFrom = [];
            possibleArrivals.queen[squareTo].forEach(item => {
                if(typeof this.squares[item] !== 'undefined' && this.squares[item] === player + piece ){
                    squaresFrom.push(item);
                    count += 1;
                }
            })
            if(count === 1){
                squareFrom = squaresFrom[0];
            } else{
                let ch = str[1];
                if( (/[a-zA-Z]/).test(ch) ){//Is this an alpha character?
                    squaresFrom.forEach(item => {
                        if(item[0] === ch){
                            squareFrom = item;
                        }
                    })
                } else {
                    squaresFrom.forEach(item => {
                        if(item[1] === ch){
                            squareFrom = item;
                        }
                    })
                }
            }
        } else if(str[0] === "K"){//It's a king
            piece = "King";
            let count = 0;
            let squaresFrom = [];
            possibleArrivals.king[squareTo].forEach(item => {
                if(typeof this.squares[item] !== 'undefined' && this.squares[item] === player + piece ){
                    squaresFrom.push(item);
                    count += 1;
                }
            })
            if(count === 1){
                squareFrom = squaresFrom[0];
            } else{
                let ch = str[1];
                if( (/[a-zA-Z]/).test(ch) ){//Is this an alpha character?
                    squaresFrom.forEach(item => {
                        if(item[0] === ch){
                            squareFrom = item;
                        }
                    })
                } else {
                    squaresFrom.forEach(item => {
                        if(item[1] === ch){
                            squareFrom = item;
                        }
                    })
                }
            }
        } else if(str[0] === "N"){//It's a knight
            piece = "Knight";
            let count = 0;
            let squaresFrom = [];
            possibleArrivals.knight[squareTo].forEach(item => {
                if(typeof this.squares[item] !== 'undefined' && this.squares[item] === player + piece ){
                    squaresFrom.push(item);
                    count += 1;
                }
            })
            if(count === 1){
                squareFrom = squaresFrom[0];
            } else{
                let ch = str[1];
                if( (/[a-zA-Z]/).test(ch) ){//Is this an alpha character?
                    squaresFrom.forEach(item => {
                        if(item[0] === ch){
                            squareFrom = item;
                        }
                    })
                } else {
                    squaresFrom.forEach(item => {
                        if(item[1] === ch){
                            squareFrom = item;
                        }
                    })
                }
            }
        } else if(str[0] === "R"){//It's a rook
            piece = "Rook";
            let count = 0;
            let squaresFrom = [];
            possibleArrivals.rook[squareTo].forEach(item => {
                if(typeof this.squares[item] !== 'undefined' && this.squares[item] === player + piece ){
                    squaresFrom.push(item);
                    count += 1;
                }
            })
            if(count === 1){
                squareFrom = squaresFrom[0];
            } else{
                let ch = str[1];
                if( (/[a-zA-Z]/).test(ch) ){//Is this an alpha character?
                    squaresFrom.forEach(item => {
                        if(item[0] === ch){
                            squareFrom = item;
                        }
                    })
                } else {
                    squaresFrom.forEach(item => {
                        if(item[1] === ch){
                            squareFrom = item;
                        }
                    })
                }
            }
        } else if(str[0] === "B"){//It's a bishop
            piece = "Bishop";
            let count = 0;
            let squaresFrom = [];
            possibleArrivals.bishop[squareTo].forEach(item => {
                if(typeof this.squares[item] !== 'undefined' && this.squares[item] === player + piece ){
                    squaresFrom.push(item);
                    count += 1;
                }
            })
            //console.log("count = ", count, " and squareFrom = ", squaresFrom);
            if(count === 1){
                squareFrom = squaresFrom[0];
            } else{
                let ch = str[1];
                if( (/[a-zA-Z]/).test(ch) ){//Is this an alpha character?
                    squaresFrom.forEach(item => {
                        if(item[0] === ch){
                            squareFrom = item;
                        }
                    })
                } else {
                    squaresFrom.forEach(item => {
                        if(item[1] === ch){
                            squareFrom = item;
                        }
                    })
                }
            }
        } else{//It's a pawn
            if(str[str.length-2] === "="){//it's a promotion
                squareTo = str.substring(str.length-4, str.length-2);
                if(str.length-1 === "Q"){//It's a queen
                    piece = "Queen";
                } else if(str.length-1 === "N"){//It's a knight
                    piece = "Knight";
                } else if(str.length-1 === "R"){//It's a rook
                    piece = "Rook";
                } else{//It's a bishop
                    piece = "Bishop";
                }
            } else{//no promotion, keep the pawn
                piece = "Pawn";
            }
            if(str[1] == "x"){//It's a pawn capture
                if(false){//Is en passant

                } else{//Is not en passant 
                    if(player === "white"){
                        possibleArrivals.whitePawn[squareTo].forEach(item => {
                            if( typeof this.squares[item] !== 'undefined' && this.squares[item] === player + "Pawn"){
                                squareFrom = item;
                            }
                        })
                    } else{
                        possibleArrivals.blackPawn[squareTo].forEach(item => {
                            if( typeof this.squares[item] !== 'undefined' && this.squares[item] === player + "Pawn"){
                                squareFrom = item;
                            }
                        })
                    }
                }
            } else{//It's a pawn move
                if(player === "white"){
                    squareFrom = squareIndexer[squareIndexerInverted[squareTo] - 8];
                    if(typeof this.squares[squareFrom] === 'undefined'){
                        squareFrom = squareIndexer[squareIndexerInverted[squareTo] - 16];
                    }
                } else{
                    squareFrom = squareIndexer[squareIndexerInverted[squareTo] + 8]
                    if(typeof this.squares[squareFrom] === 'undefined'){
                        squareFrom = squareIndexer[squareIndexerInverted[squareTo] + 16];
                    }
                }
            }
        }
        //We still have to figure out from which square ti came from
        this.squares[squareTo] = player + piece;
        if(squareFrom !== ""){
            this.squares[squareFrom] = undefined;
            //console.log("piece = ", piece, " of player ", player,  " moved  from ", squareFrom, " to ", squareTo);
        } else{
            //console.log("piece = ", piece, " of player ", player,  " moved  from somewhere unnidentified to ", squareTo);
        }
        return undefined;
    }
    listPieces(){
        let list = new Array(0);
        for(let i = 0; i<8; i++){
            for(let j=0; j<8; j++){
                if( typeof this.squares[letters[j] + numbers[i]] !== 'undefined'){
                    let str = this.squares[letters[j] + numbers[i]];
                    list.push([letters[j] + numbers[i], str.substring(5, str.length), str.substring(0, 5)])//[square, piece, color]
                }
            }
        }
        return list;
    }
}


let squaresHTML
let style = "B"
fetch(url)
.then(res => res.json()) // parse response as JSON
.then(data => {
    placeSquares(boardHTML, (data.game.pgn.split(" ").length )%2 === 0 ? "white" : "black" )
    squaresHTML = new Array(0);
    for(let i=0; i<8;i++){
        for(let j=0; j<8; j++){
            squaresHTML.push(document.querySelector("#"+ letters[j] + numbers[i]));
        }
    }
    squaresHTML.forEach(item => {//Addeventlisteners
    })
    let moves = data.game.pgn.split(" ");
    //Create the list of pieces/position on the board
    let emptyBoard = new Board()
    //Read out the moves and apply it to the board
    moves.forEach((mv, index) => {
        if(index % 2 === 0){
            emptyBoard.move(mv, "white"); 
        } else{
            emptyBoard.move(mv, "black");
        }
    });
    listOfPieces = emptyBoard.listPieces();
    listOfPieces.forEach(item => {
        squaresHTML[squareIndexerInverted[item[0]]].style.backgroundImage = `url(assets/images/pieces/Style${style}Color${item[2]}Piece${pieceParser[item[1]]}.png)`;
    })
})
.catch(err => {
    console.log(`error ${err}`)
    displayHTML.innerHTML += `error ${err}`
});




