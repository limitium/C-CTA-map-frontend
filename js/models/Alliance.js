function Alliance(a, an, c) {
    this.a = a;
    this.an = an;
    this.c = c;
    this.squares = [];
    this.poi = {
        "1": {
            score: 0,
            place: 41
        },
        "2": {
            score: 0,
            place: 41
        },
        "3": {
            score: 0,
            place: 41
        },
        "4": {
            score: 0,
            place: 41
        },
        "5": {
            score: 0,
            place: 41
        },
        "6": {
            score: 0,
            place: 41
        },
        "7": {
            score: 0,
            place: 41
        }
    };
}

Alliance.prototype.setPlace = function (type, place) {
    return this.poi[type].place = place;
};
Alliance.prototype.getPlace = function (type) {
    return this.poi[type].place;
};
Alliance.prototype.getScore = function (type) {
    return this.poi[type].score;
};
Alliance.prototype.getBonus = function (type) {
    return   this.poi[type].score + /*(Poi.types[type].type == "resource" ? "/h" : "%") + */" +" + Poi.top40[this.poi[type].place] + "%";
//    return this.poi[type].bonus + this.poi[type].bonus * this.poi[type].add;
};
Alliance.prototype.isVisible = function () {
    if (this.c < settings['filter-alliance-min-level']
        || (this.a === 0 && settings['filter-noalliance-hide'])
        ) {
        return false;
    }
    return true;
};
Alliance.prototype.addSquare = function (square) {
    this.squares.push(square);
};
