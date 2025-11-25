<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
</head>
<body>
    <h1>Login</h1>
    <p>
        <?php
        if (isset($_COOKIE['stud_login_err'])) {
            echo $_COOKIE['stud_login_err'];
        }
        ?>
    </p>
    <form action="functions.php" method="POST" autocomplete="off">
        <input type="text" name="student_number" placeholder="Student Number">
        <input type="password" name="password" placeholder="Password">
        <input type="hidden" name="student_login">
        <button type="submit">Log In</button>
    </form>
    <a href="students_register.php">Register</a>
</body>

<script>
    window.addEventListener("load", () => {
        document.cookie = "stud_login_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    });
</script>

</html>