<?php
include 'functions.php';

unset($_SESSION['admin_id']);
unset($_SESSION['admin_name']);
unset($_SESSION['admin_email']);

header("Location: staffs_login.php");
exit();
?>