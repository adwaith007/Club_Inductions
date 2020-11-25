<?php
include("includes/config.php");
include("includes/classes/User.php");
include("includes/classes/Artist.php");
include("includes/classes/Album.php");
include("includes/classes/Song.php");
include("includes/classes/Playlist.php");

if (isset($_SESSION['userLoggedIn'])) {
    $userLoggedIn = new User($con,$_SESSION['userLoggedIn']);
    $username = $userLoggedIn->getUsername();
    echo "<script> userLoggedIn = '$username';</script> ";
}
else {
    header("Location: register.php");
}
?>

<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="assets/css/index.css">
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
        <script type="text/javascript" src="assets/js/script.js"></script>
        <title>MusicPlayer</title>
    </head>
    <body>

        <div id="mainContainer">
            <div id="topContainer">
                <?php include("includes/navBarContainer.php");?>
                <div id="mainViewContainer">
                    <div id="mainContent">