<?php
include 'functions.php';

if (!isset($_SESSION['store_id'])) header('Location: store_login.php');

$store_id = $_SESSION['store_id'];

getStoreInfo();
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
    <input type="hidden" id="storeIdInp" value="<?php echo $store_id; ?>">

    <a href="store_index.php">Return</a>
    
    <div>
        <img alt="store_profile_picture" id="storePhoto">
        <button id="changePhotoBtn">Change profile picture</button>
        <h2 id="storeName"></h2>
        <p id="storeDesc"></p>
        <button id="editDescBtn">Edit store description</button>
    </div>

    <div id="changeStorePhotoModal" class="modal">
        <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Change profile picture</h3>
        <form action="functions.php" method="POST" enctype="multipart/form-data" autocomplete="off">
            <input type="hidden" name="store_id" value="<?php echo $store_id; ?>">
            <input type="file" name="store_photo" accept="image/*" required>
            <input type="hidden" name="change_store_photo">
            <button type="submit">Change</button>
        </form>
        </div>
    </div>
    
    <div id="editDescModal" class="modal">
        <div class="modal-content">
        <span class="close">&times;</span>
        <h3>Edit store description</h3>
        <form action="functions.php" method="POST" autocomplete="off">
            <input type="hidden" name="store_id" value="<?php echo $store_id; ?>">
            <textarea name="store_description" id="storeDescInp"></textarea>
            <input type="hidden" name="edit_store_description">
            <button type="submit">Save</button>
        </form>
        </div>
    </div>
</body>

<script src="js/store_profile.js" defer></script>

</html>