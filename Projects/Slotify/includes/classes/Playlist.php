<?php


class Playlist {
    private $id;
    private $con;
    private $name;
    private $owner;

    public function __construct($con,$data) {
        if (!is_array($data)) {
            $query = mysqli_query($con, "SELECT * FROM playlists WHERE id = '$data';");
            $data = mysqli_fetch_array($query);
        }
        $this->id = $data['id'];
        $this->name = $data['name'];
        $this->owner = $data['owner'];
        $this->con = $con;
    }

    public function getName() {
        return $this->name;
    }

    public function getId() {
        return $this->id;
    }

    public function getOwner() {
        return $this->owner;
    }

    public function getNumOfSongs() {
        $query = mysqli_query($this->con,"SELECT id FROM playlistSongs WHERE playlistId = '$this->id';" );
        return mysqli_num_rows($query);
    }
    public function getSongIds() {
        $query = mysqli_query($this->con,"SELECT songId FROM PlaylistSongs WHERE playlistId = '$this->id' ORDER BY playlistOrder ASC;" );
        $result = array();
        while( $row = mysqli_fetch_array($query) ) {
            array_push($result,$row['songId']);
        }
        return $result;
    }
}
?>

