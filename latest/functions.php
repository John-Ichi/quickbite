<?php
date_default_timezone_set("Asia/Manila");

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

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['store_registration'])) { // Store registration
    $store_name = trim($_POST['store_name']);
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);

    if ($password !== $confirm_password) {
        setcookie('store_reg_pass_err', 'Error: Passwords do not match.');
        header('Location: store_register.php');
        exit();
    }

    $hashed_password = password_hash($password,PASSWORD_DEFAULT);

    $sql =
        "INSERT INTO stores
        (email, store_name, password)
        VALUES
        (?,?,?)";
    $register_store = $conn->prepare($sql);
    $register_store->bind_param('sss',$email,$store_name,$hashed_password);

    try {
        if ($register_store->execute()) {
            setcookie('store_reg_success','Store registered successfully.');
            header('Location: store_login.php');
            exit();
        }
    } catch (mysqli_sql_exception $e) {
        if ($e->getCode() === 1062) {
            $error_msg = $e->getMessage();

            if (strpos($error_msg,"for key 'email'")) {
                setcookie('store_reg_email_err',$email);
            }


            if (strpos($error_msg,"for key 'email_2'")) {
                setcookie('store_reg_email_err',$email);
            }

            if (strpos($error_msg,"for key 'store_name'")) {
                setcookie('store_reg_name_err',$store_name);
            }

            header('Location: store_register.php');
            exit();
        } else {
            setcookie('store_reg_err', 'Database error: ' . $e->getMessage());
            header('Location: store_register.php');
            exit();
        }
    }
}

