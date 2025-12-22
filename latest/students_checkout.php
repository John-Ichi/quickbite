<?php
include 'functions.php';

if (!isset($_SESSION['student_number'])) header('Location: index.php');

if (!isset($_SESSION['check_out'])) header('Location: students_dashboard.php');
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QuickBite</title>
</head>
<body>
    Hello, World!
</body>

</html>