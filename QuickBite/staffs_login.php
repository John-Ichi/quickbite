<?php
include 'functions.php';
if (isset($_SESSION["admin_id"])) {
    header("Location: staffs_dashboard.php");
    exit();
}
?>
<!DOCTYPE html>
<html>

<head>
    <title>QuickBite</title>
</head>

<body>
    <h2>Admin Login</h2>
    <p>
        <?php 
        if (isset($_COOKIE['staff_login_err'])) {
            echo $_COOKIE['staff_login_err'];
        }
        ?>
    </p>
    <form action="functions.php" method="POST" autocomplete="off">
        <input type="email" name="email" placeholder="Email" required><br><br>
        <input type="password" name="password" placeholder="Password" required><br><br>
        <input type="hidden" name="staff_login" value="true">
        <button type="submit">Login</button><br><br>  
    </form>
    <a href="staffs_register.php">Register</a>
</body>

<script>
    window.addEventListener("load", () => {
        document.cookie = "staff_login_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    });
</script>

</html>