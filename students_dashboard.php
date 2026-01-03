<?php
include 'functions.php';

unset($_SESSION['check_out']);
unset($_SESSION['check_out_store']);

if (!isset($_SESSION['student_number'])) header('Location: index.php');

$student_number = $_SESSION['student_number'];

getStoreList();
getCart($student_number);
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
    <div class="app">
        <header class="header">
            <div class="brand">
                <div class="logo">QB</div>
                <div>
                    <div style="font-weight:700">QuickBite</div>
                    <small style="opacity:.85">Student Dashboard</small>
                </div>
            </div>
            <div class="h-actions">
                <button class="btn" id="viewOrders">Orders</button>
                <button class="btn" id="viewCart">Cart</button>
                <button class="btn" id="logoutBtn">Logout</button>
            </div>
        </header>

        <aside class="sidebar">
            <h3>Account</h3>
            <p><strong>ID:</strong> <?php echo htmlspecialchars($student_number); ?></p>
            <p>Welcome back!</p>
        </aside>

        <main class="stores-panel">
            <h3>Canteen Stores</h3>
            <div id="storesDiv"></div>
        </main>

        <input type="hidden" id="studentNumberInp" value="<?php echo $student_number; ?>">

        <!-- Cart Modal -->
        <div id="cartModal" class="modal">
            <div class="modal-content small">
                <div class="modal-header">
                    <h3>Cart</h3>
                    <button class="close">&times;</button>
                </div>
                <div id="cartDiv"></div>
                <div class="footer-actions">
                    <button class="btn" id="checkoutFromCart">Proceed to Checkout</button>
                </div>
            </div>
        </div>

        <!-- Orders Modal -->
        <div id="ordersModal" class="modal">
            <div class="modal-content medium">
                <div class="modal-header">
                    <h3>Orders</h3>
                    <button class="close">&times;</button>
                </div>
                <div id="ordersDiv"></div>
            </div>
        </div>

        <!-- Logout Modal -->
        <div id="logoutModal" class="modal">
            <div class="modal-content small">
                <div class="modal-header">
                    <h3>Confirm Logout</h3>
                    <button class="close">&times;</button>
                </div>
                <p>Are you sure you want to logout?</p>
                <div class="footer-actions">
                    <button class="btn" id="confirmLogout">Yes, Logout</button>
                </div>
            </div>
        </div>

        <!-- Hidden forms (existing flows) -->
        <form action="functions.php" method="POST" id="deleteForm" style="display:none">
            <input type="hidden" name="student_number" value="<?php echo $student_number; ?>">
            <input type="hidden" name="cart_id" id="cartIdInp">
            <input type="hidden" name="remove_cart_item">
        </form>

        <form action="functions.php" method="POST" id="checkOut" style="display:none">
            <input type="hidden" name="student_number" value="<?php echo $student_number; ?>">
            <input type="hidden" name="store_id" id="storeIdInp">
            <input type="hidden" name="check_out">
        </form>

        <form action="functions.php" method="POST" id="cancelOrderForm" style="display:none">
            <input type="hidden" name="student_number" value="<?php echo $student_number; ?>">
            <input type="hidden" name="order_id" id="orderIdInp">
            <input type="hidden" name="student_cancel_order">
        </form>
    </div>

    <script src="js/students_dashboard.js"></script>
</body>

</html>