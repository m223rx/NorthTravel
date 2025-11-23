<?php
require_once './api/db.php';
require_once './api/helpers/helpers.php';

$userId = requireAuth($pdo);
$input = getInput();
$reward_id = intval($input['reward_id'] ?? 0);
if (!$reward_id) {
    echo json_encode(['success' => false, 'message' => 'reward_id required']);
    exit;
}
$stmt = $pdo->prepare('SELECT cost_points FROM rewards WHERE id = ?');
$stmt->execute([$reward_id]);
$reward = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$reward) {
    echo json_encode(['success' => false, 'message' => 'Reward not found']);
    exit;
}

$stmt = $pdo->prepare('SELECT points FROM users WHERE id = ?');
$stmt->execute([$userId]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if ($user['points'] < $reward['cost_points']) {
    echo json_encode(['success' => false, 'message' => 'Not enough points']);
    exit;
}
$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('UPDATE users SET points = points - ? WHERE id = ?');
    $stmt->execute([$reward['cost_points'], $userId]);
    $stmt = $pdo->prepare('INSERT INTO transactions (user_id, type, points, description) VALUES (?, "spend", ?, ?)');
    $stmt->execute([$userId, $reward['cost_points'], 'Claim reward #' . $reward_id]);
    $stmt = $pdo->prepare('INSERT INTO user_rewards (user_id, reward_id) VALUES (?, ?)');
    $stmt->execute([$userId, $reward_id]);
    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}
echo json_encode(['success' => true, 'message' => 'Reward claimed']);
