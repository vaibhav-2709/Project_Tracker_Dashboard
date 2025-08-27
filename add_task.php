<?php
$conn = new mysqli("localhost", "root", "", "project_tracker");
$title = $_POST['title'];
$description = $_POST['description'];
$assigned_to = $_POST['assigned_to'];
$deadline = $_POST['deadline'];
$status = 'To Do';

$stmt = $conn->prepare("INSERT INTO tasks (title, description, assigned_to, deadline, status) VALUES (?, ?, ?, ?, ?)");
$stmt->bind_param("sssss", $title, $description, $assigned_to, $deadline, $status);
$stmt->execute();
$stmt->close();
$conn->close();
?>
