<?php
include 'functions.php';

unset($_SESSION['check_out']);
unset($_SESSION['check_out_store']);

if (!isset($_SESSION['student_number'])) header('Location: index.php');

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

        .store:hover {
            cursor: pointer;
        }
    </style>
</head>
<body>
    <input type="hidden" id="studentNumberInp" value="<?php echo $student_number; ?>">

    <h2>QuickBite</h2>

    <ul>
        <li><a href="students_logout.php">Logout</a></li>
    </ul>

    <button id="viewCart">Cart</button>

    <button id="viewOrders">Orders</button>

    <h3>Canteen Stores</h3>
    
    <div id="storesDiv"></div>

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

        <input type="text" name="store_id" id="storeIdInp">

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

<script src="js/students_dashboard.js"></script>

</html>