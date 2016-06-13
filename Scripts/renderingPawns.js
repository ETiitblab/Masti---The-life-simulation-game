/**
 * Created by Srujan on 11-06-2016.
 */
var pawn_canvas = null, pawn_ctx = null;
var pawn_image;
var currentPawnPosition;

function drawThePawn(x,y) {
    pawn_image = new Image();
    pawn_image.src = 'pawns/pawn_red.png';
    pawn_image.style.opacity = 1;
    pawn_image.onload = function(){
        pawn_ctx.drawImage(pawn_image
            , tileWidth / 2 + tileWidth * x + tileWidth/2 - tileWidth*32/322 //To make sure pawn is in the centre of the tile. 
            , (tileWidth/2) / 2 + (tileWidth/2) * y + tileWidth/4 - tileWidth*32/322
            , tileWidth*32/161 // Pawn dimensions should be 32px when tile is 161 px wide. 
                               // The formula helps resizing the pawn when window size is changed.
            , tileWidth*32/161);
    }
}

function moveThePawn(moves){
    clearCanvas();
    currentPawnPosition = (currentPawnPosition + moves)%24;
    // alert('new position:' + currentPawnPosition);
    drawThePawn(getTileX(currentPawnPosition + 1),getTileY(currentPawnPosition + 1));
}

function clearCanvas(){
    pawn_ctx.clearRect(0,0,pawn_canvas.width,pawn_canvas.height);
}

function getTileX(currentPosition){
    switch (currentPosition){
        case 1: return 0; break;
        case 2: return 1; break;
        case 3: return 2; break;
        case 4: return 3; break;
        case 5: return 4; break;
        case 6: return 5; break;
        case 7: return 6; break;
        case 8: return 6; break;
        case 9: return 6; break;
        case 10: return 6; break;
        case 11: return 6; break;
        case 12: return 6; break;
        case 13: return 6; break;
        case 14: return 5; break;
        case 15: return 4; break;
        case 16: return 3; break;
        case 17: return 2; break;
        case 18: return 1; break;
        case 19: return 0; break;
        case 20: return 0; break;
        case 21: return 0; break;
        case 22: return 0; break;
        case 23: return 0; break;
        case 24: return 0; break;
        default:
            alert("No case found.");
            break;
    }
}
function getTileY(currentPosition) {
    switch (currentPosition){
        case 1: return 0; break;
        case 2: return 0; break;
        case 3: return 0; break;
        case 4: return 0; break;
        case 5: return 0; break;
        case 6: return 0; break;
        case 7: return 0; break;
        case 8: return 1; break;
        case 9: return 2; break;
        case 10: return 3; break;
        case 11: return 4; break;
        case 12: return 5; break;
        case 13: return 6; break;
        case 14: return 6; break;
        case 15: return 6; break;
        case 16: return 6; break;
        case 17: return 6; break;
        case 18: return 6; break;
        case 19: return 6; break;
        case 20: return 5; break;
        case 21: return 4; break;
        case 22: return 3; break;
        case 23: return 2; break;
        case 24: return 1; break;
    }
}

function initPawnCanvas(){
    pawn_canvas =  document.getElementById("pawnboard");
    pawn_ctx = pawn_canvas.getContext("2d");
    pawn_canvas.setStyle = function (styleMap) {
        var styleString = new String();
        for (i in styleMap) {
            styleString += i + ':' + styleMap[i] + '; ';
        }
        pawn_canvas.setAttribute('style', styleString);
    }
    var canvasStyle = {

        'border': '1px solid grey'
    };
    pawn_canvas.setStyle(canvasStyle);

    canvasWidth = window.innerWidth*(4/5);
    canvasHeight = window.innerHeight*(17/20);
    pawn_ctx.canvas.width = canvasWidth;
    pawn_ctx.canvas.height = canvasHeight;

    drawThePawn(-0.75,0);
}