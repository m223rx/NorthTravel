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

$name = isset($input['name']) ? trim($input['name']) : null;
$phone = isset($input['phone']) ? trim($input['phone']) : null;
$address = isset($input['address']) ? trim($input['address']) : null;
$city = isset($input['city']) ? trim($input['city']) : null;
$country = isset($input['country']) ? trim($input['country']) : null;

$stmt = $conn->prepare("UPDATE users SET name = ?, phone = ?, address = ?, city = ?, country = ? WHERE id = ?");
$stmt->bind_param("sssssi", $name, $phone, $address, $city, $country, $payload['user_id']);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true,
        'message' => 'Profile updated successfully'
    ]);
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Failed to update profile'
    ]);
}

$stmt->close();
$conn->close();
?>
