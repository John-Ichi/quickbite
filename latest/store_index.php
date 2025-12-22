<?php
include 'functions.php';

if (!isset($_SESSION['store_id'])) header('Location: store_login.php');

$store_id = $_SESSION['store_id'];

getStoreInfo($store_id);
getMenu($store_id);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
    <style>
        .modal {
            display: none;
            position: fixed;
            z-index: 1;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgb(0,0,0);
            background-color: rgba(0,0,0,0.4);
        }

        .modal-content {
            background-color: #fefefe;
            margin: 15% auto;
            padding: 20px;
            border: 1px solid #888;
            width: 80%;
        }

        .close {
            color: #aaa;
            float: right;
            font-size: 28px;
            font-weight: bold;
        }

        .close:hover,
        .close:focus {
            color: black;
            text-decoration: none;
            cursor: pointer;
        }

        img {
            height: 10%;
            width: 10%;
        }
    </style>
</head>
<body>
    <a href="" id="logOut">Log out</a>
    <h1>Home, Manage Food Menu</h1>
    <ul>
        <li><a href="store_profile.php">Profile</a></li>
        <li><a href="">Manage Food Menu</a></li>
        <li><a href="">Process Orders</a></li>
        <li><a href="store_inventory.php">Inventory Management</a></li>
        <li><a href="">Reports & Analytics</a></li>
        <li><a href="registration.php">Register Users</a></li>
    </ul>
    <div>
        <form action="functions.php" method="POST" enctype="multipart/form-data" autocomplete="off">
            <input type="text" name="name" placeholder="Food Name" required>
            <textarea name="description" placeholder="Description"></textarea>
            <input type="number" name="price" step="0.01" placeholder="Price" required>
            <input type="number" name="stock" placeholder="Initial Stock" required>
            <input type="file" name="photo" accept="image/*">
            <input type="hidden" name="store_id" value="<?php echo $store_id; ?>">
            <input type="hidden" name="add_menu" value="true">
            <button type="submit">Add Menu Item</button>
        </form>
        <table border="1" cellpadding="5" id="menuTable"></table>
    </div>

    <div id="editMenuItemModal" class="modal">
        <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Edit Menu Information</h3>
        <form action="functions.php" method="POST" enctype="multipart/form-data" autocomplete="off">
            <input type="hidden" name="id" id="menuItemId">
            <input type="text" name="name" id="editNameInp" required>
            <textarea name="description" id="editDescInp" required></textarea>
            <input type="number" name="price" id="editPriceInp"  step="0.01" required>
            <input type="number" name="stock" id="editStockInp" required>
            <input type="file" name="photo" accept="image/*">
            <input type="hidden" name="update_menu_item">
            <button type="submit">Change</button>
        </form>
        </div>
    </div>

    <form action="functions.php" method="POST" id="deleteMenu" style="display: none;">
        <input type="text" name="store_id" value="<?php echo $store_id; ?>">
        <input type="text" name="menu_id" id="menuIdInp">
        <input type="text" name="delete_menu_item">
    </form>
</body>

<script src="js/store_index.js"></script>

</html>