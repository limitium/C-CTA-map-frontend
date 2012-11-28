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
    <link rel="stylesheet" href="/css/wColorPicker.1.2.css">
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
    <div class="color-picker"></div>
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
        <?php endif; ?>
        <button class="btn btn-success hide" id="clear" href="#">Clear</button>
        <button class="btn btn-success hide" id="remove-last" href="#">Remove last</button>
        <input class="hide" id="draw-color" type="hidden" value="#FF0000">
        <input class="hide" id="draw-width" type="number" value="1">
        <button class="btn btn-success hide" id="save" href="#">Save</button>
        <button class="btn btn-success hide" id="load" href="#">Load</button>
        <button class="btn btn-info" id="share" href="#">Share</button>
        <button class="btn btn-danger" style="margin-left: 20px" id="vote" href="#">Important poll!</button>
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
                        <option value="<?php echo $marker->hash; ?>"><?php echo $servers[$marker->world]; ?>:<?php echo $marker->hash; ?> <?php echo $marker->name; ?></option>
                        <?php endforeach; ?>
                    </select>
                </div>
            </div>
        </div>
    </div>
    <div class="modal-footer">
        <button href="#" class="btn btn-primary" id="pull-drawing">Load</button>
        <button href="#" class="btn" data-dismiss="modal" aria-hidden="true">Close</button>
    </div>
</div>

