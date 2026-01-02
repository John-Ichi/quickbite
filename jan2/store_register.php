<?php
include 'functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
</head>
<body>
    <p>
        <?php
        if (isset($_COOKIE['store_reg_pass_err'])) echo $_COOKIE['store_reg_pass_err'];
        if (isset($_COOKIE['store_reg_err'])) echo $_COOKIE['store_reg_err'];
        if (isset($_COOKIE['store_reg_email_err'])) echo 'Error: An account with the same email already exists.';
        if (isset($_COOKIE['store_reg_name_err'])) echo 'Error: An account with the same store name already exists.';
        ?>
    </p>
    <form action="functions.php" method="POST" autocomplete="off">
        <input type="text" name="store_name" placeholder="Store Name" id="storeNameInp" required>
        <input type="email" name="email" placeholder="Email" id="storeEmailInp" required>
        <input type="password" name="password" placeholder="Password" required>
        <input type="password" name="confirm_password" placeholder="Confirm Password" required>
        <input type="hidden" name="store_registration">
        <button type="submit" id="signupBtn">Sign Up</button>
    </form>
</body>

<script>
    // Fix case sensitivity
    const emailInput = document.getElementById("storeEmailInp");
    const nameInput = document.getElementById("storeNameInp");
    const signupBtn = document.getElementById("signupBtn");

    function getCookie(name) {
        return document.cookie
            .split("; ")
            .find(row => row.startsWith(name + "="))
            ?.split("=")[1];
    }

    let signUpDisabled = false;

    const errEmail = decodeURIComponent(getCookie("store_reg_email_err") || "");
    const errName = decodeURIComponent(getCookie("store_reg_name_err") || "");

    function checkSignupBtn() {
        const emailErrBool = errEmail && emailInput.value === errEmail;
        const nameErrBool = errName && nameInput.value === errName;

        if (emailErrBool || nameErrBool) {
            signupBtn.disabled = true;
            signUpDisabled = true;
        } else {
            signupBtn.disabled = false;
            signUpDisabled = false;
        }
    }

    if (errEmail) {
        emailInput.addEventListener("input", () => {
            checkSignupBtn();
        });
    }

    if (errName) {
        nameInput.addEventListener("input", () => {
            checkSignupBtn();
        });
    }

    checkSignupBtn();

    window.addEventListener("load", () => {
        document.cookie = "store_reg_pass_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = "store_reg_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = "store_reg_email_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = "store_reg_name_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    });
</script>

</html>