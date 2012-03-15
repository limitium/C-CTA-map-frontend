var map = {
    init:function (v, z) {
        map.v = v;
        map.z = z;
        map.d = false;
        map.ox = 0;
        map.oy = 0;
        map.s = null;
        map.selected = {};
        map.mapImage = $("#map-image")[0];
    },
    draw:function () {
        map.v.clearRect(0, 0, 1000, 1000);
        map.drawBG();
        map.drawGrid();
        map.drawBases();
        map.changeHash(map.getScale());
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

        map.v.drawImage(map.mapImage,
            sx, sy,
            sw > 0 ? sw : 0, sh > 0 ? sh : 0,
            dx, dy,
            dw > 0 ? dw : 0, dh > 0 ? dh : 0
        );
    },
    drawXLine:function (x, scale, maxY) {
        map.v.moveTo(map.ox + scale * x * 100, map.oy);
        map.v.lineTo(map.ox + scale * x * 100, maxY);
        map.v.lineWidth = 1;
        map.v.strokeStyle = "rgba(220,220,220,0.1)"; // line color;
        map.v.stroke();
    },
    drawYLine:function (y, scale, maxX) {
        map.v.moveTo(map.ox, map.oy + scale * y * 100);
        map.v.lineTo(maxX, map.oy + scale * y * 100);
        map.v.lineWidth = 1;
        map.v.strokeStyle = "rgba(220,220,220,0.1)"; // line color;
        map.v.stroke();
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
                map.v.font = 40 * scale + "px Calibri";
                map.v.textAlign = "center";
                map.v.fillStyle = "rgba(220,220,220,0.4)";
                map.v.fillText(mark, markX, markY)
            }

            map.drawXLine(i, scale, maxY);
            map.drawYLine(i, scale, maxX);
        }
        map.drawXLine(10, scale, maxY);
        map.drawYLine(10, scale, maxX);
    },
    getScale:function () {
        var scale;
        if (map.z == 1) {
            scale = 1;
        } else {
            scale = 1 + map.z / 4;
        }
        return scale;
    },
    drawBases:function () {
        var scale = map.getScale(),
            i = bases.length,
            r = scale * 1,
            a = 2 * Math.PI;
        while (i--) {
            var base = bases[i],
                color = "#87E1FF";

            base.dx = map.ox + scale * base.x;
            base.dy = map.oy + scale * base.y;
            base.r = r;

            if (typeof map.selected[base.a] != 'undefined') {
                color = map.selected[base.a];
            }
            if (map.s && map.s.a == base.a) {
                color = "black";
            }

            if (base.dx > 1000 || base.dy > 1000 || base.dx < 0 || base.dy < 0) {
                continue;
            }
            map.v.beginPath();
            map.v.arc(base.dx, base.dy, r, 0, a, false);
            map.v.fillStyle = color;
            map.v.fill();
            map.v.lineWidth = 1;
            map.v.strokeStyle = color;
            map.v.stroke();
        }
    },
    setZoom:function (z) {
        if (z < 1) {
            z = 1;
        }

        map.z = z;
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
        map.img = map.v.getImageData(map.ox, map.oy, map.getScale() * 1000, map.getScale() * 1000);
    },
    dragStart:function (e) {
        $("#pop").popover('hide');
        map.d = true;
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
            $.each(bases, function () {
                if (Math.sqrt(Math.pow(el - this.dx, 2) + Math.pow(e.pageY - this.dy, 2)) <= this.r) {
                    hovered = true;
                    if (map.s != this) {
                        map.s = this;
                        map.tooltip(this);
                        map.draw();
                    }
                    return false;
                }
            });
            if (!hovered && map.s != null) {
                map.s = null;
                map.draw();
            }
        } else {
            dx = e.pageX;
            dy = e.pageY;
            map.ox = map.ox + dx - map.dx0;
            map.oy = map.oy + dy - map.dy0;
            map.dx0 = dx;
            map.dy0 = dy;
            map.v.clearRect(0, 0, 1000, 1000);
            map.v.putImageData(map.img, map.ox, map.oy);
            if (map.getScale() > 1 && (Math.abs(map.dxr0 - e.pageX) > 200 || Math.abs(map.dyr0 - e.pageY) > 200)) {
                map.dxr0 = e.pageX;
                map.dyr0 = e.pageY;
                map.show();
            }
        }
    },
    dragEnd:function (e) {
        map.d = false;
//        if (map.getScale() > 1) {
        map.show();
//        } else {
//            map.draw();
//        }
    },
    selectAlliance:function (a) {
        map.selected[a.an] = a.c;
        map.show();
    },
    deSelectAlliance:function (a) {
        delete map.selected[a];
        map.show();
    },
    search:function (n) {
        $.each(bases, function () {
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
        location.hash = Math.round((1000 / 2 - map.ox) / scale) + ":" + Math.round((1000 / 2 - map.oy ) / scale) + "/" + map.z;
    }

}


$(document).ready(function () {

    var colors = [], zoom = 1, zooming = false, i = 0, span = $('.zoom-lvl');
    bases = data.bases;

    var changeZoom = function (zoom) {
        if (zoom <= 0) {
            zoom = 1;
            return;
        }
        map.setZoom(zoom);
        span.html(zoom);
    }

    $("#last-update").html(data.updated);
    $("#bases-total").html(bases.length);

    map.init($("canvas")[0].getContext("2d"), 1);

    if (location.hash) {
        try {
            var xyz = location.hash.slice(1).split("/"), xy = xyz[0].split(":");
            if (typeof xyz[1] != 'undefined') {
                zoom = xyz[1];
                changeZoom(zoom);
            }
            map.scrollTo(map.getScale() * xy[0], map.getScale() * xy[1]);
        } catch (e) {
            console.log(e);
        }
    }
    map.show();

    $("#pop").popover('hide');

    $("#zoom-in").click(function () {
        changeZoom(++zoom);
    });
    $("#zoom-out").click(function () {
        changeZoom(--zoom);
    });

    $("canvas").mousedown(map.dragStart);
    $("canvas").mousemove(map.mousemove);
    $("canvas").mouseup(map.dragEnd);

    for (var s = 255; s > 0; s = s - 8) {
        var color = [0, 0, 0];
        color[i % 3] = s;
        color[i % 2] = s;
        colors.push("rgb(" + color.join(",") + ")");
        i++;
    }


    $("form.form-search").submit(function () {
        map.search($("input").val());
        return false;
    });
    $("#pop").popover({
        placement:"top",
        trigger:"manual"

    });

    $alliances = "";
    $.each(data.alliances, function () {
        $alliances += "<li><a href='' data-name='" + this.a + "'>" + this.an + " (" + this.c + ")</a></li>";
    });

    $("ul.alliances").html($alliances);
    $("li a").toggle(function () {
        var link = $(this);
        var scale = zoom == 1 ? 1 : zoom * 1.1;
        var color = colors[$("li a.selected").length % colors.length];
        link.addClass("selected").css({"color":color });
        map.selectAlliance({an:link.attr("data-name"), c:color});
        return false;
    }, function () {
        var link = $(this);
        var scale = zoom == 1 ? 1 : zoom;
        link.removeClass("selected").css({"color":"" });
        map.deSelectAlliance(link.attr("data-name"));
        return false;
    });
    $("a[data-name=174]").trigger("click");
    $("a[data-name=702]").trigger("click");
    $("a[data-name=1322]").trigger("click");
    $(".menu-btn a").click(function () {
        alert("Soon bro :)");
        return false;
    })
});