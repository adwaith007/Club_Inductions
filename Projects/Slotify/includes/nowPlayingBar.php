<?php
$songQuery = mysqli_query($con,"SELECT id FROM songs ORDER BY RAND() LIMIT 5");
$resultArray = array();
while($row = mysqli_fetch_array($songQuery)) {
    array_push($resultArray,$row['id']);
}
$jsonArray = json_encode($resultArray);
?>

<script>
    $(document).ready(function () {
        var newPlaylist = <?php echo $jsonArray ?>;
        audioElement = new Audio();
        setTrack(newPlaylist[0], newPlaylist, false);

        $("#nowPlayingBarContainer").on("mousedown touchstart mousemove touchmove", function (e) {
            e.preventDefault();
        });

        $(".playbackBar .progressBar").mousedown(function () {
            mouseDown = true;
        });

        $(".playbackBar .progressBar").mousemove(function (e) {
            if (mouseDown) {
                timeFromOffset(e,this);
            }
        });

        $(".playbackBar .progressBar").mouseup(function (e) {
                timeFromOffset(e,this);
        });

        $(".volumeBar .progressBar").mousedown(function () {
            mouseDown = true;
        });

        $(".volumeBar .progressBar").mousemove(function (e) {
            if (mouseDown) {
                var percentage = e.offsetX / $(this).width();
                audioElement.audio.volume = percentage;
            }
        });

        $(".volumeBar .progressBar").mouseup(function (e) {
                var percentage = e.offsetX / $(this).width();
                audioElement.audio.volume = percentage;
        });

        $(document).mouseup(function () {
            mouseDown = false;
        });


    });
    function timeFromOffset(mouse, progressBar) {
        var percentage = mouse.offsetX / $(progressBar).width();
        var seconds = audioElement.audio.duration * percentage;
        audioElement.setTime(seconds);
    }


    function setTrack (trackId, newPlaylist, play) {
        // If there is a new playlist to run, set the new playlist as current playlist, meanwhile, create a corresponding shuffle list.
        if (newPlaylist != currentPlaylist) {
            currentPlaylist = newPlaylist;
            shufflePlaylist = currentPlaylist.slice();
            shuffleArray(shufflePlaylist);
        }
        if (shuffle) {
            currentIndex = shufflePlaylist.indexOf(trackId);
        }
        else {
            currentIndex = currentPlaylist.indexOf(trackId);
        }
        $.post("includes/handlers/ajax/getSongJson.php", {songId: trackId}, function (data) {

            var track = JSON.parse(data);
            $(" .trackName").text(track.title);

            $.post("includes/handlers/ajax/getArtistJson.php", {artistId: track.artist}, function (data) {
                var artist = JSON.parse(data);
                $(".singerName").text(artist.name);
                $(".singerName").attr("onclick","openPage('artist.php?id=" + artist.id+"')");

            });
            $.post("includes/handlers/ajax/getAlbumJson.php", {albumId: track.album}, function (data) {
                var album = JSON.parse(data);
                $(".albumLink img").attr("src",album.artworkPath);
                $(".albumLink").attr("onclick","openPage('album.php?id="+album.id+"')");
            });
            audioElement.setTrack(track);

            if (play == true) {
                playSong();
            }
        });
    }

    function nextSong() {
        if (repeatSong) {
            audioElement.setTime(0);
            playSong();
            return;
        }
        if (currentIndex == currentPlaylist.length-1) {
            currentIndex = 0;
        }
        else {
            currentIndex = currentIndex+1;
        }
        var trackToPlay = shuffle ? shufflePlaylist[currentIndex] : currentPlaylist[currentIndex];
        setTrack(trackToPlay,currentPlaylist,true);
    }

    function previousSong() {
        if (audioElement.audio.currentTime > 3 || currentIndex == 0) {
            audioElement.setTime(0);
            playSong();
        }
        else{
            currentIndex=currentIndex-1;
            var trackToPlay = currentPlaylist[currentIndex];
            setTrack(trackToPlay,currentPlaylist,true);
        }

    }

    function playSong () {
        if(audioElement.audio.currentTime == 0) {
            $.post("includes/handlers/ajax/updatePlays.php",{ songId: audioElement.currentlyPlaying.id});
        }
        audioElement.play();
        $(".controlButton.playButton").hide();
        $(".controlButton.pauseButton").show();
    }

    function pauseSong () {
        audioElement.pause();
        $(".controlButton.playButton").show();
        $(".controlButton.pauseButton").hide();
    }

    function repeatMode () {
        if (repeatSong) {
            repeatSong = false;
            $(".repeat img").attr("src","assets/images/icons/repeatButton.png");
        }
        else {
            repeatSong = true;
            $(".repeat img").attr("src","assets/images/icons/repeatButtonGreen.png");
        }
    }

    function muteMode () {
        audioElement.audio.muted = !audioElement.audio.muted;
        var image = audioElement.audio.muted ? "assets/images/icons/mute.png" : "assets/images/icons/volume.png";
        $ (".volume img").attr("src",image);
    }

    function shuffleMode() {
        shuffle = !shuffle;
        var image = shuffle ? "assets/images/icons/shuffleActive.png" : "assets/images/icons/shuffleButton.png";
        $ (".shuffle img").attr("src",image);

        if (shuffle) {
            shuffleArray(shufflePlaylist);
            currentIndex = shufflePlaylist.indexOf(audioElement.currentlyPlaying.id);
        }
        else {
            currentIndex = currentPlaylist.indexOf(audioElement.currentlyPlaying.id);
        }
    }

    function shuffleArray(a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
    }




</script>

<div id="nowPlayingBarContainer">
    <div id="nowPlayingBar">
        <div id="nowPlayingLeft">
            <div class="content" style="color:white;">
                            <span class="albumLink">
                                <img src="">
                            </span>
                <div class="trackInfo">
                    <span class="trackName"></span>
                    <span class="singerName">lalaei</span>
                </div>
            </div>
        </div>
        <div id="nowPlayingCenter">
            <div class="content playerControls">
                <div class="button">
                    <button class="controlButton shuffle" title="shuffle button" onclick="shuffleMode()"> <img src="assets/images/icons/shuffleButton.png" alt="shuffle"></button>
                    <button class="controlButton previousButton" title="play previous song" onclick = "previousSong()"> <img src="assets/images/icons/previousSong.png" alt="previous"></button>
                    <button class="controlButton playButton" title="play button" onclick="playSong()"> <img src="assets/images/icons/playButton.png" alt="play"></button>
                    <button class="controlButton pauseButton" style="display: none;" title="pause button" onclick="pauseSong()"> <img src="assets/images/icons/pauseButton.png" alt="pause"></button>
                    <button class="controlButton nextButton" title="play next song" onclick="nextSong()"> <img src="assets/images/icons/nextSong.png" alt="next"></button>
                    <button class="controlButton repeat" title="repeat button" onclick="repeatMode()"> <img src="assets/images/icons/repeatButton.png" alt="repeat"></button>
                </div>
                <div class="playbackBar">
                    <span class="progressTime current">0.00</span>
                    <div class="progressBar">
                        <div class="progressBarbg">
                            <div class="progress"></div>
                        </div>
                    </div>
                    <span class="progressTime remain">0.00</span>
                </div>
            </div>
        </div>
        <div id="nowPlayingRight">
            <div class="volumeBar">
                <button class="volume controlButton" title="Volume Button" onclick="muteMode()">
                    <img src="assets/images/icons/volume.png" alt="volumeButton">
                </button>
                <div class="progressBar">
                    <div class="progressBarbg">
                        <div class="progress"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>