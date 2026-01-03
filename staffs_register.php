<?php
include 'functions.php';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite - Staff Registration</title>
    <link rel="stylesheet" href="css/staffs_register.css">
</head>

<body>
    <div class="box">
        <header class="page-header">
            <div class="brand">
                <div class="logo">S</div>
                <div>
                    <div style="font-weight:700">QuickBite</div>
                    <small style="opacity:0.85">Create your staff account</small>
                </div>
            </div>
            <a href="staffs_login.php">← Back</a>
        </header>
        <h1>Register an account</h1>

        <form action="functions.php" method="POST" autocomplete="off">
            <input type="text" name="name" id="staffNameInp" placeholder="Full Name" required value="<?php echo isset($_COOKIE['staff_reg_name_err']) ? htmlspecialchars($_COOKIE['staff_reg_name_err']) : ''; ?>">
            <input type="email" name="email" id="staffEmailInp" placeholder="Email" required value="<?php echo isset($_COOKIE['staff_reg_email_err']) ? htmlspecialchars($_COOKIE['staff_reg_email_err']) : ''; ?>">
            <input type="password" name="password" placeholder="Password" required>
            <input type="password" name="confirm_password" placeholder="Confirm Password" required>
            <input type="hidden" name="staff_registration" value="true">
            <button type="submit">Register</button>
        </form>
        <footer class="page-footer">© QuickBite — welcome</footer>
    </div>
    <script>
        window.addEventListener("load", () => {
            document.cookie = "staff_reg_name_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
            document.cookie = "staff_reg_email_err=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
        });
    </script>

    <script src="js/staffs_register.js"></script>

</body>

</html>