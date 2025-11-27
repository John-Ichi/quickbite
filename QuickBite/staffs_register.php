<?php
include 'functions.php';
?>
<!DOCTYPE html>
<html>

<head>
    <title>QuickBite</title>
</head>

<body>
    <a href="staffs_login.php">Return</a>
    <h2>Staff Registration</h2>
    <p>
        <?php 
        if (isset($_COOKIE['staff_reg_res'])) {
            echo $_COOKIE['staff_reg_res'];
        }
        ?>
    </p>
    <form action="functions.php" method="POST" autocomplete="off">
        <input type="text" name="name" placeholder="Full Name" required><br><br>
        <input type="email" name="email" placeholder="Email" required><br><br>
        <input type="password" name="password" placeholder="Password" required><br><br>
        <input type="password" name="confirm_password" placeholder="Confirm Password" required><br><br>
        <input type="hidden" name="staff_registration" value="true">
        <button type="submit">Register</button><br><br><br><br>
    </form>
</body>

<script>
    window.addEventListener("load", () => {
        document.cookie = "staff_reg_res=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    });
</script>

</html>