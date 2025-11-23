<?php
require_once './api/db.php';
require_once './api/helpers/helpers.php';

$userId = requireAuth($pdo);
$input = getInput();
$product_id = intval($input['product_id'] ?? 0);
$quantity = max(1, intval($input['quantity'] ?? 1));
if (!$product_id) {
    echo json_encode(['success' => false, 'message' => 'product_id required']);
    exit;
}

$stmt = $pdo->prepare('SELECT id FROM cart WHERE user_id = ? AND product_id = ?');
$stmt->execute([$userId, $product_id]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
if ($row) {
    $stmt = $pdo->prepare('UPDATE cart SET quantity = quantity + ? WHERE id = ?');
    $stmt->execute([$quantity, $row['id']]);
} else {
    $stmt = $pdo->prepare('INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)');
    $stmt->execute([$userId, $product_id, $quantity]);
}
echo json_encode(['success' => true, 'message' => 'Added to cart']);
