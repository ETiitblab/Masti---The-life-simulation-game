function showModal(data){
    document.getElementById("cardframe").style.display = "";
    // document.getElementById("cardframe").src = "modal.html#" + getUserName() + "!";
    var cardSrc = "cards/" + data[1] + ".html#" + data[0] + "!"
    document.getElementById("cardframe").src = cardSrc;
}
 window.removeFrame = function(){
    // alert("removeFrame called");
    document.getElementById("cardframe").style.display = "none";
}