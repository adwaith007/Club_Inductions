<?php

include("../../config.php");
if ( isset($_POST['playlistId']) && isset($_POST['songId']) ) {

    $playlistId = $_POST['playlistId'];
    $songId = $_POST['songId'];

    $orderQuery = mysqli_query($con, "SELECT MAX(playlistOrder)+1 AS playlistOrder FROM playlistSongs WHERE playlistId= '$playlistId'; ");

    $rows = mysqli_fetch_array($orderQuery);

    $playlistOrder=$rows[0]['playlistOrder'];
    if (!$playlistOrder) {
        $playlistOrder = 1;
    }
    $query = mysqli_query($con, "INSERT INTO playlistSongs VALUES('','$songId','$playlistId','$playlistOrder');");
}
else {
    echo "playlistId and songId is not passed in.";
}

?>