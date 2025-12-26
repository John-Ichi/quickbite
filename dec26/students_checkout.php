<?php
include 'functions.php';

if (!isset($_SESSION['student_number'])) header('Location: index.php');

if (!isset($_SESSION['check_out'])) header('Location: students_dashboard.php');

$student_number = $_SESSION['student_number'];

getCart($student_number);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
    <style>
        img {
            height: 10%;
            width: 10%;
        }
    </style>
</head>
<body>
    <a href="students_dashboard.php">Return</a>
    <h2>Order Summary</h2>

    <div id="orderSummaryDiv"></div>

    // View order summary <br><br>
    
    Checkout process: <br>
    // Create an order entry (orders table) <br>
    // Copy items from cart table to order_items table <br>
    // Clear cart table
    
    <h2>Choose Payment Method</h2>

    <form action="">
        <!-- Add necessary info for order_items -->
        <select name="">
            <option value="" selected disabled hidden>Select Payment Method</option>
            <option value="">Cash</option>
            <option value="">GCash</option>
        </select>
        <button type="submit">Check Out</button>
    </form>
</body>

<script src="js/students_checkout.js" defer></script>

</html>