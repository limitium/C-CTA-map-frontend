function Square(xs, ys, w, h) {
    this.id = xs + ":" + ys;
    this.xs = xs;
    this.x = xs * 100;
    this.ys = ys;
    this.y = ys * 100;
    this.w = w;
    this.h = h;
    this.cache = {};
    this.bases = [];
    this.pois = [];
    this.renderedCount = 0;
    this.selectedBase = null;
    this.selectedAlliances = {};
}
Square.prototype.reload = function () {
    this.cache = {};
};
Square.prototype.addBase = function (base, add) {
    //seems never used?!
    if (add) {
        base.add = 1;
    }
    this.bases[this.bases.length] = base;
    base.addSquare(this);
};
Square.prototype.addPoi = function (poi) {
    this.pois[this.pois.length] = poi;
};
Square.prototype.renderBase = function (renderer, scale, x, y, r, color, a, base) {
    if (base.pr || base.al) {
        renderer.beginPath();
        renderer.fillStyle = base.al ? settings['color-altered'] : settings['color-protected'];
        renderer.strokeStyle = base.al ? settings['color-altered'] : settings['color-protected'];
        renderer.lineWidth = 1;

        renderer.beginPath();
        // Start from the top-left point.
        renderer.moveTo(x, y + 2 * r); // give the (x,y) coordinates
        renderer.lineTo(x + r * 3 / Math.sqrt(3), y - r);
        renderer.lineTo(x - 3 * r / Math.sqrt(3), y - r);
        renderer.lineTo(x, y + 2 * r);

        // Done! Now fill the shape, and draw the stroke.
        // Note: your shape will not be visible until you call any of the two methods.
        renderer.fill();
        renderer.stroke();
        renderer.closePath();
    }

    renderer.beginPath();
    renderer.arc(x, y, r, 0, a, false);
    renderer.fillStyle = color;
    renderer.fill();
    renderer.lineWidth = 1;
    renderer.strokeStyle = color;
    renderer.stroke();
};
Square.prototype.renderBases = function (renderer, scale) {
    var l = this.bases.length,
        r = settings['size-base'] * scale,
        sr = 10 * scale,
        a = 2 * Math.PI;
    while (l--) {
        var base = this.bases[l],
            x = (base.x - this.x) * scale ,
            y = (base.y - this.y) * scale;

        if (!base.isVisible()) {
            continue;
        }

        color = settings['color-base'];
        if (typeof this.selectedAlliances[base.getAlliance().a] != "undefined") {
            color = this.selectedAlliances[base.getAlliance().a];
        }
        if (map.player && map.player.i == base.pi) {
            color = settings['color-self'];
        }

        this.renderBase(renderer, scale, x, y, r, color, a, base);
    }
    //render selected base
    if (this.selectedBase) {
        base = this.selectedBase;
        x = (base.x - this.x) * scale;
        y = (base.y - this.y) * scale;

        if (!map.player || map.player.i != this.selectedBase.pi) {
            this.renderBase(renderer, scale, x, y, r, settings['color-selected'], a, base);
        }

        //attack
        renderer.beginPath();
        renderer.arc(x, y, sr, 0, a, false);
        renderer.lineWidth = 1;
        renderer.strokeStyle = settings['color-selected'];
        renderer.stroke();
//move
        renderer.beginPath();
        renderer.arc(x, y, sr * 2, 0, a, false);
        renderer.lineWidth = 1;
        renderer.strokeStyle = settings['color-selected'];
        renderer.stroke();
//remove
        renderer.beginPath();
        renderer.arc(x, y, sr * 3, 0, a, false);
        renderer.lineWidth = 1;
        renderer.strokeStyle = settings['color-selected'];
        renderer.stroke();
    }
};

Square.prototype.renderPois = function (renderer, scale) {
    if (settings['filter-poi-hide']) {
        return;
    }
    var halfSize = 0.5 * settings['size-poi'] * scale,
        l = this.pois.length;
    while (l--) {
        var poi = this.pois[l],
            x = (poi.x - this.x) * scale ,
            y = (poi.y - this.y) * scale;

        if (!poi.isVisible()) {
            continue;
        }
        renderer.beginPath();

        renderer.fillStyle = settings[Poi.types[poi.t].id];
        renderer.strokeStyle = settings[Poi.types[poi.t].id];
        renderer.lineWidth = 1;

        renderer.moveTo(x - halfSize, y - halfSize);
        renderer.lineTo(x - halfSize, y + halfSize);
        renderer.lineTo(x + halfSize, y + halfSize);
        renderer.lineTo(x + halfSize, y - halfSize);
        renderer.lineTo(x - halfSize, y - halfSize);

        renderer.fill();
        renderer.stroke();
        renderer.closePath();
    }
};
Square.prototype.renderLog = function (renderer, scale) {
    renderer.font = 20 + "px Calibri";
    renderer.textAlign = "left";
    renderer.textBaseline = "top";
    renderer.fillStyle = "red";
    renderer.fillText(this.renderedCount + ":" + this.bases.length, 0, 0);
};
Square.prototype.renderGridMark = function (renderer, scale) {
    renderer.beginPath();

    var x0 = 0,
        y0 = 0,
        w = this.w * scale,
        h = this.h * scale,
        x1 = x0 + w,
        y1 = y0 + h;
    //set canvas to sqwuare size
    $(renderer.canvas).attr({width:w + "px", height:h + "px"});
    renderer.clearRect(x0, y0, w, h);
    if (this.x === 0) {
        renderer.moveTo(x0, y0);
        renderer.lineTo(x0, y1);
    } else {
        renderer.moveTo(x0, y1);
    }

    renderer.lineTo(x1, y1);
    renderer.lineTo(x1, y0);

    if (this.y === 0) {
        renderer.lineTo(x0, y0);
    }
    renderer.lineWidth = 1;
    renderer.strokeStyle = settings['color-grid']; // line color;
    renderer.stroke();


    //draw mark
    var mark = String.fromCharCode(65 + this.y / this.h) + ":" + this.x / this.w,
        markX = x0 + w / 2,
        markY = y0 + h / 2;

    renderer.font = 40 * scale + "px Calibri";
    renderer.textAlign = "center";
    renderer.textBaseline = "middle";
    renderer.fillStyle = settings['color-grid-label'];
    renderer.fillText(mark, markX, markY);
};
Square.prototype.render = function (renderer, scale) {
    this.renderedCount++;
    this.renderGridMark(renderer, scale);
    this.renderPois(renderer, scale);
    this.renderBases(renderer, scale);
//    this.renderLog(renderer, scale);
};
Square.prototype.saveCache = function (renderer, scale) {
    var x0 = 0,
        y0 = 0 ,
        w = this.w * scale,
        h = this.h * scale;

    this.cache[scale] = renderer.getImageData(x0, y0, w, h);
};

