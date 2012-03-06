<?php
class cc
{
    public static $ses = "";

    public static function getData($url, $data)
    {
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url = "http://prodgame04.alliances.commandandconquer.com/12/Presentation/Service.svc/ajaxEndpoint/" . $url);

        curl_setopt($ch, CURLOPT_TIMEOUT, 15);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        curl_setopt($ch, CURLOPT_POST, 1);


        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Host: prodgame04.alliances.commandandconquer.com",
            "User-Agent: Mozilla/5.0 (Windows NT 6.1; rv:10.0.2) Gecko/20100101 Firefox/10.0.2",
            "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language: en-us,en;q=0.5",
            "Accept-Encoding: gzip, deflate",
//    "Connection: keep-alive",
            "Content-Type: application/json; charset=UTF-8",
            "X-Qooxdoo-Response-Type: application/json",
            "Referer: http://prodgame04.alliances.commandandconquer.com/12/index.aspx",
//    "Content-Length: 75",
//    "Cookie: __utma=25228909.1939348203.1330591594.1330683886.1330684723.8; __utmz=25228909.1330684723.8.5.utmcsr=%28not%2520set%29|utmccn=cca_command-and-conquer-beta-acceptance-email-limited---ru|utmcmd=email; __utmx=25228909.00020447133450465393:1:0; __utmxx=25228909.00020447133450465393:1330591593:2592000; __utmb=25228909.5.10.1330684723; __utmc=25228909; cnc_sso=Ciyvab0tregdVsBtboIpeChe4G6uzC1v5_-SIxmvSLLCeS_9cqBKWEXxB85b7X_IFfEtIPvv28pu13uHRzI7eam5xMY0qn4DqpHfQTZ4j6KHd3WWEXts4PP1hlLi9V2V",
            "Pragma: no-cache",
            "Cache-Control: no-cache"
        ));


        $data['session'] = self::$ses;
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));


        return json_decode(curl_exec($ch));
    }
}

cc::$ses = "214b232f-079e-4d8d-b17a-f0633166fff3";

$last = cc::getData('RankingGetCount', array(
    "view" => 0,
    "rankingType" => 0)) - 1;



$step = 1000;
$cur = 8000;
print_r("Total: $last\r\n");
while ($cur < $last) {
    $next = $cur + $step;
    if ($next > $last) {
        $next = $last;
    }
    $users = array();
    print_r("Get from $cur to $next \r\n");
    $p = cc::getData('RankingGetData', array(
            "view" => 0,
            "rankingType" => 0,
            "ascending" => true,
            "firstIndex" => $cur,
            "lastIndex" => $next,
            "sortColumn" => 0)
    );
    foreach ($p->p as $user) {
        $user = (array)$user;
        $addData = (array)cc::getData('GetPublicPlayerInfo', array("id" => $user['p']));
        foreach ($addData["c"] as $i => $base) {
            $addData["c"][$i] = (array)$base;
        }
        $users[] = array_merge($user, $addData);
    }

    $cur = $next;
    file_put_contents("c:\\cc".$cur, "<?php return " . var_export($users, true) . ";");
}


