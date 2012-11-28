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

    <title>Sign up Command & Conquer Tiberium Alliances World Map</title>
    <meta name="description" content="Join us! We know everything about all worlds.">

    <!-- Mobile viewport optimized: h5bp.com/viewport -->
    <meta name="viewport" content="width=device-width">

    <!-- Place favicon.ico and apple-touch-icon.png in the root directory: mathiasbynens.be/notes/touch-icons -->
    <link rel="icon" type="image/png" href="favicon.png"/>
    <link rel="stylesheet" href="/css/style.css">

</head>
<body>
<!-- Prompt IE 6 users to install Chrome Frame. Remove this if you support IE 6.
chromium.org/developers/how-tos/chrome-frame-getting-started -->
<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a
    different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a>
    to experience this site.</p><![endif]-->
<div class="container">
    <h2 class="offset3">Sign in, Commander.</h2>
    <ul class="pager">
        <li class="previous">
            <a href="<?php echo $back ? $back : "/"; ?>">&larr; Return to Map</a>
        </li>
    </ul>

    <div class="row">
        <div class="offset3 span4">
            <?php foreach ($flash->getMessages() as $type => $msg): ?>
            <div class="alert alert-<?php echo $type;?>">
                <?php echo $msg; ?>
            </div>
            <?php endforeach; ?>

            <script src="http://loginza.ru/js/widget.js" type="text/javascript"></script>
            <iframe
                src="http://loginza.ru/api/widget?overlay=loginza&token_url=http://map.tiberium-alliances.com/check&providers_set=facebook,google,twitter,aol,steam,vkontakte,openid,myopenid,yandex,flickr,lastfm,verisign,mailruapi,mailru,loginza,webmoney,rambler&lang=en"
                style="width:359px;height:300px;" scrolling="no" frameborder="no"></iframe>


        </div>
    </div>
</div>


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