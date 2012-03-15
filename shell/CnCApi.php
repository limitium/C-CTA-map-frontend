<?php
class CnCApi
{

    private $session = "";
    private $server;

    public function __construct($server)
    {
        $this->server = $server;
    }

    public function getData($method, $data)
    {
        $ch = curl_init();

        $host = "prodgame0" . $this->server . ".alliances.commandandconquer.com";
        $url = "http://$host/" . (8 + $this->server);

        curl_setopt($ch, CURLOPT_URL, $url. "/Presentation/Service.svc/ajaxEndpoint/" . $method);

        curl_setopt($ch, CURLOPT_TIMEOUT, 15);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        curl_setopt($ch, CURLOPT_POST, 1);


        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Host: $host",
            "User-Agent: Mozilla/5.0 (Windows NT 6.1; rv:10.0.2) Gecko/20100101 Firefox/10.0.2",
            "Accept: text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language: en-us,en;q=0.5",
            "Accept-Encoding: gzip, deflate",
//    "Connection: keep-alive",
            "Content-Type: application/json; charset=UTF-8",
            "X-Qooxdoo-Response-Type: application/json",
            "Referer: $url/index.aspx",
//    "Content-Length: 75",
//    "Cookie: __utma=25228909.1939348203.1330591594.1330683886.1330684723.8; __utmz=25228909.1330684723.8.5.utmcsr=%28not%2520set%29|utmccn=cca_command-and-conquer-beta-acceptance-email-limited---ru|utmcmd=email; __utmx=25228909.00020447133450465393:1:0; __utmxx=25228909.00020447133450465393:1330591593:2592000; __utmb=25228909.5.10.1330684723; __utmc=25228909; cnc_sso=Ciyvab0tregdVsBtboIpeChe4G6uzC1v5_-SIxmvSLLCeS_9cqBKWEXxB85b7X_IFfEtIPvv28pu13uHRzI7eam5xMY0qn4DqpHfQTZ4j6KHd3WWEXts4PP1hlLi9V2V",
            "Pragma: no-cache",
            "Cache-Control: no-cache"
        ));


        $data['session'] = $this->session;
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        return json_decode(curl_exec($ch));
    }

    public function setSession($ses)
    {
        $this->session = $ses;
    }

    public function isValidSession()
    {
        return $this->getPlayerCount() > 0;
    }

    public function getPlayerCount()
    {
        return $this->getData('RankingGetCount', array(
            "view" => 0,
            "rankingType" => 0)) - 1;
    }

    public function getPlayers($from, $to)
    {
        return $this->getData('RankingGetData', array(
                "view" => 0,
                "rankingType" => 0,
                "ascending" => true,
                "firstIndex" => $from,
                "lastIndex" => $to,
                "sortColumn" => 0)
        );
    }

    public function getUserInfo($id)
    {
        return $this->getData('GetPublicPlayerInfo', array("id" => $id));
    }

    public function setServer($server)
    {
        $this->server = $server;
    }

    public function getServer()
    {
        return $this->server;
    }

    public function authorize($login, $password)
    {

        $this->setSession($this->requestSession($login, $password));
    }

    private function requestSession($login, $password)
    {
        throw new Exception("Not implemented");
    }

}
