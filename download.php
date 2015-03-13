<?php
session_start();

$File = "Arrangement.json";
$session_name = "ResultOfArrangement";

header("Content-Disposition: attachment; filename=\"" . basename($File) . "\"");
header("Content-Type: application/force-download");
header("Connection: close");

if(!isset($_SESSION[$session_name])) {
    echo "The arrangement is not set successfully!";
} else {
    echo $_SESSION[$session_name];
}
?>
