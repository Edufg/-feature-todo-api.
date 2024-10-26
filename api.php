<?php
header('Content-Type: application/json');
$method = $_SERVER['REQUEST_METHOD'];
$tasksFile = 'tasks.json';

if ($method === 'GET') {
    
    $tasks = json_decode(file_get_contents($tasksFile), true);
    echo json_encode($tasks);
} elseif ($method === 'POST') {
    
    $data = json_decode(file_get_contents('php://input'), true);
    $tasks = json_decode(file_get_contents($tasksFile), true);
    $data['id'] = count($tasks) + 1; 
    $tasks[] = $data;
    file_put_contents($tasksFile, json_encode($tasks));
    echo json_encode($data);
} elseif ($method === 'PUT') {
    
    parse_str(file_get_contents("php://input"), $put_vars);
    $id = $put_vars['id'];
    $status = $put_vars['status'];
    $tasks = json_decode(file_get_contents($tasksFile), true);
    foreach ($tasks as &$task) {
        if ($task['id'] == $id) {
            $task['status'] = $status;
            break;
        }
    }
    file_put_contents($tasksFile, json_encode($tasks));
    echo json_encode($tasks);
} elseif ($method === 'DELETE') {
    
    parse_str(file_get_contents("php://input"), $del_vars);
    $id = $del_vars['id'];
    $tasks = json_decode(file_get_contents($tasksFile), true);
    $tasks = array_filter($tasks, function($task) use ($id) {
        return $task['id'] != $id;
    });
    file_put_contents($tasksFile, json_encode(array_values($tasks)));
    echo json_encode(['message' => 'Task deleted']);
}
?>