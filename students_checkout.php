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
    <link rel="stylesheet" href="css/students_dashboard.css">
</head>
<body>
    <div class="app" style="max-width:720px;margin:40px auto;grid-template-columns:1fr">
        <header class="header">
            <div class="brand">
                <div class="logo">QB</div>
                <div>
                    <div style="font-weight:700">Order Checkout</div>
                </div>
            </div>
        </header>

        <main class="stores-panel">
            <a href="#" id="returnToDashboard" style="display:inline-block;margin-bottom:12px;color:var(--muted);text-decoration:none">← Back</a>
            <h2>Order Summary</h2>
            <div id="orderSummaryDiv"></div>

            <h3>Choose Payment Method</h3>
            <form action="functions.php" method="POST" id="checkoutForm">
                <input type="hidden" name="customer_id" value="<?php echo $student_number; ?>">
                <input type="hidden" name="store_id" id="checkoutStoreIdInp" value="<?php echo $chceckout_store_id; ?>">
                <input type="hidden" name="total_sale" id="totalSaleInp">
                <div style="margin-top:10px">
                    <select name="payment_method" required style="padding:10px;border-radius:8px;width:100%">
                        <option value="" selected disabled hidden>Select Payment Method</option>
                        <option value="Cash">Cash</option>
                        <option value="GCash">GCash</option>
                    </select>
                </div>
                <input type="hidden" name="checkout_order" value="<?php echo $checkout_uniqid; ?>">
                <div style="margin-top:12px;text-align:right"><button class="btn" type="submit">Check Out</button></div>
            </form>
        </main>
    </div>

    <script src="js/students_checkout.js" defer></script>

</body>

</html>