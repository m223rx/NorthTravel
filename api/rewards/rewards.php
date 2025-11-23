<?php
require_once './api/db.php';

$stmt = $pdo->query('SELECT id, title, cost_points, description, reward_type FROM rewards');
$rewards = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(['success' => true, 'rewards' => $rewards]);
