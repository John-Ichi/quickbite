<?php
include 'functions.php';
if (!isset($_SESSION['student_number'])) {
    header('Location: index.php');
    exit();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
</head>
<body>
    <h2>Hello World!</h2>
    <ul>
        <li><a href="students_logout.php">Logout</a></li>
    </ul>
</body>
</html>