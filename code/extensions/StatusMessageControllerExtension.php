<?php

/**
 *
 */
class StatusMessageControllerExtension extends Extension {

    public function onBeforeInit() {
        StatusMessage::AddIncludes();
    }

}
