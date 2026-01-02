<?php
include 'functions.php';

if (!isset($_SESSION['student_number'])) header('Location: index.php');

if (!isset($_SESSION['check_out'])) header('Location: students_dashboard.php');

$student_number = $_SESSION['student_number'];
$checkout_uniqid = $_SESSION['check_out'];
$chceckout_store_id = $_SESSION['check_out_store'];

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
    
    <h2>Choose Payment Method</h2>

    <form action="functions.php" method="POST" id="checkoutForm">
        <input type="hidden" name="customer_id" value="<?php echo $student_number; ?>">
        <input type="hidden" name="store_id" id="checkoutStoreIdInp" value="<?php echo $chceckout_store_id; ?>">
        <input type="hidden" name="total_sale" id="totalSaleInp">
        <select name="payment_method" required>
            <option value="" selected disabled hidden>Select Payment Method</option>
            <option value="Cash">Cash</option>
            <option value="GCash">GCash</option>
        </select>
        <input type="hidden" name="checkout_order" value="<?php echo $checkout_uniqid; ?>">
        <button type="submit">Check Out</button>
    </form>
</body>

<script src="js/students_checkout.js" defer></script>

</html>