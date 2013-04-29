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

    <title>Command & Conquer Tiberium Alliances World Map</title>
    <meta name="description" content="Global world map of command & conquer tiberium alliances close beta">

    <!-- Mobile viewport optimized: h5bp.com/viewport -->
    <meta name="viewport" content="width=device-width">

    <!-- Place favicon.ico and apple-touch-icon.png in the root directory: mathiasbynens.be/notes/touch-icons -->
    <link rel="icon" type="image/png" href="favicon.png"/>
    <link rel="stylesheet" href="/css/jquery.miniColors.css">
    <link
        href='http://fonts.googleapis.com/css?family=Play&subset=latin,latin-ext,cyrillic-ext,cyrillic,greek,greek-ext'
        rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="/css/style.css">

</head>
<body class="map">
<!-- Prompt IE 6 users to install Chrome Frame. Remove this if you support IE 6.
chromium.org/developers/how-tos/chrome-frame-getting-started -->
<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a
    different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a>
    to experience this site.</p><![endif]-->
<div id="main">
    <div class="color-picker hide"><input type="text"/></div>
    <div class="mouse-coordinates"></div>
    <div class="loader"></div>
    <canvas id="map" width="1000px" height="1000px"></canvas>
    <canvas class="renderer"></canvas>
    <canvas id="drawer"></canvas>
    <div id="world-info">
        <div class="server-info">
            <div>Server: <span id="server-name">-</span></div>
            <div>Players: <span id="players-total">-</span></div>
            <div>Bases: <span id="bases-total">-</span></div>
            <div>Last update: <span id="last-update">-</span></div>
        </div>
        <div class="point-info">

        </div>
        <div class="alliance-info">
        </div>
    </div>

    <div id="users">
        <a class="btn btn-success" href="/">Servers</a>
        <?php if ($role == "guest"): ?>
            <a class="btn btn-success in" href="/auth">Sign in</a>
        <?php else: ?>
            <a class="btn btn-success in" href="/settings">Settings</a>
        <?php endif; ?>
        <?php if ($role == "guest"): ?>
            <a class="btn btn-warning" href="/auth">Draw</a>
        <?php else: ?>
            <button class="btn btn-warning" id="draw" href="#">Draw</button>
            <button class="btn btn-success" id="clear" href="#">Clear</button>
            <button class="btn btn-success" id="remove-last" href="#">Remove last</button>
            <input id="draw-color" type="text" value="#FF0000">
            <input id="draw-width" type="number" value="1">
            <button class="btn btn-success" id="save" href="#">Save</button>
            <button class="btn btn-success" id="load" href="#">Load</button>
        <?php endif; ?>
        <button class="btn btn-info" id="share" href="#">Share</button>
        <form action="https://www.paypal.com/cgi-bin/webscr" method="post">
            <input type="hidden" name="cmd" value="_s-xclick">
            <input type="hidden" name="encrypted" value="-----BEGIN PKCS7-----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-----END PKCS7-----
">
            <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" border="0"
                   name="submit" alt="PayPal - The safer, easier way to pay online!">
            <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
        </form>


    </div>

    <div class="menu alliance">
        <div class="actions">
            <button class="btn btn-primary" id="zoom-out"><i class="icon-minus"></i></button>
            <button class="btn btn-primary" id="zoom-in"><i class="icon-plus"></i></button>
            <span>Zoom lvl: </span><span class="zoom-lvl">0.5</span>

            <form class="form-search">
                <label>Search by player nick:</label>
                <input type="text" class="input-medium search-query">
                <button type="submit" class="btn"><i class="icon-search"></i></button>
            </form>
        </div>
        <div class="menu-bottom"></div>
        <div class="menu-top"></div>
        <ul class="alliances">

        </ul>
        <div class="menu-bottom"></div>
    </div>
</div>

<div class="modal hide fade" id="modal-share">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Share url</h3>
    </div>
    <div class="modal-body">
        <div class="form-horizontal">
            <div class="control-group">
                <label class="control-label" for="share-url">Url for sharing</label>

                <div class="controls">
                    <input type="text" id="share-url">
                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button href="#" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">Ok</button>
    </div>
