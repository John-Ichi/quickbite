<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
    <link rel="stylesheet" href="css/students_register.css">
</head>
<body>
    <div class="box">
        <header class="page-header">
            <div class="brand">
                <div class="logo">QB</div>
                <div>
                    <div style="font-weight:700">QuickBite</div>
                    <small style="opacity:0.85;color:rgba(246,238,243,0.9)">Create your student account</small>
                </div>
            </div>
            <a href="index.php">← Back</a>
        </header>
        <h1>Register an account</h1>
        <p class="message">
            <?php
            if (isset($_COOKIE['stud_reg_res'])) {
                echo $_COOKIE['stud_reg_res'];
            }
            ?>
        </p>
        <form action="functions.php" method="POST" autocomplete="off">
            <input id="studentNumberInp" type="text" name="student_number" placeholder="Student number" required inputmode="numeric" pattern="\d{9}" maxlength="9" minlength="9">
            <input id="contactNumberInp" type="text" name="contact_number" placeholder="Contact Number" required inputmode="numeric" pattern="\d{11}" maxlength="11" minlength="11">
            <input type="password" name="password" placeholder="Password" required>
            <input type="password" name="confirm_password" placeholder="Confirm password" required>
            <input type="hidden" name="student_registration">
            <button type="submit">Register</button>
        </form>
        <footer class="page-footer">© QuickBite — welcome</footer>
    </div>
</body>

<script src="js/students_register.js"></script>

</html>