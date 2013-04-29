<?php

require 'Slim/Slim.php';

require 'models/Idiorm.php';
require 'models/Paris.php';

require 'models/Models.php';

require 'models/SettingsForm.php';
$settings = require __DIR__ . DIRECTORY_SEPARATOR . "settings.php";

ORM::configure($settings["db_url"]);
ORM::configure('username', $settings["db_username"]);
ORM::configure('password', $settings["db_password"]);
ORM::configure('driver_options', array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));

$app = new Slim($settings);

$app->add(new Slim_Middleware_SessionCookie(), array(
    'expires' => time() + 355 * 24 * 60 * 60,
    'path' => '/',
    'domain' => null,
    'secure' => false,
    'httponly' => true,
    'name' => 'cncmap',
    'secret_key' => $settings["session_secret"]
));

$checkAuthorization = function () use ($app) {
    $uid = $app->getEncryptedCookie('c');
    if (!$uid || ($user = Model::factory('User')->where('id', $uid)->find_one()) == null) {
        $app->redirect('/auth');
    }
    $app->user = $user;
    return true;
};


$app->get('/', function () use ($app) {
    $servers = require __DIR__ . DIRECTORY_SEPARATOR . "models" . DIRECTORY_SEPARATOR . "servers.php";
    $app->render("index.php", array("servers" => $servers));
});

$app->get('/map/:id', function ($id) use ($app) {
    $serversData = require __DIR__ . DIRECTORY_SEPARATOR . "models" . DIRECTORY_SEPARATOR . "servers.php";
    $servers = array();
    foreach ($serversData as $serverData) {
        $servers[$serverData['id']] = $serverData['name'];
    }

    if (!is_numeric($id)) {
        $app->redirect("/");
    }
    if (!isset($servers[$id])) {
        $app->redirect("/");
    }


    $server = array("id" => $id, "name" => $servers[$id]);

    $settingsForm = new SettingsForm();

    $uid = $app->getEncryptedCookie('c');
    $role = "guest";
    $markers = array();
    if ($uid && ($user = Model::factory('User')->where('id', $uid)->find_one())) {
        $role = "user";
        $settingsForm->fillFrom($user->settings()->find_one()->as_array());
        $markers = $user->markers()->find_many();
    }
    $app->render("map.php", array("server" => $server, "servers" => $servers, "role" => $role, "settings" => json_encode($settingsForm->getValues()), "markers" => $markers));
});

$app->get('/auth', function () use ($app) {
    $app->render("auth.php", array("back" => $app->getCookie("back")));
});

$app->post('/check', function () use ($app) {
    $token = $app->request()->post("token");
    $wid = $app->config("loginza_wid");
    $skey = $app->config("loginza_key");
    $testUrl = "http://loginza.ru/api/authinfo?token=$token&id=$wid&sig=" . md5($token . $skey);

    $ch = curl_init();

    curl_setopt($ch, CURLOPT_AUTOREFERER, TRUE);
    curl_setopt($ch, CURLOPT_HEADER, 0);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $testUrl);

    $data = curl_exec($ch);
    curl_close($ch);

    $data = json_decode($data);
    if (isset($data->error_message)) {
        $app->flash("error", "<strong>Nah.</strong> " . $data->error_message);
        $app->redirect("/auth");
    }

    $user = Model::factory("User")->where('identity', $data->identity)->find_one();
    $redirect = "/";

    if (!$user) {
        $data = (array)$data;
        $userData = array();
        foreach (array('identity', 'provider', 'uid', 'nickname', 'email') as $field) {
            if (isset($data[$field]) && (is_string($data[$field]) || is_numeric($data[$field]))) {
                $userData[$field] = $data[$field];
            }
        }

        $user = Model::factory("User")->create($userData);

        $user->save();

        $settingsForm = new SettingsForm();
        $settings = Model::factory("Settings")->create($settingsForm->getValues());
        $settings->user_id = $user->id;
        $settings->save();

        $app->flash("info", "<strong>Yeah!</strong> Congratulations, Commander now you're with us!");
        $redirect = "/settings";
    }

    $user->authorize($app);
    $app->redirect($redirect);
});

