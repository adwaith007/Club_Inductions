var currentPlaylist = [];
var shufflePlaylist = [];
var tempPlaylist = [];
var audioElement;
var mouseDown = false;
var currentIndex = 0;
var repeatSong = false;
var shuffle = false;
var userLoggedIn;
var currentSelectedSong = 0;
var currentSelectedAlbum = 0;
function Audio() {

    this.audio = document.createElement("audio");
    this.currentlyPlaying;

    this.setTrack = function(track) {
        this.audio.src = track.path;
        this.currentlyPlaying = track;

    };

    this.play =function () {
        this.audio.play();
    };

    this.pause = function () {
        this.audio.pause();
    };

    this.audio.addEventListener("timeupdate", function () {
        if (this.duration) {
            updateTimeProgressBar(this);
        }
        if (this.currentTime == this.duration) {
            nextSong();
        }
    });

    this.audio.addEventListener("canplay",function () {
        var duration = secondToMinute(this.duration);
        $(".progressTime.remain").text(duration);
        updateVolumeProgressBar(this);
    });

    this.audio.addEventListener("volumechange",function () {
        updateVolumeProgressBar(this);
    });
    this.setTime =function (seconds) {
        this.audio.currentTime = Math.floor(seconds);
    }
}


function secondToMinute (seconds) {
    var minutes = Math.floor(seconds / 60);
    var second = Math.ceil(seconds - (minutes * 60));
    if (seconds < 10) {
        return minutes.toString() + ":0" + second.toString();
    }
    else {
        return  minutes.toString() + ":" + second.toString();
    }
}

function updateTimeProgressBar(audio) {
    $(".progressTime.current").text(secondToMinute(audio.currentTime));
    $(".progressTime.remain").text(secondToMinute(audio.duration-audio.currentTime));
    var progressRatio = (audio.currentTime / audio.duration * 100);
    $(".playbackBar .progress").css("width", progressRatio+"%");
}
function updateVolumeProgressBar(audio) {
    var volumePercentage  = audio.volume * 100;
    $(".volumeBar .progress").css("width", volumePercentage+"%");
}

function openPage(url) {
    if (url.indexOf("?") == -1) {
        url = url + '?';
    }
    var encodedUrl = encodeURI(url+"&userLoggedIn="+userLoggedIn);
    $("#mainContent").load(encodedUrl);
    $("body").scrollTop(0);
    history.pushState(null,null,url);
}

function createPlaylist( ) {
    var popup = prompt("Please enter the name of your playlist.");
    if (popup != null) {
        $.post("includes/handlers/ajax/createPlaylist.php", { name:popup, username:userLoggedIn })
        .done( function (error) {
            if (error) {
                console.log("error:",error);
                return;
            } else {
                openPage("yourMusic.php")
            }

        });
    }
}

function deletePlaylist (playlistId) {
    var prompt = confirm("Are you sure to delete this playlist?");
    if (prompt) {
        $.post("includes/handlers/ajax/deletePlaylist.php",{ id: playlistId}).done(
            function (error) {
                if (error){
                    alert(error);
                    return;
                }
                openPage('yourMusic.php');
            }
        );
    }
}

function showOptionsMenu(button) {
    currentSelectedSong = $(button).data("value");
    currentSelectedAlbum = $(button).data("album");
    var menu = $(".optionsMenu");
    var menuWidth = menu.width();
    //distance from top to top of document
    var scrollTop = $(window).scrollTop();
    var elementOffset = $(button).offset().top;

    var top = elementOffset - scrollTop;
    var left = $(button).position().left;
    menu.css({ "top": top +"px", "left":left-menuWidth+"px", "display": "inline" });

}

function hideOptionsMenu() {
    var menu = $(".optionsMenu");
    if(menu.css("display") != 'none') {
        menu.css("display","none");
    }
}

function addSongToPlaylist(button) {
    var playlistId = $(button).data("value");
    var songId = currentSelectedSong;

    $.post("includes/handlers/ajax/addSongToPlaylist.php",{playlistId: playlistId, songId:songId})
        .done(function(error) {
            if(!error)   {
                hideOptionsMenu();
            }
            else{
                console.log("error:",error);
            }
        }
    );
}

function deleteSongFromPlaylist(button) {
    var playlistId = $(button).data("playlist");
    var songId = currentSelectedSong;

    $.post("includes/handlers/ajax/deleteSongFromPlaylist.php",{playlistId: playlistId, songId:songId})
        .done(function(error) {
                if(!error)   {
                    hideOptionsMenu();
                    openPage('playlist.php?id='+playlistId);
                }
                else{
                    console.log("error:",error);
                }
            }
        );
}

function goToAlbum() {
    openPage('album.php?id='+currentSelectedAlbum);
}

function logOut() {
    $.post("includes/handlers/ajax/logOut.php",function () {
        location.reload();
    });
}

function updateEmail() {
    var email = $("#updateEmail").val();
    $.post("includes/handlers/ajax/updateEmail.php", {email:email, username:userLoggedIn}, function (response) {
        $("#emailResponse").text(response).show();
    });
}

function resetPassword() {
    var currentPassword = $("#oldPassword").val();
    var newPassword = $("#newPassword1").val();
    var confirmPassword= $("#newPassword2").val();

    $.post("includes/handlers/ajax/resetPassword.php",
        {currentPassword:currentPassword, newPassword:newPassword, confirmPassword:confirmPassword, username:userLoggedIn},
        function (response) {
        $("#newPasswordResponse").text(response).show();
        });
}

$(window).scroll(function () {
    hideOptionsMenu();
});

$(document).click (function (click) {
    var target = $(click.target);

    if(!target.hasClass("item")&& !target.hasClass("optionsButton")) {
        hideOptionsMenu();
    }

});