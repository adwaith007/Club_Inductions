<?php

    $addSongModal = "<div class=\"optionsMenu\">
                <p>Add to Playlist</p>
                <ul>";
    $queryUsername = $userLoggedIn->getUsername();
    $PlaylistQuery = mysqli_query($con, "SELECT id,name FROM Playlists WHERE owner = '$queryUsername';");
    while ($row = mysqli_fetch_array($PlaylistQuery)) {
        $id = $row['id'];
        $name = $row['name'];
        $addSongModal = $addSongModal . "<li onclick='addSongToPlaylist(this)' class='item' data-value=$id> $name </li>";
    }
    echo $addSongModal. "</ul>
                   <p class='modalItem' onclick='goToAlbum()'>Go to Album</p>
                </div>";


?>
