<?php
$cookie_value = file_get_contents("php://input");
$cookie_name = "result";
setcookie($cookie_name, $cookie_value, time() + (60 * 2), "/");
?>
