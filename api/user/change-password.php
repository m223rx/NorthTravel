<?php
require_once '../config.php';

$token = getBearerToken();

if (!$token) {
    echo json_encode([
        'success' => false,
        'message' => 'No token provided'
    ]);
    exit();
}

$payload = verifyJWT($token);

if (!$payload) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid or expired token'
    ]);
    exit();
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['currentPassword']) || !isset($input['newPassword'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Current password and new password are required'
    ]);
    exit();
}

$currentPassword = $input['currentPassword'];
$newPassword = $input['newPassword'];

if (strlen($newPassword) < 6) {
    echo json_encode([
        'success' => false,
        'message' => 'New password must be at least 6 characters'
    ]);
    exit();
}

$stmt = $conn->prepare("SELECT password FROM users WHERE id = ?");
$stmt->bind_param("i", $payload['user_id']);
$stmt->execute();
$result = $stmt->get_result();
$user = $result->fetch_assoc();

if (!password_verify($currentPassword, $user['password'])) {
    echo json_encode([
        'success' => false,
        'message' => 'Current password is incorrect'
    ]);
    exit();
}

$hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

$stmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
$stmt->bind_param("si", $hashedPassword, $payload['user_id']);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Password changed successfully'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to change password'
    ]);
}

$stmt->close();
$conn->close();
?>
