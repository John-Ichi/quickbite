<?php
include 'functions.php';

if (isset($_SESSION['store_id'])) header('Location: store_index.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite - Store Login</title>
    <link rel="stylesheet" href="css/store_login.css">
</head>

<body>
    <div class="box">
        <header class="page-header">
            <div class="brand">
                <div class="logo">R</div>
                <div>
                    <div style="font-weight:700">QuickBite</div>
                    <small style="opacity:0.85">Store Login</small>
                </div>
            </div>
            <a href="index.php">← Back</a>
        </header>
        <h1>Store Login</h1>
        <form action="functions.php" method="POST" autocomplete="off">
            <input type="email" name="email" placeholder="Email" value="<?php echo isset($_COOKIE['store_login_email']) ? htmlspecialchars($_COOKIE['store_login_email']) : ''; ?>" required>
            <input type="password" name="password" placeholder="Password" required>
            <input type="hidden" name="store_login">
            <button type="submit">Log In</button>
        </form>
        <footer class="page-footer">
            Don't have an account? <a href="store_register.php" style="color:var(--accent);text-decoration:none">Register here</a>
        </footer>
    </div>
</body>

<script src="js/store_login.js"></script>

</html>