<?php
set_time_limit(0);

header('Content-Type: text/event-stream');
header('Cache-Control: no-cache');
header('Connection: keep-alive');

$file = 'store_orders.json';
$lastKnownMTime = file_exists($file) ? filemtime($file) : 0;

while (true) {
    clearstatcache();
    $currentMtime = file_exists($file) ? filemtime($file) : 0;

    if ($currentMtime > $lastKnownMTime) {
        echo "event: update\n";
        echo "data: " . json_encode(['updated' => true]) . "\n\n";

        $lastKnownMTime = $currentMtime;
    }

    echo ": heartbeat\n\n";

    ob_flush();
    flush();
    sleep(2);
}
?>