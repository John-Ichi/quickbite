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
        <?php if (isset($_COOKIE['inv_import_res'])) echo $_COOKIE['inv_import_res']; ?>
    </p>
    <h1>Inventory</h1>
    <h2>Add individual Inventory Item</h2>
    
    <form action="functions.php" method="POST" autocomplete="off">

        <input type="hidden" name="store_id" value="<?php echo $store_id; ?>">
        
        <input type="text" name="item_name" placeholder="Item Name" required>
        
        <input type="text" name="item_supplier" placeholder="Supplier" required>
        
        <select name="category" required>

            <option value="" selected disabled hidden>Select Category</option>

            <option value="Shelf-Stable">Shelf-Stable</option>

            <option value="Refrigerated">Refrigerated</option>

            <option value="Frozen">Frozen</option>

        </select>
        
        <input type="text" name="unit" placeholder="Unit" required>

        <input type="number" step="1" min="1" name="quantity" placeholder="Quantity Per Unit" required>
        
        <input type="date" name="date_stocked" required>
        
        <!--    Time Input    -->
        <input type="number" step="1" min="0" max="23" name="time_hours" placeholder="HH" required>
        :
        <input type="number" step="1" min="0" max="59" name="time_minutes" placeholder="MM" required>
        :
        <input type="number" step="1" min="0" max="59" name="time_seconds" placeholder="SS" required>

        <input type="number" step="0.01" min="0.01" name="price" placeholder="Price Per Unit" required>
        
        <select name="restock" required>

            <option value="" selected disabled hidden>Need Restock</option>

            <option value="0">No</option>

            <option value="1">Yes</option>

        </select>
        
        <input type="text" name="remarks" placeholder="Remarks">

        <input type="hidden" name="add_inventory_item">

        <button type="submit">Add Inventory Item</button>
    </form>
    
        <h2>Import Inventory</h2>
    
    <form action="functions.php" method="POST" enctype="multipart/form-data">
        <input type="hidden" name="store_id" value="<?php echo $store_id; ?>">
        <input type="file" name="inventory_excel_list" accept=".xlsx, .xls" required>
        <input type="hidden" name="store_import_inv">
        <button type="submit">Import</button>
    </form>
        
    <form action="functions.php" method="POST" id="inventoryForm">

        <input type="text" name="store_id" value="<?php echo $store_id?>" style="display: none;">

        <input type="text" name="menu_id" id="itemIdInp" style="display: none;"> <!--    menu_id === item_id    -->

        <table border="1" cellpadding="5" id="inventoryTable"></table>

        <input type="text" name="old_quantity" id="oldQuantityInp" style="display: none;">

        <input type="text" name="old_datetime" id="oldDatetimeInp" style="display: none;">

        <input type="text" name="upd_inv_item_quan" id="newQuantityInp" style="display: none;">

        <input type="text" name="upd_price_per_unit" id="newPriceInp" style="display: none;">

        <input type="text" name="total_price" id="totalPriceInp" style="display: none;">

        <input type="text" name="need_restock" id="needRestockInp" style="display: none;">

        <textarea name="remarks" id="remarksInp" style="display: none;"></textarea>

        <input type="text" name="delete_inv_item" id="itemDeleteInp" style="display: none;">

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