<div class="modal hide fade" id="modal-poll">
    <div class="modal-header">
        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
        <h3>The future development of the C&C map.</h3>
    </div>
    <div class="modal-body">
        <p>As I said <a href="http://forum.alliances.commandandconquer.com/showthread.php?tid=13431&pid=93842#pid93842">before</a> I have a lot of features need to be implemented, but I haven't enough time to do them.</p>
        <p> This project interesting for me and it's usefull because it have 8000 pageviews per day. I can reduce time on primary job to spend more time on this project finally add pyrmainds, impact zones, managmet for drawings, email notification when base altered, reduce load and render time.</p>
            <p>Now I spend all time to improve worlds parser to get most recent data and now it's "almost" realtime. Currently profit from adsense barely enough to pay for servers and traffic.</p>
                <p>I see several options:</p>
        <ul>
            <li>a) nothing changes and developments of new features will be somwhere sometime or never.</li>
            <li>b) someone joins to developing.</li>
            <li>c) service beocme paid with symbolic fee 1-2$ or how many who wants to per month.</li>
        </ul>
                    <p>You can leave any comments <a href="http://c-c-map.idea.informer.com/proj/?ia=60378">here</a>. Don't forget to make your vote.</p>
        <script type="text/javascript">
            var cookie_booroo=52124, surveyid=52124, random_booroo=0, enddate_booroo=0, maxchecked_booroo=2, jsonurl_booroo='http://kwiksurveys.com/app/vote.asp', customurl_booroo='',jsonThemeString={"poll":{"bg_hide":1,"bg_opacity":100,"bg_color_start":"ededed","bg_color_end":"ededed","border_color":"ffffff","border_style":"solid","border_size_t":0,"border_size_r":0,"border_size_b":0,"border_size_l":0,"border_size_grouper":1,"border_radius_grouper":1,"border_radius_t":4,"border_radius_r":4,"border_radius_b":4,"border_radius_l":4,"border_size":0,"border_radius":0,"border_pref":0,"shadow_x":0,"shadow_y":0,"shadow_size":"0","shadow_blur":0,"shadow_color":"000000","shadow_style":"","padding_grouper":1,"padding_t":10,"padding_r":10,"padding_b":10,"padding_l":10,"margin_grouper":0,"margin_t":0,"margin_r":0,"margin_b":50,"margin_l":0},"pollpreview":{"bg_hide":0,"bg_opacity":0,"bg_color_start":"666666","bg_color_end":"666666","border_color":"20fc15","border_style":"solid","border_size_t":0,"border_size_r":1,"border_size_b":1,"border_size_l":1,"border_size_grouper":0,"border_radius_grouper":0,"border_radius_t":0,"border_radius_r":0,"border_radius_b":0,"border_radius_l":0,"border_size":0,"border_radius":0,"border_pref":1,"padding_grouper":1,"padding_t":10,"padding_r":10,"padding_b":10,"padding_l":10},"pquestion":{"bg_hide":0,"bg_opacity":0,"bg_color_start":"666666","bg_color_end":"666666","border_style":"solid","border_size_t":1,"border_size_r":1,"border_size_b":0,"border_size_l":1,"border_size_grouper":0,"border_radius_grouper":0,"border_radius_t":0,"border_radius_r":0,"border_radius_b":0,"border_radius_l":0,"border_size":1,"border_radius":0,"border_pref":0,"border_color":"20fc15","font_family":"Arial,Helvetica,sans-serif","font_size":15,"font_color":"20fc15","font_bold":"bold","font_italic":"normal","text_shadow":0,"text_shadow_h":1,"text_shadow_v":1,"text_shadow_blur":0,"text_shadow_color":"20fc15","padding_grouper":1,"padding_t":10,"padding_r":10,"padding_b":10,"padding_l":10,"margin_grouper":0,"margin_t":0,"margin_r":0,"margin_b":0,"margin_l":0,"font_underline":"none"},"alabel":{"font_family":"Arial,Helvetica,sans-serif","font_size":12,"font_color":"20fc15","font_bold":"bold","font_italic":"normal","text_shadow":0,"text_shadow_h":0,"text_shadow_v":0,"text_shadow_blur":4,"text_shadow_color":"444444","padding_grouper":0,"padding_t":7,"padding_r":0,"padding_b":7,"padding_l":0,"margin_grouper":0,"margin_t":0,"margin_r":0,"margin_b":0,"margin_l":0,"font_underline":"none","answer_seperator":1},"bartext":{"font_family":"Arial,Helvetica,sans-serif","font_size":15,"font_color":"20fc15","font_bold":"bold","font_italic":"normal","text_shadow":0,"text_shadow_h":0,"text_shadow_v":0,"text_shadow_blur":2,"text_shadow_color":"444444","padding_grouper":0,"padding_t":0,"padding_r":0,"padding_b":0,"padding_l":0,"margin_grouper":0,"margin_t":0,"margin_r":0,"margin_b":0,"margin_l":0,"font_underline":"none"},"qviewa":{"font_family":"Arial,Helvetica,sans-serif","font_size":11,"font_color":"20fc15","font_bold":"bold","font_italic":"normal","font_color_hover":"444444","font_underline":"underline","text_shadow":0,"text_shadow_h":1,"text_shadow_v":1,"text_shadow_blur":1,"text_shadow_color":"444444","padding_grouper":1,"padding_t":0,"padding_r":0,"padding_b":0,"padding_l":0,"margin_grouper":1,"margin_t":0,"margin_r":0,"margin_b":0,"margin_l":0},"qbutton":{"font_family":"Verdana,Arial,Helvetica,sans-serif","font_size":12,"font_bold":"bold","font_italic":"normal","font_color":"000000","text_shadow":0,"text_shadow_h":1,"text_shadow_v":1,"text_shadow_blur":0,"text_shadow_color":"636263","bg_hide":0,"bg_opacity":0,"bg_color_start":"62c462","bg_color_end":"51a351","border_color":"5bb75b","border_style":"solid","border_size_t":1,"border_size_r":1,"border_size_b":1,"border_size_l":1,"border_size_grouper":0,"border_radius_grouper":0,"border_radius_t":0,"border_radius_r":0,"border_radius_b":0,"border_radius_l":0,"border_size":1,"border_radius":4,"border_pref":0,"padding_grouper":0,"padding_t":5,"padding_r":9,"padding_b":5,"padding_l":9,"margin_grouper":0,"margin_t":6,"margin_r":0,"margin_b":0,"margin_l":0,"font_underline":"none"},"bar":{"bg_hide":0,"bg_opacity":0,"bg_color_start":"57ac3d","bg_color_end":"57ac3d","border_color":"46912d","border_style":"solid","border_size_t":1,"border_size_r":1,"border_size_b":1,"border_size_l":1,"border_size_grouper":0,"border_radius_grouper":0,"border_radius_t":0,"border_radius_r":0,"border_radius_b":0,"border_radius_l":0,"border_size":1,"border_radius":0,"border_pref":0,"padding_grouper":1,"padding_t":6,"padding_r":6,"padding_b":6,"padding_l":6,"margin_grouper":1,"margin_t":4,"margin_r":4,"margin_b":4,"margin_l":4},"barperc":{"font_family":"Arial,Helvetica,sans-serif","font_size":10,"font_color":"20fc15","text_shadow":0,"text_shadow_h":1,"text_shadow_v":1,"text_shadow_blur":3,"text_shadow_color":"ffffff","font_underline":"none"},"defaultpage":{"bg_color_start":"ffffff","bg_color_end":"ffffff","background_image_url":"","background_image_style":"Stretched","background_image_width":"1200","background_image_height":"904","poll_position":"2","bg_width":310},"default_options":{"help":0}}; </script>
        <link  href="http://kwiksurveys.com/app_content/theme_poll/2/custom_themes/inc/cleanslate.css" rel="stylesheet" type="text/css" /><!--[if lt IE 7]><link rel="stylesheet" type="text/css" media="screen" href="http://kwiksurveys.com/app_content/theme_poll/2/custom_themes/css/ie.css" /><![endif]--><div id="booroo_poll_container52124"><div class="poll_booroo52124 "><!-- change poll width here --><div class="pquestion_booroo52124">What do you prefer?</div><div class="pollpreview_booroo52124 cleanslate"><div class="content_booroo"><div class="options_booroo"><form class="form_booroo"><fieldset><div class="padded_booroo"><input name="qid" value="52124" type="hidden"><input name="sid" value="ctcv4e515ufqvp052124" type="hidden"><input name="pqid" value="6904" type="hidden"><div class="items_booroo"><div class="row_booroo"><label for="ans-25717"  ><input type="radio" name="ans" value="25717" id="ans-25717" class="checkbox_booroo" />Make service paid 1-2$ per month.</label></div><div class="row_booroo"><label for="ans-25718"  ><input type="radio" name="ans" value="25718" id="ans-25718" class="checkbox_booroo" />Don't make any changes</label></div><div class="row_booroo"><label for="ans-25719"  ><input type="radio" name="ans" value="25719" id="ans-25719" class="checkbox_booroo" />I can help with programming </label></div></div><div><input type="text" name="ans-other" value="Other: (Please specify)" id="ans-radio-other" class="text_booroo" /></div><div id="submit_booroo" class="submit_booroo"><input class="qbutton_booroo52124" type="button" value="Vote Now" /><a class="qviewa_booroo52124">View results</a></div><div class="booroo_footer"><a rel="nofollow" class='footer_hyperlink' href="https://kwiksurveys.com"><p>Powered by kwiksurveys.com</p></a></div></div></fieldset></form></div><div class="results_booroo" style="display:none !important"><div class="padded_booroo"><div class="row_booroo"><strong>Make service paid 1-2$ per month.</strong><img src="http://kwiksurveys.com/app_content/theme_poll/2/custom_themes/images/graph.gif" id="res-25717" class="result_booroo" style="width:0%;" /><span>0%</span></div> <div class="row_booroo"><strong>Don't make any changes</strong><img src="http://kwiksurveys.com/app_content/theme_poll/2/custom_themes/images/graph.gif" id="res-25718" class="result_booroo" style="width:0%;" /><span>0%</span></div> <div class="row_booroo"><strong>I can help with programming </strong><img src="http://kwiksurveys.com/app_content/theme_poll/2/custom_themes/images/graph.gif" id="res-25719" class="result_booroo" style="width:0%;" /><span>0%</span></div> <div class="row_booroo"><strong>Other: (Please specify)</strong><img src="http://kwiksurveys.com/app_content/theme_poll/2/custom_themes/images/graph.gif" id="res-999999" class="result_booroo" style="width:0%;"><span>0%</span></div> </div><div class="booroo_footer"><a rel="nofollow" class='footer_hyperlink' href="https://kwiksurveys.com/"><p>Create a poll like this</p></a></div></div></div></div></div></div><!--Requires jquery 1.6.1 --><script src="http://ajax.googleapis.com/ajax/libs/jquery/1.6.1/jquery.min.js" type="text/javascript"></script><script src="http://kwiksurveys.com/app/polltheme/2/poll-min.js" type="text/javascript"></script>
    </div>
    <div class="modal-footer">
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