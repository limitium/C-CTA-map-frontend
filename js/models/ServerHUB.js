function ServerHUB(x, y, s) {
    this.x = x;
    this.y = y;
    this.s = s;
}
ServerHUB.prototype.isVisible = function () {
    if (settings['filter-endgame-hide']) {
        return false;
    }
    return true;
};
ServerHUB.prototype.inArea = function (x, y) {
    var s = settings['size-server-hub'],
        size = (1 + (s / 2) ) ,
        size2 = (-1 + (s / 2));
    if (this.isVisible() && x <= this.x + size && x >= this.x - size2 && y <= this.y + size && y >= this.y - size2) {
        return true;
    }
    return false;
};
ServerHUB.name = "ServerHUB";
ServerHUB.render = function (renderer, scale, square, hub) {
    var s = settings['size-server-hub'],
        size = (1 + (s / 2) ) * scale,
        size2 = (-1 + (s / 2)) * scale,
        size3 = 1 * scale,

        x = (hub.x - square.x) * scale ,
        y = (hub.y - square.y) * scale;

    renderer.beginPath();
    var grd = renderer.createRadialGradient(x + size3, y + size3, 0, x + size3, y + size3, size);
    var color1 = settings['color-server-hub-crash-start'],
        color2 = settings['color-server-hub-crash'];

    if (hub.s == 2) {
        color1 = settings['color-server-hub-start'];
        color2 = settings['color-server-hub'];
    }
    grd.addColorStop(0, color1);
    grd.addColorStop(1, color2);

    renderer.fillStyle = grd;
    renderer.strokeStyle = color2;
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