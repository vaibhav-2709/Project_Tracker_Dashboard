<?php
$conn = new mysqli("localhost", "root", "", "project_tracker");
$id = $_POST['id'];
$status = $_POST['status'];

$stmt = $conn->prepare("UPDATE tasks SET status=? WHERE id=?");
$stmt->bind_param("si", $status, $id);
$stmt->execute();
$stmt->close();
$conn->close();
?>
