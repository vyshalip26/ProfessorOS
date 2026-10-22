
function updateTime() {
    var currentTime = new Date().toLocaleString();
    var timeElement = document.getElementById("timeElement");
    timeElement.innerHTML =currentTime;
}
setInterval(updateTime, 1000);

document.querySelectorAll(".app-item").forEach(function (app) {
    let startX = 0;
    let startY = 0;
    let moveX = 0;
    let moveY = 0;

    app.addEventListener("mousedown", function (e) {
        e.preventDefault();

        startX = e.clientX - moveX;
        startY = e.clientY - moveY;

        function moveApp(e) {
            moveX = e.clientX - startX;
            moveY = e.clientY - startY;

            app.style.transform =
                `translate(${moveX}px, ${moveY}px)`;
        }

        function stopMoving() {
            document.removeEventListener("mousemove", moveApp);
            document.removeEventListener("mouseup", stopMoving);
        }

        document.addEventListener("mousemove", moveApp);
        document.addEventListener("mouseup", stopMoving);
    });
});
