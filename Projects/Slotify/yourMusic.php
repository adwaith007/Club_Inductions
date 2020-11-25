<?php

include("includes/includedFile.php");
?>
<div class="playlistsContainer">
    <div class="gridViewContainer">
        <h2> Playlist </h2>
        <div class="buttonItems">
            <button class="greenButton" onclick="createPlaylist()">New Playlist</button>
        </div>
    </div>
    <?php
    $username = $userLoggedIn->getUsername();
    $playlistQuery = mysqli_query($con,"SELECT * FROM Playlists WHERE owner = '$username';");

    while($row = mysqli_fetch_array($playlistQuery)) {
        $playList = new Playlist($con,$row);
        echo "<div class='gridViewItem'>
                        <span onclick=openPage('playlist.php?id=".$playList->getId()."')>
                            <img src='assets/images/icons/playlist.png'>
                        </span>
                        <div class='gridViewInfo'>" . $playList->getName(). "</div>
                      </div>";
    }
    ?>
</div>
