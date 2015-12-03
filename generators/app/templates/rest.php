<?php

require_once(dirname(__FILE__) . '/../../../../../config/global.php');
require_once(APP_DIR . "rest/RestBaseClass.php");
require_once(TOOLS_DIR . "ModManager.php");

require_once(CLS_DIR . "models/%%0%%.php");
require_once(dirname(__FILE__) . "/../config/serialize/%%0%%Serialize.php");

class Rest%%0%% extends RestBaseClass
{
  function __construct()
  {
    $this->http_support = ["GET", "POST", "DELETE"];
    $this->object_name = "%%0%%";
    $this->serializeObject = new %%0%%Serialize();
  }
}