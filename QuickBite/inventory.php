<?php
include 'functions.php';
if (!isset($_SESSION["admin_id"])) {
    header("Location: admin_login.php");
    exit();
}

$message = "";
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $food_id = $_POST["food_id"];
    $action = $_POST["action"];
    $qty = $_POST["quantity"];
    $remarks = $_POST["remarks"];

    if ($action === "add_stock")
        $conn->query("UPDATE food_menu SET stock = stock + $qty WHERE id = $food_id");
    else
        $conn->query("UPDATE food_menu SET stock = GREATEST(stock - $qty, 0) WHERE id = $food_id");

    $stmt = $conn->prepare("INSERT INTO inventory_logs (food_id, action, quantity, remarks) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isis", $food_id, $action, $qty, $remarks);
    $stmt->execute();

    $message = "Inventory updated successfully.";
}

$foods = $conn->query("SELECT * FROM food_menu");
$logs = $conn->query("
  SELECT l.*, f.name AS food_name
  FROM inventory_logs l
  JOIN food_menu f ON l.food_id = f.id
  ORDER BY l.created_at DESC
");
?>
<!DOCTYPE html>
<html>

<head>
    <title>Inventory</title>
</head>

<body>
    <h2>Inventory Management</h2>
    <form method="POST">
        <select name="food_id" required>
            <?php while ($f = $foods->fetch_assoc()): ?>
                <option value="<?= $f['id'] ?>"><?= htmlspecialchars($f['name']) ?></option>
            <?php endwhile; ?>
        </select>
        <select name="action" required>
            <option value="add_stock">Add</option>
            <option value="reduce_stock">Reduce</option>
        </select>
        <input type="number" name="quantity" placeholder="Quantity" required>
        <input type="text" name="remarks" placeholder="Remarks">
        <button type="submit">Submit</button>
    </form>
    <p><?= $message ?></p>

    <h3>Inventory Logs</h3>
    <table border="1" cellpadding="5">
        <tr>
            <th>ID</th>
            <th>Food</th>
            <th>Action</th>
            <th>Qty</th>
            <th>Remarks</th>
            <th>Date</th>
        </tr>
        <?php while ($l = $logs->fetch_assoc()): ?>
            <tr>
                <td><?= $l['id'] ?></td>
                <td><?= htmlspecialchars($l['food_name']) ?></td>
                <td><?= $l['action'] ?></td>
                <td><?= $l['quantity'] ?></td>
                <td><?= htmlspecialchars($l['remarks']) ?></td>
                <td><?= $l['created_at'] ?></td>
            </tr>
        <?php endwhile; ?>
    </table>
</body>

</html>