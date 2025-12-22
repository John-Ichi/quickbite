<?php
include 'functions.php';

if (!isset($_SESSION['store_id'])) header('Location: store_login.php');

$store_id = $_SESSION['store_id'];

getStoreInventory($store_id);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
</head>
<body>
    <a href="store_index.php">Return</a>
    <p class="message">
        <?php
        if (isset($_COOKIE['inv_import_res'])) echo $_COOKIE['inv_import_res'];
        ?>
    </p>
    <h1>Inventory</h1>
    <h2>Import Inventory</h2>
    <form action="functions.php" method="POST" enctype="multipart/form-data">
        <input type="hidden" name="store_id" value="<?php echo $store_id; ?>">
        <input type="file" name="inventory_excel_list" accept=".xlsx, .xls" required>
        <input type="hidden" name="store_import_inv">
        <button type="submit">Import</button>
    </form>
    <form action="functions.php" method="POST" id="inventoryForm">

        <input type="text" name="store_id" value="<?php echo $store_id?>">

        <input type="text" name="menu_id" id="itemIdInp">

        <table border="1" cellpadding="5" id="inventoryTable"></table>

        <input type="text" name="old_quantity" id="quantityInp"> <!-- For updating price -->

        <input type="text" name="old_price" id="priceInp"> <!-- For updating quantity -->

        <button type="submit" style="display: none;">Submit</button>

    </form>
</body>

<script>
    window.addEventListener("load", () => {
        document.cookie = "inv_import_res=; expires=Thu, 01 Jan 1970 00:00:00 UTC";
    });
</script>

<script src="js/store_inventory.js" defer></script>

</html>