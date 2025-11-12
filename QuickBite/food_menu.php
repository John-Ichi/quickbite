<?php
include 'functions.php';
if (!isset($_SESSION["admin_id"])) {
    header("Location: admin_login.php");
    exit();
}

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $name = $_POST["name"];
    $desc = $_POST["description"];
    $price = $_POST["price"];
    $stock = $_POST["stock"];

    // Handle image upload
    $photo = null;
    if (!empty($_FILES["photo"]["name"])) {
        $targetDir = "uploads/foods/";
        if (!is_dir($targetDir))
            mkdir($targetDir, 0777, true);

        $fileName = time() . "_" . basename($_FILES["photo"]["name"]);
        $targetFile = $targetDir . $fileName;
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        // Validate file type
        $allowedTypes = ["jpg", "jpeg", "png"];
        if (in_array($imageFileType, $allowedTypes)) {
            if (move_uploaded_file($_FILES["photo"]["tmp_name"], $targetFile)) {
                $photo = $fileName;
            } else {
                $message = "Error uploading image.";
            }
        } else {
            $message = "Invalid file type. Only JPG and PNG allowed.";
        }
    }

    // Insert data
    $stmt = $conn->prepare("INSERT INTO food_menu (name, description, price, stock, photo) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdis", $name, $desc, $price, $stock, $photo);
    $stmt->execute();
    $message = "Menu item added successfully.";
}

$result = $conn->query("SELECT * FROM food_menu ORDER BY created_at DESC");
?>
<!DOCTYPE html>
<html>

<head>
    <title>Food Menu</title>
</head>

<body>
    <h2>Food Menu Management</h2>
    <form method="POST" enctype="multipart/form-data">
        <input type="text" name="name" placeholder="Food Name" required><br><br>
        <textarea name="description" placeholder="Description"></textarea><br><br>
        <input type="number" step="0.01" name="price" placeholder="Price" required><br><br>
        <input type="number" name="stock" placeholder="Stock" required><br><br>
        <input type="file" name="photo" accept="image/*"><br><br>
        <button type="submit">Add Menu Item</button>
    </form>
    <p><?php echo $message; ?></p>

    <h3>Current Menu</h3>
    <table border="1" cellpadding="5">
        <tr>
            <th>ID</th>
            <th>Photo</th>
            <th>Name</th>
            <th>Price</th>
            <th>Stock</th>
        </tr>
        <?php while ($row = $result->fetch_assoc()): ?>
            <tr>
                <td><?= $row['id'] ?></td>
                <td>
                    <?php if ($row['photo']): ?>
                        <img src="uploads/foods/<?= htmlspecialchars($row['photo']) ?>" width="70" height="70" alt="Food Photo">
                    <?php else: ?>
                        <span>No Image</span>
                    <?php endif; ?>
                </td>
                <td><?= htmlspecialchars($row['name']) ?></td>
                <td><?= number_format($row['price'], 2) ?></td>
                <td><?= $row['stock'] ?></td>
            </tr>
        <?php endwhile; ?>
    </table>
</body>

</html>