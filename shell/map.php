<?php
/**
 * Created by JetBrains PhpStorm.
 * User: Svobodnaya
 * Date: 02.03.12
 * Time: 15:45
 * To change this template use File | Settings | File Templates.
 */
class Map
{
    public static function render()
    {
        $ans = array();
        $dataPath = dirname(__FILE__) . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . "data";
        $users = array();
        foreach (scandir($dataPath) as $f) {
            if (!in_array($f, array('.', ".."))) {
                $users = array_merge($users, require_once $dataPath . DIRECTORY_SEPARATOR . $f);

            }

        }

        $minX = 1000;
        $minY = 1000;
        foreach ($users as $user) {
            foreach ($user["c"] as $base) {
                $minX = min($minX, $base['x']);
                $minY = min($minY, $base['y']);

            }
        }
        foreach ($users as $user) {
//            if ($user['r'] < 3500) {
//                continue;
//            }
            $user['an'] = preg_replace('/\s+/', '', $user['an']);

            if ($user['an'] == "") {
                $user['an'] = "noAlliance";
            }
            if (!isset($ans[$user['an']])) {
                $ans[$user['an']] = 1;
            }
            $ans[$user['an']]++;
            foreach ($user["c"] as $base) {
                $x = $base['x'] - $minX+ 100 ;
                $y = $base['y'] - $minY+ 100;
                echo '<div p="' . $base["p"] . '" n="' . strtolower($user["n"]) . '" x="' . $x . '" y="' . $y . '" class="nick" an="' . $user['an'] . '" style="top:' . $y . 'px;left:' . $x . 'px">';
                echo '</div>';
            }
        }


        uasort($ans, "Map::sort");
        return $ans;
    }

    public static function sort($a, $b)
    {
        return ($a > $b) ? -1 : 1;
    }
}