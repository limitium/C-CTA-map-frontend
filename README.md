# Command and Conquer Tiberium Alliances map
 for this project http://tiberium-alliances.com

## Install map
 Database stucture you can find in
 
``./db/structure.sql``

Also you need to create settings file in root directory

``./settings.php``

    <?php return array(
        'db_url' => 'mysql:host=localhost;dbname=tiberium_map',
        'db_username' => 'username',
        'db_password' => 'password',
        'session_secret' => 'abc123',
        'loginza_wid' => 123123,
        'loginza_key' => "abc123"
    );
    
You can get your own loginza_key and wid at http://loginza.ru or skip user authorization