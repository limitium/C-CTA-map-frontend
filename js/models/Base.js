function Base(x, y, n, pi, i, l, al, pr, cb, cd, ps) {
    this.x = x;
    this.y = y;
    this.n = n;
    this.pi = pi;
    this.i = i;
    this.l = l;
    this.al = al;
    this.pr = pr;
    this.cb = cb;
    this.cd = cd;
    this.ps = ps;

    //min 1 max 4;
    this.squares = [];
}

Base.prototype.addSquare = function (square) {
    this.squares.push(square);
};
Base.prototype.getAlliance = function () {
    return map.alliances[map.players[this.pi].a];
};
Base.prototype.getPlayer = function () {
    return map.players[this.pi];
};
Base.prototype.isVisible = function () {
    if ((settings['filter-unselected-hide'] && typeof map.selectedAlliances[this.getAlliance().a] == "undefined")
        || this.l <= settings['filter-base-min-level']
        || !this.getAlliance().isVisible()
        ) {
        return false;
    }
    return true;
};
Base.prototype.inArea = function (x, y) {
    if (this.isVisible() && Math.sqrt(Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2)) <= settings['size-base']) {
        return true;
    }
    return false;
};
Base.prototype.getEffect = function () {
    var effect = 8, base = this;
    $.each([40, 35, 30, 25, 21, 16, 10, 1], function () {
        if (base.l >= this) {
            return false;
        }
        effect--;
    });
    return (this.getPlayer().f == 1 ? "g" : "n") + effect;
};