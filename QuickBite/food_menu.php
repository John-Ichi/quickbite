<?php
include 'functions.php';
if (!isset($_SESSION["admin_id"])) {
    header("Location: admin_login.php");
    exit();
}

getMenu();
?>
<!DOCTYPE html>
<html>

<head>
    <title>Food Menu</title>
</head>

<body>
    <a href="staffs_dashboard.php">Return</a>
    <h2>Food Menu Management</h2>
    <form action="functions.php" method="POST" enctype="multipart/form-data">
        <input type="text" name="item_code" placeholder="Item Code" required><br><br>
        <input type="text" name="name" placeholder="Food Name" required><br><br>
        <textarea name="description" placeholder="Description"></textarea><br><br>
        <input type="number" step="0.01" name="price" placeholder="Price" required><br><br>
        <input type="number" name="stock" placeholder="Stock" required><br><br>
        <input type="file" name="photo" accept="image/*"><br><br>
        <input type="hidden" name="add_menu" value="true">
        <button type="submit">Add Menu Item</button>
    </form>
    <p></p>

    <h3>Current Menu</h3>
    <table border="1" cellpadding="5" id="menuTable">
        <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
        </tr>
    </table>
</body>

<script>
    fetch("menu.json")
    .then(res => res.json())
    .then(data => {
        data.forEach(menu => {
            const tr = document.createElement("tr");

            Object.values(menu).forEach(value => {
                const td = document.createElement("td");
                td.textContent = value;
                tr.appendChild(td);
            });

            const menuTable = document.getElementById("menuTable");
            menuTable.appendChild(tr);
        });
    });
</script>

</html>