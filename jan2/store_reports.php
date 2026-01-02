<?php
include 'functions.php';

if (!isset($_SESSION['store_id'])) header('Location: store_login.php');

$store_id = $_SESSION['store_id'];

getStoreOrders($store_id);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
</head>
<body>
    <a href="store_index.php">Return</a>

    <div id="itemSalesDiv"></div>

    <div id="salesSummaryDiv"></div>
</body>

<script src="js/store_reports.js" defer></script>

</html>