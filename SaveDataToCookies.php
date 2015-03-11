<?php
// $cookie_value = file_get_contents("php://input");
$cookie_name = $_POST['name'];
$cookie_value = $_POST['data'];
setcookie($cookie_name, $cookie_value, time() + (60 * 2), "/");
?>
