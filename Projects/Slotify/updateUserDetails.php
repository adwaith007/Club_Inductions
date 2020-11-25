<?php

include("includes/includedFile.php");
?>

<div class="userDetails">
    <div class="container borderBottom">
        <h2>Reset Email</h2>
        <input type="text" id="updateEmail"class="updateItem" name="email" placeholder="Email address..." value="<?php echo $userLoggedIn->getEmail(); ?>">
        <p id="emailResponse" class="Response"></p>

        <button class="blackButton" onclick="updateEmail()"> Save </button>

        <h2>Reset Password</h2>
        <input type="password" id="oldPassword"  class="updateItem" name="oldPassword" placeholder="Current Password" value="">
        <p id="currentPasswordResponse"></p>
        <input type="password" id="newPassword1" class="updateItem" name="newPassword1" placeholder="New Password" value="">
        <input type="password" id="newPassword2" class="updateItem" name="newPassword2" placeholder="Confirm Password" value="">
        <p id="newPasswordResponse" class="Response"></p>
        <button class="blackButton" onclick="resetPassword()"> Save </button>
    </div>
</div>
