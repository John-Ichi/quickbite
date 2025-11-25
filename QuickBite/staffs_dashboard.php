<?php
include 'functions.php';
if (!isset($_SESSION["admin_id"])) {
    header("Location: staffs_login.php");
    exit();
}
?>
<!DOCTYPE html>
<html>

<head>
    <title>QuickBite</title>
</head>

<body>
    <h2>Welcome, <?php echo htmlspecialchars($_SESSION["admin_name"]); ?></h2>
    <ul>
        <li><a href="food_menu.php">Manage Food Menu</a></li>
        <li><a href="orders.php">Process Orders</a></li>
        <li><a href="inventory.php">Inventory Management</a></li>
        <li><a href="reports.php">Reports & Analytics</a></li>
        <li><a href="registration.php">Register Users</a></li>
        <li><a href="staffs_logout.php">Logout</a></li>
    </ul>
</body>

</html>