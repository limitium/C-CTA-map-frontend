<?php
class User extends Model
{
    public function settings()
    {
        return $this->has_one("Settings");
    }

    public function authorize(Slim $app)
    {
        $app->setEncryptedCookie("c", $this->id, time() + 355 * 24 * 60 * 60, null, null, null, true);
    }

    public function markers()
    {
        return $this->has_many_through('Marker');
    }
}

class Settings extends Model
{
    public function user()
    {
        return $this->belongs_to("User");
    }
}

class Marker extends Model
{
    public function users()
    {
        return $this->has_many_through('User');
    }

    public function addToUser($userId)
    {
        $relation = Model::factory('MarkerUser')->create();
        $relation->marker_id = $this->id;
        $relation->user_id = $userId;
        $relation->save();
    }
}

class MarkerUser extends Model
{
    public static $_table = 'marker_user';
}