<?php
include 'functions.php';
?>
<!DOCTYPE html>
<html>

<head>
    <title>QuickBite</title>
    <link rel="stylesheet" href="css/staffs_register.css">
</head>

<body>
    <div class="wrap">
        <header class="page-header">
            <div class="brand">
                <div class="logo">QB</div>
                <div>
                    <div style="font-weight:700">QuickBite</div>
                    <small style="opacity:0.85;color:#2b6777">Create staff account</small>
                </div>
            </div>
            <a href="staffs_login.php">← Back to login</a>
        </header>
        <h2>Staff Registration</h2>
        <p class="message">
            <?php
            if (isset($_COOKIE['staff_reg_res'])) {
                echo $_COOKIE['staff_reg_res'];
            }
            ?>
        </p>
        <form action="functions.php" method="POST" autocomplete="off">
            <input type="text" name="name" placeholder="Full name" required>
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <input type="password" name="confirm_password" placeholder="Confirm password" required>
            <input type="hidden" name="staff_registration" value="true">
            <button type="submit">Register</button>
        </form>
        <footer class="page-footer">© QuickBite — staff management</footer>
    </div>
</body>

<script>
    window.addEventListener("load", () => {
        document.cookie = "staff_reg_res=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    });
</script>

</html>