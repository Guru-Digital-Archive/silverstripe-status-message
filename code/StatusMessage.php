<?php

/**
 * @method static StatusMessage create($content, $type, $title, $timeOut, $extendedTimeOut)
 */
class StatusMessage extends ViewableData
{
    //  implements JsonSerializable {

    protected $Title           = "";
    protected $Type            = "";
    protected $Content         = "";
    protected $TimeOut         = "";
    protected $ExtendedTimeOut = "";
    protected $extraClasses    = array();

    /**
     * @var array Any custom form attributes set through {@link setAttributes()}.
     * Some attributes are calculated on the fly, so please use {@link getAttributes()} to access them.
     */
    protected $attributes = array();

    public static function info($content, $title = null, $timeOut = null, $extendedTimeOut = null)
    {
        return parent::create($content, StatusMessageTypes::INFO, $title, $timeOut, $extendedTimeOut);
    }

    public static function warning($content, $title = null, $timeOut = null, $extendedTimeOut = null)
    {
        return parent::create($content, StatusMessageTypes::WARNING, $title, $timeOut, $extendedTimeOut);
    }

    public static function success($content, $title = null, $timeOut = null, $extendedTimeOut = null)
    {
        return parent::create($content, StatusMessageTypes::SUCCESS, $title, $timeOut, $extendedTimeOut);
    }

    public static function danger($content, $title = null, $timeOut = null, $extendedTimeOut = null)
    {
        return parent::create($content, StatusMessageTypes::DANGER, $title, $timeOut, $extendedTimeOut);
    }

    public static function loading($content, $title = null, $timeOut = null, $extendedTimeOut = null)
    {
        return parent::create($content, StatusMessageTypes::LOADING, $title, $timeOut, $extendedTimeOut);
    }

    public function __construct($content, $type = null, $title = null, $timeOut = null, $extendedTimeOut = null)
    {
        parent::__construct();
        $this->Title = $title;
        if (is_bool($type) || is_numeric($type)) {
            $this->Type = $type ? StatusMessageTypes::SUCCESS : StatusMessageTypes::DANGER;
        } else {
            $this->Type = is_null($type) ? StatusMessageTypes::INFO : $type;
        }
        $this->Content         = $content;
        $this->TimeOut         = $timeOut;
        $this->ExtendedTimeOut = $extendedTimeOut;
    }

    public function getTitle()
    {
        return $this->Title;
    }

    public function getType()
    {
        return $this->Type;
    }

    public function getTypeForForm()
    {
        return StatusMessageTypes::forForm($this->Type);
    }

    public function getContent()
    {
        return $this->Content;
    }

    public function getContentForForm()
    {
        $result = "";
        if ($this->Title) {
            $result = "<h1 class='form-title'>" . $this->Title . "</h1>" . PHP_EOL;
        }
        $result .= $this->Content;

        return $result;
    }

    /**
     *
     * @param Form $form
     * @return StatusMessage
     */
    public function addToForm(Form $form)
    {
        $form->setMessage($this->getContentForForm(), $this->getTypeForForm());
        return $this;
    }

    public function getTimeOut()
    {
        return $this->TimeOut;
    }

    public function getExtendedTimeOut()
    {
        return $this->ExtendedTimeOut;
    }

    public function setTitle($Title)
    {
        $this->Title = $Title;
        return $this;
    }

    public function setType($Type)
    {
        $this->Type = $Type;
        return $this;
    }

    public function setContent($Content)
    {
        $this->Content = $Content;
        return $this;
    }

    public function setTimeOut($TimeOut)
    {
        $this->TimeOut = $TimeOut;
        return $this;
    }

    public function setExtendedTimeOut($ExtendedTimeOut)
    {
        $this->ExtendedTimeOut = $ExtendedTimeOut;
        return $this;
    }

    public function forTemplate()
    {
        return $this->renderWith(__CLASS__);
    }

    public function jsonSerialize()
    {
        return (object) array("content" => $this->Content, "title" => $this->Title, "type" => $this->getTypeForForm(), "orignalType" => $this->Type);
    }

