function showModal(){
    alert("showModal: " + getUserName());
    document.getElementById("cardframe").style.display = "";
    document.getElementById("cardframe").src = "modal.html?" + getUserName() + "!";
}
 window.removeFrame = function(){
    // alert("removeFrame called");
    document.getElementById("cardframe").style.display = "none";
}