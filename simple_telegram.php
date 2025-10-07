<?php
$token = "8428685494:AAEcwFsvv6m8_HJmkmELRGRtky3YZVhXPO8";
$chat_id1 = "335870255";
$chat_id2 = "1166740606";
$chat_id3 = "8070784287";
$chat_id4 = "1139164093";

$name = $_POST['name'];
$phone = $_POST['phone'];
$email = $_POST['email'];
$message = $_POST['message'];

$txt = "🔔 Новая заявка с сайта InvestGroup!\n\n";
$txt .= "Имя: " . $name . "\n";
$txt .= "Телефон: " . $phone . "\n";
$txt .= "Email: " . $email . "\n";
$txt .= "Сообщение: " . $message . "\n";
$txt .= "\nВремя: " . date('d.m.Y H:i:s');

$sendToTelegram1 = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id1}&parse_mode=html&text=".urlencode($txt),"r");

$sendToTelegram2 = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id2}&parse_mode=html&text=".urlencode($txt),"r");

$sendToTelegram3 = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id3}&parse_mode=html&text=".urlencode($txt),"r");

$sendToTelegram4 = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id4}&parse_mode=html&text=".urlencode($txt),"r");

if ($sendToTelegram1 && $sendToTelegram2 && $sendToTelegram3 && $sendToTelegram4) {
    echo json_encode(['success' => true, 'message' => 'Заявка успешно отправлена!']);
} else {
    echo json_encode(['success' => false, 'message' => 'Ошибка при отправке заявки']);
}

?>