function storeLoginErr($message) {
    setcookie('store_login_err', $message);
    header('Location: store_login.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['store_login'])) { // Store login
    $email = trim($_POST['email']);
    $password = trim($_POST['password']);

    $sql =
        "SELECT id, email, store_name, password
        FROM stores
        WHERE email=?";
    $get_store = $conn->prepare($sql);
    $get_store->bind_param('s',$email);

    try {
        $get_store->execute();
        $rs = $get_store->get_result();

        if ($rs->num_rows === 0) storeLoginErr('Error: Account does not exist.');
        
        $info = $rs->fetch_assoc();

        if (!password_verify($password,$info['password'])) storeLoginErr('Error: Wrong password.');

        $_SESSION['store_id'] = $info['id'];
        $_SESSION['store_email'] = $info['email'];
        $_SESSION['store_name'] = $info['store_name'];

        header('Location: store_index.php');
        exit();
    } catch (mysqli_sql_exception $e) {
        storeLoginErr('Database error: ' . $e->getMessage());
    }
}
function getStoreInfo($store_id) {
    $conn = connect();

    $sql =
        "SELECT *
        FROM store_info
        WHERE store_id=?";
    $get_store_info = $conn->prepare($sql);
    $get_store_info->bind_param('s',$store_id);
    $get_store_info->execute();

    $rs = $get_store_info->get_result();

    $page = basename($_SERVER['PHP_SELF']);

    if ($rs->num_rows === 0) {
        $output = json_encode(null);

        if ($page !== 'store_information.php') {
            header('Location: store_information.php');
            exit();
        }
    } else {
        if ($page === 'store_information.php') {
            header('Location: store_index.php');
            exit();
        }

        while ($data = $rs->fetch_assoc()) {
            $info[] = $data;
        }
        $output = json_encode($info, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
    file_put_contents('store_info.json',$output);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['store_info_inp'])) { // Store information
    $store_id = trim($_POST['store_id']);
    $store_name = trim($_POST['store_name']);
    $store_desc = trim($_POST['store_desc']);

    $upload_dir = 'uploads/store_profile/';
    $allowed_file_extensions = array('jpg','jpeg','png');
    $allowed_MIME_types = array('image/jpeg','image/png');

    $photo = null;
    if (!empty($_FILES['store_photo']['name'])) {
        if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

        $image_name = time() . '_' . basename($_FILES['store_photo']['name']);
        $image_type = $_FILES['store_photo']['type'];
        $image_error = $_FILES['store_photo']['error'];
        $image_file_extension = pathinfo($image_name, PATHINFO_EXTENSION);

        // Check for errors
        if ($image_error !== 0) menuUploadRes('Error uploading photo.');

        // Validate file type
        if (!in_array($image_file_extension, $allowed_file_extensions) || !in_array($image_type, $allowed_MIME_types)) menuUploadRes('Invalid file type.');

        $new_file_name = uniqid('img_', true) . '.' . $image_file_extension;
        $photo = $upload_dir . $new_file_name;

        move_uploaded_file($_FILES['store_photo']['tmp_name'], $photo);
    }

    $sql = "INSERT INTO store_info (store_id,store_name,store_description,store_photo) VALUES (?,?,?,?)";
    $upload_info = $conn->prepare($sql);
    $upload_info->bind_param('ssss',$store_id,$store_name,$store_desc,$photo);

    try {
        if ($upload_info->execute()) {
            header('Location: store_index.php');
            exit();
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('info_upl_err', 'Database error: ' . $e->getMessage());
        header('store_information.php');
        exit();
    }
}

function getMenu($store_id) { // Helper function
    $conn = connect();

    $sql =
        "SELECT id, name, description, price, stock, photo
        FROM food_menu
        WHERE store_id=?
        ORDER BY id DESC";
    $get_menu = $conn->prepare($sql);
    $get_menu->bind_param('s',$store_id);

    try {
        if ($get_menu->execute()) {
            $rs = $get_menu->get_result();

            if ($rs->num_rows === 0) {
                $output = json_encode(null);
            } else {
                while ($menu_item = $rs->fetch_assoc()) {
                    $menu[] = $menu_item;
                }
                $output = json_encode($menu, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }
            file_put_contents('menu.json',$output);
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('get_menu_err','Database error: ' . $e->getMessage());
    }
}

function menuUploadRes($message) { // Helper function
    setcookie('menu_upl_res', $message);
    header('Location: store_index.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_menu'])) { // Post menu item (store)
    $name = trim($_POST['name']);
    $desc = trim($_POST['description']);
    $price = trim($_POST['price']);
    $stock = trim($_POST['stock']);
    $store_id = trim($_POST['store_id']);

    $upload_dir = 'uploads/foods/';
    $allowed_file_extensions = array('jpg','jpeg','png');
    $allowed_MIME_types = array('image/jpeg','image/png');

    // Handle image upload
    $photo = null;
    if (!empty($_FILES['photo']['name'])) {
        if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

        $image_name = time() . '_' . basename($_FILES['photo']['name']);
        $image_type = $_FILES['photo']['type'];
        $image_error = $_FILES['photo']['error'];
        $image_file_extension = pathinfo($image_name, PATHINFO_EXTENSION);

        // Check for errors
        if ($image_error !== 0) menuUploadRes('Error uploading photo.');

        // Validate file type
        if (!in_array($image_file_extension, $allowed_file_extensions) || !in_array($image_type, $allowed_MIME_types)) menuUploadRes('Invalid file type.');

        $new_file_name = uniqid('img_', true) . '.' . $image_file_extension;
        $photo = $upload_dir . $new_file_name;

        move_uploaded_file($_FILES['photo']['tmp_name'], $photo);
    }

    // Insert data
    $sql =
        "INSERT INTO food_menu
        (name,description,price,stock,photo,store_id)
        VALUES
        (?,?,?,?,?,?)";
    $upload_menu = $conn->prepare($sql);
    $upload_menu->bind_param('ssdiss',$name,$desc,$price,$stock,$photo,$store_id);
    
    try {
        if ($upload_menu->execute()) {
            menuUploadRes('Menu uploaded successfully.');
        }
    } catch (mysqli_sql_exception $e) {
        menuUploadRes('Database error: ' . $e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_menu_item'])) { // Update menu item
    $id = trim($_POST['id']);
    $new_name = trim($_POST['name']);
    $new_desc = trim($_POST['description']);
    $new_price = trim($_POST['price']);
    $updated_stock = trim($_POST['stock']);
    $current_timestamp = date('Y-m-d H:i:s');

    $upload_dir = 'uploads/foods/';
    $allowed_file_extensions = array('jpg','jpeg','png');
    $allowed_MIME_types = array('image/jpeg','image/png');

    $new_photo = null;
    if (!empty($_FILES['photo']['name'])) {
        $get_old_photo = $conn->prepare("SELECT photo FROM food_menu WHERE id=?");
        $get_old_photo->bind_param('s',$id);
        $get_old_photo->execute();
        $get_old_photo->bind_result($old_photo);
        $get_old_photo->fetch();
        $get_old_photo->close();

        if (!empty($old_photo) && file_exists($old_photo)) {
            unlink($old_photo);
        }

        if (!is_dir($upload_dir)) mkdir($upload_dir, 0755, true);

        $image_name = time() . '_' . basename($_FILES['photo']['name']);
        $image_type = $_FILES['photo']['type'];
        $image_error = $_FILES['photo']['error'];
        $image_file_extension = pathinfo($image_name, PATHINFO_EXTENSION);   
        
        // Check for errors
        if ($image_error !== 0) setcookie('update_menu_item_err','Error uploading photo.');

        // Validate file type
        if (!in_array($image_file_extension, $allowed_file_extensions) || !in_array($image_type, $allowed_MIME_types)) setcookie('update_menu_item_err','Invalid file type.');

        $new_file_name = uniqid('img_', true) . '.' . $image_file_extension;
        $new_photo = $upload_dir . $new_file_name;

        move_uploaded_file($_FILES['photo']['tmp_name'], $new_photo);   
    }

    if ($new_photo === null) {
        $sql =
            "UPDATE food_menu
            SET name=?,description=?,price=?,stock=?,last_updated=?
            WHERE id=?";
        $update_menu_item = $conn->prepare($sql);
        $update_menu_item->bind_param('ssdiss',$new_name,$new_desc,$new_price,$updated_stock,$current_timestamp,$id);

        try {
            if ($update_menu_item->execute()) {
                getMenu($_SESSION['store_id']);
            }
        } catch (mysqli_sql_exception $e) {
            setcookie('update_menu_item_err',$e->getMessage());
        }
    } else if ($new_photo !== null) {
        $sql =
            "UPDATE food_menu
            SET name=?,description=?,price=?,stock=?,last_updated=?,photo=?
            WHERE id=?";
        $update_menu_item = $conn->prepare($sql);
        $update_menu_item->bind_param('ssdisss',$new_name,$new_desc,$new_price,$updated_stock,$current_timestamp,$new_photo,$id);

        try {
            if ($update_menu_item->execute()) {
                getMenu($_SESSION['store_id']);
            }
        } catch (mysqli_sql_exception $e) {
            setcookie('update_menu_item_err',$e->getMessage());
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_menu_item'])) { // Delete menu item
    $store_id = trim($_POST['store_id']);
    $menu_id = trim($_POST['menu_id']);

    $sql = "DELETE FROM food_menu WHERE id=? AND store_id=?";
    $delete_menu_item = $conn->prepare($sql);
    $delete_menu_item->bind_param('ss',$menu_id,$store_id);

    try {
        if ($delete_menu_item->execute()) {
            getMenu($store_id);
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('delete_menu_item_err','Database error: ' . $e->getMessage());
    }
}

if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_POST['food_inventory'])) { // (check)
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

function getRegisteredUsers() { // Get registered users
    $conn = connect();

    $sql = "SELECT student_number, name FROM registered_users";
    $rs = $conn->query($sql);

    if ($rs->num_rows === 0) {
        $output = json_encode(null);
    } else {
        while ($user = $rs->fetch_assoc()) {
            $users[] = $user;
        }
        $output = json_encode($users, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    }
    file_put_contents('registered_users.json', $output);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['staff_user_registration'])) { // Register individual user
    $student_number = trim($_POST['student_number']);
    $name = trim($_POST['name']);

    $sql = "INSERT INTO registered_users (student_number, name) VALUES (?,?)";
    $register_user = $conn->prepare($sql);
    $register_user->bind_param('ss',$student_number,$name);

    try {
        if ($register_user->execute()) {
            staffUserRegistrationResult('User registered successfully.');
        }
    } catch (mysqli_sql_exception $e) {
        if ($e->getCode() === 1062) {
            staffUserRegistrationResult('Error: User already exists.');
        } else {
            staffUserRegistrationResult('Database error: ' . $e->getMessage());
        }
    }
}

require 'vendor/autoload.php';

use PhpOffice\PhpSpreadsheet\IOFactory;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['staff_import_users'])) { // Import excel sheet list of registered students
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
        } catch (mysqli_sql_exception $e) {
            staffUserRegistrationResult($e->getMessage());
        }
    } else {
        staffUserRegistrationResult('Invalid file.');
    }
}

function getStoreInventory($store_id) {
    $conn = connect();

    $sql = "SELECT * FROM inventory WHERE store_id=?";
    $get_inventory = $conn->prepare($sql);
    $get_inventory->bind_param('s',$store_id);

    try {
        if ($get_inventory->execute()) {
            $rs = $get_inventory->get_result();

            if ($rs->num_rows === 0) {
                $output = json_encode(null);
            } else {
                while ($inventory_item = $rs->fetch_assoc()) {
                    $inventory[] = $inventory_item;
                }
                $output = json_encode($inventory, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }
            file_put_contents('inventory.json',$output);
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('get_menu_err','Database error: ' . $e->getMessage());
    }
}

function storeImportInventoryResult($message) {
    setcookie('inv_import_res',$message);
    header('Location: store_inventory.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['store_import_inv'])) { // Import excel sheet list of store inventory
    $store_id = trim($_POST['store_id']);

    if (isset($_FILES['inventory_excel_list']) && $_FILES['inventory_excel_list']['error'] == 0) {
        $fileTempPath = $_FILES['inventory_excel_list']['tmp_name'];

        try {
            $spreadsheet = IOFactory::load($fileTempPath);
            $sheet = $spreadsheet->getActiveSheet();
            $data = $sheet->toArray();

            $sql =
                "INSERT INTO inventory
                (store_id,item_name,supplier,category,unit,quantity_per_unit,last_restocked,price_per_unit,total_price,need_restock,remarks)
                VALUES
                (?,?,?,?,?,?,?,?,?,?,?)";
            $import_inv = $conn->prepare($sql);

            $count = 0;
            for ($i = 1; $i < count($data); $i++) {
                $row = $data[$i];

                $item_name = trim($row[0]);
                $supplier = trim($row[1]);
                $category = trim($row[2]);
                $unit = trim($row[3]);
                $qty_per_unit = trim($row[4]);
                $timestamp = strtotime(str_replace('/','-',$row[5]));
                $last_restocked = date('Y-m-d H:i:s',$timestamp);
                $price_per_unit = trim($row[6]);
                $total_price = trim($row[7]);
                $need_restock = trim($row[8]);
                $remarks = !empty($row[9]) ? trim($row[9]) : null;

                if (!empty($item_name) && !empty($supplier) && !empty($category) && !empty($unit) && !empty($qty_per_unit)) {
                    $import_inv->bind_param('sssssssddss',$store_id,$item_name,$supplier,$category,$unit,$qty_per_unit,$last_restocked,$price_per_unit,$total_price,$need_restock,$remarks);
                    $import_inv->execute();
                    $count++;
                }
            }
            storeImportInventoryResult('Imported ' . $count . ' items.');
        } catch (mysqli_sql_exception $e) {
            storeImportInventoryResult($e->getMessage());
        }
    } else {
        storeImportInventoryResult('Invalid file.');
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST'  && isset($_POST['upd_inv_item_quan'])) { // Update item inventory quantity
    echo "TEST";
}

// Student functions

function studentLoginErr($message) { // Helper function
    setcookie('stud_login_err', $message);
    header('Location: index.php');
    exit();
}
function studentRegisRes($message) { // Helper function
    setcookie('stud_reg_res', $message);
    header('Location: students_register.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['student_registration'])) { // Student/user registration
    $student_number = trim($_POST['student_number']);
    $password = trim($_POST['password']);
    $confirm_password = trim($_POST['confirm_password']);

    $sql = "SELECT student_number FROM registered_users WHERE student_number=?";
    $get_stud_num = $conn->prepare($sql);
    $get_stud_num->bind_param('s',$student_number);
    $get_stud_num->execute();

    $rs = $get_stud_num->get_result();

    if ($rs->num_rows === 0) {
        studentRegisRes('Invalid student number.');
    }

    if ($password !== $confirm_password) {
        studentRegisRes('Password does not match.');
    }

    try {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO user_login_info (student_number, password) VALUES (?,?)";
        $register_account = $conn->prepare($sql);
        $register_account->bind_param('ss',$student_number,$hashed_password);

        if ($register_account->execute()) {
            studentRegisRes('Account created successfully.');
        }
    } catch (mysqli_sql_exception $e) {
        if ($e->getCode() === 1062) {
            studentRegisRes('Error: Account already exists.');
        } else {
            studentRegisRes('Database error: ' . $e->getMessage());
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['student_login'])) { // Student/user login
    $student_number = trim($_POST['student_number']);
    $password = trim($_POST['password']);

    try {
        $sql =
            "SELECT user_login_info.student_number, registered_users.name, user_login_info.password
            FROM user_login_info
            LEFT JOIN registered_users
            ON user_login_info.student_number=registered_users.student_number
            WHERE user_login_info.student_number=?";
        $get_info = $conn->prepare($sql);
        $get_info->bind_param('s',$student_number);
        $get_info->execute();
        $rs = $get_info->get_result();

        if ($rs->num_rows === 0) {
            studentLoginErr('Account does not exist.');
        }

        $info = $rs->fetch_assoc();

        if (!password_verify($password, $info['password'])) {
            studentLoginErr('Wrong password.');
        }

        $_SESSION['student_number'] = $student_number;
        $_SESSION['student_name'] = $info['name'];

        header('Location: students_dashboard.php');
    } catch (mysqli_sql_exception $e) {
        studentLoginErr('Database error: ' . $e->getMessage());
    }
}

function getStoreList() {
    $conn = connect();

    $sql = "SELECT * FROM store_info";
    $rs = $conn->query($sql);

    try {
        if ($rs->num_rows === 0) {
            $output = json_encode(null);
        } else {
            while ($store = $rs->fetch_assoc()) {
                $stores[] = $store;
            }
            $output = json_encode($stores, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
        }

        file_put_contents('stores.json',$output);
    } catch (mysqli_sql_exception $e) {
        setcookie('get_stores_err','Database error: ' . $e->getMessage());
    }
}

function getCart($customer_id) {
    $conn = connect();

    $sql =
        "SELECT cart.*, food_menu.name, food_menu.description, food_menu.price, food_menu.photo
        FROM cart
        LEFT JOIN food_menu
        ON cart.food_id=food_menu.id
        WHERE customer_id=?
        ORDER BY id DESC";
    $get_cart = $conn->prepare($sql);
    $get_cart->bind_param('s',$customer_id);

    try {
        if ($get_cart->execute()) {
            $rs = $get_cart->get_result();

            if ($rs->num_rows === 0) {
                $output = json_encode(null);
            } else {
                while ($cart_item = $rs->fetch_assoc()) {
                    $cart[] = $cart_item;
                }
                $output = json_encode($cart, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }
            file_put_contents('cart.json',$output);
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('get_cart_err','Database error: ' . $e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_to_cart'])) { // Add an item to cart
    $customer_id = trim($_POST['customer_id']);
    $food_id = trim($_POST['food_id']);
    $food_quantity = trim($_POST['food_quantity']);

    $sql = "SELECT id, customer_id, food_id, quantity FROM cart";
    $get_cart = $conn->query($sql);

    while ($row = $get_cart->fetch_assoc()) {
        if ($customer_id === $row['customer_id'] && $food_id === $row['food_id']) {
            $cart_id = $row['id'];
            $old_quantity = $row['quantity'];
            $new_quantity = $old_quantity + $food_quantity;
            $current_timestamp = date('Y-m-d H:i:s');

            $sql = "UPDATE cart SET quantity=?, last_updated=? WHERE id=?";
            $update_quantity = $conn->prepare($sql);
            $update_quantity->bind_param('sss',$new_quantity,$current_timestamp,$cart_id);

            try {
                if ($update_quantity->execute()) {
                    getCart($customer_id);
                    exit();
                }
            } catch (mysqli_sql_exception $e) {
                setcookie('upd_quan_err','Database error: ' . $e->getMessage());
                exit();
            }
        }
    }

    $sql = "INSERT INTO cart (customer_id,food_id,quantity) VALUES (?,?,?)";
    $add_to_cart = $conn->prepare($sql);
    $add_to_cart->bind_param('sss',$customer_id,$food_id,$food_quantity);

    try {
        if ($add_to_cart->execute()) {
            getCart($customer_id);
            exit();
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('add_to_cart_err','Database error: ' . $e->getMessage());
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_cart_item_quantity'])) { // Update cart item quantity
    $order_id = trim($_POST['order_id']);
    $customer_id = trim($_POST['customer_id']);
    $new_quantity = trim($_POST['quantity']);
    $current_timestamp = date('Y-m-d H:i:s');

    $sql = "UPDATE cart SET quantity=?, last_updated=? WHERE id=?";
    $update_quantity = $conn->prepare($sql);
    $update_quantity->bind_param('sss',$new_quantity,$current_timestamp,$order_id);

    try {
        if ($update_quantity->execute()) {
            getCart($customer_id);

        }
    } catch (mysqli_sql_exception $e) {
        setcookie('upd_quan_err','Database error: ' . $e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['remove_cart_item'])) { // Delete cart item
    $customer_id = trim($_POST['student_number']);
    $cart_id = trim($_POST['cart_id']);

    $sql = "DELETE FROM cart WHERE id=?";
    $remove_cart_item = $conn->prepare($sql);
    $remove_cart_item->bind_param('s',$cart_id);

    try {
        if ($remove_cart_item->execute()) {
            getCart($customer_id);
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('delete_cart_item_err',$e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['check_out'])) { // Set checkout ID
    $_SESSION['check_out'] = trim($_POST['student_number']); // Pwede change to random ID for security
}
?>