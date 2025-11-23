<?php
require_once './api/db.php';
require_once './api/helpers/helpers.php';

$input = getInput();
$name = trim($input['name'] ?? '');
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Email and password required']);
    exit;
}

$stmt = $pdo->prepare('SELECT id FROM users WHERE email = ?');
$stmt->execute([$email]);
if ($stmt->fetch()) {
    echo json_encode(['success' => false, 'message' => 'Email already registered']);
    exit;
}

$hash = password_hash($password, PASSWORD_DEFAULT);
$stmt = $pdo->prepare('INSERT INTO users (name, email, password, points) VALUES (?, ?, ?, 50)');
$stmt->execute([$name, $email, $hash]);
$userId = $pdo->lastInsertId();

$stmt = $pdo->prepare('INSERT INTO transactions (user_id, type, points, description) VALUES (?, "earn", 50, "Signup Bonus")');
$stmt->execute([$userId]);

echo json_encode(['success' => true, 'message' => 'Registered', 'user_id' => (int)$userId]);
