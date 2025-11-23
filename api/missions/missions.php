<?php
require_once './api/db.php';

$stmt = $pdo->query('SELECT id, title, description, points, required_action FROM missions');
$missions = $stmt->fetchAll(PDO::FETCH_ASSOC);
echo json_encode(['success' => true, 'missions' => $missions]);
