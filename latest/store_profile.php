<?php
include 'functions.php';

if (!isset($_SESSION['store_id'])) header('Location: store_login.php');

getStoreInfo($_SESSION['store_id']);
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
            <input type="file" name="store_photo" accept="image/*">
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
            <textarea name="store_description" id="storeDescInp"></textarea>
            <input type="hidden" name="edit_store_description">
            <button type="submit">Save</button>
        </form>
        </div>
    </div>
</body>

<script>
    const changeStorePhotoModal = document.getElementById("changeStorePhotoModal");
    const changePhotoBtn = document.getElementById("changePhotoBtn");
    changePhotoBtn.addEventListener("click", () => {
        changeStorePhotoModal.style.display = "block";
    });

    const photoModalCloseBtn = changeStorePhotoModal.querySelector(".close");
    photoModalCloseBtn.addEventListener("click", () => {
        changeStorePhotoModal.style.display = "none";
    });

    const editDescModal = document.getElementById("editDescModal");
    const editDescBtn = document.getElementById("editDescBtn");
    editDescBtn.addEventListener("click", () => {
        editDescModal.style.display = "block";
    });

    const descModalCloseBtn = editDescModal.querySelector(".close");
    descModalCloseBtn.addEventListener("click", () => {
        editDescModal.style.display = "none";
    });

    editDescModal.addEventListener("submit", (e) => {
        e.preventDefault();
        // Asynchronous update
    });

    fetch("store_info.json")
    .then(res => res.json())
    .then(data => {
        renderStoreInformation(data);
    });

    function renderStoreInformation(info) {
        info.forEach(data => {
            if (data.store_name) {
                document.getElementById("storeName").textContent = data.store_name;
            }

            if (data.store_description) {
                const description = data.store_description;
                document.getElementById("storeDesc").textContent = description;
                document.getElementById("storeDescInp").value = description;
            }

            if (data.store_photo) {
                document.getElementById("storePhoto").src = data.store_photo;
            }
        });
    }
</script>

</html>