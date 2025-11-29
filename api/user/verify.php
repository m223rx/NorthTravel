<?php
require_once 'config.php';

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


$stmt = $conn->prepare("SELECT id, name, email, phone, address, city, country, created_at FROM users WHERE id = ?");
$stmt->bind_param("i", $payload['user_id']);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode([
        'success' => false,
        'message' => 'User not found'
    ]);
    exit();
}

$user = $result->fetch_assoc();

echo json_encode([
    'success' => true,
    'user' => $user
]);

$stmt->close();
$conn->close();
?>
