function ServerHUB(x, y, s, es) {
    this.x = x;
    this.y = y;
    this.s = s;
    this.es = es;
}
ServerHUB.render = function (renderer, scale, square, hub) {


    var size = 2.5 * scale,
        size2 = 0.5 * scale,
        size3 = 1 * scale,
        x = (hub.x - square.x) * scale ,
        y = (hub.y - square.y) * scale;


    renderer.beginPath();
    var grd = renderer.createRadialGradient(x + size3, y + size3, 0, x + size3, y + size3, size);
    grd.addColorStop(0, 'rgba(255,255,0,0.3)');
    grd.addColorStop(1, "#ffff00");

    renderer.fillStyle = grd;
    renderer.strokeStyle = "#ffff00";
    renderer.lineWidth = 1;

    renderer.moveTo(x - size2, y - size2);
    renderer.lineTo(x - size2, y + size);
    renderer.lineTo(x + size, y + size);
    renderer.lineTo(x + size, y - size2);
    renderer.lineTo(x - size2, y - size2);

    renderer.fill();
    renderer.stroke();
    renderer.closePath();
};