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

function registrationResult($message) { // Helper function
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

function getMenu() { // Helper function
    $conn = connect();

    $sql =
        "SELECT *
        FROM food_menu";
    if ($rs = $conn->query($sql)) {
        while ($menu_item = $rs->fetch_assoc()) {
            $menu[] = $menu_item;
        }

        $output = json_encode($menu, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);

        if ($output !== null) {
            file_put_contents('menu.json', $output);
        }
    }
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['add_menu'])) { // Post menu item
    $code = $_POST['item_code'];
    $name = $_POST["name"];
    $desc = $_POST["description"];
    $price = $_POST["price"];
    $stock = $_POST["stock"];

    // Handle image upload
    $photo = null;
    if (!empty($_FILES["photo"]["name"])) {
        $targetDir = "uploads/foods/";
        if (!is_dir($targetDir))
            mkdir($targetDir, 0777, true);

        $fileName = time() . "_" . basename($_FILES["photo"]["name"]);
        $targetFile = $targetDir . $fileName;
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        // Validate file type
        $allowedTypes = ["jpg", "jpeg", "png"];
        if (in_array($imageFileType, $allowedTypes)) {
            if (move_uploaded_file($_FILES["photo"]["tmp_name"], $targetFile)) {
                $photo = $fileName;
            } else {
                $message = "Error uploading image.";
            }
        } else {
            $message = "Invalid file type. Only JPG and PNG allowed.";
        }
    }

    // Insert data
    $stmt = $conn->prepare("INSERT INTO food_menu (code, name, description, price, stock, photo) VALUES (?,?, ?, ?, ?, ?)");
    $stmt->bind_param("sssdis", $code, $name, $desc, $price, $stock, $photo);
    
    if ($stmt->execute()) {
        header('Location: food_menu.php');
    } else {
        header('Location: food_menu.php');
    }
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['food_inventory'])) {
    $food_id = $_POST["food_id"];
    $action = $_POST["action"];
    $qty = $_POST["quantity"];
    $remarks = $_POST["remarks"];

    if ($action === "add_stock")
        $conn->query("UPDATE food_menu SET stock = stock + $qty WHERE id = $food_id");
    else
        $conn->query("UPDATE food_menu SET stock = GREATEST(stock - $qty, 0) WHERE id = $food_id");

    $stmt = $conn->prepare("INSERT INTO inventory_logs (food_id, action, quantity, remarks) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isis", $food_id, $action, $qty, $remarks);
    $stmt->execute();

    if ($stmt->execute()){
        header('Location: inventory.php');
    } else {
          header('Location: inventory.php');
    }
}

function staffUserRegistrationResult($message) { // Helper function
    setcookie('staff_user_reg_res', $message);
    header('Location: registration.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['staff_user_registration'])) { // Register individual user
    $student_number = $_POST['student_number'];
    $name = $_POST['name'];

    $sql =
        "INSERT INTO registered_users
        (student_number, name)
        VALUES
        (?,?)";
    $register_user = $conn->prepare($sql);
    $register_user->bind_param('ss',$student_number,$name);

    try {
        if ($register_user->execute()) {
            staffUserRegistrationResult('User registered successfully.');
        }
    } catch(mysqli_sql_exception $e) {
        staffUserRegistrationResult($e->getMessage());
    }
}

require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['staff_import_users'])) { // Import excel sheet list
    if (isset($_FILES['user_list_excel']) && $_FILES['user_list_excel']['error'] == 0) {
        $fileTempPath = $_FILES['user_list_excel']['tmp_name'];
        
        try {
            $spreadsheet = IOFactory::load($fileTempPath);
            $sheet = $spreadsheet->getActiveSheet();
            $data = $sheet->toArray();

            $sql =
                "INSERT INTO registered_users
                (student_number, name)
                VALUES
                (?,?)";
            $import_users = $conn->prepare($sql);

            $count = 0;
            for ($i = 1; $i < count($data); $i++) {
                $row = $data[$i];

                $student_number = $row[0];
                $name = $row[1];

                if (!empty($student_number) && !empty($name)) {
                    $import_users->bind_param('ss',$student_number,$name);
                    $import_users->execute();
                    $count++;
                }
            }

            staffUserRegistrationResult('Imported ' . $count . ' users.');
        } catch(mysqli_sql_exception $e) {
            staffUserRegistrationResult($e->getMessage());
        }
    } else {
        staffUserRegistrationResult('Invalid file.');
    }
}

// Student functions

function studentLoginErr($message) {
    setcookie('stud_login_err', $message);
    header('Location: index.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['student_registration'])) {
    // Code
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['student_login'])) {
    $student_number = $_POST['student_number'];
    $password = $_POST['password'];

    try {
        $sql =
            "SELECT *
            FROM user_login_info
            WHERE student_number='$student_number'";
        $rs = $conn->query($sql);

        if ($rs->num_rows === 0) {
            studentLoginErr('Account does not exist.');
        }

        $info = $rs->fetch_assoc();

        if (!password_verify($password, $info['password'])) {
            studentLoginErr('Wrong password.');
        }
        
        // End result
    } catch(mysqli_sql_exception $e) {
        studentLoginErr('Login Error.');
    }
}

?>