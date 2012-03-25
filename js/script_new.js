function Square(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.cache = {};
    this.reload = true;
    this.bases = [];
    this.renderedCount = 0;
}
Square.prototype.addBase = function (base) {
    this.bases[this.bases.length] = base;
}
Square.prototype.draw = function (viewport) {
    if (this.reload) {
        this.render(viewport);
        this.saveCache(viewport, "c");
        this.reload = false;
    } else {
        this.loadFromCache(viewport, "c");
    }
}
Square.prototype.render = function (viewport) {
    this.renderedCount++;
    viewport.clearRect(this.x, this.y, this.w, this.h);

    //draw grid
    viewport.beginPath();

    if (this.x == 0) {
        viewport.moveTo(this.x, this.y);
        viewport.lineTo(this.x, this.y + this.h);
    } else {
        viewport.moveTo(this.x, this.y + this.h);
    }

    viewport.lineTo(this.x + this.w, this.y + this.h);
    viewport.lineTo(this.x + this.w, this.y);

    if (this.y == 0) {
        viewport.lineTo(this.x, this.y);
    }

    viewport.lineWidth = 1;
    viewport.strokeStyle = "rgba(220,220,220,0.1)"; // line color;
    viewport.stroke();


    //draw mark
    var mark = String.fromCharCode(65 + this.y / this.h) + ":" + this.x / this.w,
        markX = this.x + this.w / 2,
        markY = this.y + this.h / 2;

    viewport.font = 40 + "px Calibri";
    viewport.textAlign = "center";
    viewport.textBaseline = "middle";
    viewport.fillStyle = "rgba(17,53,17,0.5)";
    viewport.fillText(mark, markX, markY)

    //draw redner counter

    viewport.font = 20 + "px Calibri";
    viewport.textAlign = "left";
    viewport.textBaseline = "top";
    viewport.fillStyle = "red";
    viewport.fillText(this.renderedCount, this.x, this.y)


    //draw base
    var l = this.bases.length,
        r = 1,
        a = 2 * Math.PI,
//        color = "#57BD3D";
//        color = "#8BE79A";
        color = "#56DC6D";

    while (l--) {
        var base = this.bases[l];

        viewport.beginPath();
        viewport.arc(base.x, base.y, r, 0, a, false);
        viewport.fillStyle = color;
        viewport.fill();
        viewport.lineWidth = 1;
        viewport.strokeStyle = color;
        viewport.stroke();
    }
}

Square.prototype.saveCache = function (viewport, key) {
    this.cache[key] = viewport.getImageData(this.x, this.y, this.w, this.h);
}

Square.prototype.loadFromCache = function (viewport, key) {
    viewport.putImageData(this.cache[key], this.x, this.y, this.w, this.h);
}

