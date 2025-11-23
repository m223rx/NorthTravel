<?php
require_once './api/db.php';
require_once './api/helpers/helpers.php';

$userId = requireAuth($pdo);

$stmt = $pdo->prepare('SELECT c.quantity, p.price FROM cart c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?');
$stmt->execute([$userId]);
$items = $stmt->fetchAll(PDO::FETCH_ASSOC);
if (!$items) {
    echo json_encode(['success' => false, 'message' => 'Cart empty']);
    exit;
}
$total = 0;
foreach ($items as $it) $total += $it['price'] * $it['quantity'];

$points = floor($total);
$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('UPDATE users SET points = points + ? WHERE id = ?');
    $stmt->execute([$points, $userId]);
    $stmt = $pdo->prepare('INSERT INTO transactions (user_id, type, points, description) VALUES (?, "earn", ?, ?)');
    $stmt->execute([$userId, $points, 'Purchase points']);
    $stmt = $pdo->prepare('DELETE FROM cart WHERE user_id = ?');
    $stmt->execute([$userId]);
    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}
echo json_encode(['success' => true, 'message' => 'Checkout complete', 'earned_points' => $points]);
