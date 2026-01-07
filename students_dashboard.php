<?php
include 'functions.php';

unset($_SESSION['check_out']);
unset($_SESSION['check_out_store']);

if (!isset($_SESSION['student_number'])) header('Location: index.php');

if (isset($_COOKIE['invoice_url'])) header('Location: ' . $_COOKIE['invoice_url']);

$student_number = $_SESSION['student_number'];

getStoreList();
getCart();
getStudentOrders();
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
    <link rel="stylesheet" href="css/students_dashboard.css">
</head>
<body>
    <input type="hidden" id="studentNumberInp" value="<?php echo $student_number; ?>">

    <div class="app">
        <header class="header">
            <div class="brand">
                <div class="logo">QB</div>
                <div>
                    <div style="font-weight:700">QuickBite</div>
                    <small style="opacity:0.85;color:rgba(246,238,243,0.9)">Student dashboard</small>
                </div>
            </div>

            <div class="h-actions">
                <button class="btn" id="viewCart">Cart</button>
                <button class="btn" id="viewOrders">Orders</button>
                <a class="btn" href="students_logout.php">Logout</a>
            </div>
        </header>

        <aside class="sidebar">
            <h3>Your Account</h3>
            <p style="word-break:break-all;">Student: <?php echo $student_number; ?></p>
            <h3 style="margin-top:12px;">Shortcuts</h3>
            <ul>
                <li><a href="students_register.php">Manage registration</a></li>
            </ul>
        </aside>

        <main class="stores-panel">
            <h3>Canteen Stores</h3>
            <div class="stores-grid" id="storesDiv"></div>
        </main>
    </div>

    <div id="cartModal" class="modal">
        <div class="modal-content small">
            <span class="close">&times;</span>
            <h3>Cart</h3>
            <div id="cartDiv" class="cart-list"></div>
            <div class="footer-actions"></div>
        </div>

        <form action="functions.php" method="POST" id="deleteForm" style="display: none;">
            <input type="text" name="student_number" value="<?php echo $student_number; ?>">
            <input type="text" name="cart_id" id="cartIdInp">
            <input type="text" name="remove_cart_item">
        </form>
    </div>

    <form action="functions.php" method="POST" id="checkOut" style="display: none;">
        <input type="text" name="student_number" value="<?php echo $student_number; ?>">
        <input type="text" name="store_id" id="storeIdInp">
        <input type="text" name="check_out">
    </form>

    <div id="ordersModal" class="modal">
        <div class="modal-content medium">
            <span class="close">&times;</span>
            <h3>Orders</h3>
            <div id="ordersDiv" class="orders-list"></div>
        </div>
    </div>

    <form action="functions.php" method="POST" id="cancelOrderForm" style="display: none;">
        <input type="text" name="student_number" value="<?php echo $student_number; ?>">
        <input type="text" name="order_id" id="orderIdInp">
        <input type="text" name="student_cancel_order">
    </form>

</body>

<script src="js/students_dashboard.js"></script>

</html>