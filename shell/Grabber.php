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
        $step = 100;
        $cur = 0;
        print_r("Total: $last\r\n");
        while ($cur < $last) {
            $next = $cur + $step;
            if ($next > $last) {
                $next = $last;
            }
            ;

            print_r("Get from $cur to $next \r\n");
            $p = (array)$this->api->getPlayers($cur, $next);
            if (!$p['p']) {
                print_r($p);
            }
            foreach ($p['p'] as $user) {
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
        $players = array();
        foreach ($this->users as $user) {
            if ($user['an'] == "") {
                $user['an'] = "No Alliance";
            }

            if (!isset($alliances[$user['a']])) {
                $alliances[$user['a']] = array(
                    'a' => $user['a'],
                    'an' => $user['an'], //Alliance Name
                    'c' => 1
                );
            }

            $alliances[$user['a']]['c']++;

            $players[$user['i']] = array(
                'bd' => $user['bd'], //Enemy bases destoed total?
                'bde' => $user['bde'], //Forgoteen base destoed?
                'd' => $user['d'], //Bases Destroyed
                'bc' => $user['bc'], //Base Count
                'r' => $user['r'], //Rank
                'p' => $user['p'], //Points
                'i' => $user['i'], //Player ID
                'a' => $user['a'], //Alliance ID
                'n' => $user['n'], //Player Name
                'dccc' => $user['dccc'], //Distance from center
            );

            if (is_array($user["c"])) {
                foreach ($user["c"] as $base) {
                    $bases[] = array(
                        'pi' => $user['i'], //Player ID

                        'y' => $base['y'], //y
                        'x' => $base['x'], //x
                        'n' => $base['n'], //Name
                        'i' => $base['i'], //Base ID
                        'p' => $base['p'], //Points
                    );
                }
            }
        }


        uasort($alliances, "Grabber::sort");

        $data = array('bases' => $bases,
            'players' => $players,
            'alliances' => array_values($alliances),
            'updated' => date("d/m/Y H:i:s"),
            'timestamp' => time(),
        );

        $path = dirname(__FILE__) . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "js" . DIRECTORY_SEPARATOR . "cncdata" . DIRECTORY_SEPARATOR;
        $dataFile = $path . "data_" . $this->api->getServer() . ".json";
        @rename($dataFile, $path . ".." . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "data" . DIRECTORY_SEPARATOR . "data_" . $this->api->getServer() . "_" . date("Y-m-d_H-i-s") . ".json");
        file_put_contents($dataFile, json_encode($data));
    }

    public static function sort($a, $b)
    {
        return ($a['an'] > $b['an']) ? 1 : -1;
    }

    public function load()
    {
        $this->users = require_once dirname(__FILE__) . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "data" . DIRECTORY_SEPARATOR . "0";
    }
}
