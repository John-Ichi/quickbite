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
    
    <h1>Manage Orders</h1>

    <h2>Orders</h2>

    <div id="ordersDiv"></div>

    <form action="functions.php" method="POST" id="updateOrderForm">
        <input type="hidden" name="store_id" value="<?php echo $store_id; ?>">
        <input type="hidden" name="customer_contact" id="customerContactInp">
        <input type="hidden" name="checkout_id" id="orderCheckoutIdInp">
        <input type="hidden" name="update_order" id="updateOrderInp">
    </form>
</body>

<script src="js/store_orders.js" defer></script>

</html>