$(document).ready(function () {
    $("#registerForm").hide();

    $("#showRegister").click(function () {
        $("#loginForm").hide();
        $("#registerForm").show();
    });

    $("#hideRegister").click(function () {
        $("#loginForm").show();
        $("#registerForm").hide();
    });

});