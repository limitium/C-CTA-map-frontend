var map = {
    init:function (v, z) {
        map.v = v;
        map.z = z;
        map.f = 0;
        map.t = new Date().getTime();
        map.d = false;
        map.ox = 0;
        map.oy = 0;
        map.s = null;
        map.selected = {};
    },
    draw:function () {
        map.v.clearRect(0, 0, 1000, 1000);
        map.drawGrid();
        map.drawBases();
        map.f++;
    },
    drawXLine:function (x, scale) {
        map.v.moveTo(map.ox + scale * x * 100, map.oy + 0);
        map.v.lineTo(map.ox + scale * x * 100, map.oy + scale * 1000);
        map.v.lineWidth = 1;
        map.v.strokeStyle = "#eee"; // line color;
        map.v.stroke();
    },
    drawYLine:function (y, scale) {
        map.v.moveTo(map.ox + 0, map.oy + scale * y * 100);
        map.v.lineTo(map.ox + scale * 1000, map.oy + scale * y * 100);
        map.v.lineWidth = 1;
        map.v.strokeStyle = "#eee"; // line color;
        map.v.stroke();
    },
    drawGrid:function () {
        var scale = map.getScale();
        for (var i = 0; i < 10; i++) {
            for (var j = 0; j < 10; j++) {
                var mark = String.fromCharCode(65 + j) + ":" + i;
                map.v.font = 40 * scale + "px Calibri";
                map.v.textAlign = "center";
                map.v.fillStyle = "#eee";
                map.v.fillText(mark, map.ox + scale * i * 100 + 50 * scale, map.oy + scale * j * 100 + 60 * scale)
            }

            map.drawXLine(i, scale);
            map.drawYLine(i, scale);
        }
        map.drawXLine(10, scale);
        map.drawYLine(10, scale);
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
        var scale = map.getScale();
        $.each(bases, function () {
            var color = "#6CB4CC", dx = map.ox + scale * this.x, dy = map.oy + scale * this.y, r = scale * 1;
            if (typeof map.selected[this.an] != 'undefined') {
                color = map.selected[this.an];
            }

            this.dx = dx;
            this.dy = dy;
            this.r = r + 1;
            map.v.beginPath();
            map.v.arc(dx, dy, r, 0, 2 * Math.PI, false);
            map.v.fillStyle = color;
            map.v.fill();
            map.v.lineWidth = 1;
            map.v.strokeStyle = color;
            map.v.stroke();
        });
    },
    setZoom:function (z) {
        if (z < 1) {
            z = 1;
        }
        map.z = z;
        map.draw();
    },
    show:function () {
        map.draw();
    },
    dragStart:function (e) {
        map.d = true;
        map.dx0 = e.pageX;
        map.dy0 = e.pageY;
    },
    tooltip:function (b) {
        $("#pop").css({
            width:map.z + 4 + "px",
            height:map.z + 4 + "px",
            top:b.dy - 2,
            left:b.dx - 2
        });
        $("#pop").attr("data-content", b.bn)
        $("#pop").attr("data-original-title", "Player: " + b.n + "<br />Score: " + b.p + "<br />Alliance: " + b.an + "<br />x:" + b.x + ", y:" + b.y)
    },
    mousemove:function (e) {
        if (!map.d) {
            $.each(bases, function () {
                if (Math.sqrt(Math.pow(e.pageX - this.dx, 2) + Math.pow(e.pageY - this.dy, 2)) <= this.r) {
                    if (map.s != this) {
                        map.tooltip(this);
                    }
                    map.s = this;
                    return false;
                }
            });
        } else {
            dx = e.pageX;
            dy = e.pageY;
            map.ox = map.ox + dx - map.dx0;
            map.oy = map.oy + dy - map.dy0;
            map.dx0 = dx;
            map.dy0 = dy;
            map.draw();
        }
    },
    dragEnd:function (e) {
        map.d = false;
    },
    selectAlliance:function (a) {
        map.selected[a.an] = a.c;
        map.draw()
    },
    deSelectAlliance:function (a) {
        delete map.selected[a];
        map.draw()
    },
    search:function (n) {
        $.each(bases, function () {
            if (this.n == n) {
                map.scrollTo(map.getScale() * this.x, map.getScale() * this.y);
                map.tooltip(this);
                $("#pop").popover('show');
                return false;
            }
        });
    },
    scrollTo:function (x, y) {
        map.ox = -x + 1000 / 2;
        map.oy = -y + 1000 / 2;
        map.draw();
    }
}


$(document).ready(function () {

    map.init($("canvas")[0].getContext("2d"), 1);
    map.show();
    $("#pop").popover('hide');
    $("#zoom-in").click(function () {
        changeZoom(++zoom);
    });
    $("#zoom-out").click(function () {
        changeZoom(--zoom);
    });
    var changeZoom = function (zoom) {
        if (zoom <= 0) {
            zoom = 1;
            return;
        }
        map.setZoom(zoom);
        span.html(zoom);
    }
    $("canvas").mousedown(map.dragStart);
    $("canvas").mousemove(map.mousemove);
    $("canvas").mouseup(map.dragEnd);

    var colors = [], zoom = 1, zooming = false, i = 0;
    for (var s = 255; s > 0; s = s - 8) {
        var color = [0, 0, 0];
        color[i % 3] = s;
        color[i % 2] = s;
        colors.push("rgb(" + color.join(",") + ")");
        i++;
    }

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
    $("a[data-name=RusssianAllianceW]").trigger("click");
    $("a[data-name=RussianAllianceN]").trigger("click");

    var span = $('.zoom-lvl');

    $("form").submit(function () {
        map.search($("input").val());
        return false;
    });
    $("#pop").popover({
        placement:"top"
    });
});