function CenterHUB(x, y) {
    this.x = x;
    this.y = y;
}
CenterHUB.prototype.isVisible = function () {
    if (settings['filter-endgame-hide']) {
        return false;
    }
    return true;
};
CenterHUB.prototype.inArea = function (x, y) {
    var s = settings['size-center-hub'],
        size = (1.5 + (s / 2) ) ,
        size2 = (-1.5 + (s / 2));
    if (this.isVisible() && x <= this.x + size && x >= this.x - size2 && y <= this.y + size && y >= this.y - size2) {
        return true;
    }
    return false;
};
CenterHUB.name = "CenterHUB";
CenterHUB.render = function (renderer, scale, square, hub) {
    var s = settings['size-center-hub'],
        size = (1.5 + (s / 2) ) * scale,
        size2 = (-1.5 + (s / 2) ) * scale,
        size3 = 1.5 * scale,
        x = (hub.x - square.x) * scale ,
        y = (hub.y - square.y) * scale;

    renderer.beginPath();
    var grd = renderer.createRadialGradient(x + size3, y + size3, 0, x + size3, y + size3, size);
    grd.addColorStop(0, settings['color-center-hub-start']);
    grd.addColorStop(1, settings['color-center-hub']);

    renderer.fillStyle = grd;
    renderer.strokeStyle = settings['color-center-hub'];
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