<?php


include("../../config.php");
if ( isset($_POST['playlistId']) && isset($_POST['songId']) ) {

    $playlistId = $_POST['playlistId'];
    $songId = $_POST['songId'];

    $query = mysqli_query($con, "DELETE FROM PlaylistSongs WHERE songId = '$songId' AND playlistId = '$playlistId';");
}
else {
    echo "playlistId and songId is not passed in.";
}

?>