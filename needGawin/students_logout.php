<?php
include 'functions.php';

unset($_SESSION['student_number']);
unset($_SESSION['student_name']);

header('Location: index.php');
exit();
?>