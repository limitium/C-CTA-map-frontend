<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]>
<html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>
<html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>
<html class="no-js lt-ie9" lang="en"> <![endif]-->
<!-- Consider adding a manifest.appcache: h5bp.com/d/Offline -->
<!--[if gt IE 8]><!-->
<html class="no-js" lang="en"> <!--<![endif]-->
<head>
    <meta charset="utf-8">

    <!-- Use the .htaccess and remove these lines to avoid edge case issues.
 More info: h5bp.com/i/378 -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">

    <title>Personal settings</title>
    <meta name="description" content="Personal settings">

    <!-- Mobile viewport optimized: h5bp.com/viewport -->
    <meta name="viewport" content="width=device-width">

    <!-- Place favicon.ico and apple-touch-icon.png in the root directory: mathiasbynens.be/notes/touch-icons -->
    <link rel="icon" type="image/png" href="favicon.png"/>

    <link rel="stylesheet" href="/css/jquery.miniColors.css">
    <link rel="stylesheet" href="/css/style.css">

</head>
<body>
<!-- Prompt IE 6 users to install Chrome Frame. Remove this if you support IE 6.
chromium.org/developers/how-tos/chrome-frame-getting-started -->
<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a
    different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a>
    to experience this site.</p><![endif]-->
<div class="container">
    <h2 class="offset3">Personal settings, Commander.</h2>
    <ul class="pager">
        <li class="previous">
            <a href="<?php echo $back ? $back : "/"; ?>">&larr; Return to Map</a>
        </li>
        <li class="next">
            <a href="/logout">Sign out &rarr;</a>
        </li>
    </ul>
    <div class="row">
        <div class="span12">
            <ul class="nav nav-tabs">
                <li><a href="#filters" data-toggle="tab">Filters</a></li>
                <li><a href="#colors" data-toggle="tab">Colors</a></li>
                <li><a href="#sizes" data-toggle="tab">Sizes</a></li>
                <li><a href="#notifications" data-toggle="tab">Notifications</a></li>
            </ul>
        </div>
        <form class="form-horizontal span12" method="post" action="/settings">
            <div class="row">

                <div class="tab-content">
                    <div class="tab-pane" id="filters">
                        <div class="span4">
                            <?php foreach (array('filter-alliance-min-level', 'filter-base-min-level','filter-poi-min-level') as $fName) : ?>
                                <div
                                    class="control-group<?php echo isset($settings->fields[$fName]['invalid']) ? " error" : ""; ?>">
                                    <label class="control-label"
                                           for="<?php echo $fName ?>"><?php echo $settings->fields[$fName]['label']; ?></label>

                                    <div class="controls">
                                        <input class="input-small" id="<?php echo $fName ?>" name="<?php echo $fName ?>"
                                               type="text" value="<?php echo $settings->fields[$fName]['val']; ?>">
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <div class="span4">
                            <?php foreach (array('filter-poi-hide', 'filter-unselected-hide','filter-noalliance-hide') as $fName) : ?>
                                <div
                                    class="control-group<?php echo isset($settings->fields[$fName]['invalid']) ? " error" : ""; ?>">
                                    <label class="control-label"
                                           for="<?php echo $fName ?>"><?php echo $settings->fields[$fName]['label']; ?></label>

                                    <div class="controls">
                                        <label class="checkbox">
                                            <input type="checkbox" id="<?php echo $fName ?>"
                                                   name="<?php echo $fName ?>"<?php echo $settings->fields[$fName]['val'] ? " checked" : ""; ?>>
                                        </label>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <div class="span4">
                            <?php foreach (array('filter-endgame-hide') as $fName) : ?>
                                <div
                                    class="control-group<?php echo isset($settings->fields[$fName]['invalid']) ? " error" : ""; ?>">
                                    <label class="control-label"
                                           for="<?php echo $fName ?>"><?php echo $settings->fields[$fName]['label']; ?></label>

                                    <div class="controls">
                                        <label class="checkbox">
                                            <input type="checkbox" id="<?php echo $fName ?>"
                                                   name="<?php echo $fName ?>"<?php echo $settings->fields[$fName]['val'] ? " checked" : ""; ?>>
                                        </label>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <div class="tab-pane" id="colors">
                        <div class="span4">
                            <?php foreach (array('color-background', 'color-grid', 'color-grid-label', 'color-base', 'color-selected-base','color-selected', 'color-self', 'color-protected', 'color-altered') as $fName) : ?>
                                <div
                                    class="control-group<?php echo isset($settings->fields[$fName]['invalid']) ? " error" : ""; ?>">
                                    <label class="control-label"
                                           for="<?php echo $fName ?>"><?php echo $settings->fields[$fName]['label']; ?></label>

                                    <div class="controls">
                                        <input class="input-small" id="<?php echo $fName ?>" name="<?php echo $fName ?>"
                                               type="text" value="<?php echo $settings->fields[$fName]['val']; ?>">
                                    </div>
                                </div>
                            <?php endforeach; ?>


                        </div>
                        <div class="span4">
                            <?php foreach (array('color-aircraft', 'color-crystal', 'color-reactor', 'color-tiberium', 'color-resonator', 'color-tungsten', 'color-uranium') as $fName) : ?>
                                <div
                                    class="control-group<?php echo isset($settings->fields[$fName]['invalid']) ? " error" : ""; ?>">
                                    <label class="control-label"
                                           for="<?php echo $fName ?>"><?php echo $settings->fields[$fName]['label']; ?></label>

                                    <div class="controls">
                                        <input class="input-small" id="<?php echo $fName ?>" name="<?php echo $fName ?>"
                                               type="text" value="<?php echo $settings->fields[$fName]['val']; ?>">
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                        <div class="span4">
                            <?php foreach (array('color-center-hub', 'color-control-hub', 'color-server-hub', 'color-server-hub-crash') as $fName) : ?>
                                <div
                                    class="control-group<?php echo isset($settings->fields[$fName]['invalid']) ? " error" : ""; ?>">
                                    <label class="control-label"
                                           for="<?php echo $fName ?>"><?php echo $settings->fields[$fName]['label']; ?></label>

                                    <div class="controls">
                                        <input class="input-small" id="<?php echo $fName ?>" name="<?php echo $fName ?>"
                                               type="text" value="<?php echo $settings->fields[$fName]['val']; ?>">
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                    <div class="tab-pane" id="sizes">
                        <div class="span4">
                            <?php foreach (array('size-base', 'size-poi','size-center-hub','size-control-hub','size-server-hub') as $fName) : ?>
                                <div
                                    class="control-group<?php echo isset($settings->fields[$fName]['invalid']) ? " error" : ""; ?>">
                                    <label class="control-label"
                                           for="<?php echo $fName ?>"><?php echo $settings->fields[$fName]['label']; ?></label>

                                    <div class="controls">
                                        <input class="input-small" id="<?php echo $fName ?>" name="<?php echo $fName ?>"
                                               type="text" value="<?php echo $settings->fields[$fName]['val']; ?>">
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>

                    <div class="tab-pane" id="notifications">
                        <div class="span10">
                            <?php foreach (array('notice-email') as $fName) : ?>
                                <div
                                    class="control-group<?php echo isset($settings->fields[$fName]['invalid']) ? " error" : ""; ?>">
                                    <label class="control-label"
                                           for="<?php echo $fName ?>"><?php echo $settings->fields[$fName]['label']; ?></label>

                                    <div class="controls">
                                        <input class="input-medium " id="<?php echo $fName ?>" name="<?php echo $fName ?>"
                                               type="text" value="<?php echo $settings->fields[$fName]['val']; ?>">
                                    </div>
                                </div>
                            <?php endforeach; ?>
                            <?php foreach (array('notice-name') as $fName) : ?>
                                <div
                                    class="control-group<?php echo isset($settings->fields[$fName]['invalid']) ? " error" : ""; ?>">
                                    <label class="control-label"
                                           for="<?php echo $fName ?>"><?php echo $settings->fields[$fName]['label']; ?></label>

                                    <div class="controls">
                                        <input class="input-medium " id="<?php echo $fName ?>" name="<?php echo $fName ?>"
                                               type="text" value="<?php echo $settings->fields[$fName]['val']; ?>">
                                        <span class="help-block">Comma separated, if several worlds</span>
                                    </div>
                                </div>
                            <?php endforeach; ?>

                            <?php foreach (array('notice-altered', 'notice-ruined') as $fName) : ?>
                                <div
                                    class="control-group<?php echo isset($settings->fields[$fName]['invalid']) ? " error" : ""; ?>">
                                    <label class="control-label"
                                           for="<?php echo $fName ?>"><?php echo $settings->fields[$fName]['label']; ?></label>

                                    <div class="controls">
                                        <label class="checkbox">
                                            <input type="checkbox" id="<?php echo $fName ?>"
                                                   name="<?php echo $fName ?>"<?php echo $settings->fields[$fName]['val'] ? " checked" : ""; ?>>
                                        </label>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
                <div class="span12">
                    <a href="/reset" class="pull-right btn">Reset</a>
                </div>
            </div>
            <?php foreach ($flash->getMessages() as $type => $msg): ?>
                <div class="alert alert-<?php echo $type;?>">
                    <?php echo $msg; ?>
                </div>
            <?php endforeach; ?>
            <div class="form-actions">
                <button type="submit" class="offset3 btn btn-primary">Save changes</button>
            </div>
        </form>
    </div>
