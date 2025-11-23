<?php
require_once './api/db.php';

$stmt = $pdo->query('SELECT id, title, price, description, image FROM products');
$products = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(['success' => true, 'products' => $products]);
