<?php
include 'functions.php';
if (!isset($_SESSION["admin_id"])) {
    header("Location: admin_login.php");
    exit();
}

if (isset($_POST["update_status"])) {
    $id = $_POST["order_id"];
    $status = $_POST["status"];
    $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);
    $stmt->execute();
}

$orders = $conn->query("
  SELECT o.*, f.name AS food_name
  FROM orders o
  JOIN food_menu f ON o.food_id = f.id
  ORDER BY o.created_at DESC
");
?>
<!DOCTYPE html>
<html>

<head>
    <title>Orders</title>
</head>

<body>
    <a href="staffs_dashboard.php">Return</a>
    <h2>Process Orders</h2>
    <table border="1" cellpadding="5">
        <tr>
            <th>ID</th>
            <th>Customer</th>
            <th>Food</th>
            <th>Qty</th>
            <th>Total</th>
            <th>Status</th>
            <th>Action</th>
        </tr>
        <?php while ($o = $orders->fetch_assoc()): ?>
            <tr>
                <td><?= $o['id'] ?></td>
                <td><?= htmlspecialchars($o['customer_name']) ?></td>
                <td><?= htmlspecialchars($o['food_name']) ?></td>
                <td><?= $o['quantity'] ?></td>
                <td><?= number_format($o['total_amount'], 2) ?></td>
                <td><?= $o['status'] ?></td>
                <td>
                    <form method="POST" style="display:inline;">
                        <input type="hidden" name="order_id" value="<?= $o['id'] ?>">
                        <select name="status">
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                        <button type="submit" name="update_status">Update</button>
                    </form>
                </td>
            </tr>
        <?php endwhile; ?>
    </table>
</body>

</html>