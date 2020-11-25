<?php

    include("includes/includedFile.php");
    include("includes/addSongToPlaylistModal.php");
    if (isset($_GET['term'])) {
        $term = urldecode($_GET['term']);
    }
    else {
        $term = "";
    }
?>
<div class="searchInputContainer">
    <div class="searchGuide">
        <p>Search for an Artist, Song, Album or Playlist</p>
    </div>
    <div>
        <input class="searchInput" type="text" onfocus="this.value = this.value" value="<?php echo $term; ?>" placeholder="Start typing...">
    </div>
</div>

<script>
    $(".searchInput").focus();
    $(function () {
        var timer;
        $(".searchInput").keyup(function () {
            clearTimeout(timer);
            timer = setTimeout(function () {
                var searchText = $(".searchInput").val();
                openPage("search.php?term=" + searchText);
            },1000);
        });
    });
</script>
<div class="searchResultContainer">
    <h2>Songs</h2>
    <div class="trackListContainer">
        <ul class="trackList">
            <?php
            $Query = mysqli_query($con, "SELECT id FROM Songs WHERE title LIKE '%$term%' ");
            if (mysqli_num_rows($Query) == 0) {
                echo "<span class='noResult'>No results.</span>";
            }
            else{
                $i = 1;
                $songIdArray = array();
                while ($row = mysqli_fetch_array($Query)) {
                    if ($i > 15) {
                        break;
                    }
                    array_push($songIdArray,$row['id']);
                    $searchSong = new Song($con, $row['id']);
                    $albumId = $searchSong->getAlbum()->getId();
                    echo "<li class='trackListRow'>
                           <div class = 'trackCount'>
                                <img class='play' src='assets/images/icons/playWhite.png' onclick='setTrack(\"" . $searchSong->getId() . "\",tempPlaylist,true)'>
                                <span class='trackNumber'>" . $i . "</span>
                            </div>
                            
                            <div class='trackInfo'>
                                <span class='trackTitle'>" . $searchSong->getTitle() . "</span>
                                <div class='trackArtist'>" . $searchSong->getArtist()->getName() . "</div>
                            </div>
                            <div class='trackOptions'>
                                <img onclick='showOptionsMenu(this)' class='optionsButton' data-album='$albumId' data-value='$songId' src='assets/images/icons/option.png'>
                            </div>
                            
                            <div class='trackDuration'>
                                <span class='duration'>" . $searchSong->getDuration() . "</span>
                            </div>
                      </li>";
                    $i = $i + 1;
                }
            }

            ?>
            <script>
                var tempSongIds = '<?php echo json_encode($songIdArray)?>';
                tempPlaylist = JSON.parse(tempSongIds);
            </script>

        </ul>
    </div>
</div>
<div class="artistFoundContainer">
    <h2>Artists</h2>
    <div class="GridViewContianer">
        <?php
        $artistQuery = mysqli_query($con, "SELECT id FROM Artists WHERE name LIKE '%$term%'");
        if (mysqli_num_rows($artistQuery) == 0) {
            echo "<span class='noResult'>No results.</span>";
        }
        else{
            while ($row = mysqli_fetch_array($artistQuery)) {
                $artistFound = new Artist($con, $row['id']);

                echo "
                     <div class='artistFoundItem' onclick='openPage(\"artist.php?id=".$artistFound->getId()."\")'>
                        ".$artistFound->getName()."
                     </div>
                    ";
            }
        }
        ?>
    </div>
</div>
<div class="albumFoundContainer">
    <h2>Albums</h2>
    <div class="albumFoundItemsContainer">
        <?php
            $albumQuery = mysqli_query($con,"SELECT * FROM Albums WHERE title LIKE '%$term%'");
            if (mysqli_num_rows($albumQuery) == 0 ) {
                echo "<span class='noResult'>No results.</span>";
            }
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
</div>
