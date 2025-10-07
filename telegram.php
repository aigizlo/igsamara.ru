<?php
// Отключаем вывод ошибок для продакшена
error_reporting(0);

// Настройки Telegram
$token = "8428685494:AAEcwFsvv6m8_HJmkmELRGRtky3YZVhXPO8";
$chat_ids = [
    "335870255",
    "1166740606", 
    "8070784287",
    "1139164093"
];

// Получаем данные из формы
$name = isset($_POST['name']) ? $_POST['name'] : '';
$phone = isset($_POST['phone']) ? $_POST['phone'] : '';
$email = isset($_POST['email']) ? $_POST['email'] : '';
$message = isset($_POST['message']) ? $_POST['message'] : '';

// Формируем текст сообщения
$txt = "🔔 Новая заявка с сайта InvestGroup!\n\n";

if (!empty($name)) {
    $txt .= "Имя: " . $name . "\n";
}

if (!empty($phone)) {
    $txt .= "Телефон: " . $phone . "\n";
}

if (!empty($email)) {
    $txt .= "Email: " . $email . "\n";
}

if (!empty($message)) {
    $txt .= "Сообщение: " . $message . "\n";
}

$txt .= "\nВремя: " . date('d.m.Y H:i:s');

// Счетчик успешных отправок
$success_count = 0;
$total_count = count($chat_ids);

// Отправляем сообщение каждому пользователю
foreach ($chat_ids as $chat_id) {
    $url = "https://api.telegram.org/bot{$token}/sendMessage";
    $params = [
        'chat_id' => $chat_id,
        'text' => $txt,
        'parse_mode' => 'HTML'
    ];
    
    // Отправляем через cURL для более надежной работы
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($params));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    
    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    // Проверяем успешность отправки
    if ($http_code === 200 && $response !== false) {
        $success_count++;
    }
}

// Возвращаем результат в JSON формате
header('Content-Type: application/json');

if ($success_count > 0) {
    echo json_encode([
        'success' => true, 
        'message' => 'Заявка успешно отправлена!',
        'sent_to' => $success_count,
        'total' => $total_count
    ]);
} else {
    echo json_encode([
        'success' => false, 
        'message' => 'Ошибка при отправке заявки. Попробуйте еще раз.',
        'sent_to' => 0,
        'total' => $total_count
    ]);
}
?>