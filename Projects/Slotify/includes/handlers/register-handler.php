<?php


    function sanitizeFormString($inputText) {
        $inputText = strip_tags($inputText);
        $inputText = str_replace(" ","",$inputText);
        return $inputText;
    }

    function sanitizeFormUsername($inputText) {
        $inputText = strip_tags($inputText);
        $inputText = str_replace(" ","",$inputText);
        $inputText = ucfirst(strtolower($inputText));
        return $inputText;
    }

    function sanitizeFormPassword($inputText) {
        $inputText = strip_tags($inputText);
        return $inputText;
    }



    if (isset($_POST['registerButton'])) {
        //Register button was pressed
        $username = sanitizeFormString($_POST['registerUsername']);
        $firstName = sanitizeFormUsername($_POST['firstName']);
        $lastName = sanitizeFormUsername($_POST['lastName']);
        $email = sanitizeFormString($_POST['email']);
        $password = sanitizeFormPassword($_POST['registerPassword']);
        $password2 = sanitizeFormPassword($_POST['confirmPassword']);

        $wasSuccessful = $account->register($username,$firstName,$lastName,$email,$password,$password2);

        if ($wasSuccessful) {
            header("Location:index.php");
        }
    }


?>