function showModal(){
    // alert(myUserName);
    document.getElementById("cardframe").style.display = "";
    document.getElementById("cardframe").src = "modal.html";
}
 window.removeFrame = function(){
    // alert("removeFrame called");
    document.getElementById("cardframe").style.display = "none";
}
