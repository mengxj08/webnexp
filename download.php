<?php
$File = "Arrangement.json";
$cookie_name = "ResultOfArrangement";

header("Content-Disposition: attachment; filename=\"" . basename($File) . "\"");
header("Content-Type: application/force-download");
header("Connection: close");

if(!isset($_COOKIE[$cookie_name])) {
    echo "The arrangement is not set successfully!";
} else {
    echo $_COOKIE[$cookie_name];
}
?>
