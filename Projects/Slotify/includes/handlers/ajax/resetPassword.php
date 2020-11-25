<?php

include("../../config.php");

    if (isset($_POST['currentPassword'])) {
        $currentPassword = $_POST['currentPassword'];
        if ($currentPassword == "") {
            echo "currentPassword can not be empty";
            return;
        }
    } else {
        echo "Current password is not passed in.";
        return;
    }

    if (isset($_POST['newPassword'])) {
        $newPassword = $_POST['newPassword'];
        if ($newPassword == "") {
            echo "new can not be empty";
            return;
        }
    } else {
        echo "new password is not passed in.";
        return;
    }

    if (isset($_POST['confirmPassword'])) {
        $confirmPassword = $_POST['confirmPassword'];
        if ($currentPassword == "") {
            echo "confirm Password can not be empty";
            return;
        }
    } else {
        echo "Confirm password is not passed in.";
        return;
    }

    if (isset($_POST['username'])) {
        $username = $_POST['username'];
    } else {
        echo "user is not passed in.";
        return;
    }

    if ($newPassword != $confirmPassword) {
        echo "The new passwords do not match.";
        return;
    }

    if (strlen($newPassword) < 5 || strlen($newPassword) > 30) {
        echo "Password must be between 5 to 30 characters.";
        return;
    }




    $encodedCurrentPassword = md5($currentPassword);
    $currentPasswordQuery = mysqli_query($con, "SELECT password FROM Users WHERE username = '$username';");
    $row = mysqli_fetch_array($currentPasswordQuery);
    $currentStoredPassword = $row['password'];

    if ($encodedCurrentPassword != $currentStoredPassword ) {
        echo "wrong password.";
        return;
    } else {
        $encodedNewPassword = md5($newPassword);
        $query = mysqli_query($con, "UPDATE Users SET password = '$encodedNewPassword' WHERE username = '$username';");
        echo "You have successfully reset the password.";
    }



?>