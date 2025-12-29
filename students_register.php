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
        <form action="functions.php" method="POST" autocomplete="off">
            <input type="text" name="student_number" id="studentNumberInp" placeholder="Student number" required>
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