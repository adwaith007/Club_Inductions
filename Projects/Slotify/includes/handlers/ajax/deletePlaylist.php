<?php

include("../../config.php");
if( isset($_POST['id']) ) {
    $playlistId = $_POST['id'];
    $query1 = mysqli_query($con,"DELETE FROM Playlists WHERE id = '$playlistId'");
    $query2 = mysqli_query($con,"DELETE FROM PlaylistSongs WHERE playlistId = '$playlistId'");
} else {
    echo "playlist id is not passed in";
}
?>