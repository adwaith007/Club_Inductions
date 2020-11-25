
<div id="navBarContainer">
    <nav class="navBar">
        <span role = "link" tabindex="0" onclick="openPage('index.php')" class="logo">
            <img alt="logo" src="https://vignette.wikia.nocookie.net/s4s/images/2/23/Sad_Frog.png/revision/latest?cb=20160217024838">
        </span>

        <div class="group">
            <div class="navItem" onclick="openPage('search.php')">
                <span class="navItemLink"> Search</span>
                <img src="assets/images/icons/search.png" class="icon" alt="search icon">
            </div>
        </div>

        <div class="group">
            <div class="navItem">
                <span role="link" tabindex="0" onclick="openPage('browse.php')" class="navItemLink"> Browse </span>
            </div>

            <div class="navItem">
                <span role="link" tabindex="0" onclick="openPage('yourMusic.php')" class="navItemLink"> Your Music </span>
            </div>
        </div>
        <div class="group">
            <div class="navItem">
                <span role="link" tabindex="0" onclick="openPage('settings.php')" class="navItemLink"> <?php echo $userLoggedIn->getUsername(); ?> </span>
            </div>
        </div>
    </nav>
</div>
