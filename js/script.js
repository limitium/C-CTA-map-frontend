$(document).ready(function () {

    $(".menuhider").remove();
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
        $(".nick[an=" + link.attr("data-name") + "]").addClass("selected").css({
            "background-color":color,
            "font-size":2 * 2 * scale + "px"
        });

        return false;
    }, function () {
        var link = $(this);
        var scale = zoom == 1 ? 1 : zoom;
        link.removeClass("selected").css({"color":"" });
        $(".nick[an=" + link.attr("data-name") + "]").removeClass("selected").css({
            "background-color":"",
            "font-size":2 * scale + "px"
        });
        return false;
    });
    $("a[data-name=RusssianAllianceW]").trigger("click");
    $("a[data-name=RussianAllianceN]").trigger("click");

    var nicks = $(".nick"), span = $('.zoom-lvl');

    $("#zoom-in").click(function () {
        changeZoom(++zoom);
    });
    $("#zoom-out").click(function () {
        changeZoom(--zoom);
    });
    var changeZoom = function (zoom) {
        if (zooming) {
            return false;
        }
        if (zoom <= 0) {
            return false;
        }
        var scale = zoom == 1 ? 1 : zoom;

        zooming = true;
        nicks.each(function (d) {
            var d = $(this);
//            d.css({
//                            "top":d.attr("y") * scale + "px",
//                            "left":d.attr("x") * scale + "px",
//                            "font-size":2 * scale + "px"
//                        });
            d.css({
                "top":d.attr("y") * scale + "px",
                "left":d.attr("x") * scale + "px",
                "width":2 * scale + "px",
                "height":2 * scale + "px",
                "webkit-border-radius":2 * scale + "px",
                "-moz-border-radius":2 * scale + "px",
                "border-radius":2 * scale + "px"

//                            "font-size":2 * scale + "px"
            });
        });
        zooming = false;
        span.html(zoom);
    }

    $("form").submit(function () {
        search($("input").val());
        return false;
    })
    var search = function (nick) {
        var u = $("[n=" + nick.toLowerCase() + "]");
        if (u.length) {

            $("body").animate({"scrollTop":u.position().top - $(window).height() / 2,
                "scrollLeft":u.position().left - $(window).width() / 2}, 600);
            u.popover('show');
            setTimeout(function () {
                u.popover('hide');
            }, 2000)
//            u.animate({"background-color":"black"}, 600)
//                .animate({"background-color":"white"}, 600)
//                .animate({"background-color":"black"}, 600)
//                .animate({"background-color":"white"}, 600)
//                .animate({"background-color":"black"}, 600)
//                .animate({"background-color":"white"}, 600);
        }
    }
    $(".nick").each(function (i, user) {
        user = $(user);
        user.popover({
            placement:"top",
            title:user.attr("n"),
            content:"score: " + user.attr("p") + "<br />player: " + user.attr("n") + "<br />alliance: " + user.attr("an") + "<br />x:" + user.attr("rx")  + ", y:" + user.attr("ry")
        })
    });
//    var dragged = false;
//    $("html").mousemove(function (event) {
//        if (dragged) {
//            console.log(dragged)
//            var msg = "Handler for .mousemove() called at ";
//            var b = $('body');
////            console.log(event.pageY-dragged.pageY)
////            console.log(event.pageY-dragged.pageY)
//            b.scrollTop(dragged.scrollTop + dragged.pageY - event.pageY);
//            b.scrollLeft(dragged.scrollLeft + dragged.pageX - event.pageX);
//            msg += event.pageX + ", " + event.pageY;
//            console.log(msg);
//        }
//    });
//    $("html").mousedown(function (e) {
//        var b = $('body');
//        dragged = e;
//        e.scrollTop = b.scrollTop();
//        e.scrollLeft = b.scrollLeft();
//    })
//    $("html").mouseup(function () {
//        dragged = false;
//    })
});