<?php
include 'functions.php';

function logout() {
    unset($_SESSION['store_id']);
    unset($_SESSION['store_email']);
    unset($_SESSION['store_name']);
}

logout();
?>