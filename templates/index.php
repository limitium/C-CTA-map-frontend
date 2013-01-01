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
    <meta name="description" content="Join us! We know everything about all worlds.">

    <!-- Mobile viewport optimized: h5bp.com/viewport -->
    <meta name="viewport" content="width=device-width">

    <!-- Place favicon.ico and apple-touch-icon.png in the root directory: mathiasbynens.be/notes/touch-icons -->
    <link rel="icon" type="image/png" href="favicon.png"/>
    <link
        href='http://fonts.googleapis.com/css?family=Play&subset=latin,latin-ext,cyrillic-ext,cyrillic,greek,greek-ext'
        rel='stylesheet' type='text/css'>
    <link rel="stylesheet" href="/css/style.css">
</head>
<body class="index">
<!-- Prompt IE 6 users to install Chrome Frame. Remove this if you support IE 6.
chromium.org/developers/how-tos/chrome-frame-getting-started -->
<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a
    different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a>
    to experience this site.<![endif]-->
<div class="container">
    <h2 class="offset3">Select world to scan.</h2>

    <div class="row">
        <?php $perCol = ceil(sizeof($servers) / 3); ?>
        <?php for ($i = 0; $i <= 2; $i++): ?>

        <ul class="span4 world-list">
            <?php for ($k = $i * $perCol; $k < ($i + 1) * $perCol; $k++): ?>
            <?php if ($k == sizeof($servers)) {
                break;
            }
            $server = $servers[$k]; ?>
            <li>
                <a href="/map/<?php echo $server['id']; ?>"><?php echo $server['name']; ?></a>
            </li>
            <?php endfor; ?>
        </ul>
        <?php endfor;?>
    </div>
    <div class="row">
        <div class="changelog span8 offset2">
            <h5>30.12.2012</h5>
            Good news everyone! Today we have lunched Email notification service. You need go to <a hreg="http://map.tiberium-alliances.com/settings#notifications">settings</a> page specify your email, nickname and you will receive notification when your base is alerted or destroyed.
            Special thanks to Chris Misztur.
            <h5>24.12.2012</h5>
            Added World 59 (USA West Coast), World 60 (Europe), Мир 10, Mundo 8 (España).
            <h5>16.12.2012</h5>
            Added Monde 8, World 57 (Europe), World 58 (USA East Coast), Welt 21, Mundo 5 Brazil.
            <h5>5.12.2012</h5>
            Added Dünya3, World 55, Mundo 8 (España), Świat 5, World 56, Wereld 3.
            <h5>27.11.2012</h5>
            Added World 54, Welt 20, Мир 9.
            <h5>12.11.2012</h5>
            <a href="http://forum.alliances.commandandconquer.com/showthread.php?tid=13431&pid=93842#pid93842">Looking for help</a>. Added World 51, World 52, World 53, Мир 8, Welt 19. New faster parser all worlds in 5 mins!
            <h5>7.11.2012</h5>
            Added Мир 1, Världen 1, Svet 1, Lume 1, Verden 1, Világ 1, Maailma 1, Verden 1, Svět 1.
            <h5>4.11.2012</h5>
            Added Monde 7, Mundo 4 (Portuguesa), Welt 18, World 50 (Europe), Mundo 5 (España)
            <h5>31.10.2012</h5>
            Added Modne 2, World 49.
            <h5>24.10.2012</h5>
            Added Świat 4, Welt 14, Мир 7, World 48.
            <h5>15.10.2012</h5>
            Added World 47, Mundo 3. Now you can change "width" in drawings!
            <h5>04.10.2012</h5>
            Added possibility to share drawings via URL just add '~drawHash' to URL tail.
            <h5>04.10.2012</h5>
            Added sharing url shortner compatible with ingame forums.
            <h5>02.10.2012</h5>
            Added World 44, Мир 6. Fixed selected base info.
            <h5>30.09.2012</h5>
            Added Monde 6, Welt 15. Moved to new hosting.
            <h5>25.09.2012</h5>
            Added Mundo 2 (Portuguesa), Welt 14, World 12, Мир 5, World 43.
            <h5>13.09.2012</h5>
            Added World 40, Welt 13, Mundo 5 (España), Świat 3, World 41. Now custom markers can be saved and shared! Draw yours best plan!
            <h5>7.09.2012</h5>
            Custom markers now can be zoomed + change colors! test plz.
            <h5>28.08.2012</h5>
            Added Wereld 2, Mudno 4. Added ability to change own bases color. Set "Own base" color and "Player name" in settings.
            <h5>24.08.2012</h5>
            Added World 38, World 39. Improved data load speed and updates.
            <h5>20.08.2012</h5>
            Added Monde 5, Welt 12, World 37. Changed data update methods.
            <h5>15.08.2012</h5>
            Added World 36, Mundo 4, Dünya 2, Мир 4. Fixed data parser in updated worlds, in old worlds base names, levels etc are corrupted.
            <h5>10.08.2012</h5>
            Test draw moves
            <h5>9.08.2012</h5>
            Test drawings
            <h5>6.08.2012</h5>
            Added Welt 10, World 34, Mundo 3 Brazil, World 35, Welt 11. Added Donate button.
            <h5>24.07.2012</h5>
            Added Świat 2, World 33 (Europe), Welt 9, Мир 3
            <h5>17.07.2012</h5>
            Added Mundo 3, World 31, World 32, Monde 4. Rewrote parser hope EA will not block me anymore :E.
            <h5>11.07.2012</h5>
            Added World 30. Add NOD base images.
            <h5>09.07.2012</h5>
            Added  Welt 8.
            <h5>03.07.2012</h5>
            Added World 28, World 29. Mouse wheel zoom added.
            <h5>28.06.2012</h5>
            New version improve load speed. Separate worlds. Added: Welt 7, Monde 3, World 27.
            <h5>22.06.2012</h5>
            New filters added: minimum base lvl, minimum poi lvl, minimum players in alliance, hide "No Alliance" bases.
            Added: Mir 1, World 27.
            <h5>18.06.2012</h5>
            Monde 2, Welt 6, World 24, Mundo 2 (Espana), World 25, World 26.
            <h5>12.06.2012</h5>
            Removed alliances with players count 0-1 custom filters will be added later.
            Added POI position.
            Added icons for POI and GDI bases.
            <h5>11.06.2012</h5>
            Alliance on hover info added with poi summary + top40 position.
            Poi score info added.
            <h5>07.06.2012</h5>
            Poi hover info added.
            A lot of fixes.
            <h5>06.06.2012</h5>
            New version!!!
            Custom map settings.
            POI markers added.
            Improved rendering speed.
            <h5>04.06.2012</h5>
            World 23.
            <h5>03.06.2012</h5>
            World 21.
            <h5>02.06.2012</h5>
            World 22, Welt 5.
            <h5>01.06.2012</h5>
            World 18 (Europe), World 19 (USA West Coast), Monde 1, Mondo 1, Mundo 1 (España), Świat 1, Mир 1, Mundo 1
            (Portuguesa), Dünya 1, Wereld 1, Mundo 1 (Brasil).
            <h5>19.05.2012</h5>
            Welt 4 added.
            <h5>17.05.2012</h5>
            World 16 added.
            <h5>04.05.2012</h5>
            World 15 added.
            <h5>28.04.2012</h5>
            Changed data request no more data lost.
            <h5>27.04.2012</h5>
            Change circle marks to triangle.
            <h5>26.04.2012</h5>
            Close beta 1 added!
            <h5>25.04.2012</h5>
            New parser updates every <strong>10 mins!</strong>.
            Altered base marked with red circle.
            Protected base marked with blue circle.
            Base defence and buildings conditions added in info.
            Protection timeout added in info.
            Base level added in info.
            Removed ruined bases.
            Removed destroyed bases.
        </div>
    </div>
</div>
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