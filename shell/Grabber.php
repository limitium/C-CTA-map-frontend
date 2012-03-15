<?php
require_once dirname(__FILE__) . DIRECTORY_SEPARATOR . "CnCApi.php";

class Grabber
{
    private $api;
    private $users = array();

    public function __construct(CnCApi $api)
    {

        $this->api = $api;
    }

    public function parse()
    {

        $last = $this->api->getPlayerCount();

        $step = 1000;
        $cur = 0;
        print_r("Total: $last\r\n");
        while ($cur < $last) {
            $next = $cur + $step;
            if ($next > $last) {
                $next = $last;
            }
            ;

            print_r("Get from $cur to $next \r\n");
            $p = $this->api->getPlayers($cur, $next);
            foreach ($p->p as $user) {
                $user = (array)$user;

                $addData = (array)$this->api->getUserInfo($user['p']);
                if (is_array($addData["c"])) {
                    foreach ($addData["c"] as $i => $base) {
                        $addData["c"][$i] = (array)$base;
                    }
                    $this->users[] = array_merge($user, $addData);
                }
            }
            $cur = $next;
        }
        return $this;
    }

    public function writeData()
    {


        $alliances = array();

        $bases = array();
        foreach ($this->users as $user) {
            if ($user['an'] == "") {
                $user['an'] = "No Alliance";
            }

            if (!isset($alliances[$user['a']])) {
                $alliances[$user['a']] = array(
                    'a' => $user['a'],
                    'an' => $user['an'],
                    'c' => 1
                );
            }

            $alliances[$user['a']]['c']++;

            if (is_array($user["c"])) {
                foreach ($user["c"] as $base) {

                    $bases[] = array(
                        'x' => $base['x'],
                        'y' => $base['y'],
                        'n' => $user['n'],
                        'bn' => $base['n'],
                        'p' => $user['p'],
                        'a' => $user['a']
                    );
                }
            }
        }


        uasort($alliances, "Grabber::sort");

        $bases = array('bases' => $bases,
            'updated' => date("d/m/Y H:i:s"),
            'alliances' => $alliances
        );

        $path = dirname(__FILE__) . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "js" . DIRECTORY_SEPARATOR;
        $dataFile = $path . "data_" . $this->api->getServer() . ".js";
        @rename($dataFile, $path . ".." . DIRECTORY_SEPARATOR . "data".DIRECTORY_SEPARATOR."data_" . $this->api->getServer() . "_" . date("Y-m-d_H-i-s") . ".js");
        file_put_contents($dataFile, "var data = " . json_encode($bases) . ";");

    }

    public static function sort($a, $b)
    {
        return ($a["c"] > $b["c"]) ? -1 : 1;
    }

    public function load()
    {
        $this->users = require_once dirname(__FILE__) . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "data" . DIRECTORY_SEPARATOR . "0";
    }
}
