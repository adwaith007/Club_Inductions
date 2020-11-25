<?php


class Artist {
    private $con;
    private $id;

    public function __construct($con, $id) {
        $this->con = $con;
        $this->id = $id;
    }

    public function getName() {
        $Query = mysqli_query($this->con,"SELECT name FROM Artists WHERE id = '$this->id'");
        $artist = mysqli_fetch_array($Query);
        $artistName = $artist['name'];
        return $artistName;
    }

    public function getAlbum() {
        $Query = mysqli_query($this->con,"SELECT * FROM Albums WHERE artist = '$this->id'");
        $albums = mysqli_fetch_array($Query);
        return $albums;
    }

    public function getPopularSongs() {
        $Query = mysqli_query($this->con,"SELECT id FROM Songs WHERE artist = '$this->id' ORDER BY plays LIMIT 5");
        $songs = array();
        while ($song = mysqli_fetch_array($Query)) {
            array_push($songs,$song['id']);
        };
        return $songs;
    }

    public function getId() {
        return $this->id;
    }
}
?>