<?php
session_start();

$File = "Design.json";
$session_name = "ResultOfDesign";

header("Content-Disposition: attachment; filename=\"" . basename($File) . "\"");
header("Content-Type: application/force-download");
header("Connection: close");

if(!isset($_SESSION[$session_name])) {
    echo "The arrangement is not set successfully!";
} else {
    echo $_SESSION[$session_name];
}
?>
