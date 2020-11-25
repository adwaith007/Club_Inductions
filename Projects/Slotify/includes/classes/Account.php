<?php


    class Account {
        private $errorArray;
        private $con;

        public function __construct($con)
        {
            $this->errorArray = array();
            $this->con = $con;

        }

        public function register($un,$fn,$ln,$em,$pw,$pw2) {
            $this->validateUsername($un);
            $this->validateFirstName($fn);
            $this->validateLastName($ln);
            $this->validateEmail($em);
            $this->validatePassword($pw,$pw2);

            if(empty($this->errorArray)) {
                return $this->insertUserDetails($un,$fn,$ln,$em,$pw);
            }
            else{
                return false;
            }
        }

        public function login ($un,$pw) {
            $encryptedPw = md5($pw);
            $queryUsername = "SELECT * FROM Users WHERE username = '$un'AND password = '$encryptedPw'";

            $CheckUsernameExist = mysqli_query($this->con, $queryUsername);

            if (mysqli_num_rows($CheckUsernameExist) == 1){
                return true;
            }
            else {
                array_push($this->errorArray,Constants::$loginFailed);
                return false;
            }




        }

        public function getError($error) {
            if (!in_array($error,$this->errorArray)) {
                $error = "";
            }
            return "<span class='errorMessage'>$error</span>";
        }

        private function insertUserDetails($un,$fn,$ln,$em,$pw) {
            $encryptedPw = md5($pw);
            $profileImg = "assets/images/profile-pics/head_emerald.png";
            $date = date("Y-m-d");
            $query = "INSERT INTO Users VALUES ('','$un','$fn','$ln','$em','$encryptedPw','$date','$profileImg')";
            $result = mysqli_query($this->con, $query);

            return $result;
        }

        private function validateUsername($un){
            if (strlen($un) > 25 || strlen($un) < 5) {
                array_push($this->errorArray, Constants::$invalidUsername);
                return;
            }

            $query = "SELECT username FROM Users WHERE username = '$un'";
            $checkUsernameQuery = mysqli_query($this->con,$query);
            if (mysqli_num_rows($checkUsernameQuery) != 0 ){
                array_push($this->errorArray, Constants::$existedUsername);
                return;
            }

        }

        private function validateFirstName($fn){
            if (strlen($fn) > 25 || strlen($fn) < 2) {
                array_push($this->errorArray, Constants::$invalidFirstName);
                return;
            }
        }

        private function validateLastName($ln){
            if (strlen($ln) > 25 || strlen($ln) < 2) {
                array_push($this->errorArray, Constants::$invalidLastName);
                return;
            }
        }

        private function validateEmail($em){
            if (!filter_var($em,FILTER_VALIDATE_EMAIL)){
                array_push($this->errorArray, Constants::$invalidEmail);
                return;
            }

            $query = "SELECT email FROM Users WHERE email = '$em'";
            $checkEmailQuery = mysqli_query($this->con,$query);
            if (mysqli_num_rows($checkEmailQuery) != 0 ){
                array_push($this->errorArray, Constants::$existedEmail);
                return;
            }

        }

        private function validatePassword($pw,$pw2) {
            if ($pw != $pw2) {
                array_push($this->errorArray, Constants::$passwordDoNotMatch);
                return;
            }
            if (preg_match("/[^A-Za-z0-9]/",$pw)) {
                array_push($this->errorArray, Constants::$passwordNotAlphanumeric);
                return;
            }
            if (strlen($pw) > 30 || strlen($pw) < 5) {
                array_push($this->errorArray, Constants::$invalidLengthPassword);
                return;
            }
        }
    }
?>