<?php

include("../../config.php");

    if (isset($_POST['email'])) {
        $email = $_POST['email'];
    }else {
        echo "email is not passed in.";
        return;
    }

    if (isset($_POST['username'])) {
        $username = $_POST['username'];
    }else {
        echo "username is not passed in.";
        return;
    }

    if(!filter_var($email,FILTER_VALIDATE_EMAIL)) {
        echo "please enter an correct email address.";
        return;
    }

    $mailQuery = mysqli_query($con, "SELECT email FROM Users WHERE email = '$email';");
    if (mysqli_num_rows($mailQuery)!= 0) {
        echo "Sorry, this email address has already been used.";
        return;
    }

    $query = mysqli_query($con,"UPDATE Users SET email = '$email' WHERE email = '$username';");
    echo "Email is updated.";


?>