Square.prototype.loadFromCache = function (viewport, ox, oy, scale) {
    viewport.putImageData(this.cache[scale],
        this.x * scale + ox, this.y * scale + oy,
        0, 0,
        100 * scale, 100 * scale);
    //@todo:cleanup cache
};
Square.prototype.draw = function (viewport, renderer, ox, oy, scale) {
    if (typeof this.cache[scale] == 'undefined') {
        this.render(renderer, scale);
        this.saveCache(renderer, scale);
    }
    this.loadFromCache(viewport, ox, oy, scale);
};
Square.prototype.selectBase = function (base) {
    this.selectedBase = base;
    this.reload();
};
Square.prototype.deSelectBase = function (base) {
    this.selectedBase = null;
    this.reload();
};
Square.prototype.selectAlliance = function (alliance, color) {
    this.selectedAlliances[alliance.a] = color;
    this.reload();
};
Square.prototype.deSelectAlliance = function (alliance, color) {
    delete this.selectedAlliances[alliance.a];
    this.reload();
};

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
    if ((settings['filter-unselected-hide'] && typeof this.squares[0].selectedAlliances[this.getAlliance().a] == "undefined")
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

function Poi(x, y, l, t, a) {
    this.x = x;
    this.y = y;
    this.l = l;
    this.t = t;
    this.a = a;
}
Poi.types = {
    "1":{
        name:'Tiberium Control Hub',
        id:'color-tiberium',
        type:'resource'
    },
    "2":{
        name:'Crystal Control Hub',
        id:'color-crystal',
        type:'resource'
    },
    "3":{
        name:'Reactor',
        id:'color-reactor',
        type:'resource'
    },
    "4":{
        name:'Tungsten Compound',
        id:'color-tungsten',
        type:'battle'
    },
    "5":{
        name:'Uranium Compound',
        id:'color-uranium',
        type:'battle'
    },
    "6":{
        name:'Aircraft Guidance Tower',
        id:'color-aircraft',
        type:'battle'
    },
    "7":{
        name:'Resonator Network Tower',
        id:'color-resonator',
        type:'battle'
    }
};
Poi.scores = {
    "12":1,
    "13":3,
    "14":6,
    "15":10,
    "16":15,
    "17":25,
    "18":40,
    "19":65,
    "20":100,
    "21":150,
    "22":250,
    "23":400,
    "24":650,
    "25":1000,
    "26":1500,
    "27":2500,
    "28":4000,
    "29":6500,
    "30":10000,
    "31":15000,
    "32":25000,
    "33":40000,
    "34":65000,
    "35":100000,
    "36":150000,
    "37":250000,
    "38":400000,
    "39":650000,
    "40":1000000,
    "41":1500000,
    "42":2500000,
    "43":4000000,
    "44":6500000,
    "45":10000000
};
Poi.top40 = {
    "1":100,
    "2":90,
    "3":85,
    "4":80,
    "5":76,
    "6":72,
    "7":68,
    "8":64,
    "9":60,
    "10":57,
    "11":54,
    "12":51,
    "13":48,
    "14":45,
    "15":42,
    "16":39,
    "17":36,
    "18":33,
    "19":30,
    "20":28,
    "21":26,
    "22":24,
    "23":22,
    "24":20,
    "25":18,
    "26":16,
    "27":14,
    "28":13,
    "29":12,
    "30":11,
    "31":10,
    "32":9,
    "33":8,
    "34":7,
    "35":6,
    "36":5,
    "37":4,
    "38":3,
    "39":2,
    "40":1,
    "41":0
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
function Alliance(a, an, c) {
    this.a = a;
    this.an = an;
    this.c = c;
    this.squares = {};
    this.poi = {
        "1":{
            score:0,
            place:41
        },
        "2":{
            score:0,
            place:41
        },
        "3":{
            score:0,
            place:41
        },
        "4":{
            score:0,
            place:41
        },
        "5":{
            score:0,
            place:41
        },
        "6":{
            score:0,
            place:41
        },
        "7":{
            score:0,
            place:41
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

var map = {
    init:function (v, renderer) {
        map.viewport = v;
        map.renderer = renderer;
        map.height = 1000;
        map.width = 1000;
        map.onHoverBase = function () {
        };
        map.onBlurBase = function () {
        };
        map.onHoverPoi = function () {
        };
        map.onBlurPoi = function () {
        };
        map.clear();
    },
    clear:function () {
        map.zoom = 0.5;
        map.dragging = false;
        map.ox = 0;
        map.oy = 0;
        map.maxX = 0;
        map.maxY = 0;
        map.centerX = 500;
        map.centerY = 500;
        map.selectedAlliances = {};
        map.bases = [];
        map.pois = [];
        map.player = false;
        map.players = {};
        map.alliances = {};
        map.squares = [];
        map.hoveredBase = null;
        map.hoveredPoi = null;
        map.selectedBase = null;
        map.drawing = false;

    },
    makeSquares:function () {
        var l = this.bases.length;

        while (l--) {
            map.maxX = Math.max(this.bases[l].x, map.maxX);
            map.maxY = Math.max(this.bases[l].y, map.maxY);
        }
        //make squares
        map.maxX = (map.maxX / 100 << 0) + 1;
        map.maxY = (map.maxY / 100 << 0) + 1;

        map.maxY = map.maxX = map.maxX > 10 || map.maxY > 10 ? 16 : 10;

        for (var x = 0; x < map.maxX; x++) {
            map.squares[x] = [];
            for (var y = 0; y < map.maxY; y++) {
                map.squares[x][y] = new Square(x, y, 100, 100);
            }
        }

        l = this.bases.length;
        while (l--) {
            var base = this.bases[l],
                xs = base.x / 100 << 0,
                ys = base.y / 100 << 0;
            //@todo:improve alliance squares;
            //base in squares
            map.squares[xs][ys].addBase(base);
            //add squary to allinceHash;
            base.getAlliance().squares[map.squares[xs][ys].id] = map.squares[xs][ys];

            //boundary  squares
            //add squary to allinceHash;
            var boundarySquares = map.getBoundarySquares(base, settings['size-base'] * 0.01);
            var bl = boundarySquares.length;
            while (bl--) {
                boundarySquares[bl].addBase(base, 1);
                base.getAlliance().squares[boundarySquares[bl].id] = boundarySquares[bl];
            }
        }
        l = this.pois.length;
        while (l--) {
            var poi = this.pois[l],
                xs = poi.x / 100 << 0,
                ys = poi.y / 100 << 0;
            //base in squares
            map.squares[xs][ys].addPoi(poi);
            //boundary  squares
            //add squary to allinceHash;
            var boundarySquares = map.getBoundarySquares(poi, settings['size-poi'] * 0.0001);
            var bl = boundarySquares.length;
            while (bl--) {
                boundarySquares[bl].addPoi(poi);
            }
        }
    },
    getBoundarySquares:function (base, delta) {
        //border bases
        var boundarySquares = [],
            xd = base.x / 100,
            yd = base.y / 100,
            xs = parseInt(xd),
            ys = parseInt(yd),
            deltaX = Math.round((xd)) - xd,
            deltaY = Math.round((yd)) - yd;
        if (Math.abs(deltaX) < delta &&
            deltaX <= 0 &&
            Math.abs(deltaY) < delta &&
            deltaY <= 0) {
            if (xs - 1 >= 0 && ys - 1 >= 0) {
                boundarySquares.push(map.squares[xs - 1][ys - 1]);
            }

        }
        if (Math.abs(deltaX) < delta &&
            deltaX <= 0) {
            if (xs - 1 >= 0) {
                boundarySquares.push(map.squares[xs - 1][ys]);
            }
        }
        if (Math.abs(deltaX) < delta &&
            deltaX <= 0 &&
            Math.abs(deltaY) < delta &&
            deltaY > 0) {
            if (xs - 1 >= 0 && ys + 1 <= 9) {
                boundarySquares.push(map.squares[xs - 1][ys + 1]);
            }
        }
        if (Math.abs(deltaY) < delta &&
            deltaY > 0) {
            if (ys + 1 <= 9) {
                boundarySquares.push(map.squares[xs ][ys + 1]);
            }
        }
        if (Math.abs(deltaX) < delta &&
            deltaX > 0 &&
            Math.abs(deltaY) < delta &&
            deltaY > 0) {
            if (xs + 1 <= 9 && ys + 1 <= 9) {
                boundarySquares.push(map.squares[xs + 1 ][ys + 1]);
            }
        }
        if (Math.abs(deltaX) < delta &&
            deltaX > 0) {
            if (xs + 1 <= 9) {
                boundarySquares.push(map.squares[xs + 1 ][ys]);
            }
        }
        if (Math.abs(deltaX) < delta &&
            deltaX > 0 &&
            Math.abs(deltaY) < delta &&
            deltaY <= 0) {
            if (xs + 1 <= 9 && ys - 1 >= 0) {
                boundarySquares.push(map.squares[xs + 1 ][ys - 1]);
            }
        }
        if (Math.abs(deltaY) < delta &&
            deltaY <= 0) {
            if (ys - 1 >= 0) {
                boundarySquares.push(map.squares[xs][ys - 1]);
            }
        }
        return boundarySquares;

    },
    draw:function () {
        //for context select
//        setTimeout(function () {
        map.viewport.clearRect(0, 0, map.width, map.height);

        var l = map.squares.length, scale = map.getScale();
        while (l--) {
            var j = map.squares[l].length;
            while (j--) {
                //@todo: check this code
                var square = map.squares[l][j],
                    x0 = square.x * scale + map.ox,
                    y0 = square.y * scale + map.oy,
                    w = square.w * scale,
                    h = square.h * scale,
                    x1 = x0 + w,
                    y1 = y0 + h;
                if (x0 <= map.width && y0 <= map.height && x1 >= 0 && y1 >= 0) {
                    square.draw(map.viewport, map.renderer, map.ox, map.oy, scale);
                }
            }
        }
//        }, 0);
    },
    setZoom:function (zoom) {
        if (!map.drawing) {
            map.zoom = zoom;
            map.scrollTo(map.centerX, map.centerY);
            return true;
        }
        return false;
    },
    setSize:function (height, width) {
        map.height = height;
        map.width = width;
    },
    getScale:function () {
        return map.zoom;
    },
    mousedown:function (e) {
        if (!map.drawing) {
            if (map.hoveredBase) {
                if (map.selectedBase) {
                    var newSelect = map.selectedBase != map.hoveredBase;
                    map.deSelectBase();
                    if (newSelect) {
                        map.selectBase(map.hoveredBase);
                    }
                } else {
                    map.selectBase(map.hoveredBase);
                }
            } else {
                map.dragging = true;
                map.dragPrevX = e.pageX;
                map.dragPrevY = e.pageY;
            }
        }
    },
    mouseup:function (e) {
        map.dragging = false;
        map.updateCenter();
    },

    mousemove:function (e) {
        if (map.dragging) {
            map.moveMapTo(map.ox + (e.pageX - map.dragPrevX), map.oy + (e.pageY - map.dragPrevY));

            map.dragPrevX = e.pageX;
            map.dragPrevY = e.pageY;
        } else {
            var scale = map.getScale(),
                inGridX = (e.pageX - map.ox) / scale,
                inGridY = (e.pageY - map.oy) / scale,
                xs = parseInt(inGridX / 100),
                ys = parseInt(inGridY / 100);
            if (typeof map.squares[xs] != 'undefined' && typeof map.squares[xs][ys] != 'undefined') {
                var square = map.squares[xs][ys],
                    bl = square.bases.length,
                    pl = square.pois.length,
                    hoveredBase = false,
                    hoveredPoi = false;
                while (bl--) {
                    var base = square.bases[bl];
                    if (base.inArea(inGridX, inGridY)) {
                        hoveredBase = true;
                        if (map.hoveredBase != base) {
                            if (map.hoveredPoi) {
                                map.blurPoi();
                            }
                            map.hoverBase(base);
                        }
                    }
                }

                while (pl--) {
                    var poi = square.pois[pl];
                    if (!map.hoveredBase && poi.inArea(inGridX, inGridY)) {
                        hoveredPoi = true;
                        if (map.hoveredPoi != poi) {
                            map.hoverPoi(poi);
                        }
                    }
                }
                if (!hoveredPoi && map.hoveredPoi) {
                    map.blurPoi();
                }
                if (!hoveredBase && map.hoveredBase) {
                    map.blurBase();
                }
            }
        }
    },
    hoverBase:function (base) {
        map.hoveredBase = base;
//        map.draw();
        map.onHoverBase(base);
    },
    blurBase:function () {
        map.hoveredBase = null;
//        map.draw();
        map.onBlurBase();
    },
    hoverPoi:function (poi) {
        map.hoveredPoi = poi;
        map.onHoverPoi(poi);
    },
    blurPoi:function () {
        map.hoveredPoi = null;
        map.onBlurPoi();
    },
    changeSelection:function (base, isSelect) {
        var squares = map.getBoundarySquares(base, 0.1), sl = squares.length;
        while (sl--) {
            squares[sl][isSelect ? 'selectBase' : 'deSelectBase'](base);
        }
        //base square;
        base.squares[0][isSelect ? 'selectBase' : 'deSelectBase'](base);
    },
    selectBase:function (base) {
        map.selectedBase = base;
        map.changeSelection(base, true);
        map.changeSelectionAlliances(base.getAlliance(), settings['color-selected']);
        map.updateHash();
    },
    deSelectBase:function () {
        map.changeSelection(map.selectedBase, false);
        map.changeSelectionAlliances(map.selectedBase.getAlliance(), typeof map.selectedAlliances[map.selectedBase.getAlliance().a] != 'undefined' ? map.selectedAlliances[map.selectedBase.getAlliance().a] : '');
        map.selectedBase = null;
        map.updateHash();
    },
    changeSelectionAlliances:function (alliance, color) {
        for (var square in alliance.squares) {
            alliance.squares[square][color ? 'selectAlliance' : 'deSelectAlliance'](alliance, color);
        }
        map.draw();
    },

    selectAlliance:function (alliance, color) {
        map.selectedAlliances[alliance.a] = color;
        map.changeSelectionAlliances(alliance, color);
        map.updateHash();
    },
    deSelectAlliance:function (alliance) {
        map.changeSelectionAlliances(alliance);
        delete map.selectedAlliances[alliance.a];
        map.updateHash();
    },
    updateCenter:function () {
        var scale = map.getScale();
        map.centerX = parseInt(( map.width / 2 - map.ox ) / scale);
        map.centerY = parseInt(( map.height / 2 - map.oy ) / scale);
        map.updateHash();
    },
    updateHash:function () {
        var alliances = [];
        for (var a in map.selectedAlliances) {
            alliances.push(a + ":" + map.selectedAlliances[a]);
        }
        location.hash = map.centerX + ":" + map.centerY + "|" + map.zoom + "|" + (map.selectedBase ? map.selectedBase.i : "") + "|" + alliances.join(",") + "~" + window.drawHash;
    },
    scrollTo:function (x, y) {
        var scale = map.getScale();
        map.moveMapTo(-x * scale + map.width / 2, -y * scale + map.height / 2);
        map.updateHash();
    },
    moveMapTo:function (x, y) {
        var dx = x - map.ox, dy = y - map.oy;
        map.ox = x;
        map.oy = y;
        window.mapListener.onMove(dx, dy);
        map.draw();
    },
    toCenter:function () {
        map.centerX = map.maxX * 50;
        map.centerY = map.maxY * 50;
        map.scrollTo(map.centerX, map.centerY);
    },
    search:function (n) {
        var name = n.trim().toLowerCase();
        if (name) {
            for (var i in map.players) {
                var player = map.players[i];
                if (player.n.trim().toLowerCase().match(name)) {
                    return player;
                }
            }
        }
        return false;
    },
    findPlayerBase:function (playerName) {
        var player = map.search(playerName);
        if (player) {
            map.scrollTo(player.bases[0].x, player.bases[0].y);
            map.selectBase(player.bases[0]);
        } else {
            alert("Nothing found or all bases are ruined :(");
        }
    },
    loadData:function (data) {
        map.clear();


        map.players = [];
        $.each(data.players, function () {
            map.players[this.i] = new Player(
                this.a,
                this.bc,
                this.i,
                this.n,
                this.p,
                this.f);
        });

        map.alliances = {};
        $.each(data.alliances, function () {
            map.alliances[this.a] = this;
        });

        map.bases = [];
        $.each(data.bases, function () {
            var base = new Base(
                this.x,
                this.y,
                this.n,
                this.pi,
                this.i,
                this.l,
                this.al,
                this.pr,
                this.cb,
                this.cd,
                this.ps
            );
            map.bases.push(base);
            map.players[this.pi].addBase(base);
        });
        map.pois = [];
        $.each(data.pois, function () {
            if (this.t > 0) {
                map.pois.push(new Poi(
                    this.x,
                    this.y,
                    this.l,
                    this.t,
                    this.a));
            }
        });

        $.each(settings['notice-name'].split(","), function (i, name) {
            map.player = map.search(name);
            if (map.player) {
                return false;
            }
        });

        map.makeSquares();
        map.calculatePoi();
    },
    calculatePoi:function () {
        _.each(map.pois, function (poi) {
            if (poi.a > 0) {
                map.alliances[poi.a].poi[poi.t].score += poi.getScore();
            }
        });
        var alliances = _.values(map.alliances);
        _.each([1, 2, 3, 4, 5, 6, 7], function (poiType) {
            _.each(_.sortBy(alliances,
                function (alliance) {
                    return alliance.getScore(poiType);
                }).reverse().slice(0, 40), function (alliance, index) {
                alliance.setPlace(poiType, index + 1);
            });
        });
    }
};


$(document).ready(function () {
    var canvas = $("canvas#map"), ct = canvas[0], buf = $("canvas.renderer")[0];
    $("canvas#map,canvas.renderer").css("background-color", settings['color-background']);

    if (typeof ct == "undefined" || typeof ct.getContext == "undefined") {
        alert("Canvas unsupported by your browser :(");
        return;
    }

    settings['color-grid'] = "rgba(" + hex2rgb(settings['color-grid']) + ",0.1)";
    settings['color-grid-label'] = "rgba(" + hex2rgb(settings['color-grid-label']) + ",0.5)";

    $("canvas#drawer")
        .mousedown(map.mousedown)
        .mouseup(map.mouseup)
        .mousemove(map.mousemove)
        .mousewheel(function (event, delta, deltaX, deltaY) {
            delta > 0 ? zoomIn() : zoomOut();
        });

    window.mapListener = initDrawing(ct);

    $("#zoom-in").click(function () {
        zoomIn();
    });


    $("#zoom-out").click(function () {
        zoomOut();
    });

    $(window).resize(function () {
        resizeCanvas();
        map.draw();
    });

    $(".color-picker").wColorPicker({
        mode:"click",
        onSelect:colorClick,
        showSpeed:100,
        hideSpeed:100
    });

    $("form.form-search").submit(function () {
        map.findPlayerBase($("input.search-query").val());
        return false;
    });

    $("#users a.in").click(function () {
        window.location = "/saver?url=" + this.href + "&hash=" + window.location.hash.replace("#", "") + "&pathname=" + window.location.pathname;
        return false;
    });

    $("#share").click(function () {
        $.getJSON(
            "http://api.bitly.com/v3/shorten?callback=?",
            {
                "format":"json",
                "apiKey":"R_6b660de4008a5d0b5eca64e1b529b54f",
                "login":"limitium",
                "longUrl":window.location.href
            },
            function (response) {
                if (response.status_code != 200) {
                    alert("Shortner error: " + response.status_txt);
                    return false;
                }
                $("#modal-share").modal();
                $("#share-url").val(response.data.url).focus();
            }
        );

//        $.ajax({
//            type:'POST',
//            url:'https://www.googleapis.com/urlshortener/v1/url?key=AIzaSyBgrIES9ndGHgstT8VNZ2tpyflZK2RjwEo',
//            data:JSON.stringify({longUrl:window.location.href}),
//            success:function (response) {
////                window.prompt ("Copy to clipboard: Ctrl+C, Enter", response.id);
//                $("#modal-share").modal();
//                $("#share-url").val(response.id).focus();
//            },
//            contentType:"application/json",
//            processData:false,
//            dataType:"json"
//        });
        return false;
    });

    $("#vote").click(function () {
        $("#modal-poll").modal();
        $(".poll_booroo52124,.padded_booroo,.submit_booroo,.booroo_footer").removeAttr("style");
        $("#ans-radio-other").css({width:"95%"});
    });

    map.init(ct.getContext("2d"), buf.getContext("2d"));
    map.onHoverBase = hoverBase;
    map.onHoverPoi = hoverPoi;
    map.onBlurBase = cleanPointInfo;
    map.onBlurPoi = cleanPointInfo;


    resizeCanvas();


    if (typeof ccmapData == 'undefined') {
        alert("There is no data for " + server.name + " yet :(");
        return;
    }
    loadData();

    parseHash();

});

function hex2rgb(hex) {
    if (hex[0] == "#") {
        hex = hex.substr(1);
    }
    if (hex.length == 3) {
        var temp = hex;
        hex = '';
        temp = /^([a-f0-9])([a-f0-9])([a-f0-9])$/i.exec(temp).slice(1);
        for (var i = 0; i < 3; i++) {
            hex += temp[i] + temp[i];
        }
    }
    var triplets = /^([a-f0-9]{2})([a-f0-9]{2})([a-f0-9]{2})$/i.exec(hex).slice(1);
    return parseInt(triplets[0], 16) + ',' + parseInt(triplets[1], 16) + ',' + parseInt(triplets[2], 16);
}
function parseHash() {
    if (location.hash) {
        var href = window.location.hash.split("%7C").join("|").split("%23").join("#");
        location.href = href;

        var dataHash = href.split("~");
        var data = dataHash[0].split("|");

        if (data.length == 4) {
            var xy = data[0].slice(1).split(":"),
                z = data[1],
                selected = data[2],
                alliances = data[3].split(",");

            map.centerX = xy[0];
            map.centerY = xy[1];


            if (selected) {
                $.each(map.bases, function () {
                    if (this.i == selected) {
                        map.selectBase(this);
                        hoverBase(this);
                        return false;
                    }
                });
            }

            $.each(alliances, function (i, s) {
                if (s) {
                    var iColor = s.split(":");
                    if (typeof map.alliances[iColor[0]] != "undefined") {
                        $("a[data-a=" + iColor[0] + "]").addClass("selected").css({color:iColor[1]});
                        map.selectAlliance(map.alliances[iColor[0]], iColor[1]);
                    }
                }
            });

            setZoom(z);
        }

        if (typeof dataHash[1] != "undefined" && dataHash[1]) {
            window.drawHash = dataHash[1];
            map.updateHash();
            window.loadDrawing(drawHash);
        }
    } else {
        map.toCenter();
    }
}
function colorClick(color) {
    var picking = $("a.colorPicking");
    if (picking.length) {
        picking.removeClass("colorPicking").addClass("selected").css({color:color});
        map.selectAlliance(map.alliances[picking.attr("data-a")], color);
    }
}

function allianceClick(e) {

    var self = $(this), a = $("[data-a=" + self.attr("data-a") + "]"), picking = $("a.colorPicking");

    if (picking.length) {
        //close picker
        $("._wColorPicker_buttonColor").trigger('click');
        picking.removeClass("colorPicking");
    }
    console.log(self, a, picking, self.attr('data-a'));
    if (a.hasClass("selected")) {
        a.removeClass("selected").css({color:""});
        map.deSelectAlliance(map.alliances[a.attr("data-a")]);
    } else {
        $(".color-picker").css({top:e.pageY - 23 + "px", left:e.pageX - 16 + "px"});
        a.addClass('colorPicking');
        $("._wColorPicker_buttonColor").trigger('click');
    }
    return false;
}

function hoverBase(base) {
    var player = map.players[base.pi], allianceClass = "", color = "";

    if (typeof map.selectedAlliances[player.a] != 'undefined') {
        allianceClass = "selected";
        color = map.selectedAlliances[player.a];
    }
    var info = "<ul>";
    info += "<li><img src='/img/icons/base_level_" + base.getEffect() + ".png' /></li>";
    info += "<li>Name: " + base.n + "</li>";
    info += "<li>Position: " + base.x + ":" + base.y + "</li>";
    info += "<li>Level: " + base.l + "</li>";
    info += "<li>Player: " + player.n + "</li>";
    info += "<li>Alliance: <a href='' " + (color ? "style='color:" + color + "'" : "") + " class='" + allianceClass + "' data-a='" + player.a + "'>" + map.alliances[player.a].an + "</a></li>";
    info += "<li>End protection: " + (base.ps ? getPeriod(base.ps / 1000) : "-") + "</li>";
    info += "<li>Condition buildings: " + base.cb + "%</li>";
    info += "<li>Condition defence: " + base.cd + "%</li>";
    info += "<li>Player score: " + player.p + "</li>";
    info += "<li>Player base count: " + player.bc + "</li>";
    info += "</ul>";
    $(".point-info").html(info);
    $(".point-info a").click(allianceClick);
    $(".point-info a").hover(hoverAlliance, cleanAllianceInfo);
}
function hoverAlliance() {

    var alliance = map.alliances[$(this).attr("data-a")];

    var basesData = _.reduce(map.bases, function (memo, base) {
        if (base.getAlliance() == alliance) {
            memo.bc++;
            memo.totalDcc += Math.sqrt(Math.pow(base.x - map.centerX, 2) + Math.pow(base.y - map.centerY, 2));
        }
        return memo;
    }, {
        bc:0,
        totalDcc:0
    });


    var info = "<ul>";
    info += "<li>Name: " + alliance.an + "</li>";
    info += "<li>Bases: " + basesData.bc + "</li>";
    info += "<li>Average DCC: " + Math.round(basesData.totalDcc / basesData.bc) + "</li>";
    info += "<li></li>";
    info += "<li class='label-success'>Tiberium: " + alliance.getBonus(1) + "</li>";
    info += "<li class='label-success'>Crystal: " + alliance.getBonus(2) + "</li>";
    info += "<li class='label-success'>Power: " + alliance.getBonus(3) + "</li>";
    info += "<li class='label-important'>Infantry: " + alliance.getBonus(4) + "</li>";
    info += "<li class='label-important'>Vehicle: " + alliance.getBonus(5) + "</li>";
    info += "<li class='label-important'>Aircraft: " + alliance.getBonus(6) + "</li>";
    info += "<li class='label-info'>Defence: " + alliance.getBonus(7) + "</li>";
    info += "</ul>";
    $(".alliance-info").html(info);
}
function hoverPoi(poi) {
//    var player = map.players[base.pi];
    var info = "<ul>";
    info += "<li><img src='/img/icons/poi_" + poi.t + ".png' /></li>";
    info += "<li>Name: " + Poi.types[poi.t].name + "</li>";
    info += "<li>Position: " + poi.x + ":" + poi.y + "</li>";
    info += "<li>Level: " + poi.l + "</li>";
    info += "<li>Score: " + poi.getScore() + "</li>";
    info += "<li>Owners: " + map.alliances[poi.a].an + "</li>";
    info += "</ul>";
    $(".point-info").html(info);
}
function zoomIn() {
    setZoom(map.zoom >= 1 ? ++map.zoom : 0.5 + (map.zoom - 0));
}
function zoomOut() {
    var zoom = map.zoom <= 1 ? map.zoom - 0.5 : --map.zoom;
    if (zoom <= 0.5) {
        zoom = 0.5;
    }
    setZoom(zoom);
}
function cleanPointInfo() {
    if (map.selectedBase) {
        hoverBase(map.selectedBase);
    } else {
        $(".point-info").html("");
    }
}
function cleanAllianceInfo() {
    $(".alliance-info").html("");
}
function resizeCanvas() {
    $($("canvas")[0])
        .attr("width", $(window).outerWidth(true))
        .attr("height", $(window).outerHeight(true));
    window.mapListener.onResize($(window).outerWidth(true), $(window).outerHeight(true));
    map.setSize($(window).height(), $(window).width());
}

function setZoom(zoom) {
    if (map.setZoom(zoom)) {
        $('.zoom-lvl').html(zoom);
        console.log("onscale");
        window.mapListener.onScale(map.getScale());
    }
}


function loadData() {

    var data = ccmapData;
    $("#last-update").html(getPeriod(serverTime - data.timestamp) + " ago");
    $("#bases-total").html(data.bases.length);

    alliances = "";
    alliancesHash = {};

    $.each(data.alliances, function () {
        var alliance = new Alliance(this.a, this.an, this.c);
        if (alliance.isVisible()) {
            alliances += "<li><a href='' data-a='" + this.a + "'>" + this.an + " (" + this.c + ")</a></li>";
        }
        alliancesHash[this.a] = alliance;
    });


    data.alliances = alliancesHash;
    map.loadData(data);


    $("ul.alliances").html(alliances);
    $(".alliances a").click(allianceClick);
    $(".alliances a").hover(hoverAlliance, cleanAllianceInfo);

    $('.loader').hide();
    $("#players-total").html(data.players.length);
    $("#server-name").html(server.name);
}

function getPeriod(timeout) {
    /* Get 1 hour in milliseconds, ie 60*60 */
    var one_hour = 3600;
    var elapsedHours = Math.floor(timeout / one_hour);

    /* Milliseconds still unaccounted for РІР‚вЂњ less than an hourРІР‚в„ўs worth. */
    timeout = timeout % one_hour;

    /* Get 1 minute in milliseconds, ie 60 */
    var one_minute = 60;
    var elapsedMinutes = Math.floor(timeout / one_minute);

    /* Milliseconds still unaccounted for РІР‚вЂњ less than a minuteРІР‚в„ўs worth. */
    var elapsedSeconds = Math.floor(timeout % one_minute);

    /* Get 1 second in milliseconds */
//    var one_second = 1000;
//    var elapsedSeconds = timeout / one_second);
    return (elapsedHours < 10 ? "0" : "") + elapsedHours + ":" + (elapsedMinutes < 10 ? "0" : "") + elapsedMinutes + ":" + (elapsedSeconds < 10 ? "0" : "") + elapsedSeconds;
}


function initDrawing(canvas) {

    paper.install(window);
    paper.setup($("#drawer")[0]);

    var drawButton = $("#draw"),
        clearButton = $("#clear"),
        removeLast = $("#remove-last"),
        color = $("#draw-color").miniColors(),
        width = $("#draw-width"),
        colorPicker = $(".miniColors-trigger").addClass("hide"),
        save = $("#save"),
        load = $("#load"),
        pushDraw = $("#push-drawing"),
        pullDraw = $("#pull-drawing"),
        loadHash = $("#drawing-load-hash"),
        loadList = $("#drawing-load-list"),
        pushData = null,
        drawTool = new Tool(),
        emptyTool = new Tool(),
        path,
        group = new Group(),
        prevScale = 0.5;


    group.position = new Point(500 * prevScale, 500 * prevScale);

    window.group = group;
    window.drawHash = "";

    loadHash.focus(function () {
        loadList.val("");
    });
    loadList.focus(function () {
        loadHash.val("");
    });
    createPath = function (color, width) {
        var path = new Path();
        path.strokeCap = 'round';
        path.strokeJoin = 'round';
        path.strokeWidth = width;
        path.strokeColor = color;
        return path;
    }
    window.loadDrawing = function (hash, cb) {
        $.getJSON("/path/load/" + hash, function (data) {
            if (!data) {
                alert("Nothing found");
                return;
            }
            window.drawHash = hash;
            map.updateHash();

            if (!$("[value=" + data.hash + "]", loadList).length) {
                loadList.append("<option value=" + data.hash + ">" + servers[data.world] + ":" + data.hash + " " + data.name + "</option>");
            }

            group.removeChildren();
            _.each(data.paths, function (lpath) {
                var path = createPath(lpath.color, lpath.width * map.getScale());
                _.each(lpath.segments, function (segment) {
                    path.add(new Point(segment.x * map.getScale() + map.ox, segment.y * map.getScale() + map.oy));
                });
                path.smooth();
                group.addChild(path);
                paper.view.draw();
            });
            if (typeof cb != "undefined") {
                cb();
            }
        });
    };
    pushDraw.click(function () {
        var name = $("#drawing-name").val();
        if (name) {
            $('#modal-save').modal('hide');
            $("#drawing-name").val("");
            pushData.name = name;
            pushData.world = server.id;
            $.post("/path/save", pushData, function (hash) {
                $("#drawing-hash").html(hash);
                $("#modal-saved").modal("show");
                loadList.append("<option value=" + hash + ">" + servers[pushData.world] + ":" + hash + " " + pushData.name + "</option>");
                window.drawHash = hash;
                map.updateHash();
            });
        }
    });
    pullDraw.click(function () {
        var hash = loadHash.val() || loadList.val();
        if (hash) {
            $("#modal-load").modal("hide");
            loadDrawing(hash, function () {
                drawButton.trigger("click");
            });
        }
    });
    save.click(function () {
            if (group.children.length) {
                pushData = {
                    paths:_.map(group.children, function (path) {
                        return {
                            width:path.strokeWidth / map.getScale(),
                            color:path.strokeColor.toCssString(),
                            segments:_.map(path.segments, function (segment) {
                                return {
                                    x:parseInt((segment.point.x - map.ox) / map.getScale()),
                                    y:parseInt((segment.point.y - map.oy) / map.getScale())
                                }
                            })}
                    })
                };
                $('#modal-save').modal('show');
            } else {
                alert("Draw something");
            }
        }
    );
    load.click(function () {
        $("#modal-load").modal("show");
    });
    drawButton.click(function () {
        if (drawButton.html() == "Draw") {
            map.drawing = true;
            drawButton.html("Stop draw").addClass("active");
            clearButton.removeClass("hide");
            removeLast.removeClass("hide");
            colorPicker.removeClass("hide");
            width.removeClass("hide");
            save.removeClass("hide");
            load.removeClass("hide");
            drawTool.activate();
        } else {
            map.drawing = false;
            drawButton.html("Draw").removeClass("active");
            clearButton.addClass("hide");
            removeLast.addClass("hide");
            colorPicker.addClass("hide");
            width.addClass("hide");
            save.addClass("hide");
            load.addClass("hide");
            emptyTool.activate();
        }
    });
    clearButton.click(function () {
        group.removeChildren();
        paper.view.draw();
    });
    removeLast.click(function () {
        if (group.children.length > 0) {
            group.removeChildren(group.children.length - 1);
            paper.view.draw();
        }
    });


    drawTool.onMouseDown = function (event) {
        var w = Math.abs(parseInt(width.val()) || 1);
        width.val(w);
        path = createPath(color.val(), w);
        path.add(event.point);
    };

    drawTool.onMouseDrag = function (event) {
        path.add(event.point);
    };

    drawTool.onMouseUp = function (event) {
        path.simplify();
        group.addChild(path);
    };

    emptyTool.onMove = function (dx, dy) {
        group.translate(dx, dy);
    };

    emptyTool.onScale = function (scale) {
        scale = parseFloat(scale);
        var deltaScale = scale / prevScale,
            direction = (deltaScale > 1 ? 1 : -1),
            zoomSteps = Math.abs(scale - prevScale),
            delta = 500 * zoomSteps * direction;

        prevScale = scale;
        if (deltaScale != 1) {
            group.scale(deltaScale);
            group.translate(delta, delta);
            _.each(group.children, function (p) {
                p.strokeWidth = p.strokeWidth * deltaScale;
            });
            paper.view.draw();
        }
    };
    emptyTool.onResize = function (width, height) {
        paper.view.viewSize = new Size(width, height);
    };
    emptyTool.activate();
    return emptyTool;
}