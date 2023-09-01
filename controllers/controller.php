<?php
    $data = file_get_contents('php://input');
    $score = json_decode($data, TRUE)['score'];

    try {
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "touch_claro";

        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $sql = "UPDATE wp_tablesome_table_1004 SET score = '".$score."' WHERE id = (SELECT MAX(id) FROM wp_tablesome_table_1004); ";

        if ($conn->query($sql) === TRUE) {
            echo "New record created successfully";
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }

        $conn->close();
    }catch(PDOException $e) {
        echo "Connection failed: " . $e->getMessage();
    }    
?>