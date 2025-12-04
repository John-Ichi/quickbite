-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 04, 2025 at 05:08 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `quickbite`
--

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE `cart` (
  `id` bigint(20) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `food_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cart`
--

INSERT INTO `cart` (`id`, `customer_id`, `food_id`, `quantity`, `created_at`, `last_updated`) VALUES
(3, 202310001, 13, 2, '2025-12-04 09:45:14', '2025-12-04 12:07:28');

-- --------------------------------------------------------

--
-- Table structure for table `food_menu`
--

CREATE TABLE `food_menu` (
  `id` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `last_updated` datetime DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `store_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `food_menu`
--

INSERT INTO `food_menu` (`id`, `name`, `description`, `price`, `stock`, `created_at`, `last_updated`, `photo`, `store_id`) VALUES
(10, 'Caldereta', 'Yummy!', 30.00, 5, '2025-12-03 08:09:35', '2025-12-03 09:58:56', 'uploads/foods/img_692f99601ee854.99227421.png', 19),
(11, 'Menudo', '', 40.00, 5, '2025-12-03 10:00:11', NULL, NULL, 19),
(12, 'New Name', 'Description', 10.00, 5, '2025-12-03 10:07:37', '2025-12-03 10:07:57', 'uploads/foods/img_692f9b776cb547.05330968.jpg', 19),
(13, 'New Menu', 'Newest menu from our store!', 20.00, 10, '2025-12-03 10:12:14', '2025-12-03 10:12:21', 'uploads/foods/img_692f9c85913a12.02931027.png', 19),
(14, 'Caldereta', 'Ichi\'s store 2 caldereta better than ever!', 20.00, 5, '2025-12-03 11:01:47', '2025-12-03 11:02:06', 'uploads/foods/img_692fa82eea3670.77954291.jpg', 28);

-- --------------------------------------------------------

--
-- Table structure for table `inventory_logs`
--

CREATE TABLE `inventory_logs` (
  `id` bigint(11) NOT NULL,
  `food_id` int(11) NOT NULL,
  `action` enum('add_stock','reduce_stock') NOT NULL,
  `quantity` int(11) NOT NULL,
  `remarks` text DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` bigint(20) NOT NULL,
  `customer_id` bigint(20) NOT NULL,
  `food_id` bigint(20) NOT NULL,
  `quantity` int(11) NOT NULL,
  `total_price` decimal(10,2) NOT NULL,
  `status` enum('pending','done','cancelled') DEFAULT 'pending',
  `paid` tinyint(1) NOT NULL DEFAULT 0,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `registered_users`
--

CREATE TABLE `registered_users` (
  `student_number` bigint(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `registered_users`
--

INSERT INTO `registered_users` (`student_number`, `name`, `created_at`) VALUES
(202112345, 'Juan Malakas', '2025-12-03 13:44:54'),
(202234567, 'Don Pedro Singkit', '2025-12-03 13:44:54'),
(202310001, 'Juan Luna', '2025-12-03 13:44:54'),
(202310002, 'Luna Makata', '2025-12-03 13:44:54'),
(202310499, 'Juan Tamad', '2025-12-03 13:44:54'),
(202456789, 'Dummy Luna', '2025-12-03 13:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `stores`
--

CREATE TABLE `stores` (
  `id` bigint(20) NOT NULL,
  `email` varchar(100) NOT NULL,
  `store_name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stores`
--

INSERT INTO `stores` (`id`, `email`, `store_name`, `password`, `created_at`) VALUES
(19, 'mail@mail.com', 'Ichi\'s Store', '$2y$10$H3knA56zi6lZ4xyFg6mNmOUepdp.NKVzKZnRMdARUsXnzu1qpY6ie', '2025-12-03 08:03:04'),
(28, 'mail2@mail.com', 'Ichi\'s Store 2', '$2y$10$jvBmVtA.etxmRV43yTYHtOD3sVAHJQelhGJ3kB0Y7.cZIRc.Mj.Ye', '2025-12-03 08:07:00');

-- --------------------------------------------------------

--
-- Table structure for table `store_info`
--

CREATE TABLE `store_info` (
  `store_id` bigint(20) NOT NULL,
  `store_name` varchar(100) NOT NULL,
  `store_description` text NOT NULL,
  `store_photo` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `store_info`
--

INSERT INTO `store_info` (`store_id`, `store_name`, `store_description`, `store_photo`) VALUES
(19, 'Ichi\'s Store', 'Broke store.', 'uploads/store_profile/img_692f7f778fc107.90799000.png'),
(28, 'Ichi\'s Store 2', 'Ichi\'s second store.', 'uploads/store_profile/img_692fa7ab6a2456.78798688.png');

-- --------------------------------------------------------

--
-- Table structure for table `user_login_info`
--

CREATE TABLE `user_login_info` (
  `student_number` bigint(20) NOT NULL,
  `password` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user_login_info`
--

INSERT INTO `user_login_info` (`student_number`, `password`, `created_at`) VALUES
(202310001, '$2y$10$6E1nutXLnf9fc1DexSA4Du.avt4TjmwIN.hXWmgQ2OeTU3MKmHit2', '2025-12-03 13:45:10');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cart`
--
ALTER TABLE `cart`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `food_menu`
--
ALTER TABLE `food_menu`
  ADD PRIMARY KEY (`id`),
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `food_id` (`food_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `student_number` (`customer_id`),
  ADD KEY `food_id` (`food_id`);

--
-- Indexes for table `registered_users`
--
ALTER TABLE `registered_users`
  ADD PRIMARY KEY (`student_number`);

--
-- Indexes for table `stores`
--
ALTER TABLE `stores`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`,`store_name`),
  ADD UNIQUE KEY `email_2` (`email`),
  ADD UNIQUE KEY `store_name` (`store_name`);

--
-- Indexes for table `store_info`
--
ALTER TABLE `store_info`
  ADD KEY `store_id` (`store_id`);

--
-- Indexes for table `user_login_info`
--
ALTER TABLE `user_login_info`
  ADD PRIMARY KEY (`student_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `food_menu`
--
ALTER TABLE `food_menu`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `inventory_logs`
--
ALTER TABLE `inventory_logs`
  MODIFY `id` bigint(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `stores`
--
ALTER TABLE `stores`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `food_menu`
--
ALTER TABLE `food_menu`
  ADD CONSTRAINT `food_menu_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `user_login_info` (`student_number`),
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`food_id`) REFERENCES `food_menu` (`id`);

--
-- Constraints for table `store_info`
--
ALTER TABLE `store_info`
  ADD CONSTRAINT `store_info_ibfk_1` FOREIGN KEY (`store_id`) REFERENCES `stores` (`id`);

--
-- Constraints for table `user_login_info`
--
ALTER TABLE `user_login_info`
  ADD CONSTRAINT `user_login_info_ibfk_1` FOREIGN KEY (`student_number`) REFERENCES `registered_users` (`student_number`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
