<?php
include 'functions.php';

if (isset($_SESSION['store_id'])) header('Location: store_index.php');
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
        if (isset($_COOKIE['store_reg_success'])) echo $_COOKIE['store_reg_success'];
        if (isset($_COOKIE['store_login_err'])) echo $_COOKIE['store_login_err'];
        ?>
    </p>
    <form action="functions.php" method="POST" autocomplete="off">
        <input type="email" name="email" placeholder="Email">
        <input type="password" name="password" placeholder="Password">
        <input type="hidden" name="store_login">
        <button type="submit">Log In</button>
    </form>
</body>

<script>
    window.addEventListener("load", () => {
        document.cookie = "store_reg_success=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        document.cookie = "store_login_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    });
</script>

</html>