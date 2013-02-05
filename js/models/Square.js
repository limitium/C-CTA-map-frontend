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
    this.endgames = [];
    this.renderedCount = 0;
    this.selectedBase = null;
}
Square.prototype.reload = function () {
    this.cache = {};
};
Square.prototype.addBase = function (base) {
    this.bases[this.bases.length] = base;
};
Square.prototype.addPoi = function (poi) {
    this.pois[this.pois.length] = poi;
};
Square.prototype.addEndgame = function (endgame) {
    this.endgames[this.endgames.length] = endgame;
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
        r = settings['size-base'] / 2 * scale,
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
        if (typeof map.selectedAlliances[base.getAlliance().a] != "undefined") {
            color = map.selectedAlliances[base.getAlliance().a];
        }
        if (map.player && map.player.i == base.pi) {
            color = settings['color-self'];
        }
        if (map.selectedBase && map.selectedBase.getAlliance() == base.getAlliance()) {
            color = settings['color-selected'];
            if (map.selectedBase.pi == base.pi) {
                color = settings['color-selected-base'];
            }

        }

        this.renderBase(renderer, scale, x, y, r, color, a, base);
    }
    //render selected base
    if (map.selectedBase) {
        base = map.selectedBase;
        x = (base.x - this.x) * scale;
        y = (base.y - this.y) * scale;

//        if (!map.player || map.player.i != map.selectedBase.pi) {
//            this.renderBase(renderer, scale, x, y, r, settings['color-selected'], a, base);
//        }

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
Square.prototype.renderEndgames = function (renderer, scale) {
    if (settings['filter-poi-hide']) {
        return;
    }
    var l = this.endgames.length,
        size = 2.5 * scale;
        size2 = 0.5 * scale;
        size3 = 1 * scale;
    while (l--) {
        var endgame = this.endgames[l],
            x = (endgame.x - this.x) * scale ,
            y = (endgame.y - this.y) * scale;

//        if (!endgame.isVisible()) {
//            continue;
//        }
        renderer.beginPath();
        var grd = renderer.createRadialGradient(x+size3, y+size3, 0, x+size3, y+size3, size);
        grd.addColorStop(0, 'rgba(255,0,0,0.3)');
        grd.addColorStop(1, "#ff0000");

        renderer.fillStyle = grd;
        renderer.strokeStyle = "#ff0000";
        renderer.lineWidth = 1;

        renderer.moveTo(x-size2, y-size2);
        renderer.lineTo(x-size2, y + size);
        renderer.lineTo(x + size, y + size);
        renderer.lineTo(x + size, y-size2);
        renderer.lineTo(x-size2, y-size2);

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
    $(renderer.canvas).attr({width: w + "px", height: h + "px"});
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
    this.renderEndgames(renderer, scale);
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