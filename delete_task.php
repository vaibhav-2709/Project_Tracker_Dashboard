<?php
$pdo = new PDO("mysql:host=localhost;dbname=project_tracker", "root", "");

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['id'])) {
    $id = $_POST['id'];
    $stmt = $pdo->prepare("DELETE FROM tasks WHERE id = ?");
    $stmt->execute([$id]);
    echo "Task deleted";
} else {
    echo "Invalid request";
}
?>
