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
    <link rel="stylesheet" href="css/staffs_login.css">
</head>

<body>
    <div class="boxed">
        <header class="page-header">
            <div class="brand">
                <div class="logo">QB</div>
                <div>
                    <div style="font-weight:700">QuickBite</div>
                    <small style="opacity:0.85;color:rgba(234,242,255,0.9)">Staff sign in</small>
                </div>
            </div>
        </header>
        <h2>Admin Login</h2>
        <p class="message">
            <?php
            if (isset($_COOKIE['staff_login_err'])) {
                echo $_COOKIE['staff_login_err'];
            }
            ?>
        </p>
        <form action="functions.php" method="POST" autocomplete="off">
            <input type="email" name="email" placeholder="Email" required>
            <input type="password" name="password" placeholder="Password" required>
            <input type="hidden" name="staff_login" value="true">
            <button type="submit">Login</button>
        </form>

        <a href="staffs_register.php">Create staff account</a>
        <footer class="page-footer">© QuickBite — staff access</footer>
    </div>
</body>

<script>
    window.addEventListener("load", () => {
        document.cookie = "staff_login_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    });
</script>

</html>