</div>


<!-- JavaScript at the bottom for fast page loading -->

<!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="/js/libs/jquery-1.7.1.min.js"><\/script>')</script>
<script src="/js/libs/bootstrap-tab.js"></script>
<script src="/js/libs/jquery.miniColors.js"></script>
<script>
    $(function () {
        $("input[name^=color][type=text]").minicolors({
            theme:"bootstrap",
            letterCase:"uppercase"
        });

        var tab = $("[href=" + location.hash + "]");
        if (!tab.length) {
            tab = $("[href=#filters]");
        }
        tab.tab('show');
    });
</script>
<!-- Asynchronous Google Analytics snippet. Change UA-XXXXX-X to be your site's ID.
mathiasbynens.be/notes/async-analytics-snippet -->
<script>
    var _gaq = [
        ['_setAccount', 'UA-29659292-3'],
        ['_trackPageview']
    ];
    (function (d, t) {
        var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
        g.src = ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js';
        s.parentNode.insertBefore(g, s)
    }(document, 'script'));
</script>
<script type="text/javascript">
    reformal_wdg_domain = "c-c-map";
    reformal_wdg_mode = 0;
    reformal_wdg_title = "C&C map";
    reformal_wdg_ltitle = "Leave feedback";
    reformal_wdg_lfont = "";
    reformal_wdg_lsize = "";
    reformal_wdg_color = "#ff0088";
    reformal_wdg_bcolor = "#516683";
    reformal_wdg_tcolor = "#FFFFFF";
    reformal_wdg_align = "left";
    reformal_wdg_waction = 0;
    reformal_wdg_vcolor = "#9FCE54";
    reformal_wdg_cmline = "#E0E0E0";
    reformal_wdg_glcolor = "#105895";
    reformal_wdg_tbcolor = "#FFFFFF";

    reformal_wdg_bimage = "8489db229aa0a66ab6b80ebbe0bb26cd.png";

</script>
<script type="text/javascript" language=JavaScript src="http://idea.informer.com/tab6.js?domain=c-c-map"></script>
<noscript><a href="http://c-c-map.idea.informer.com">C&C map feedback </a> <a href="http://idea.informer.com"><img
            src="http://widget.idea.informer.com/tmpl/images/widget_logo.jpg"/></a></noscript>


</body>
</html>