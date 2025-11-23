<?php
require_once './api/db.php';
require_once './api/helpers/helpers.php';

$input = getInput();
$email = trim($input['email'] ?? '');
$password = $input['password'] ?? '';

if (!$email || !$password) {
    echo json_encode(['success' => false, 'message' => 'Email and password required']);
    exit;
}

$stmt = $pdo->prepare('SELECT id, password FROM users WHERE email = ?');
$stmt->execute([$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);
if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode(['success' => false, 'message' => 'Invalid credentials']);
    exit;
}

$token = generateToken(64);
$stmt = $pdo->prepare('INSERT INTO api_tokens (user_id, token) VALUES (?, ?)');
$stmt->execute([$user['id'], $token]);

echo json_encode(['success' => true, 'token' => $token, 'user_id' => (int)$user['id']]);
