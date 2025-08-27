<?php
$pdo = new PDO("mysql:host=localhost;dbname=project_tracker", "root", "");

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
  $id = $_POST['id'];
  $title = $_POST['title'];
  $description = $_POST['description'];
  $assigned_to = $_POST['assigned_to'];
  $deadline = $_POST['deadline'];

  $stmt = $pdo->prepare("UPDATE tasks SET title = ?, description = ?, assigned_to = ?, deadline = ? WHERE id = ?");
  $stmt->execute([$title, $description, $assigned_to, $deadline, $id]);

  echo "Task updated";
}
?>