var map = {
    init:function (v) {
        map.viewport = v;
        map.clear();
    },
    clear:function () {
        map.zoom = 1;
        map.dragging = false;
        map.ox = 0;
        map.oy = 0;
        map.hoveredBase = null;
        map.selectedAlliances = {};
        map.bases = [];
        map.players = {};
        map.server = 0;
        map.squares = [];
    },
    makeSquares:function () {
        for (var x = 0; x < 10; x++) {
            map.squares[x] = [];
            for (var y = 0; y < 10; y++) {
                map.squares[x][y] = new Square(x * 100, y * 100, 100, 100);
            }
        }
        var l = this.bases.length;
        while (l--) {
            var base = this.bases[l],
                x = parseInt(base.x / 100),
                y = parseInt(base.y / 100);
            map.squares[x][y].addBase(base);
        }
    },

    drawSquares:function () {
        var l = this.squares.length;
        while (l--) {
            var j = this.squares[l].length;
            while (j--) {
                
                //@todo: draw only in camera squares
                this.squares[l][j].draw(map.viewport);
            }
        }
    },

    draw:function () {
//        map.viewport.clearRect(0, 0, 1000, 1000);
//        map.drawBG();
//        map.drawGrid();
//        map.drawBases();
//        map.changeHash(map.getScale());
    },

    drawBG:function () {

//        var scale = map.getScale(),
//            sx = Math.max(0 - map.ox + 125, 0),
//            sy = Math.max(0 - map.oy + 125, 0),
//            sw = Math.min((1000 - Math.abs(map.ox) + 125), 1000),
//            sh = Math.min((1000 - Math.abs(map.oy) + 125), 1000),
//
//            dx = Math.abs(Math.min(125 - map.ox, 0)),
//            dy = Math.abs(Math.min(125 - map.oy, 0)),
//            dw = Math.min(1000 - Math.abs(map.ox) + 125, 1000),
//            dh = Math.min(1000 - Math.abs(map.oy) + 125, 1000);
        var scale = map.getScale(),
            dx = Math.abs(Math.min(-map.ox, 0)),
            dy = Math.abs(Math.min(-map.oy, 0)),

            dw = map.ox > 0 ? 1000 - dx : Math.max(1000 * scale + map.ox, 0),
            dh = map.oy > 0 ? 1000 - dy : Math.max(1000 * scale + map.oy, 0),

            sx = Math.max(0 - map.ox, 0) / scale,
            sy = Math.max(0 - map.oy, 0) / scale,

            sw = dw / scale,
            sh = dh / scale;


//        console.log("scale:" + scale);
//        console.log("x:" + map.ox);
//        console.log("y:" + map.oy);
//        console.log("sx:" + sx);
//        console.log("sy:" + sy);
//        console.log("sw:" + sw);
//        console.log("sh:" + sh);
////
//        console.log("dx:" + dx);
//        console.log("dy:" + dy);
//        console.log("dw:" + dw);
//        console.log("dh:" + dh);
//        console.log("================================================");

        map.viewport.drawImage(map.mapImage,
            sx, sy,
            sw > 0 ? sw : 0, sh > 0 ? sh : 0,
            dx, dy,
            dw > 0 ? dw : 0, dh > 0 ? dh : 0
        );
    },

    drawXLine:function (x, scale, maxY) {
        map.viewport.moveTo(map.ox + scale * x * 100, map.oy);
        map.viewport.lineTo(map.ox + scale * x * 100, maxY);
        map.viewport.lineWidth = 1;
        map.viewport.strokeStyle = "rgba(220,220,220,0.1)"; // line color;
        map.viewport.stroke();
    },

    drawYLine:function (y, scale, maxX) {
        map.viewport.moveTo(map.ox, map.oy + scale * y * 100);
        map.viewport.lineTo(maxX, map.oy + scale * y * 100);
        map.viewport.lineWidth = 1;
        map.viewport.strokeStyle = "rgba(220,220,220,0.1)"; // line color;
        map.viewport.stroke();
    },

    drawGrid:function () {
        var scale = map.getScale();
        var maxX = map.ox + scale * 1000;
        var maxY = map.oy + scale * 1000;
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                var mark = String.fromCharCode(65 + j) + ":" + i,
                    markX = map.ox + scale * i * 100 + 50 * scale,
                    markY = map.oy + scale * j * 100 + 60 * scale;
                if (markX > 1100 || markY > 1100 || markX < -100 || markY < -100) {
                    continue;
                }
                map.viewport.font = 40 * scale + "px Calibri";
                map.viewport.textAlign = "center";
                map.viewport.fillStyle = "rgba(220,220,220,0.4)";
                map.viewport.fillText(mark, markX, markY)
            }

            map.drawXLine(i, scale, maxY);
            map.drawYLine(i, scale, maxX);
        }
        map.drawXLine(10, scale, maxY);
        map.drawYLine(10, scale, maxX);
    },

    getScale:function () {
        var scale;
        if (map.zoom == 1) {
            scale = 1;
        } else {
            scale = 1 + map.zoom / 4;
        }
        return scale;
    },

    drawBases:function () {
        var scale = map.getScale(),
            i = map.bases.length,
            r = scale * 1,
            a = 2 * Math.PI;
        while (i--) {
            var base = map.bases[i],
                color = "#87E1FF";

            base.dx = map.ox + scale * base.x;
            base.dy = map.oy + scale * base.y;
            base.r = r;

            if (typeof map.selectedAlliances[base.a] != 'undefined') {
                color = map.selectedAlliances[base.a];
            }
            if (map.hoveredBase && map.s.a == base.a) {
                color = "black";
            }

            if (base.dx > 1000 || base.dy > 1000 || base.dx < 0 || base.dy < 0) {
                continue;
            }
            map.viewport.beginPath();
            map.viewport.arc(base.dx, base.dy, r, 0, a, false);
            map.viewport.fillStyle = color;
            map.viewport.fill();
            map.viewport.lineWidth = 1;
            map.viewport.strokeStyle = color;
            map.viewport.stroke();
        }
    },

    setZoom:function (z) {
        if (z < 1) {
            z = 1;
        }

        map.zoom = z;
        if (z == 1) {
            map.ox = 0;
            map.oy = 0;
        }
        map.show();
        $("#pop").popover('hide');
    },

    show:function () {
        map.draw();
        map.saveData();
    },

    saveData:function () {
        map.img = map.viewport.getImageData(map.ox, map.oy, map.getScale() * 1000, map.getScale() * 1000);
    },

    dragStart:function (e) {
        $("#pop").popover('hide');
        map.dragging = true;
        map.dx0 = e.pageX;
        map.dy0 = e.pageY;

        map.dxr0 = e.pageX;
        map.dyr0 = e.pageY;
    },

    tooltip:function (b) {
        $("#pop")
            .css({
                top:b.dy,
                left:b.dx + $('canvas').offset().left
            })
            .attr("data-content", "Player: " + b.n + "<br />Score: " + b.p + "<br />Alliance: " + $("[data-name=" + b.a + "]").html() + "<br />x:" + b.x + ", y:" + b.y)
            .attr("data-original-title", b.bn)
            .popover("show");
    },

    mousemove:function (e) {
        if (!map.d) {
            var hovered = false;
            var el = e.pageX - $('canvas').offset().left;
            $.each(map.bases, function () {
                if (Math.sqrt(Math.pow(el - this.dx, 2) + Math.pow(e.pageY - this.dy, 2)) <= this.r) {
                    hovered = true;
                    if (map.hoveredBase != this) {
                        map.hoveredBase = this;
                        map.tooltip(this);
                        map.draw();
                    }
                    return false;
                }
            });
            if (!hovered && map.hoveredBase != null) {
                map.hoveredBase = null;
                map.draw();
            }
        } else {
            dx = e.pageX;
            dy = e.pageY;
            map.ox = map.ox + dx - map.dx0;
            map.oy = map.oy + dy - map.dy0;
            map.dx0 = dx;
            map.dy0 = dy;
            map.viewport.clearRect(0, 0, 1000, 1000);
            map.viewport.putImageData(map.img, map.ox, map.oy);
            if (map.getScale() > 1 && (Math.abs(map.dxr0 - e.pageX) > 200 || Math.abs(map.dyr0 - e.pageY) > 200)) {
                map.dxr0 = e.pageX;
                map.dyr0 = e.pageY;
                map.show();
            }
        }
    },
    dragEnd:function (e) {
        map.dragging = false;
        map.show();
    },
    selectAlliance:function (a) {
        map.selectedAlliances[a.an] = a.c;
        map.show();
    },
    deSelectAlliance:function (a) {
        delete map.selectedAlliances[a];
        map.show();
    },
    search:function (n) {
        $.each(map.bases, function () {
            if (this.n.match(n)) {
                map.scrollTo(map.getScale() * this.x, map.getScale() * this.y);
                map.tooltip(this);
                return false;
            }
        });
    },
    scrollTo:function (x, y) {
        map.ox = -x + 1000 / 2;
        map.oy = -y + 1000 / 2;
        map.draw();
    },
    changeHash:function (scale) {
        location.hash = Math.round((1000 / 2 - map.ox) / scale) + ":" + Math.round((1000 / 2 - map.oy ) / scale) + "/" + map.zoom + "s" + map.server;
    },
    loadData:function (server, cb) {
        var a = $("[data-server=" + server + "]"),
            file = a.attr("data-file");
        console.log("loading: " + a.html());
        map.server = server;
        $.getJSON(file, function (data) {
            console.log("loaded");

            $("#server").html(a.html());
            $("#last-update").html(data.updated);
            $("#bases-total").html(data.bases.length);

            $alliances = "";
            $.each(data.alliances, function () {
                $alliances += "<li><a href='' data-name='" + this.a + "'>" + this.an + " (" + this.c + ")</a></li>";
            });

            $("ul.alliances").html($alliances);

//            $("li a").toggle(function () {
//                var link = $(this);
//                var color = map.colors[$("li a.selected").length % map.colors.length];
//                link.addClass("selected").css({"color":color });
//                map.selectAlliance({an:link.attr("data-name"), c:color});
//                return false;
//            }, function () {
//                var link = $(this);
//                link.removeClass("selected").css({"color":"" });
//                map.deSelectAlliance(link.attr("data-name"));
//                return false;
//            });

            var bases = [];
            map.a = data.alliances;

            $.each(data.bases, function () {
                bases.push(this);
            });

            map.bases = bases;
            map.players = data.players;
//            map.show();
            cb();
        });

    }
}


