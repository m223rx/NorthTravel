<?php
require_once './api/db.php';
require_once './api/helpers/helpers.php';

$userId = requireAuth($pdo);
$input = getInput();
$mission_id = intval($input['mission_id'] ?? 0);
if (!$mission_id) {
    echo json_encode(['success' => false, 'message' => 'mission_id required']);
    exit;
}

$stmt = $pdo->prepare('SELECT points, title FROM missions WHERE id = ?');
$stmt->execute([$mission_id]);
$m = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$m) {
    echo json_encode(['success' => false, 'message' => 'Mission not found']);
    exit;
}

$pdo->beginTransaction();
try {
    $stmt = $pdo->prepare('UPDATE users SET points = points + ? WHERE id = ?');
    $stmt->execute([$m['points'], $userId]);
    $stmt = $pdo->prepare('INSERT INTO transactions (user_id, type, points, description) VALUES (?, "earn", ?, ?)');
    $stmt->execute([$userId, $m['points'], 'Completed mission: '.$m['title']]);
    $pdo->commit();
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
    exit;
}
echo json_encode(['success' => true, 'message' => 'Mission completed', 'awarded' => (int)$m['points']]);