    /**
     * Compiles all CSS-classes.
     *
     * @return string
     */
    public function extraClass()
    {
        return implode(array_unique(array_merge(array("status-message", "alert", "alert-" . $this->getType()), $this->extraClasses)), ' ');
    }

    /**
     * Add a CSS-class to the form-container. If needed, multiple classes can
     * be added by delimiting a string with spaces.
     *
     * @param string $class A string containing a classname or several class
     * 				names delimited by a single space.
     */
    public function addExtraClass($class)
    {
        //split at white space
        $classes = preg_split('/\s+/', $class);
        foreach ($classes as $class) {
            //add classes one by one
            $this->extraClasses[$class] = $class;
        }
        return $this;
    }

    /**
     * Remove a CSS-class from the form-container. Multiple class names can
     * be passed through as a space delimited string
     *
     * @param string $class
     */
    public function removeExtraClass($class)
    {
        //split at white space
        $classes = preg_split('/\s+/', $class);
        foreach ($classes as $class) {
            //unset one by one
            unset($this->extraClasses[$class]);
        }
        return $this;
    }

    /**
     * Return the attributes of the form tag - used by the templates.
     *
     * @param Array Custom attributes to process. Falls back to {@link getAttributes()}.
     * If at least one argument is passed as a string, all arguments act as excludes by name.
     * @return String HTML attributes, ready for insertion into an HTML tag
     */
    public function getAttributesHTML($attrs = null)
    {
        $exclude = (is_string($attrs)) ? func_get_args() : null;

        if (!$attrs || is_string($attrs)) {
            $attrs = $this->getAttributes();
        }

        // Remove empty
        $attrs = array_filter((array) $attrs, create_function('$v', 'return ($v || $v === 0);'));

        // Remove excluded
        if ($exclude) {
            $attrs = array_diff_key($attrs, array_flip($exclude));
        }

        // Create markup
        $parts = array();
        foreach ($attrs as $name => $value) {
            $parts[] = ($value === true) ? "{$name}=\"{$name}\"" : "{$name}=\"" . Convert::raw2att($value) . "\"";
        }

        return implode(' ', $parts);
    }

    /**
     * @param String
     * @param String
     */
    public function setAttribute($name, $value)
    {
        $this->attributes[$name] = $value;
        return $this;
    }

    /**
     * @return String
     */
    public function getAttribute($name)
    {
        if (isset($this->attributes[$name])) {
            return $this->attributes[$name];
        }
    }

    public function getAttributes()
    {
        $attrs = array(
            'data-status-type'    => $this->getType(),
            'data-status-content' => $this->getContent(),
            'data-status-title'   => $this->getTitle(),
            'target'              => $this->target,
            'role'                => 'alert',
            'class'               => $this->extraClass()
        );

        return array_merge($attrs, $this->attributes);
    }

    public static function AddIncludes()
    {
        if (Config::inst()->get('StatusMessage', 'UseDefaultCSS')) {
            Requirements::css('silverstripe-status-message/javascript/thirdparty/toastr/toastr.css');
        }
    
        Requirements::javascript(FRAMEWORK_DIR . '/thirdparty/jquery/jquery.js');
        Requirements::javascript('silverstripe-status-message/javascript/dist/silverstripe-status-message.js');
    }
}

class StatusMessageTypes
{

    const SUCCESS = "success";
    const DANGER  = "danger";
    const INFO    = "info";
    const LOADING = "loading";
    const WARNING = "warning";

    public static function forForm($type)
    {
        $result = "bad";
        switch ($type) {
            case StatusMessageTypes::SUCCESS:
            case StatusMessageTypes::INFO :
            case StatusMessageTypes::LOADING:
                $result = "good";
                break;
            case StatusMessageTypes::DANGER :
                $result = "bad";
                break;
            case StatusMessageTypes:: WARNING:
                $result = "warning";
                break;
            default:
                $result = $type ? "good" : "bad";
                break;
        }
        return $result;
    }
}