$(document).ready(function () {
    var zoom = 1, zooming = false, i = 0, span = $('.zoom-lvl');

    map.init($("canvas")[0].getContext("2d"));

    map.loadData("world_7", function () {
        map.makeSquares();
        map.drawSquares();
    });
    return false;
    var changeZoom = function (zoom) {
        if (zoom <= 0) {
            zoom = 1;
            return;
        }
        map.setZoom(zoom);
        span.html(zoom);
    }


    $("form.form-search").submit(function () {
        map.search($("input").val());
        return false;
    });
    $("#pop").popover({
        placement:"right",
        trigger:"manual"
    });

    $("#zoom-in").click(function () {
        changeZoom(++zoom);
    });
    $("#zoom-out").click(function () {
        changeZoom(--zoom);
    });

    $("canvas").mousedown(map.dragStart);
    $("canvas").mousemove(map.mousemove);
    $("canvas").mouseup(map.dragEnd);

    $(".menu-btn a").click(function () {
        map.loadData($(this).attr("data-server"), function () {
        });
        return false;
    });
    $("#pop").popover('hide');

    if (location.hash) {
        try {
            var xyzs = xyz = location.hash.slice(1).split("s"), xyz = xyzs[0].split("/"), xy = xyz[0].split(":");
            if (typeof xyz[1] != 'undefined') {
                zoom = xyz[1];
                changeZoom(zoom);
            }
            map.loadData(xyzs[1], function () {
                map.scrollTo(map.getScale() * xy[0], map.getScale() * xy[1]);
            });
        } catch (e) {
            console.log(e);
        }
    }
//    $("a[data-name=174]").trigger("click");
//    $("a[data-name=702]").trigger("click");
//    $("a[data-name=1322]").trigger("click");

});