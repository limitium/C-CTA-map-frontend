var map = {
    init: function (v, renderer) {
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
        map.onMouseMove = function () {
        };
        map.clear();
    },
    clear: function () {
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
        map.endgames = [];
        map.player = false;
        map.players = [];
        map.alliances = {};
        map.squares = [];
        map.hoveredBase = null;
        map.hoveredPoi = null;
        map.selectedBase = null;
        map.drawing = false;

    },
    makeSquares: function () {
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
            base.getAlliance().addSquare(map.squares[xs][ys]);

            //boundary  squares
            //add squary to allinceHash;
            var boundarySquares = map.getBoundarySquares(base, settings['size-base'] * 0.01);
            var bl = boundarySquares.length;
            while (bl--) {
                boundarySquares[bl].addBase(base);
                base.getAlliance().addSquare(boundarySquares[bl]);
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
        l = this.endgames.length;
        while (l--) {
            var endgame = this.endgames[l],
                xs = endgame.x / 100 << 0,
                ys = endgame.y / 100 << 0;
            //base in squares
            map.squares[xs][ys].addEndgame(endgame);
            //boundary  squares
            //add squary to allinceHash;
            var boundarySquares = map.getBoundarySquares(endgame, settings['size-poi'] * 0.0001);
            var bl = boundarySquares.length;
            while (bl--) {
                boundarySquares[bl].addEndgame(endgame);
            }
        }
    },
    getBoundarySquares: function (marker, delta) {
        //border bases
        var boundarySquares = [],
            xd = marker.x / 100,
            yd = marker.y / 100,
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
    draw: function () {
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
    setZoom: function (zoom) {
        if (!map.drawing) {
            map.zoom = zoom;
            map.scrollTo(map.centerX, map.centerY);
            return true;
        }
        return false;
    },
    setSize: function (height, width) {
        map.height = height;
        map.width = width;
    },
    getScale: function () {
        return map.zoom;
    },
    mousedown: function (e) {
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
                map.draw();
            } else {
                map.dragging = true;
                map.dragPrevX = e.pageX;
                map.dragPrevY = e.pageY;
            }
        }
    },
    mouseup: function (e) {
        map.dragging = false;
        map.updateCenter();
    },

    mousemove: function (e) {
        var inGridX, inGridY;
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
        map.onMouseMove(e.pageX, e.pageY, inGridX, inGridY);
    },
    hoverBase: function (base) {
        map.hoveredBase = base;
        map.onHoverBase(base);
    },
    blurBase: function () {
        map.hoveredBase = null;
        map.onBlurBase();
    },
    hoverPoi: function (poi) {
        map.hoveredPoi = poi;
        map.onHoverPoi(poi);
    },
    blurPoi: function () {
        map.hoveredPoi = null;
        map.onBlurPoi();
    },
    selectBase: function (base) {
        map.selectedBase = base;
        map.changeSelectionAlliances(base.getAlliance());
    },
    deSelectBase: function () {
        map.changeSelectionAlliances(map.selectedBase.getAlliance());
        map.selectedBase = null;
    },
    changeSelectionAlliances: function (alliance) {
        var squares = alliance.squares, sl = alliance.squares.length;
        while (sl--) {
            squares[sl].reload();
        }
        map.updateHash();
    },
    selectAlliance: function (alliance, color) {
        map.selectedAlliances[alliance.a] = color;
        map.changeSelectionAlliances(alliance);
    },
    deSelectAlliance: function (alliance) {
        delete map.selectedAlliances[alliance.a];
        map.changeSelectionAlliances(alliance);
    },
    updateCenter: function () {
        var scale = map.getScale();
        map.centerX = parseInt(( map.width / 2 - map.ox ) / scale);
        map.centerY = parseInt(( map.height / 2 - map.oy ) / scale);
        map.updateHash();
    },
    updateHash: function () {
        var alliances = [];
        for (var a in map.selectedAlliances) {
            alliances.push(a + ":" + map.selectedAlliances[a]);
        }
        location.hash = map.centerX + ":" + map.centerY + "|" + map.zoom + "|" + (map.selectedBase ? map.selectedBase.i : "") + "|" + alliances.join(",") + "~" + window.drawHash;
    },
    scrollTo: function (x, y) {
        var scale = map.getScale();
        map.moveMapTo(-x * scale + map.width / 2, -y * scale + map.height / 2);
        map.updateHash();
    },
    moveMapTo: function (x, y) {
        var dx = x - map.ox, dy = y - map.oy;
        map.ox = x;
        map.oy = y;
        window.mapListener.onMove(dx, dy);
        map.draw();
    },
    toCenter: function () {
        map.centerX = map.maxX * 50;
        map.centerY = map.maxY * 50;
        map.scrollTo(map.centerX, map.centerY);
    },
    search: function (n) {
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
    findPlayerBase: function (playerName) {
        var player = map.search(playerName);
        if (player) {
            var l = map.bases.length;
            while (l--) {
                var base = map.bases[l];
                if (base.pi == player.pi) {
                    map.selectBase(base);
                    map.scrollTo(base.x, base.y);
                    break;
                }
            }
        } else {
            alert("Nothing found or all bases are ruined :(");
        }
    },
    loadData: function (data) {
        map.clear();
        $.each(data.players, function () {
            map.players[this.i] = new Player(
                this.a,
                this.bc,
                this.i,
                this.n,
                this.p,
                this.f);
        });

        $.each(data.alliances, function () {
            map.alliances[this.a] = this;
        });

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
        });

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

        $.each(data.endgames, function () {
            switch (this.t) {
                case 1:
                    map.endgames.push(new ControlHUB(this.x, this.y, this.ai));
                    break;
                case 2:
                    map.endgames.push(new ServerHUB(this.x, this.y, this.s, this.es));
                    break;
                case 3:
                    map.endgames.push(new CenterHUB(this.x, this.y, this.ai, this.cb, this.cd));
                    break;
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
    calculatePoi: function () {
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