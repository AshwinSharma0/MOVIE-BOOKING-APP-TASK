import os
import smtplib
import threading
import time
from email.message import EmailMessage
from queue import Queue
import logging

logger = logging.getLogger(__name__)
email_queue: Queue[dict] = Queue()

SMTP_HOST = os.getenv('SMTP_HOST')
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SMTP_USERNAME = os.getenv('SMTP_USERNAME')
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
SMTP_FROM = os.getenv('SMTP_FROM', 'no-reply@example.com')
SMTP_USE_TLS = os.getenv('SMTP_USE_TLS', 'true').lower() in ('1', 'true', 'yes')
SMTP_USE_SSL = os.getenv('SMTP_USE_SSL', 'false').lower() in ('1', 'true', 'yes')


def send_email(message: EmailMessage) -> None:
    if not SMTP_HOST:
        logger.warning('SMTP_HOST not configured; skipping email send')
        return

    try:
        if SMTP_USE_SSL:
            with smtplib.SMTP_SSL(SMTP_HOST, SMTP_PORT) as smtp:
                if SMTP_USERNAME and SMTP_PASSWORD:
                    smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
                smtp.send_message(message)
        else:
            with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as smtp:
                smtp.ehlo()
                if SMTP_USE_TLS:
                    smtp.starttls()
                    smtp.ehlo()
                if SMTP_USERNAME and SMTP_PASSWORD:
                    smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
                smtp.send_message(message)

        logger.info('Email sent to %s', message['To'])
    except Exception as exc:
        logger.exception('Failed to send email: %s', exc)


def enqueue_email(to_email: str, subject: str, body: str, html_body: str | None = None) -> None:
    email_queue.put({
        'to_email': to_email,
        'subject': subject,
        'body': body,
        'html_body': html_body
    })


def create_email_message(to_email: str, subject: str, body: str, html_body: str | None = None) -> EmailMessage:
    message = EmailMessage()
    message['Subject'] = subject
    message['From'] = SMTP_FROM
    message['To'] = to_email
    message.set_content(body)
    if html_body:
        message.add_alternative(html_body, subtype='html')
    return message


def email_worker_loop():
    while True:
        job = email_queue.get()
        if job is None:
            break

        message = create_email_message(
            job['to_email'],
            job['subject'],
            job['body'],
            job.get('html_body')
        )
        send_email(message)
        email_queue.task_done()
        time.sleep(0.5)


def start_email_worker() -> threading.Thread:
    thread = threading.Thread(target=email_worker_loop, daemon=True)
    thread.start()
    return thread
