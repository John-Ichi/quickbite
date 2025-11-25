<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
</head>
<body>
    <a href="staffs_dashboard.php">Return</a>
    <h1>Register Users</h1>
    <p>
        <?php
        if (isset($_COOKIE['staff_user_reg_res'])) {
            echo $_COOKIE['staff_user_reg_res'];
        }
        ?>
    </p>
    <form action="functions.php" method="POST" enctype="multipart/form-data">
        <p>Import List</p>
        <input type="file" name="user_list_excel" accept=".xlsx, .xls" required><br><br>
        <input type="hidden" name="staff_import_users">
        <button type="submit">Import</button>
    </form>
    <br>
    <form action="functions.php" method="POST" autocomplete="off">
        <input type="text" name="student_number" placeholder="Student Number" required>
        <input type="text" name="name" placeholder="Name" required>
        <input type="hidden" name="staff_user_registration">
        <button type="submit">Register</button>
    </form>
</body>

<script>
    window.addEventListener("load", () => {
        document.cookie = "staff_user_reg_res=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    });
</script>

</html>