<?php
function getInput()
{
    $data = json_decode(file_get_contents('php://input'), true);
    return $data ? $data : $_POST;
}

function generateToken($length = 64)
{
    return bin2hex(random_bytes($length / 2));
}

function requireAuth($pdo)
{
    $headers = getallheaders();
    $auth = '';
    if (isset($headers['Authorization'])) $auth = $headers['Authorization'];
    if (!$auth && isset($headers['authorization'])) $auth = $headers['authorization'];
    if (!$auth) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Authorization header missing']);
        exit;
    }
    if (strpos($auth, 'Bearer ') === 0) $token = substr($auth, 7);
    else $token = $auth;

    $stmt = $pdo->prepare('SELECT user_id FROM api_tokens WHERE token = ?');
    $stmt->execute([$token]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row) {
        http_response_code(401);
        echo json_encode(['success' => false, 'message' => 'Invalid token']);
        exit;
    }
    return $row['user_id'];
}
