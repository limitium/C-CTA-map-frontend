function Poi(x, y, l, t, a) {
    this.x = x;
    this.y = y;
    this.l = l;
    this.t = t;
    this.a = a;
}
Poi.types = {
    "1": {
        name: 'Tiberium Control Hub',
        id: 'color-tiberium',
        type: 'resource'
    },
    "2": {
        name: 'Crystal Control Hub',
        id: 'color-crystal',
        type: 'resource'
    },
    "3": {
        name: 'Reactor',
        id: 'color-reactor',
        type: 'resource'
    },
    "4": {
        name: 'Tungsten Compound',
        id: 'color-tungsten',
        type: 'battle'
    },
    "5": {
        name: 'Uranium Compound',
        id: 'color-uranium',
        type: 'battle'
    },
    "6": {
        name: 'Aircraft Guidance Tower',
        id: 'color-aircraft',
        type: 'battle'
    },
    "7": {
        name: 'Resonator Network Tower',
        id: 'color-resonator',
        type: 'battle'
    }
};
Poi.scores = {
    "12": 1,
    "13": 3,
    "14": 6,
    "15": 10,
    "16": 15,
    "17": 25,
    "18": 40,
    "19": 65,
    "20": 100,
    "21": 150,
    "22": 250,
    "23": 400,
    "24": 650,
    "25": 1000,
    "26": 1500,
    "27": 2500,
    "28": 4000,
    "29": 6500,
    "30": 10000,
    "31": 15000,
    "32": 25000,
    "33": 40000,
    "34": 65000,
    "35": 100000,
    "36": 150000,
    "37": 250000,
    "38": 400000,
    "39": 650000,
    "40": 1000000,
    "41": 1500000,
    "42": 2500000,
    "43": 4000000,
    "44": 6500000,
    "45": 10000000
};
Poi.top40 = {
    "1": 100,
    "2": 90,
    "3": 85,
    "4": 80,
    "5": 76,
    "6": 72,
    "7": 68,
    "8": 64,
    "9": 60,
    "10": 57,
    "11": 54,
    "12": 51,
    "13": 48,
    "14": 45,
    "15": 42,
    "16": 39,
    "17": 36,
    "18": 33,
    "19": 30,
    "20": 28,
    "21": 26,
    "22": 24,
    "23": 22,
    "24": 20,
    "25": 18,
    "26": 16,
    "27": 14,
    "28": 13,
    "29": 12,
    "30": 11,
    "31": 10,
    "32": 9,
    "33": 8,
    "34": 7,
    "35": 6,
    "36": 5,
    "37": 4,
    "38": 3,
    "39": 2,
    "40": 1,
    "41": 0
};
Poi.prototype.getScore = function () {
    return Poi.scores[this.l];
};
Poi.prototype.isVisible = function () {
    if (settings['filter-poi-hide']
        || this.l <= settings['filter-poi-min-level']) {
        return false;
    }
    return true;
};
Poi.prototype.inArea = function (x, y) {
    var halfSize = 0.5 * settings['size-poi'];
    if (this.isVisible() && x <= this.x + halfSize && x >= this.x - halfSize && y <= this.y + halfSize && y >= this.y - halfSize) {
        return true;
    }
    return false;
};