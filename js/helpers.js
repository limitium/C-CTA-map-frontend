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
                        $("a[data-a=" + iColor[0] + "]").addClass("selected").css({color: iColor[1]});
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
        picking.removeClass("colorPicking").addClass("selected").css({color: color});
        map.selectAlliance(map.alliances[picking.attr("data-a")], color);
        map.draw();
    }
}

function allianceClick(e) {

    var self = $(this), a = $("[data-a=" + self.attr("data-a") + "]"), picking = $("a.colorPicking");

    if (picking.length) {
        //close picker
        $("._wColorPicker_buttonColor").trigger('click');
        picking.removeClass("colorPicking");
    }
    if (a.hasClass("selected")) {
        a.removeClass("selected").css({color: ""});
        map.deSelectAlliance(map.alliances[a.attr("data-a")]);
        map.draw();
    } else {
        $(".color-picker").css({top: e.pageY - 23 + "px", left: e.pageX - 16 + "px"});
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
        bc: 0,
        totalDcc: 0
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
function cursorMove(wx, wy, x, y) {
    var box = $(".mouse-coordinates");
    if (x && y) {
        box.html(Math.round(x) + ":" + Math.round(y));
    }
    box.offset({ top: wy + 20, left: wx + 20});

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

