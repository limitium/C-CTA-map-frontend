function ControlHUB(x, y, ai) {
    this.x = x;
    this.y = y;
    this.ai = ai;
}
ControlHUB.render = function (renderer, scale, square, hub) {
    var size = 5.5 * scale,
        size2 = -0.5 * scale,
        size3 = 3 * scale,
        x = (hub.x - square.x) * scale ,
        y = (hub.y - square.y) * scale;


    renderer.beginPath();
    var grd = renderer.createRadialGradient(x + size3, y + size3, 0, x + size3, y + size3, size);
    grd.addColorStop(0, settings['color-control-hub-start']);
    grd.addColorStop(1,  settings['color-control-hub']);

    renderer.fillStyle = grd;
    renderer.strokeStyle =  settings['color-control-hub'];
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