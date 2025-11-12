<?php
function connect() {
    $host = 'localhost';
    $user = 'root';
    $pass = '';
    $db = 'quickbite';

    $conn = new mysqli($host, $user, $pass, $db);
    if ($conn->connect_error) die('Database connection failed: ' . $conn->connect_error);
    else return $conn;
}

$conn = connect();
session_start();

function registrationResult($message) {
    setcookie('staff_reg_res', $message);
    header('Location: staffs_register.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['staff_registration'])) { // Staff registration
    $name = trim($_POST["name"]);
    $email = trim($_POST["email"]);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);

    if ($password !== $confirm_password) {
        registrationResult('Error: Password does not match.');
    }

    $hashed_password = password_hash($password, PASSWORD_DEFAULT);

    $register_staff = $conn->prepare("INSERT INTO staffs (name, email, password) VALUES (?, ?, ?)");
    $register_staff->bind_param('sss', $name, $email, $hashed_password);

    try {
        if ($register_staff->execute()) {
            registrationResult('Staff registration successful.');
        }
    } catch(mysqli_sql_exception $e) {
        if ($e->getCode() === 1062) {
            registrationResult('Error: Email already exists.');
        } else {
            registrationResult('Database error: ' . $e->getMessage());
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['staff_login'])) { // Staff login
    $email = trim($_POST["email"]);
    $password = trim($_POST['password']);

    $get_email = $conn->prepare("SELECT * FROM staffs WHERE email = ?");
    $get_email->bind_param("s", $email);
    $get_email->execute();
    
    $result = $get_email->get_result();
    $admin = $result->fetch_assoc();
    
    if ($admin && password_verify($password, $admin["password"])) {
        $_SESSION['admin_id'] = $admin['id'];
        $_SESSION['admin_name'] = $admin['name'];
        $_SESSION['admin_email'] = $email;
        header('Location: staffs_dashboard.php');
        exit();
    } else {
        setcookie('staff_login_res', 'Error: Invalide credentials.');
        header('Location: staffs_login.php');
        exit();
    }
}
?>