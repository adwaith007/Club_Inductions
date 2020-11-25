<?php


class User {
    private $username;
    private $con;

    public function __construct($con,$userLoggedIn)
    {
        $this->username = $userLoggedIn;
        $this->con = $con;
    }

    public function getUsername() {
        return $this->username;
    }

    public function getFullName() {
        $query = mysqli_query($this->con,"SELECT concat(firstName,' ',lastName) as fullName FROM Users WHERE username = '$this->username';");
        $row = mysqli_fetch_array($query);
        $fullName = $row['fullName'];
        return $fullName;
    }

    public function getEmail () {
        $query = mysqli_query($this->con, "SELECT email FROM Users WHERE username = '$this->username';");
        $row = mysqli_fetch_array($query);
        return $row['email'];
    }
}

?>