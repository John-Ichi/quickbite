<?php
include 'functions.php';
if (isset($_SESSION["admin_id"])) {
    header("Location: staffs_dashboard.php");
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite - Staff Login</title>
    <link rel="stylesheet" href="css/staffs_login.css">
</head>

<body>
    <div class="box">
        <header class="page-header">
            <div class="brand">
                <div class="logo">S</div>
                <div>
                    <div style="font-weight:700">QuickBite</div>
                    <small style="opacity:0.85">Staff Login</small>
                </div>
            </div>
            <a href="index.php">← Back</a>
        </header>
        <h1>Admin Login</h1>
        <form action="functions.php" method="POST" autocomplete="off">
            <input type="email" name="email" id="staffEmailLoginInp" placeholder="Email" value="<?php echo isset($_COOKIE['staff_login_email']) ? htmlspecialchars($_COOKIE['staff_login_email']) : ''; ?>" required>
            <input type="password" name="password" id="staffPasswordLoginInp" placeholder="Password" required>
            <input type="hidden" name="staff_login" value="true">
            <button type="submit">Login</button>
        </form>
        <footer class="page-footer">
            Don't have an account? <a href="staffs_register.php" style="color:var(--accent);text-decoration:none">Register here</a>
        </footer>
    </div>
</body>

<script src="js/staffs_login.js"></script>

</html>