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

function storeLoginErr($message) {
    setcookie('store_login_err', $message);
    header('Location: store_login.php');
    exit();
}

function getStoreInfo() {
    $conn = connect();

    $sql =
        "SELECT *
        FROM store_info";
    $get_store_info = $conn->prepare($sql);
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

getStoreInfo();

function getMenu() {
    $conn = connect();

    $sql = "SELECT id, store_id, name, description, price, stock, photo FROM food_menu ORDER BY id DESC";
    $get_menu = $conn->prepare($sql);

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

getMenu();

function menuUploadRes($message) { // Helper function
    setcookie('menu_upl_res', $message);
    header('Location: store_index.php');
    exit();
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

getRegisteredUsers();

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

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['change_store_photo'])) { // Update store profile
    $store_id = trim($_POST['store_id']);
    
    $upload_dir = 'uploads/store_profile/';
    $allowed_file_extensions = array('jpg','jpeg','png');
    $allowed_MIME_types = array('image/jpeg','image/png');

    $conn->begin_transaction();

    try {
        if (!empty($_FILES['store_photo']['name'])) { // Check photo, upload to directory
            if (!is_dir($upload_dir)) mkdir($upload_dir,0755,true);

            $image_name = time() . '_' . basename($_FILES['store_photo']['name']);
            $image_type = $_FILES['store_photo']['type'];
            $image_error = $_FILES['store_photo']['error'];
            $image_file_extension = pathinfo($image_name,PATHINFO_EXTENSION);

            if ($image_error !== 0) {
                setcookie('upd_store_profile_err','Error uploading photo.');
                exit();
            }

            if (!in_array($image_file_extension,$allowed_file_extensions) || !in_array($image_type,$allowed_MIME_types)) {
                setcookie('upd_store_profile_err','Invalid file type.');
                exit();
            }

            $new_file_name = uniqid('img_',true) . '.' . $image_file_extension;
            $new_profile_picture = $upload_dir . $new_file_name;

            if (move_uploaded_file($_FILES['store_photo']['tmp_name'],$new_profile_picture)) {
                $sql = "SELECT store_photo FROM store_info WHERE store_id=?";
                $get_old_photo = $conn->prepare($sql);
                $get_old_photo->bind_param('s',$store_id);
                $get_old_photo->execute();

                $rs = $get_old_photo->get_result();
                $photo = $rs->fetch_assoc();
                $old_profile_picture = $photo['store_photo'];

                $sql = "UPDATE store_info SET store_photo=? WHERE store_id=?";
                $update_store_photo = $conn->prepare($sql);
                $update_store_photo->bind_param('ss',$new_profile_picture,$store_id);
                $update_store_photo->execute();

                if ($old_profile_picture !== null) {
                    unlink($old_profile_picture);
                }

                $conn->commit();
                getStoreInfo();
            }
            
        }
    } catch (mysqli_sql_exception $e) {
        $conn->rollback();
        setcookie('upd_store_profile_err','Database error: ' . $e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['edit_store_description'])) { // Update store description
    $store_id = trim($_POST['store_id']);
    $new_desc = trim($_POST['store_description']);

    $sql = "UPDATE store_info SET store_description=? WHERE store_id=?";
    $update_store_desc = $conn->prepare($sql);
    $update_store_desc->bind_param('ss',$new_desc,$store_id);

    try {
        if ($update_store_desc->execute()) {
            getStoreInfo();
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('upd_store_desc_err','Database error: ' . $e->getMessage());
    }

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

    $sql = "UPDATE food_menu SET name=?, description=?, price=?, stock=?, last_updated=?, photo=? WHERE id=?";
    $update_menu_item = $conn->prepare($sql);
    $update_menu_item->bind_param('ssdisss',$new_name,$new_desc,$new_price,$updated_stock,$current_timestamp,$new_photo,$id);

    try {
        if ($update_menu_item->execute()) {
            getMenu();
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('update_menu_item_err','Database error: ' . $e->getMessage());
    }

    /**
    if ($new_photo === null) {
        $sql =
            "UPDATE food_menu
            SET name=?,description=?,price=?,stock=?,last_updated=?
            WHERE id=?";
        $update_menu_item = $conn->prepare($sql);
        $update_menu_item->bind_param('ssdiss',$new_name,$new_desc,$new_price,$updated_stock,$current_timestamp,$id);

        try {
            if ($update_menu_item->execute()) {
                getMenu();
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
                getMenu();
            }
        } catch (mysqli_sql_exception $e) {
            setcookie('update_menu_item_err',$e->getMessage());
        }
    }
    */
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_menu_item'])) { // Delete menu item (need to change: remove item from user cart when updating)
    $store_id = trim($_POST['store_id']);
    $menu_id = trim($_POST['menu_id']);

    $sql = "DELETE FROM cart WHERE food_id=?";
    $delete_menu_item_from_cart = $conn->prepare($sql);
    $delete_menu_item_from_cart->bind_param('s',$menu_id);

    try {
        if ($delete_menu_item_from_cart->execute()) {
            $sql = "DELETE FROM food_menu WHERE id=? AND store_id=?";
            $delete_menu_item = $conn->prepare($sql);
            $delete_menu_item->bind_param('ss',$menu_id,$store_id);

            if ($delete_menu_item->execute()) {
                getMenu();
            }
        }        
    } catch (mysqli_sql_exception $e) {
        setcookie('delete_menu_item_err','Database error: ' . $e->getMessage());
    }
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

function getStoreInventory() {
    $conn = connect();

    $sql = "SELECT * FROM inventory";
    $get_inventory = $conn->prepare($sql);

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

getStoreInventory();

function storeImportInventoryResult($message) {
    setcookie('inv_import_res',$message);
    header('Location: store_inventory.php');
    exit();
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_inventory_item'])) { // Add individual items to inventory
    $store_id = trim($_POST['store_id']);
    $item_name = trim($_POST['item_name']);
    $supplier = trim($_POST['item_supplier']);
    $category = trim($_POST['category']);
    $unit = trim($_POST['unit']);
    $quantity = trim($_POST['quantity']);
    
    $date = trim($_POST['date_stocked']);
    $time_hours = trim($_POST['time_hours']);
    $time_minutes = trim($_POST['time_minutes']);
    $time_seconds = trim($_POST['time_seconds']);

    $timestamp = $date . " " . $time_hours . ":" . $time_minutes . ":" . $time_seconds;
    $date_stocked = date('Y-m-d H:i:s',strtotime($timestamp));

    $price = trim($_POST['price']);
    $total_price = (int)$quantity * (int)$price;
    $need_restock = trim($_POST['restock']);
    $remarks = ($_POST['remarks'] === "") ? null : trim($_POST['remarks']);

    $sql =
        "INSERT INTO inventory
        (store_id,item_name,supplier,category,unit,quantity_per_unit,last_restocked,price_per_unit,total_price,need_restock,remarks)
        VALUES
        (?,?,?,?,?,?,?,?,?,?,?)";
    $add_inventory_item = $conn->prepare($sql);
    $add_inventory_item->bind_param('sssssdsddss',$store_id,$item_name,$supplier,$category,$unit,$quantity,$date_stocked,$price,$total_price,$need_restock,$remarks);

    try {
        if ($add_inventory_item->execute()) {
            getStoreInventory();
            header('Location: store_inventory.php');
            exit();
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('add_inv_err','Database error: ' . $e->getMessage());
    }
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

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['upd_inv_item_quan'])) { // Update item inventory quantity, last restocked, and total price
    $store_id = trim($_POST['store_id']);
    $menu_id = trim($_POST['menu_id']); // item_id
    $old_quantity = trim($_POST['old_quantity']);
    $new_quantity = trim($_POST['upd_inv_item_quan']);

    if ($new_quantity < $old_quantity) $datetime = date('Y-m-d H:i:s',strtotime(trim($_POST['old_datetime'])));
    else $datetime = date('Y-m-d H:i:s');

    $new_total_price = trim($_POST['total_price']);

    $sql =
        "UPDATE inventory
        SET
        quantity_per_unit=?,
        last_restocked=?,
        total_price=?
        WHERE
        id=? AND store_id=?";
    $update_item_quantity = $conn->prepare($sql);
    $update_item_quantity->bind_param('ssdss',$new_quantity,$datetime,$new_total_price,$menu_id,$store_id);

    try {
        if ($update_item_quantity->execute()) {
            getStoreInventory();
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('upd_inv_quan_err','Database error: ' . $e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['upd_price_per_unit'])) { // Update price per unit and total price
    $store_id = trim($_POST['store_id']);
    $menu_id = trim($_POST['menu_id']); // item_id
    $new_price = trim($_POST['upd_price_per_unit']);
    $new_total_price = trim($_POST['total_price']);

    $sql =
        "UPDATE inventory
        SET
        price_per_unit=?,
        total_price=?
        WHERE
        id=? AND store_id=?";
    $update_item_price = $conn->prepare($sql);
    $update_item_price->bind_param('ddss',$new_price,$new_total_price,$menu_id,$store_id);

    try {
        if ($update_item_price->execute()) {
            getStoreInventory();
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('upd_inv_price_err','Database error: ' . $e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['need_restock'])) { // Update need restocked
    $store_id = trim($_POST['store_id']);
    $menu_id = trim($_POST['menu_id']); // item_id
    $need_restock = trim($_POST['need_restock']);
    $need_restock_value = 0;

    $sql =
        "UPDATE inventory
        SET
        need_restock=?
        WHERE
        id=? AND store_id=?";
    $update_need_restock = $conn->prepare($sql);

    if ($need_restock === 'Yes') {
        $update_need_restock->bind_param('sss',$need_restock_value,$menu_id,$store_id);
    } else if ($need_restock === 'No') {
        $need_restock_value = 1;
        $update_need_restock->bind_param('sss',$need_restock_value,$menu_id,$store_id);
    }

    try {
        if ($update_need_restock->execute()) {
            getStoreInventory();
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('upd_need_restock_err','Database error: ' . $e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['remarks'])) { // Update remarks
    $store_id = trim($_POST['store_id']);
    $menu_id = trim($_POST['menu_id']); // item_id
    $remarks = trim($_POST['remarks']);

    if ($remarks === "null") {
        $remarks = null;
    }

    $sql = "UPDATE inventory SET remarks=? WHERE id=? AND store_id=?";
    $update_remarks = $conn->prepare($sql);
    $update_remarks->bind_param('sss',$remarks,$menu_id,$store_id);

    try {
        if ($update_remarks->execute()) {
            getStoreInventory();
            echo "DONE";
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('upd_remarks_err','Database error: ' . $e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !empty($_POST['delete_inv_item'])) { // Delete inventory item
    $store_id = trim($_POST['store_id']);
    $item_id = trim($_POST['menu_id']); // item_id

    $sql = "DELETE FROM inventory WHERE id=? and store_id=?";
    $delete_inv_item = $conn->prepare($sql);
    $delete_inv_item->bind_param('ss',$item_id,$store_id);

    try {
        if ($delete_inv_item->execute()) {
            getStoreInventory();
            echo "DONE";
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('del_inv_item_err','Database error: ' . $e->getMessage());
    }
}

// Manage order functions

function getStoreOrders() { // Fetch store orders
    $conn = connect();

    $sql =
        "SELECT
            orders.id AS order_entry_id,
            orders.checkout_id,
            orders.customer_id,
            user_login_info.contact_number AS customer_contact,
            orders.total_sale,
            orders.payment_method,
            orders.status,
            orders.created_at AS order_created_at,
            orders.status_updated_at,
            orders.cancelled_at AS order_cancelled_at,
            order_items.id AS order_item_id,
            order_items.store_id,
            order_items.food_id,
            order_items.item_name,
            order_items.item_price,
            order_items.quantity,
            order_items.subtotal,
            order_items.created_at AS order_item_created_at,
            order_items.deleted_at
        FROM orders
        LEFT JOIN order_items
            ON orders.checkout_id=order_items.order_id
        LEFT JOIN user_login_info
            ON orders.customer_id=user_login_info.student_number
        ORDER BY orders.status ASC, orders.id DESC";
    $get_store_orders = $conn->prepare($sql);

    try {
        if ($get_store_orders->execute()) {
            $rs = $get_store_orders->get_result();

            $orders = [];

            if ($rs->num_rows === 0) {
                $output = json_encode(null);
            } else {
                while ($row = $rs->fetch_assoc()) {
                    $store_id = $row['store_id'];
                    $checkout_id = $row['checkout_id'];

                    if (!isset($orders[$store_id])) {
                        $orders[$store_id] = [
                            'store_id'  => $store_id,
                            'orders'    => []
                        ];
                    }

                    if (!isset($orders[$store_id]['orders'][$checkout_id])) {
                        $orders[$store_id]['orders'][$checkout_id] = [
                            'order_id'              => $row['order_entry_id'],
                            'checkout_id'           => $checkout_id,
                            'customer_id'           => $row['customer_id'],
                            'customer_contact'      => $row['customer_contact'],
                            'total_sale'            => $row['total_sale'],
                            'payment_method'        => $row['payment_method'],
                            'status'                => $row['status'],
                            'order_created_at'      => $row['order_created_at'],
                            'status_updated_at'     => $row['status_updated_at'],
                            'order_cancelled_at'    => $row['order_cancelled_at'],
                            'items'                 => []
                        ];
                    }

                    if ($row['order_item_id']) {
                        $orders[$store_id]['orders'][$checkout_id]['items'][] = [
                            'order_item_id'             => $row['order_item_id'],
                            'food_id'                   => $row['food_id'],
                            'item_name'                 => $row['item_name'],
                            'item_price'                => $row['item_price'],
                            'quantity'                  => $row['quantity'],
                            'subtotal'                  => $row['subtotal'],
                            'order_item_created_at'     => $row['order_item_created_at'],
                            'deleted_at'                => $row['deleted_at']
                        ];
                    }
                }

                foreach ($orders as $s_id => $s_data) {
                    $orders[$s_id]['orders'] = array_values($s_data['orders']);
                }
                $orders = array_values($orders);
                $output = json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }
            file_put_contents('store_orders.json',$output);
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('get_store_orders_err','Database error: ' . $e->getMessage());
    }
}

getStoreOrders();

require __DIR__ . '/vendor/autoload.php';

$config = ClickSend\Configuration::getDefaultConfiguration()
    ->setUsername('johnichiro.mananquil@gmail.com')
    ->setPassword('8DB22247-D015-5063-7C5D-C19E10416775');
$apiInstance = new ClickSend\Api\SMSApi(new GuzzleHttp\Client(), $config);

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_order'])) { // Update order status
    $store_id = trim($_POST['store_id']);
    $order_checkout_id = trim($_POST['checkout_id']);
    $new_status = trim($_POST['update_order']);
    $updated_at = date('Y-m-d H:i:s');

    $conn->begin_transaction();

    try {
        $sql = "UPDATE orders SET status=?, status_updated_at=? WHERE checkout_id=?";
        $update_order_status = $conn->prepare($sql);
        $update_order_status->bind_param('sss',$new_status,$updated_at,$order_checkout_id);
        
        if ($update_order_status->execute()) {
            if ($new_status === 'ready') {
                $contact_number = trim($_POST['customer_contact']);
                $contact_number = '+63' . substr($contact_number,1);

                $msg = new \ClickSend\Model\SmsMessage();
                $msg->setBody("Good day ma'am/sir! Your order (ID: " . $order_checkout_id . ") is ready for pickup. Please proceed to our store. Thank you!");
                $msg->setTo($contact_number);
                $msg->getSource();

                $sms_messages = new \ClickSend\Model\SmsMessageCollection();
                $sms_messages->setMessages([$msg]);

                // Commented part is sending SMS notif, do not remove unless needed for demo
                // $result = $apiInstance->smsSendPost($sms_messages)
            }

            $conn->commit();
            getStoreOrders();
        }
    } catch (mysqli_sql_exception $e) {
        $conn->rollback();
        setcookie('upd_order_status_err','Database error: ' . $e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['cancel_order'])) { // Cancel order item store-side
    $store_id = trim($_POST['store_id']);
    $order_checkout_id = trim($_POST['checkout_id']);
    $new_status = trim($_POST['cancel_order']);
    $current_timestamp = date('Y-m-d H:i:s');

    $sql = "UPDATE orders SET status=?, cancelled_at=? WHERE checkout_id=?";
    $cancel_order_store = $conn->prepare($sql);
    $cancel_order_store->bind_param('sss',$new_status,$current_timestamp,$order_checkout_id);

    try {
        if ($cancel_order_store->execute()) {
            $contact_number = trim($_POST['customer_contact']);
            $contact_number = '+63' . substr($contact_number,1);

            $msg = new \ClickSend\Model\SmsMessage();
            $msg->setBody("Good day ma'am/sir! We are sorry to inform you that your order (ID: " . $order_checkout_id . ") has been cancelled.");
            $msg->setTo($contact_number);
            $msg->getSource();

            $sms_messages = new \ClickSend\Model\SmsMessageCollection();
            $sms_messages->setMessages([$msg]);

            // Commented part is sending SMS notif, do not remove unless needed for demo
            // $result = $apiInstance->smsSendPost($sms_messages)
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('store_cancel_order_err','Database error: ' . $e->getMessage());
    }
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

getStoreList();

function getCart() {
    $conn = connect();

    $sql =
        "SELECT
            cart.*,
            food_menu.name,
            food_menu.description,
            food_menu.price,
            food_menu.stock,
            food_menu.photo,
            food_menu.store_id,
            store_info.store_name
        FROM cart
        LEFT JOIN food_menu
            ON cart.food_id=food_menu.id
        LEFT JOIN store_info
            ON food_menu.store_id=store_info.store_id
        ORDER BY id DESC";
    $get_cart = $conn->prepare($sql);

    try {
        if ($get_cart->execute()) {
            $rs = $get_cart->get_result();

            $cart = [];

            if ($rs->num_rows === 0) {
                $output = json_encode(null);
            } else {
                while ($row = $rs->fetch_assoc()) {
                    $store_id = $row['store_id'];
                    $customer_id = $row['customer_id'];

                    $group_key = $customer_id . '_' . $store_id;

                    if (!isset($cart[$group_key])) {
                        $cart[$group_key] = [
                            'store_id'      => $store_id,
                            'store_name'    => $row['store_name'],
                            'customer_id'   => $customer_id,
                            'items'         => []
                        ];
                    }

                    $cart[$group_key]['items'][] = [
                        'cart_id'       => $row['id'],
                        'food_id'       => $row['food_id'],
                        'name'          => $row['name'],
                        'description'   => $row['description'],
                        'price'         => $row['price'],
                        'stock'         => $row['stock'],                        
                        'quantity'      => $row['quantity'],
                        'photo'         => $row['photo']
                    ];
                }
                $cart = array_values($cart);
                $output = json_encode($cart, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }
            file_put_contents('cart.json',$output);
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('get_cart_err','Database error: ' . $e->getMessage());
    }
}

getCart();

function getStudentOrders() {
    $conn = connect();

    $sql =
        "SELECT
            orders.id AS order_id,
            orders.checkout_id,
            orders.customer_id,
            orders.total_sale,
            orders.payment_method,
            orders.status,
            orders.created_at AS order_created_at,
        
            order_items.id AS item_id,
            order_items.store_id,
            order_items.food_id,
            order_items.item_name,
            order_items.item_price,
            order_items.quantity,
            order_items.subtotal,
            order_items.created_at AS item_created_at
        FROM orders
        LEFT JOIN order_items
            ON orders.checkout_id=order_items.order_id
        ORDER BY orders.status ASC, orders.created_at DESC";
    $get_student_orders = $conn->prepare($sql);

    try {
        if ($get_student_orders->execute()) {
            $rs = $get_student_orders->get_result();

            $orders = [];

            if ($rs->num_rows === 0) {
                $output = json_encode(null);
            } else {
                while ($row = $rs->fetch_assoc()) {
                    $order_id = $row['order_id'];

                    if (!isset($orders[$order_id])) {
                        $orders[$order_id] = [
                            'order_id'          => $row['order_id'],
                            'checkout_id'       => $row['checkout_id'],
                            'customer_id'       => $row['customer_id'],
                            'total_sale'        => $row['total_sale'],
                            'payment_method'    => $row['payment_method'],
                            'status'            => $row['status'],
                            'order_created_at'        => $row['order_created_at'],
                            'items'             => []
                        ];
                    }

                    if (!empty($row['item_id'])) {
                        $orders[$order_id]['items'][] = [
                            'item_id' => $row['item_id'],
                            'store_id' => $row['store_id'],
                            'food_id' => $row['food_id'],
                            'item_name' => $row['item_name'],
                            'item_price' => $row['item_price'],
                            'quantity' => $row['quantity'],
                            'subtotal' => $row['subtotal'],
                            'item_created_at' => $row['item_created_at']
                        ];
                    }
                }
                $orders = array_values($orders);
                $output = json_encode($orders, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
            }
            file_put_contents('students_orders.json',$output);
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('get_stud_order_err','Database error: ' . $e->getMessage());
    }
}

getStudentOrders();

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['student_registration'])) { // Student/user registration
    $student_number = trim($_POST['student_number']);
    $contact_number = trim($_POST['contact_number']);
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

        $sql = "INSERT INTO user_login_info (student_number, contact_number, password) VALUES (?,?,?)";
        $register_account = $conn->prepare($sql);
        $register_account->bind_param('sss',$student_number,$contact_number,$hashed_password);

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

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['add_to_cart'])) { // Add an item to cart
    $customer_id = trim($_POST['customer_id']);
    $store_id = trim($_POST['store_id']);
    $food_id = trim($_POST['food_id']);
    $food_quantity = trim($_POST['food_quantity']);
    $remaining_food_stock = trim($_POST['food_stock']);

    if ($food_quantity > $remaining_food_stock) exit();
    if ($food_quantity == 0) exit();

    $sql = "SELECT id, customer_id, store_id, food_id, quantity FROM cart";
    $get_cart = $conn->query($sql);

    while ($row = $get_cart->fetch_assoc()) {
        if ($customer_id === $row['customer_id'] && $store_id=== $row['store_id'] && $food_id === $row['food_id']) {
            $cart_id = $row['id'];
            $old_quantity = $row['quantity'];
            $new_quantity = $old_quantity + $food_quantity;
            $current_timestamp = date('Y-m-d H:i:s');

            $sql = "UPDATE cart SET quantity=?, last_updated=? WHERE id=?";
            $update_quantity = $conn->prepare($sql);
            $update_quantity->bind_param('sss',$new_quantity,$current_timestamp,$cart_id);

            try {
                if ($update_quantity->execute()) {
                    getCart();
                    exit();
                }
            } catch (mysqli_sql_exception $e) {
                setcookie('upd_quan_err','Database error: ' . $e->getMessage());
                exit();
            }
        }
    }

    $sql = "INSERT INTO cart (customer_id, store_id, food_id, quantity) VALUES (?,?,?,?)";
    $add_to_cart = $conn->prepare($sql);
    $add_to_cart->bind_param('ssss',$customer_id,$store_id,$food_id,$food_quantity);

    try {
        if ($add_to_cart->execute()) {
            getCart();
            exit();
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('add_to_cart_err','Database error: ' . $e->getMessage());
        exit();
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['update_cart_item_quantity'])) { // Update cart item quantity
    $order_id = trim($_POST['order_id']); // Cart ID
    $customer_id = trim($_POST['customer_id']);
    $new_quantity = trim($_POST['quantity']);
    $current_timestamp = date('Y-m-d H:i:s');

    $sql = "UPDATE cart SET quantity=?, last_updated=? WHERE id=?";
    $update_quantity = $conn->prepare($sql);
    $update_quantity->bind_param('sss',$new_quantity,$current_timestamp,$order_id);

    try {
        if ($update_quantity->execute()) {
            getCart();
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
            getCart();
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('delete_cart_item_err',$e->getMessage());
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['check_out'])) { // Set unique checkout ID
    $bytes = random_bytes(16);

    $bytes[6] = chr(ord($bytes[6]) & 0x0f | 0x40);
    $bytes[8] = chr(ord($bytes[8]) & 0x3f | 0x80);
    
    $_SESSION['check_out'] = vsprintf('%s%s-%s-%s-%s%s%s', str_split(bin2hex($bytes), 4));
    $_SESSION['check_out_store'] = trim($_POST['store_id']);
}

$apiKey = "xnd_development_3yoKrZZ2r7Z1KGQIpg9n0VyiH1laSjhEa5KWPBy0KpGbGGy8Vxh9laDQTm19myjq";
$auth = base64_encode($apiKey . ":");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['checkout_order'])) { // Checkout student order
    $customer_id = trim($_POST['customer_id']);
    $store_id = trim($_POST['store_id']);
    $chceckout_id = trim($_POST['checkout_order']);
    $total_sale = trim($_POST['total_sale']);
    $payment_method = trim($_POST['payment_method']);

    if ($payment_method === 'Cash') {
        $sql =
            "INSERT INTO orders
            (checkout_id,customer_id,total_sale,payment_method)
            VALUES
            (?,?,?,?)";
        $create_order_entry = $conn->prepare($sql);
        $create_order_entry->bind_param('ssds',$chceckout_id,$customer_id,$total_sale,$payment_method);

        try {
            if ($create_order_entry->execute()) {
                $sql =
                    "INSERT INTO order_items
                    (order_id, store_id, customer_id, food_id, item_name, item_price, quantity, subtotal)
                    SELECT orders.checkout_id, food_menu.store_id, cart.customer_id, cart.food_id, food_menu.name, food_menu.price, cart.quantity, (cart.quantity * food_menu.price) AS item_total
                    FROM food_menu
                    RIGHT JOIN cart
                    ON food_menu.id=cart.food_id
                    RIGHT JOIN orders
                    ON orders.customer_id=cart.customer_id
                    WHERE cart.customer_id=? AND food_menu.store_id=? AND orders.checkout_id=?";
                $copy_cart_items = $conn->prepare($sql);
                $copy_cart_items->bind_param('sss',$customer_id,$store_id,$chceckout_id);
                
                if ($copy_cart_items->execute()) {
                    $sql =
                        "UPDATE food_menu
                        LEFT JOIN cart
                            ON food_menu.id=cart.food_id
                        SET food_menu.stock=food_menu.stock-cart.quantity
                        WHERE cart.customer_id=? AND food_menu.store_id=?";
                    $deduct_stock = $conn->prepare($sql);
                    $deduct_stock->bind_param('ss',$customer_id,$store_id);

                    if ($deduct_stock->execute()) {
                        $sql = "DELETE FROM cart WHERE customer_id=? AND store_id=?";
                        $delete_cart_items = $conn->prepare($sql);
                        $delete_cart_items->bind_param('ss',$customer_id,$store_id);

                        if ($delete_cart_items->execute()) {
                            getCart();
                            getStudentOrders();
                            getStoreOrders();
                        }
                    }
                }
            }
        } catch (mysqli_sql_exception $e) {
            setcookie('checkout_err','Database error: ' . $e->getMessage());
        }
    } else if ($payment_method === 'GCash') {
        $payload = [
            "external_id" => $chceckout_id,
            "amount" => $total_sale,
            "description" => "Payment for Order #" . $chceckout_id,
            "payment_methods" => ["GCASH"],
            "success_redirect_url" => "http://localhost/quickbite/students_dashboard.php",
            "currency" => "PHP"
        ];

        $ch = curl_init("https://api.xendit.co/v2/invoices");
        curl_setopt($ch,CURLOPT_RETURNTRANSFER,true);
        curl_setopt($ch,CURLOPT_POST,true);
        curl_setopt($ch,CURLOPT_POSTFIELDS,json_encode($payload));
        curl_setopt($ch,CURLOPT_HTTPHEADER,[
            "Authorization: Basic $auth",
            "Content-Type: application/json"
        ]);

        $response = curl_exec($ch);
        $responseData = json_decode($response,true);

        if(isset($responseData['invoice_url'])) {
            $paid = 1;

            $sql =
                "INSERT INTO orders
                (checkout_id,customer_id,total_sale,payment_method,paid)
                VALUES
                (?,?,?,?,?)";
            $create_order_entry = $conn->prepare($sql);
            $create_order_entry->bind_param('ssdsi',$chceckout_id,$customer_id,$total_sale,$payment_method,$paid);
            
            try {
                if ($create_order_entry->execute()) {
                    $sql =
                        "INSERT INTO order_items
                        (order_id, store_id, customer_id, food_id, item_name, item_price, quantity, subtotal)
                        SELECT orders.checkout_id, food_menu.store_id, cart.customer_id, cart.food_id, food_menu.name, food_menu.price, cart.quantity, (cart.quantity * food_menu.price) AS item_total
                        FROM food_menu
                        RIGHT JOIN cart
                        ON food_menu.id=cart.food_id
                        RIGHT JOIN orders
                        ON orders.customer_id=cart.customer_id
                        WHERE cart.customer_id=? AND food_menu.store_id=? AND orders.checkout_id=?";
                    $copy_cart_items = $conn->prepare($sql);
                    $copy_cart_items->bind_param('sss',$customer_id,$store_id,$chceckout_id);
                    
                    if ($copy_cart_items->execute()) {
                        $sql =
                            "UPDATE food_menu
                            LEFT JOIN cart
                                ON food_menu.id=cart.food_id
                            SET food_menu.stock=food_menu.stock-cart.quantity
                            WHERE cart.customer_id=? AND food_menu.store_id=?";
                        $deduct_stock = $conn->prepare($sql);
                        $deduct_stock->bind_param('ss',$customer_id,$store_id);

                        if ($deduct_stock->execute()) {
                            $sql = "DELETE FROM cart WHERE customer_id=? AND store_id=?";
                            $delete_cart_items = $conn->prepare($sql);
                            $delete_cart_items->bind_param('ss',$customer_id,$store_id);

                            if ($delete_cart_items->execute()) {
                                getCart();
                                getStudentOrders();
                                getStoreOrders();

                                echo json_encode([
                                    "status" => "success",
                                    "redirect_url" => $responseData['invoice_url']
                                ]);
                                exit();
                            } else {
                                echo json_encode([
                                    "status" => "error",
                                    "message" => "Xendit Error: " . ($responseData['message'] ?? 'Unkown error')
                                ]);
                                exit();
                            }
                        }
                    }
                }
            } catch (mysqli_sql_exception $e) {
                setcookie('checkout_err','Database error: ' . $e->getMessage());
            }
        }
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['student_cancel_order'])) { // Cancel order by student
    $customer_id = trim($_POST['student_number']);
    $order_checkout_id = trim($_POST['order_id']);
    $current_timestamp = date('Y-m-d H:i:s');

    $sql = "UPDATE orders SET status='cancelled', cancelled_at=? WHERE checkout_id=? AND customer_id=?";
    $cancel_order = $conn->prepare($sql);
    $cancel_order->bind_param('sss',$current_timestamp,$order_checkout_id,$customer_id);

    try {
        if ($cancel_order->execute()) {

            // Return stock to food_menu

            getStudentOrders();
            getStoreOrders();
        }
    } catch (mysqli_sql_exception $e) {
        setcookie('stud_cancel_order_err','Database error: ' . $e->getMessage());
    }
}
?>