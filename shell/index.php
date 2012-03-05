<!doctype html>
<!-- paulirish.com/2008/conditional-stylesheets-vs-css-hacks-answer-neither/ -->
<!--[if lt IE 7]> <html class="no-js lt-ie9 lt-ie8 lt-ie7" lang="en"> <![endif]-->
<!--[if IE 7]>    <html class="no-js lt-ie9 lt-ie8" lang="en"> <![endif]-->
<!--[if IE 8]>    <html class="no-js lt-ie9" lang="en"> <![endif]-->
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

    <link rel="stylesheet" href="/css/bootstrap.min.css">

    <link rel="stylesheet" href="/css/style.css">

    <!-- More ideas for your <head> here: h5bp.com/d/head-Tips -->

    <!-- All JavaScript at the bottom, except this Modernizr build.
Modernizr enables HTML5 elements & feature detects for optimal performance.
Create your own custom Modernizr build: www.modernizr.com/download/ -->
    <script src="/js/libs/modernizr-2.5.2.min.js"></script>
</head>
<body>
<!-- Prompt IE 6 users to install Chrome Frame. Remove this if you support IE 6.
chromium.org/developers/how-tos/chrome-frame-getting-started -->
<!--[if lt IE 7]><p class=chromeframe>Your browser is <em>ancient!</em> <a href="http://browsehappy.com/">Upgrade to a
    different browser</a> or <a href="http://www.google.com/chromeframe/?redirect=true">install Google Chrome Frame</a>
    to experience this site.</p><![endif]-->
<header>

</header>
<div id="main">
    <?php
    require_once dirname(__FILE__) . DIRECTORY_SEPARATOR . "map.php"; $data = Map::render();
    ?>
    <table>
        <?php for ($i = 0; $i < ceil($data[1] / 100); $i++): ?>
        <tr>
            <?php for ($j = 0; $j < ceil($data[2] / 100); $j++): ?>
            <td><?php echo (chr(65 + $i)) . ":" . ($j); ?></td>
            <?php endfor; ?>
        </tr>
        <?php endfor; ?>
    </table>

    <div class="alliance well">
        <div class="actions">
            <button class="btn btn-primary" id="zoom-out"><i class="icon-minus"></i></button>
            <button class="btn btn-primary" id="zoom-in"><i class="icon-plus"></i></button>
            <span>Zoom lvl: </span><span class="zoom-lvl">1</span>

            <form class="form-search">
                <label>Nick:</label>
                <input type="text" class="input-medium search-query">
                <button type="submit" class="btn"><i class="icon-search"></i></button>
            </form>
        </div>
        <ul class="">
            <?php foreach ($data[0] as $an => $c): ?>
            <?php echo "<li><a href='' data-name='$an'>$an ($c)</a></li>"; ?>
            <?php endforeach; ?>
        </ul>
        <div class="menuhider"></div>
    </div>

</div>
<footer>

</footer>


<!-- JavaScript at the bottom for fast page loading -->

<!-- Grab Google CDN's jQuery, with a protocol relative URL; fall back to local if offline -->
<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js"></script>
<script>window.jQuery || document.write('<script src="/js/libs/jquery-1.7.1.min.js"><\/script>')</script>


<!-- scripts concatenated and minified via build script -->
<script src="/js/plugins.js"></script>
<script src="/js/script.js"></script>
<!-- end scripts -->

<!-- Asynchronous Google Analytics snippet. Change UA-XXXXX-X to be your site's ID.
mathiasbynens.be/notes/async-analytics-snippet -->
<script>
    var _gaq = [
        ['_setAccount', 'UA-29659292-1'],
        ['_trackPageview']
    ];
    (function (d, t) {
        var g = d.createElement(t), s = d.getElementsByTagName(t)[0];
        g.src = ('https:' == location.protocol ? '//ssl' : '//www') + '.google-analytics.com/ga.js';
        s.parentNode.insertBefore(g, s)
    }(document, 'script'));
</script>
</body>
</html>