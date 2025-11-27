<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
</head>
<body>
    <h1>Register</h1>
    <p>
        <?php
        if (isset($_COOKIE['stud_reg_res'])) {
            echo $_COOKIE['stud_reg_res'];
        }
        ?>
    </p>
    <form action="functions.php" method="POST" autocomplete="off">
        <input type="text" name="student_number" placeholder="Student Number">
        <input type="password" name="password" placeholder="Password">
        <input type="password" name="confirm_password" placeholder="Confirm Password">
        <input type="hidden" name="student_registration">
        <button type="submit">Register</button>
    </form>
    <a href="index.php">Login</a>
</body>

<script>
    window.addEventListener("load", () => {
        document.cookie = "stud_reg_res=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    });
</script>

</html>