<?php
require_once 'config.php';

// Get bearer token
$token = getBearerToken();

if (!$token) {
    echo json_encode([
        'success' => false,
        'message' => 'No token provided'
    ]);
    exit();
}

// Verify token
$payload = verifyJWT($token);

if (!$payload) {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid or expired token'
    ]);
    exit();
}

// Get user bookings
$stmt = $conn->prepare("SELECT * FROM bookings WHERE user_id = ? ORDER BY created_at DESC");
$stmt->bind_param("i", $payload['user_id']);
$stmt->execute();
$result = $stmt->get_result();

$bookings = [];
while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode([
    'success' => true,
    'bookings' => $bookings
]);

$stmt->close();
$conn->close();
?>
