<?php


class Album {
    private $id;
    private $con;
    private $title;
    private $artistId;
    private $genre;
    private $artworkPath;

    public function __construct($con,$id) {
        $this->con = $con;
        $this->id = $id;

        $Query = mysqli_query($this->con,"SELECT * FROM Albums WHERE id = '$this->id'");
        $album = mysqli_fetch_array($Query);

        $this->title = $album['title'];
        $this->artistId = $album['artist'];
        $this->genre = $album['genre'];
        $this->artworkPath = $album['artworkPath'];

    }
    public function getId() {
        return $this->id;
    }

    public function getTitle() {
        return $this->title;
    }

    public function getArtist() {
        $tempArtist = new Artist($this->con,$this->artistId);
        return $tempArtist;
    }

    public function getGenre() {
        return $this->genre;
    }

    public function getArtworkPath() {
        return $this->artworkPath;
    }
    public function getNumOfSongs() {
        $query = mysqli_query($this->con, "SELECT id FROM Songs WHERE album = '$this->id'");
        return mysqli_num_rows($query);
    }
    public function getSongIds() {
        $query = mysqli_query($this->con, "SELECT id FROM Songs WHERE album = '$this->id' ORDER BY albumOrder ASC");
        $ids = array();
        while ($row = mysqli_fetch_array($query)) {
            array_push($ids, $row['id']);
        }
        return $ids;

    }

}

?>