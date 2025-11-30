<?php
include 'functions.php';
if (!isset($_SESSION["admin_id"])) {
    header("Location: staffs_login.php");
    exit();
}

getRegisteredUsers();
?>
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
    <link rel="stylesheet" href="css/registration.css">
</head>

<body>
    <div class="container">
        <header class="page-header">
            <div class="brand">
                <div class="logo">QB</div>
                <div>
                    <div style="font-weight:700">QuickBite</div>
                    <small style="opacity:0.8;color:rgba(233,248,243,0.9)">Manage registered students</small>
                </div>
            </div>
            <a href="staffs_dashboard.php">← Return</a>
        </header>
        <p class="message">
            <?php
            if (isset($_COOKIE['staff_user_reg_res'])) {
                echo $_COOKIE['staff_user_reg_res'];
            }
            ?>
        </p>
        <div class="grid">
            <div class="card">
                <form action="functions.php" method="POST" enctype="multipart/form-data" class="file-input">
                    <label style="font-weight:700">Import List</label>
                    <input type="file" name="user_list_excel" accept=".xlsx, .xls" required>
                    <input type="hidden" name="staff_import_users">
                    <button type="submit">Import</button>
                </form>

                <hr style="margin:14px 0;border:none;border-top:1px solid rgba(255,255,255,0.03)">

                <form action="functions.php" method="POST" autocomplete="off">
                    <input type="text" name="student_number" placeholder="Student Number" required>
                    <input type="text" name="name" placeholder="Full name" required>
                    <input type="hidden" name="staff_user_registration">
                    <button type="submit">Register</button>
                </form>
            </div>

            <div class="card">
                <div style="font-weight:700;margin-bottom:10px">Registered Users</div>
                <div id="registeredUsers">
                    <table>
                        <thead>
                            <tr>
                                <th>Student Number</th>
                                <th>Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            <!-- Filled by getRegisteredUsers() / JS -->
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <footer class="page-footer">© QuickBite — staff tools</footer>
    </div>
</body>

<script>
    window.addEventListener("load", () => {
        document.cookie = "staff_user_reg_res=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    });
</script>

<script src="js/registration.js" defer></script>

</html>