<?php
include 'functions.php';
if (!isset($_SESSION["admin_id"])) {
    header("Location: admin_login.php");
    exit();
}


// Manage stock
// Manage availability
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
        <input type="hidden" name="food_inventory" value="true">
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