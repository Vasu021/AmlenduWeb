<?php
    $name = $_POST['name'];
    $visitor_email = $_POST['email'];
    $message = $_POST['message'];
    $email_from = 'amlendushekhar828@gmail.com';
    $email_subject = "New form submission";
    $email_body = "Username: $name.\n".
                    "User email: $visitor_email.\n".
                        "User message: $message.\n";

    $to = "amlendushekharcss_cse18@its.edu.in";
    $headers = "From: $email_from \r\n";
    $headers = "Reply-to: $visitor_email \r\n";

    mail($to,$email_subject,$email_body,$headers);
    header("Location: index.html");
?>