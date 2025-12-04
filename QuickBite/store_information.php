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
</head>
<body>
    <form action="functions.php" method="POST" enctype="multipart/form-data" autocomplete="off">
        <input type="hidden" name="store_id" value="<?php echo $_SESSION['store_id']; ?>">
        <input type="text" name="store_name" value="<?php echo $_SESSION['store_name']; ?>" readonly>
        <textarea name="store_desc" placeholder="Provide a short description for your store..." required></textarea>
        <input type="file" name="store_photo" accept="image/*">
        <input type="hidden" name="store_info_inp">
        <button type="submit">Submit</button>
    </form>
</body>
</html>