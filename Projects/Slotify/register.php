<?php
    include ("includes/config.php");
    include("includes/classes/Constants.php");
    include("includes/classes/Account.php");

    $account = new Account($con);

    include("includes/handlers/register-handler.php");
    include("includes/handlers/login-handler.php");

    function getInputValue($name) {
        if (isset($_POST[$name])) {
            echo $_POST[$name];
        }
    }
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Welcome to my musicPlayer</title>
    <link rel="stylesheet" type="text/css" href="assets/css/register.css">
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
    <script src="assets/js/register.js"></script>
</head>
<body>
        <?php
             if (isset($_POST['registerButton'])) {
                echo "<script> 
                         $(document).ready(function() {
                             $(\"#loginForm\").hide();
                             $(\"#registerForm\").show();
                         });
                      </script>";
             }
             else {
                 echo "<script> 
                           $(document).ready(function() {
                                $(\"#loginForm\").show();
                                $(\"#registerForm\").hide();
                            });
                        </script>";
             }
        ?>

    <div id="background">
    </div>
        <div id="loginContainer">

            <div id="inputContainer">
                <form id="loginForm" action="register.php" method="POST">
                    <h2>Login Here</h2>
                    <?php echo $account->getError(Constants::$loginFailed); ?>
                    <p>
                        <label for="username">User Name</label>
                        <input id="username" name="username" type="text" placeholder="e.g Simonchan1997" required>
                    </p>
                    <p>
                        <label for="password">Password</label>
                        <input id="password" name="password" type="password" placeholder="Enter your password here" required>
                    </p>
                    <button type="submit" name="loginButton">Log In</button>
                    <div class="hasAccountText">
                        <span id="showRegister"> Don't have a account yet? Click here to have one!</span>
                    </div>
                </form>

                <form id="registerForm" action="register.php" method="POST">
                    <h2>Register Here</h2>
                    <p>
                        <?php echo $account->getError(Constants::$invalidUsername); ?>
                        <?php echo $account->getError(Constants::$existedUsername); ?>
                        <label for="registerUsername">User Name</label>
                        <input id="registerUsername" name="registerUsername" placeholder="e.g Sean Chan" type="text" value="<?php getInputValue('registerUsername') ?>" required>
                    </p>

                    <p>
                        <?php echo $account->getError(Constants::$invalidFirstName); ?>
                        <label for="firstName">First Name</label>
                        <input id="firstName" name="firstName" placeholder="e.g sean" type="text" value="<?php getInputValue('firstName') ?>" required>
                    </p>

                    <p>
                        <?php echo $account->getError(Constants::$invalidLastName); ?>
                        <label for="lastName">Last Name</label>
                        <input id="lastName" name="lastName" type="text" placeholder="e.g chan" value="<?php getInputValue('lastName') ?>" required>
                    </p>

                    <p>
                        <?php echo $account->getError(Constants::$invalidEmail); ?>
                        <?php echo $account->getError(Constants::$existedEmail); ?>
                        <label for="email">Email</label>
                        <input id="email" name="email" type="email" placeholder="simonchan@gmail.com" value="<?php getInputValue('email') ?>" required>
                    </p>

                    <p>
                        <?php echo $account->getError(Constants::$passwordNotAlphanumeric); ?>
                        <?php echo $account->getError(Constants::$invalidLengthPassword); ?>
                        <label for="registerPassword">Password</label>
                        <input id="registerPassword" name="registerPassword" placeholder="Enter your password here" type="password" value="<?php getInputValue('registerPassword') ?>" required>
                    </p>

                    <p>
                        <?php echo $account->getError(Constants::$passwordDoNotMatch); ?>
                        <label for="confirmPassword">Confirm Password</label>
                        <input id="confirmPassword" name="confirmPassword" placeholder="Please enter the password again" type="password" value="<?php getInputValue('confirmPassword') ?>" required>

                    </p>
                    <button type="submit" name="registerButton">Register Now</button>
                    <div class="hasAccountText">
                        <span id="hideRegister"> Already have an account? Login here!</span>
                    </div>
                </form>
            </div>
            <div id="loginText">
                <h1>Get great music, right now.</h1>
                <h2>Listen to loads of songs for free.</h2>
                <ul>
                    <li>Discover music for you.</li>
                    <li>Follow artists to keep in date.</li>
                </ul>

            </div>
        </div>

</body>
</html>