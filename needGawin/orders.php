<?php
include 'functions.php';
if (!isset($_SESSION["admin_id"])) {
    header("Location: staffs_login.php");
    exit();
}

if (isset($_POST["update_status"])) {
    $id = $_POST["order_id"];
    $status = $_POST["status"];
    $stmt = $conn->prepare("UPDATE orders SET status = ? WHERE id = ?");
    $stmt->bind_param("si", $status, $id);
    $stmt->execute();
}

// Handle cancel action (quick cancel if customer didn't pick up)
if (isset($_POST["cancel_order"])) {
    $id = $_POST["order_id"];
    $cancelStmt = $conn->prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?");
    $cancelStmt->bind_param("i", $id);
    $cancelStmt->execute();
}

$orders = $conn->query("
  SELECT o.*, f.name AS food_name
  FROM orders o
  JOIN food_menu f ON o.food_id = f.id
  ORDER BY o.created_at DESC
");

// If requested via AJAX, return only the table body rows (for polling updates)
if (isset($_GET['ajax'])) {
    while ($o = $orders->fetch_assoc()) {
        $id = $o['id'];
        $status = htmlspecialchars($o['status']);
        $customer = htmlspecialchars($o['customer_name']);
        $food = htmlspecialchars($o['food_name']);
        $qty = $o['quantity'];
        $total = number_format($o['total_amount'], 2);
        echo "<tr>";
        echo "<td>{$id}</td>";
        echo "<td>{$customer}</td>";
        echo "<td>{$food}</td>";
        echo "<td>{$qty}</td>";
        echo "<td>{$total}</td>";
        echo "<td>{$status}</td>";
        echo "<td>";
        echo "<form method=\"POST\" style=\"display:inline;\">";
        echo "<input type=\"hidden\" name=\"order_id\" value=\"{$id}\">";
        echo "<select name=\"status\">";
        $opts = ['pending','processing','completed','cancelled'];
        foreach ($opts as $opt) {
            $sel = ($opt === $o['status']) ? 'selected' : '';
            echo "<option value=\"{$opt}\" {$sel}>{$opt}</option>";
        }
        echo "</select>";
        echo "<button type=\"submit\" name=\"update_status\">Update</button>";
        echo "</form>";
        echo " <form method=\"POST\" style=\"display:inline; margin-left:6px;\">";
        echo "<input type=\"hidden\" name=\"order_id\" value=\"{$id}\">";
        echo "<button type=\"submit\" name=\"cancel_order\" onclick=\"return confirm('Cancel this order?');\">Cancel</button>";
        echo "</form>";
        echo "</td>";
        echo "</tr>";
    }
    exit();
}
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
        <tbody id="orders-body">
        <?php while ($o = $orders->fetch_assoc()): ?>
            <tr>
                <td><?= $o['id'] ?></td>
                <td><?= htmlspecialchars($o['customer_name']) ?></td>
                <td><?= htmlspecialchars($o['food_name']) ?></td>
                <td><?= $o['quantity'] ?></td>
                <td><?= number_format($o['total_amount'], 2) ?></td>
                <td><?= htmlspecialchars($o['status']) ?></td>
                <td>
                    <form method="POST" style="display:inline;">
                        <input type="hidden" name="order_id" value="<?= $o['id'] ?>">
                        <select name="status">
                            <?php foreach (['pending','processing','completed','cancelled'] as $opt): ?>
                                <option value="<?= $opt ?>" <?= ($o['status'] === $opt) ? 'selected' : '' ?>><?= $opt ?></option>
                            <?php endforeach; ?>
                        </select>
                        <button type="submit" name="update_status">Update</button>
                    </form>
                    <form method="POST" style="display:inline; margin-left:6px;">
                        <input type="hidden" name="order_id" value="<?= $o['id'] ?>">
                        <button type="submit" name="cancel_order" onclick="return confirm('Cancel this order?');">Cancel</button>
                    </form>
                </td>
            </tr>
        <?php endwhile; ?>
        </tbody>
    </table>
    <script>
        (function pollOrders(){
            const interval = 7000; // 7000ms ~ 7s
            async function fetchRows(){
                try{
                    const res = await fetch(window.location.pathname + '?ajax=1');
                    if(!res.ok) return;
                    const html = await res.text();
                    const tbody = document.getElementById('orders-body');
                    if(tbody) tbody.innerHTML = html;
                }catch(e){ /* silent */ }
            }
            fetchRows();
            setInterval(fetchRows, interval);
        })();
    </script>
</body>

</html>