$(document).ready(function () {
    var canvas = $("canvas#map"), ct = canvas[0], buf = $("canvas.renderer")[0];
    $("canvas#map,canvas.renderer").css("background-color", settings['color-background']);

    if (typeof ct == "undefined" || typeof ct.getContext == "undefined") {
        alert("Canvas unsupported by your browser :(");
        return;
    }

    settings['color-grid'] = "rgba(" + hex2rgb(settings['color-grid']) + ",0.1)";
    settings['color-grid-label'] = "rgba(" + hex2rgb(settings['color-grid-label']) + ",0.5)";
    settings['color-center-hub-start'] = "rgba(" + hex2rgb(settings['color-center-hub']) + ",0.3)";
    settings['color-control-hub-start'] = "rgba(" + hex2rgb(settings['color-control-hub']) + ",0.3)";
    settings['color-server-hub-start'] = "rgba(" + hex2rgb(settings['color-server-hub']) + ",0.3)";
    settings['color-server-hub-crash-start'] = "rgba(" + hex2rgb(settings['color-server-hub-crash']) + ",0.3)";

    $("canvas#drawer")
        .mousedown(map.mousedown)
        .mouseup(map.mouseup)
        .mousemove(map.mousemove)
        .mousewheel(function (event, delta, deltaX, deltaY) {
            delta > 0 ? zoomIn() : zoomOut();
        });

    window.mapListener = initDrawing();

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

    $(".color-picker input").minicolors({
        hide:function(){
            var input = $(this);
            input.closest(".color-picker").hide();
            colorClick(input.val());
        }
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
                "format": "json",
                "apiKey": "R_6b660de4008a5d0b5eca64e1b529b54f",
                "login": "limitium",
                "longUrl": window.location.href
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

        return false;
    });

    map.init(ct.getContext("2d"), buf.getContext("2d"));
    map.onHoverBase = hoverBase;
    map.onHoverPoi = hoverPoi;
    map.onHoverEndgame = hoverEndgame;
    map.onBlurBase = cleanPointInfo;
    map.onBlurPoi = cleanPointInfo;
    map.onBlurEndgame = cleanPointInfo;
    map.onMouseMove = cursorMove;

    resizeCanvas();


    if (typeof ccmapData == 'undefined') {
        alert("There is no data for " + server.name + " yet :(");
        return;
    }

    loadData();
    parseHash();
});