</div>

<div class="modal hide fade" id="modal-save">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Save drawing</h3>
    </div>
    <div class="modal-body">
        <div class="form-horizontal">
            <div class="control-group">
                <label class="control-label" for="drawing-name">Drawing name</label>

                <div class="controls">
                    <input type="text" id="drawing-name" placeholder="Type name">
                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button href="#" class="btn btn-primary" id="push-drawing">Save</button>
        <button href="#" class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
    </div>
</div>

<div class="modal hide fade" id="modal-saved">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Drawing saved</h3>
    </div>
    <div class="modal-body">
        <p>
            Drawing successfully saved. Hash for sharing: <b id="drawing-hash">123</b>
        </p>

        <p>
            All yours drawings can be found under "Load" button.
        </p>
    </div>
    <div class="modal-footer">
        <button href="#" class="btn btn-primary" data-dismiss="modal" aria-hidden="true">Ok</button>
    </div>
</div>
<div class="modal hide fade" id="modal-load">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>Load drawing</h3>
    </div>
    <div class="modal-body">
        <div class="form-horizontal">
            <div class="control-group">
                <label class="control-label" for="drawing-load-hash">Drawing hash</label>

                <div class="controls">
                    <input type="text" id="drawing-load-hash" placeholder="Type hash" class="span2">
                </div>
            </div>
            <div class="control-group">
                <label class="control-label" for="drawing-load-list">Yours drawings</label>

                <div class="controls">
                    <select id="drawing-load-list" size="10" class="span4">
                        <?php foreach ($markers as $marker): ?>
                            <option value="<?php echo $marker->hash; ?>"><?php echo $servers[$marker->world]; ?>
                                :<?php echo $marker->hash; ?> <?php echo $marker->name; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button href="#" class="btn btn-danger" id="delete-drawing">Delete</button>
        <button href="#" class="btn btn-primary" id="pull-drawing">Load</button>
        <button href="#" class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
    </div>
</div>

<script>
    var settings = <?php print_r($settings);?>,
        server = <?php echo json_encode($server); ?>,
        servers = <?php echo json_encode($servers); ?>,
        serverTime = <?php echo time(); ?>;
</script>
<!-- JavaScript at the bottom for fast page loading -->

<!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="/js/libs/jquery-1.7.1.min.js"><\/script>')</script>

<script src="/js/libs/paper.js"></script>
<script src="/js/libs/bootstrap-modal.js"></script>
<!-- scripts concatenated and minified via build script -->
<script src="/js/plugins.js"></script>

<script src="/js/models/Square.js"></script>
<script src="/js/models/Base.js"></script>
<script src="/js/models/Poi.js"></script>
<script src="/js/models/Alliance.js"></script>
<script src="/js/models/Player.js"></script>
<script src="/js/models/ServerHUB.js"></script>
<script src="/js/models/CenterHUB.js"></script>
<script src="/js/models/ControlHUB.js"></script>
<script src="/js/map.js"></script>
<script src="/js/drawings.js"></script>
<script src="/js/helpers.js"></script>

<script src="/js/script.js"></script>

<!-- end scripts -->
<script type="text/javascript" src="http://data.tiberium-alliances.com/world/<?php echo $server['id']; ?>">
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

<div class="ads right">
    <script type="text/javascript"><!--
        google_ad_client = "ca-pub-1812142756488492";
        /* map2 */
        google_ad_slot = "7988629993";
        google_ad_width = 728;
        google_ad_height = 90;
        //-->
    </script>
    <script type="text/javascript"
            src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
    </script>
</div>
<div class="ads left">
    <script type="text/javascript"><!--
        google_ad_client = "ca-pub-1812142756488492";
        /* map */
        google_ad_slot = "0218655414";
        google_ad_width = 468;
        google_ad_height = 60;
        //-->
    </script>
    <script type="text/javascript"
            src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
    </script>
</div>
</body>
</html>