$app->get('/settings', $checkAuthorization, function () use ($app) {
    $settingsForm = new SettingsForm();
    $settingsForm->fillFrom($app->user->settings()->find_one()->as_array());

    $app->render("settings.php", array("back" => $app->getCookie("back"), "settings" => $settingsForm));
});

$app->post('/settings', $checkAuthorization, function () use ($app) {

    $settingsForm = new SettingsForm();
    $settingsForm->fillFrom($app->request()->post());
    if ($settingsForm->isValid()) {
        $settings = $app->user->settings()->find_one();
        foreach ($settingsForm->getValues() as $fieldName => $val) {
            $settings->$fieldName = $val;
        }
        $settings->save();

        $app->flash("success", "<strong>Well done bro.</strong> Saved!");
        $app->redirect("/settings");
    }
    $app->flashNow("error", "<strong>Oh shi.</strong> Can't save! Please fix error fields!!!");
    $app->render("settings.php", array("back" => $app->getCookie("back"), "settings" => $settingsForm));
});

$app->get('/reset', $checkAuthorization, function () use ($app) {
    //@todo: merge with /post settings
    $settingsForm = new SettingsForm();
    $settings = $app->user->settings()->find_one();
    foreach ($settingsForm->getValues() as $fieldName => $val) {
        $settings->$fieldName = $val;
    }
    $settings->save();
    $app->flash("info", "<strong>Eeehhh.</strong> Restored default settings!");
    $app->redirect("/settings");
});

$app->get('/logout', function () use ($app) {
    $app->deleteCookie('c');
    $app->redirect('/auth');
});

$app->post('/saver', function () use ($app) {
    $data = $app->request()->post();
    $app->setCookie("back", $data["pathname"] . $data["hash"]);
    $app->redirect($data["url"]);

});
$app->post("/path/save", $checkAuthorization, function () use ($app) {
    $data = $app->request()->post();

    $marker = Model::factory('Marker')->create();
    $marker->name = filter_var($data["name"], FILTER_SANITIZE_STRING);
    $marker->world = filter_var($data["world"], FILTER_SANITIZE_NUMBER_INT);
    $marker->hash = substr(sha1(mt_rand() . microtime()), mt_rand(0, 34), 6);
    $marker->paths = json_encode($data["paths"]);
    $marker->save();

    $marker->addToUser($app->user->id);

    $app->response()->body($marker->hash);
});
$app->get("/path/load/:hash", function ($hash) use ($app) {
    $hash = strtolower($hash);
    if (!preg_match("/^[0-9a-z]{6}$/", $hash)) {
        return;
    }

    $marker = Model::factory('Marker')->where("hash", $hash)->find_one();
    if (!$marker) {
        return;
    }

    if (isset($app->user)) {
        $markerUser = Model::factory('MarkerUser')
            ->where("user_id", $app->user->id)
            ->where("marker_id", $marker->id)
            ->find_one();
        if (!$markerUser) {
            $marker->addToUser($app->user->id);
        }
    }

    $marker->paths = json_decode($marker->paths);

    $app->response()->body(json_encode($marker->as_array()));
});
$app->post("/path/delete/:hash", $checkAuthorization, function ($hash) use ($app) {
    $hash = strtolower($hash);
    if (!preg_match("/^[0-9a-z]{6}$/", $hash)) {
        return;
    }

    $marker = Model::factory('Marker')->where("hash", $hash)->find_one();
    if (!$marker) {
        return;
    }

    ORM::for_table('marker_user')
        ->where("user_id", $app->user->id)
        ->where("marker_id", $marker->id)
        ->delete_many();

    $app->response()->body(1);
});

$app->run();
