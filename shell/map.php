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
                $fname = $dataPath . DIRECTORY_SEPARATOR . $f;
                $users = array_merge($users, require_once $fname);
                $update = date("d/m/Y H:i:s", filectime($fname));
            }
        }

        $minX = 1000;
        $minY = 1000;
        $maxX = 0;
        $maxY = 0;
        foreach ($users as $user) {
            if (is_array($user["c"])) {
                foreach ($user["c"] as $base) {
                    $minX = min($minX, $base['x']);
                    $minY = min($minY, $base['y']);
                    $maxX = max($maxX, $base['x']);
                    $maxY = max($maxY, $base['y']);

                }
            }
        }
        $bases = array();
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
            if (is_array($user["c"])) {
                foreach ($user["c"] as $base) {
                    $x = $base['x'] /*- $minX + 100*/
                    ;
                    $y = $base['y'] /*- $minY + 100*/
                    ;
                    //                echo '<div p="' . $base["p"] . '" n="' . strtolower($user["n"]) . '" x="' . $x . '" y="' . $y . '" rx="' . $base['x'] . '" ry="' . $base['y'] . '" class="nick" an="' . $user['an'] . '" style="top:' . $y . 'px;left:' . $x . 'px">';
                    //                echo '</div>';
                    $bases[] = array(
                        'x' => $base['x'],
                        'y' => $base['y'],
                        'n' => $user['n'],
                        'bn' => $base['n'],
                        'p' => $user['p'],
                        'an' => $user['an']
                    );
                }
            }
        }


        uasort($ans, "Map::sort");
        $bases = array('bases' => $bases,
            'updated' => $update);
        file_put_contents(dirname(__FILE__) . DIRECTORY_SEPARATOR . ".." . DIRECTORY_SEPARATOR . 'js' . DIRECTORY_SEPARATOR . 'data.js', "var data = " . json_encode($bases) . ";");
        return array($ans, $maxX, $maxY);
    }

    public static function sort($a, $b)
    {
        return ($a > $b) ? -1 : 1;
    }
}