
function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeElement = document.getElementById("timeElement");
    timeElement.innerHTML =currentTime;
}
setInterval(updateTime, 1000);