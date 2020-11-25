<?php
include("includes/includedFile.php");
include("includes/addSongToPlaylistModal.php");
    if (isset($_GET['id'])) {
        $artistId = $_GET[id];
    }
    else {
        header("Location:index.php");
    }
    $artist = new Artist($con, $artistId);
    $artistName = $artist->getName();
    $songIdArray = $artist->getPopularSongs();
?>

<div class="entityInfo">
    <div class="centerSection">
        <div class="artInfo">
            <h1 class="artName"> <?php echo $artistName ?> </h1>
            <button class="greenButton" onclick="setTrack(tempPlaylist[0],tempPlaylist,true)">Play</button>
        </div>
    </div>
</div>
<div class="TitleContainer">
    <h2> Popular </h2>
</div>
<div class="trackListContainer">
    <ul class="trackList">
        <?php
        $i = 1;
        foreach ($songIdArray as $songId) {
            $popularSong = new Song($con, $songId);
            $albumId = $popularSong->getAlbum()->getId();
            echo "<li class='trackListRow'>
                           <div class = 'trackCount'>
                                <img class='play' src='assets/images/icons/playWhite.png' onclick='setTrack(\"".$popularSong->getId()."\",tempPlaylist,true)'>
                                <span class='trackNumber'>".$i."</span>
                            </div>

                            <div class='trackInfo'>
                                <span class='trackTitle'>" . $popularSong->getTitle() . "</span>
                                <div class='trackArtist'>" . $artistName . "</div>
                            </div>
                            <div class='trackOptions'>
                                <img onclick='showOptionsMenu(this)' class='optionsButton' data-album='$albumId' data-value='$songId' src='assets/images/icons/option.png'>
                            </div>

                            <div class='trackDuration'>
                                <span class='duration'>" . $popularSong->getDuration() . "</span>
                            </div>
                      </li>";
            $i = $i + 1;
        }
        ?>
        <script>
            var tempSongIds = '<?php echo json_encode($songIdArray)?>';
            tempPlaylist = JSON.parse(tempSongIds);
        </script>

    </ul>
</div>
<div class="TitleContainer">
    <h2> Albums </h2>
</div>
<div class="gridViewContainer">
    <?php
    $albumQuery = mysqli_query($con,"SELECT * FROM Albums WHERE artist = '$artistId' ORDER BY RAND() LIMIT 10;");

    while($row = mysqli_fetch_array($albumQuery)) {
        echo "<div class='gridViewItem'>
                    <span onclick=openPage('album.php?id=".$row['id']."')>
                        <img src='" . $row['artworkPath']. "'>
                    </span>
                    <div class='gridViewInfo'>" . $row['title']. "</div>
                  </div>";
    }
    ?>
</div>
