﻿window.onload = init;
window.onresize = resizeboard;
var maindiv;
var chatWindow;
var canvas = null, ctx = null;
var dynamicFontSize = null;

function init() {
    initPlayGround();
}

function initPlayGround() {
    document.getElementById("playGround").style.display = "";
    maindiv = document.getElementById("main");
    //Declaring the chatWindow
    chatWindow = document.getElementById("chatWindow");
    canvas = document.getElementById("gameboard");
    ctx = canvas.getContext("2d");
    ctx.font = "20px helvetica"
    ctx.globalAlpha = 1.0;
    canvas.setStyle = function (styleMap) {
        var styleString = new String();
        for (i in styleMap) {
            styleString += i + ':' + styleMap[i] + '; ';
        }
        canvas.setAttribute('style', styleString);
    }
    var canvasStyle = {
        'background': '#00aaff',
        'border': '1px solid grey'
    };
    canvas.setStyle(canvasStyle);
    drawTheBoard();
}
function drawTheBoard() {
    refreshBoard();
    drawSkyGradient();
    var boardmap = createMap();
    for (var x = 0; x < 7; x++) {
        for (var y = 0; y < 7; y++) {
            ctx.font = dynamicFontSize + "px Arial";
            ctx.fillStyle="white";
            ctx.textAlign="center";
            var stepColor,stepAction;
            switch (boardmap[y][x]) {
                case 1:
                    stepColor = "blue";
                    stepAction = "Step 1";
                    break;
                case 2:
                    stepColor = "green";
                    stepAction = "Step 2";
                    break;
                case 3:
                    stepColor = "red";
                    stepAction = "step 3";
                    break;
                case 4:
                    stepColor = "yellow";
                    stepAction = "step 4";
                    break;
                case 5:
                    stepColor = "blue";
                    stepAction = "Step 5";
                    break;
                case 6:
                    stepColor = "green";
                    stepAction = "Step 6";
                    break;
                case 7:
                    stepColor = "red";
                    stepAction = "step 7";
                    break;
                case 8:
                    stepColor = "yellow";
                    stepAction = "step 8";
                    break;
                case 9:
                    stepColor = "blue";
                    stepAction = "Step 9";
                    break;
                case 10:
                    stepColor = "green";
                    stepAction = "Step 10";
                    break;
                case 11:
                    stepColor = "red";
                    stepAction = "step 11";
                    break;
                case 12:
                    stepColor = "yellow";
                    stepAction = "step 12";
                    break;
                case 13:
                    stepColor = "blue";
                    stepAction = "Step 13";
                    break;
                case 14:
                    stepColor = "green";
                    stepAction = "Step 14";
                    break;
                case 15:
                    stepColor = "red";
                    stepAction = "step 15";
                    break;
                case 16:
                    stepColor = "yellow";
                    stepAction = "step 16";
                    break;
                case 17:
                    stepColor = "blue";
                    stepAction = "Step 17";
                    break;
                case 18:
                    stepColor = "green";
                    stepAction = "Step 18";
                    break;
                case 19:
                    stepColor = "red";
                    stepAction = "step 19";
                    break;
                case 20:
                    stepColor = "yellow";
                    stepAction = "step 20";
                    break;
                case 21:
                    stepColor = "blue";
                    stepAction = "Step 21";
                    break;
                case 22:
                    stepColor = "green";
                    stepAction = "Step 22";
                    break;
                case 23:
                    stepColor = "red";
                    stepAction = "step 23";
                    break;
                case 24:
                    stepColor = "yellow";
                    stepAction = "step 24";
                    break;
                default:
                    stepColor = null;
                    break;
            }
            if (!(stepColor == null)){
                ctx.putImageData(drawARegularTile(stepColor, tileWidth), tileWidth / 2 + tileWidth * x, (tileWidth/2) / 2 + (tileWidth/2) * y);
                ctx.fillText(stepAction,tileWidth + tileWidth*x,tileWidth/2 + (tileWidth/2)*y,tileWidth);
            }
        }
    }
}

//Creates a 7*7 elements array.
function createMap() {
    var mapxy = new Array();
    //notile:0, blue:1,green:2,red:3,yello:4;
    mapxy.push([1, 2, 3, 4, 5, 6, 7]);
    mapxy.push([24, 0, 0, 0, 0, 0, 8]);
    mapxy.push([23, 0, 0, 0, 0, 0, 9]);
    mapxy.push([22, 0, 0, 0, 0, 0, 10]);
    mapxy.push([21, 0, 0, 0, 0, 0, 11]);
    mapxy.push([20, 0, 0, 0, 0, 0, 12]);
    mapxy.push([19, 18, 17, 16, 15, 14, 13]);
    return mapxy;
}
function refreshBoard() {
    canvasWidth = window.innerWidth*(4/5);
    canvasHeight = window.innerHeight;
    maindiv.style.width = canvasWidth + "px";
    maindiv.style.height = canvasHeight + "px";
    chatWindow.style.width = canvasWidth/4 + "px";
    chatWindow.style.height = canvasHeight + "px";
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;

    if (canvasHeight*2 > canvasWidth) {
        tileWidth = Math.ceil(canvasWidth / 8);
    }else{
        tileWidth = Math.ceil((canvasHeight*2)/8);
    }

    //For a normal 16" desktop tileWidth = 161 pixels and fontsize = 20px.
    //According with change in window size the dynamicFontSize will change.
    dynamicFontSize = 20*tileWidth/161;

}
function resizeboard() {
    refreshBoard();
    drawTheBoard();
    updateAllPlanes();
    changeHands();
    if (!onmobile)
        document.getElementById("buttondiv").style.visibility = "";
}
function drawSkyGradient() {
    var skyGradient = ctx.createLinearGradient(0, 0, 0, canvasHeight);
    skyGradient.addColorStop(0, '#00aaff');
    skyGradient.addColorStop(1, '#ffffff');
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}
function drawARegularTile(color, width) {
    var imgData = ctx.createImageData(width, width/2);
    var pos = 0;
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < width/2; y++) {
            setColor(color);
            imgData.data[pos++] = colorR;
            imgData.data[pos++] = colorG;
            imgData.data[pos++] = colorB;
            imgData.data[pos++] = colorA;
        }
    }
    return imgData;
}

function setColor(color) {
    switch (color) {
        case "blue": colorR = 150, colorG = 150, colorB = 255, colorA = 255; break;
        case "red": colorR = 255, colorG = 0, colorB = 0, colorA = 255; break;
        case "green": colorR = 51, colorG = 180, colorB = 51, colorA = 255; break;
        case "yellow": colorR = 255, colorG = 204, colorB = 0, colorA = 255; break;
        case "white": colorR = 255, colorG = 255, colorB = 255, colorA = 255; break;
        default: colorR = 0, colorG = 0, colorB = 0, colorA = 0; break;
    }
}
