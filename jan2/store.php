<?php
include 'functions.php';

unset($_SESSION['check_out']);
unset($_SESSION['check_out_store']);

if (!isset($_SESSION['student_number'])) header('Location: index.php');

$student_number = $_SESSION['student_number'];
$store_id = $_GET['store_id'];

getStoreInfo($store_id);
getMenu($store_id);
getCart($student_number);
getStudentOrders($student_number);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
    <style>
        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgb(0,0,0);
            background-color: rgba(0,0,0,0.4);
        }

        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
        }

        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }

        img {
            height: 10%;
            width: 10%;
        }
    </style>
</head>
<body>
    <a href="students_dashboard.php">Return</a>

    <button id="viewCart">Cart</button>

    <button id="viewOrders">Orders</button>

    <h1>Hello world!</h1>

    <div id="storeInfoDiv"></div>

    <table border="1" cellpadding="5" id="storeMenuTable"></table>
    
    <div id="addToCartModal" class="modal">
        <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Add To Cart</h3>
        <form action="functions.php" method="POST" autocomplete="off">
            <input type="hidden" name="customer_id" value="<?php echo $student_number; ?>">
            <input type="hidden" name="store_id" value="<?php echo $store_id; ?>">
            <input type="hidden" name="food_id" id="foodIdInp">
            <input type="text" name="" id="foodNameInp" readonly>
            <input type="number" name="food_quantity" min="1" step="1" id="foodQuanInp">
            <input type="number" name="food_stock" id="foodStockInp" readonly>
            <input type="number" name="" step="1" id="foodPriceInp" readonly>
            <input type="hidden" name="add_to_cart">
            <button type="submit">Add To Cart</button>
        </form>
        </div>
    </div>

    <div id="cartModal" class="modal">
        <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Cart</h3>
            <div id="cartDiv"></div>
        </div>
        <form action="functions.php" method="POST" id="deleteForm" style="display: none;">
            <input type="text" name="student_number" value="<?php echo $student_number; ?>">
            <input type="text" name="cart_id" id="cartIdInp">
            <input type="text" name="remove_cart_item">
        </form>
    </div>

    <form action="functions.php" method="POST" id="checkOut" style="display: none;">
        <input type="text" name="student_number" value="<?php echo $student_number; ?>">
        <input type="hidden" name="store_id" id="storeIdInp">
        <input type="text" name="check_out">
    </form>

    <div id="ordersModal" class="modal">
        <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Orders</h3>
            <div id="ordersDiv"></div>
        </div>
    </div>

    <form action="functions.php" method="POST" id="cancelOrderForm" style="display: none;">
        <input type="text" name="student_number" value="<?php echo $student_number; ?>">
        <input type="text" name="order_id" id="orderIdInp">
        <input type="text" name="student_cancel_order">
    </form>
</body>

<script src="js/store.js"></script>

</html>