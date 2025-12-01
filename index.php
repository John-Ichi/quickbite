<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
    <link rel="stylesheet" href="css/index.css">
</head>

<body>
    <div class="container">
        <div class="brand">
            <div class="logo">QB</div>
            <div>
                <div style="font-weight:700">QuickBite</div>
                <small style="opacity:0.8;color:rgba(255,255,255,0.7)">Student login</small>
            </div>
        </div>
        <h1>Welcome back</h1>
        <p class="message">
            <?php
            if (isset($_COOKIE['stud_login_err'])) {
                echo $_COOKIE['stud_login_err'];
            }
            ?>
        </p>
        <form action="functions.php" method="POST" autocomplete="off">
            <input type="text" name="student_number" placeholder="Student number" required>
            <input type="password" name="password" placeholder="Password" required>
            <input type="hidden" name="student_login">
            <button type="submit">Log In</button>
        </form>
        <a class="simple-link" href="students_register.php">Create a new account</a>
        <footer class="page-footer">© QuickBite — fast, healthy school meals</footer>
    </div>
</body>

<script>
    window.addEventListener("load", () => {
        document.cookie = "stud_login_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    });
</script>

</html>