function Player(a, bc, i, n, p, f) {
    this.a = a;
    this.bc = bc;
    this.i = i;
    this.n = n;
    this.p = p;
    this.f = f;
    this.bases = [];
}


Player.prototype.addBase = function (base) {
    this.bases.push(base);
};
