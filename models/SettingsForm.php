<?php
class Validator
{
    public static function color($val)
    {
        return preg_match("/^#[0-9A-F]{6}$/", $val);
    }

    public static function size($val)
    {
        return is_numeric($val) && $val > 0;
    }

    public static function check($val)
    {
        return true;
    }

    public static function name($val)
    {
        return !$val || is_string($val);
    }

    public static function email($val)
    {
        return !$val || preg_match("/^([a-z0-9_\.-]+)@([a-z0-9_\.-]+)\.([a-z\.]{2,6})$/", $val);
    }
}

class SettingsForm
{
    public $fields = array(
        'color-background' => array(
            'label' => 'Background',
            'val' => '#161616',
            'type' => 'color',
        ),
        'color-grid' => array(
            'label' => 'Grid line',
            'val' => '#DCDCDC',
            'type' => 'color',
        ),
        'color-grid-label' => array(
            'label' => 'Grid label',
            'val' => '#113511',
            'type' => 'color',
        ),
        'color-base' => array(
            'label' => 'Base',
            'val' => '#56DC6D',
            'type' => 'color',
        ),
        'color-selected-base' => array(
            'label' => 'Selected base',
            'val' => '#FFC170',
            'type' => 'color',
        ),
        'color-selected' => array(
            'label' => 'Selected alliance',
            'val' => '#FFFFFF',
            'type' => 'color',
        ),
        'color-self' => array(
            'label' => 'Own bases',
            'val' => '#FF0000',
            'type' => 'color',
        ),
        'color-protected' => array(
            'label' => 'Under protection',
            'val' => '#0066FF',
            'type' => 'color',
        ),
        'color-altered' => array(
            'label' => 'Is altered',
            'val' => '#FF0000',
            'type' => 'color',
        ),
        'color-aircraft' => array(
            'label' => 'Aircraft',
            'val' => '#FF5757',
            'type' => 'color',
        ),
        'color-crystal' => array(
            'label' => 'Crystal',
            'val' => '#8A54FF',
            'type' => 'color',
        ),
        'color-reactor' => array(
            'label' => 'Reactor',
            'val' => '#78F2FF',
            'type' => 'color',
        ),
        'color-tiberium' => array(
            'label' => 'Tiberium',
            'val' => '#00FF37',
            'type' => 'color',
        ),
        'color-resonator' => array(
            'label' => 'Resonator',
            'val' => '#FF73B0',
            'type' => 'color',
        ),
        'color-tungsten' => array(
            'label' => 'Tungsten',
            'val' => '#E6FF00',
            'type' => 'color',
        ),
        'color-uranium' => array(
            'label' => 'Uranium',
            'val' => '#FFB13D',
            'type' => 'color',
        ),
        'filter-unselected-hide' => array(
            'label' => 'Hide unselected base',
            'val' => 0,
            'type' => 'check',
        ),
        'filter-poi-hide' => array(
            'label' => 'Hide POIs',
            'val' => 0,
            'type' => 'check',
        ),
        'filter-noalliance-hide' => array(
            'label' => 'Hide "No Alliance"',
            'val' => 0,
            'type' => 'check',
        ),
        'filter-alliance-min-level' => array(
            'label' => 'Hide alliances players',
            'val' => 2,
            'type' => 'size',
        ),
        'filter-base-min-level' => array(
            'label' => 'Hide bases level',
            'val' => 1,
            'type' => 'size',
        ),
        'filter-poi-min-level' => array(
            'label' => 'Hide POIs level',
            'val' => 1,
            'type' => 'size',
        ),
        'size-base' => array(
            'label' => 'Base',
            'val' => 1,
            'type' => 'size',
        ),
        'size-poi' => array(
            'label' => 'POI',
            'val' => 1.5,
            'type' => 'size',
        ),
        'notice-email' => array(
            'label' => 'Email',
            'val' => '',
            'type' => 'email',
        ),
        'notice-name' => array(
            'label' => 'Player name',
            'val' => '',
            'type' => 'name',
        ),
        'notice-altered' => array(
            'label' => 'Base is altered',
            'val' => 1,
            'type' => 'check',
        ),
        'notice-ruined' => array(
            'label' => 'Base is ruined',
            'val' => 1,
            'type' => 'check',
        ),
    );

    public function fillFrom($data)
    {
        foreach ($this->fields as $fieldName => $fData) {
            if (isset($data[$fieldName])) {
                $this->fields[$fieldName]['val'] = $data[$fieldName];
            }
        }

    }

    public function isValid()
    {
        $valid = true;
        foreach ($this->fields as $fieldName => $fData) {
            if (!Validator::$fData['type']($fData['val'])) {
                $valid = false;
                $this->fields[$fieldName]['invalid'] = true;
            }
        }
        return $valid;
    }

    public function getValues()
    {
        $values = array();
        foreach ($this->fields as $fieldName => $fData) {
            $values[$fieldName] = $fData['type'] == "check" ? (bool)$fData['val'] : $fData['val'];
        }
        return $values;
    }
}