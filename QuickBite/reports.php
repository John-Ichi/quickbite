<?php
include 'functions.php';
if (!isset($_SESSION["admin_id"])) {
    header("Location: admin_login.php");
    exit();
}

$sales = $conn->query("
  SELECT DATE(created_at) AS order_date, SUM(total_amount) AS daily_total
  FROM orders WHERE status='completed'
  GROUP BY DATE(created_at)
  ORDER BY order_date DESC
");

$best_sellers = $conn->query("
  SELECT f.name, SUM(o.quantity) AS total_sold
  FROM orders o
  JOIN food_menu f ON o.food_id=f.id
  WHERE o.status='completed'
  GROUP BY o.food_id
  ORDER BY total_sold DESC
  LIMIT 5
");
?>
<!DOCTYPE html>
<html>

<head>
    <title>Reports & Analytics</title>
</head>

<body>
    <h2>Sales Reports</h2>
    <h3>Daily Sales</h3>
    <table border="1" cellpadding="5">
        <tr>
            <th>Date</th>
            <th>Total Sales (₱)</th>
        </tr>
        <?php while ($r = $sales->fetch_assoc()): ?>
            <tr>
                <td><?= $r['order_date'] ?></td>
                <td><?= number_format($r['daily_total'], 2) ?></td>
            </tr>
        <?php endwhile; ?>
    </table>

    <h3>Top 5 Best Sellers</h3>
    <table border="1" cellpadding="5">
        <tr>
            <th>Food</th>
            <th>Quantity Sold</th>
        </tr>
        <?php while ($b = $best_sellers->fetch_assoc()): ?>
            <tr>
                <td><?= htmlspecialchars($b['name']) ?></td>
                <td><?= $b['total_sold'] ?></td>
            </tr>
        <?php endwhile; ?>
    </table>
</body>

</html>