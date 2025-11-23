<?php
require_once './api/db.php';
require_once './api/helpers/helpers.php';

$userId = requireAuth($pdo);
$stmt = $pdo->prepare('SELECT points FROM users WHERE id = ?');
$stmt->execute([$userId]);
$row = $stmt->fetch(PDO::FETCH_ASSOC);
echo json_encode(['success' => true, 'points' => (int)$row['points']]);
