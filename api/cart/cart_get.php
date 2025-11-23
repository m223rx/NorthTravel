<?php
require_once './api/db.php';
require_once './api/helpers/helpers.php';

$userId = requireAuth($pdo);
$stmt = $pdo->prepare('SELECT c.id, c.product_id, c.quantity, p.title, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?');
$stmt->execute([$userId]);
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);

$total = 0;
foreach ($items as $it) $total += $it['price'] * $it['quantity'];
echo json_encode(['success' => true, 'items' => $items, 'total' => (float)$total]);
