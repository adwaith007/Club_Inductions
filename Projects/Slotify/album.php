<?php
include("includes/includedFile.php");
include("includes/addSongToPlaylistModal.php");
if (isset($_GET['id'])) {
    $albumId = $_GET[id];
}
else {
    header("Location:index.php");
}
$album = new Album($con,$albumId);
$albumName = $album->getTitle();
$artistName = $album->getArtist()->getName();
$artworkPath = $album->getArtworkPath();
?>


<div class="entityInfo">
    <div class="leftSection">
        <img src="<?php echo $artworkPath; ?>" alt="Album Artwork">
    </div>
    <div class="rightSection">
        <h2><?php echo $albumName; ?></h2>
        <span onclick="openPage('artist.php?id=<?php echo $album->getArtist()->getId()?>')">by <?php echo $artistName;?></span>
        <p><?php echo $album->getNumOfSongs() ?> songs</p>
    </div>
</div>
<div class="trackListContainer">
    <ul class="trackList">
        <?php
            $songIdArray = $album->getSongIds();
            $i = 1;
            foreach ($songIdArray as $songId) {
                $albumSong = new Song($con, $songId);
                $albumArtist = $albumSong->getArtist();
                $albumId = $albumSong->getAlbum()->getId();

                echo "<li class='trackListRow'>
                           <div class = 'trackCount'>
                                <img class='play' src='assets/images/icons/playWhite.png' onclick='setTrack(\"".$albumSong->getId()."\",tempPlaylist,true)'>
                                <span class='trackNumber'>".$i."</span>
                            </div>
                            
                            <div class='trackInfo'>
                                <span class='trackTitle'>" . $albumSong->getTitle() . "</span>
                                <div class='trackArtist'>" . $albumSong->getArtist()->getName() . "</div>
                            </div>
                            <div class='trackOptions'>
                                <img onclick='showOptionsMenu(this)' class='optionsButton' data-album='$albumId' data-value='$songId' src='assets/images/icons/option.png'>
                            </div>
                            
                            <div class='trackDuration'>
                                <span class='duration'>" . $albumSong->getDuration() . "</span>
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

