/**
 * Created by Srujan on 09-06-2016.
 */
/*window.onload = init;
window.onresize = refreshCanvas();
var totalWidth,totalHeight;
var detailsDiv;
var canvas = null, ctx = null;
var dynamicFontSize = null;

function init(){
    initDetails();

}

function initDetails() {
    canvas = document.getElementById("details").style.display="";
    detailsDiv = document.getElementById("detailsDiv");
    ctx = canvas.getContext("2d");
    ctx.globalAlpha = 1.0;
    var canvasStyle = {
        'background': '#00ff00',
        'border': '1px solid grey'
    };
    canvas.setStyle = function (styleMap) {
        var styleString = new String();
        for (i in styleMap) {
            styleString += i + ':' + styleMap[i] + '; ';
        }
        canvas.setAttribute('style', styleString);
    }
    canvas.setStyle(canvasStyle);
    refreshCanvas();
}


function refreshCanvas() {
    canvasWidth = window.innerWidth*(4/5);
    canvasHeight = window.innerHeight*(1/6);
    detailsDiv.style.width = canvasWidth + "px";
    detailsDiv.style.height = canvasHeight + "px";
    ctx.canvas.width = canvasWidth;
    ctx.canvas.height = canvasHeight;
}*/