<?php
// Simple PayFast notification handler (basic example)
$pfData = file_get_contents('php://input');
file_put_contents('payfast_log.txt', $pfData, FILE_APPEND);
?>
