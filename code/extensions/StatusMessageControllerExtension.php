<?php

/**
 *
 */
class StatusMessageControllerExtension extends Extension {

    public function onBeforeInit() {
        if (Config::inst()->get('StatusMessage', 'UseDefaultCSS')) {
            Requirements::css('silverstripe-status-message/javascript/thirdparty/toastr/toastr.css');
        }
        Requirements::javascript(FRAMEWORK_DIR . '/thirdparty/jquery/jquery.js');
        Requirements::javascript('silverstripe-status-message/javascript/dist/silverstripe-status-message.js');
//                               \silverstripe-status-message\javascript\dist\silverstripe-status-message.min.js
    }

}
