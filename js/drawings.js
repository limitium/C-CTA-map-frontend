function initDrawing() {

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
                    paths: _.map(group.children, function (path) {
                        return {
                            width: path.strokeWidth / map.getScale(),
                            color: path.strokeColor.toCssString(),
                            segments: _.map(path.segments, function (segment) {
                                return {
                                    x: parseInt((segment.point.x - map.ox) / map.getScale()),
                                    y: parseInt((segment.point.y - map.oy) / map.getScale())
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