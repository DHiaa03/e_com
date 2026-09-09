import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.core.config import settings

logger = logging.getLogger("uvicorn.error")

def send_order_notification_email(order_data: dict):
    """
    Sends an automated email notification to the store owner (admin) when a new order is placed.
    Gracefully logs and handles errors if SMTP server is unconfigured or unreachable.
    """
    if not settings.SMTP_HOST or not settings.ADMIN_NOTIFICATION_EMAIL:
        logger.info("[SMTP] Email notification skipped: SMTP_HOST or ADMIN_NOTIFICATION_EMAIL not configured.")
        return

    try:
        subject = f"🔔 طلب جديد #{order_data.get('order_number')} - BLACK ELEGANCE"
        
        # HTML Content
        items_html = ""
        for item in order_data.get("items", []):
            items_html += f"""
            <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">{item.get('product_name')}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">{item.get('variant_details', '-')}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: center;">{item.get('quantity')}</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee; text-align: right;">{item.get('subtotal')} د.ج / SAR</td>
            </tr>
            """

        html_body = f"""
        <!DOCTYPE html>
        <html dir="rtl" lang="ar">
        <head>
            <meta charset="UTF-8">
            <style>
                body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px; }}
                .container {{ background-color: #ffffff; max-width: 600px; margin: 0 auto; padding: 25px; border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.08); }}
                .header {{ border-bottom: 2px solid #111; padding-bottom: 15px; margin-bottom: 20px; text-align: center; }}
                .header h1 {{ margin: 0; color: #111; font-size: 24px; letter-spacing: 2px; }}
                .badge {{ background-color: #111; color: #fff; padding: 4px 12px; border-radius: 20px; font-size: 12px; display: inline-block; margin-top: 5px; }}
                .section {{ margin-bottom: 20px; }}
                .section-title {{ font-weight: bold; color: #333; margin-bottom: 8px; border-bottom: 1px solid #eee; padding-bottom: 4px; }}
                table {{ width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }}
                th {{ background-color: #f9f9f9; padding: 8px; text-align: right; border-bottom: 2px solid #ddd; }}
                .total-row {{ font-weight: bold; font-size: 16px; color: #111; }}
                .footer {{ text-align: center; font-size: 12px; color: #888; margin-top: 30px; }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>BLACK ELEGANCE</h1>
                    <span class="badge">إشعار طلب جديد (الدفع عند الاستلام)</span>
                </div>
                
                <div class="section">
                    <div class="section-title">بيانات الطلب #{order_data.get('order_number')}</div>
                    <p><strong>تاريخ الطلب:</strong> {order_data.get('created_at')}</p>
                    <p><strong>طريقة الدفع:</strong> الدفع عند الاستلام (Cash on Delivery)</p>
                    <p><strong>حالة الطلب:</strong> قيد المراجعة (Pending)</p>
                </div>

                <div class="section">
                    <div class="section-title">بيانات العميل</div>
                    <p><strong>الاسم:</strong> {order_data.get('customer_name')}</p>
                    <p><strong>الهاتف:</strong> {order_data.get('phone')}</p>
                    <p><strong>العنوان:</strong> {order_data.get('address')}</p>
                    {f"<p><strong>المدينة:</strong> {order_data.get('city')}</p>" if order_data.get('city') else ""}
                    {f"<p><strong>ملاحظات:</strong> {order_data.get('notes')}</p>" if order_data.get('notes') else ""}
                </div>

                <div class="section">
                    <div class="section-title">المنتجات المطلوبة</div>
                    <table>
                        <thead>
                            <tr>
                                <th>المنتج</th>
                                <th>المتغير</th>
                                <th style="text-align: center;">الكمية</th>
                                <th style="text-align: right;">المجموع</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items_html}
                            <tr class="total-row">
                                <td colspan="3" style="padding: 12px 8px; text-align: left;">المجموع الكلي:</td>
                                <td style="padding: 12px 8px; text-align: right; color: #b8860b;">{order_data.get('total_amount')}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="footer">
                    تم إرسال هذا الإشعار تلقائياً من نظام متجر BLACK ELEGANCE.
                </div>
            </div>
        </body>
        </html>
        """

        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = f"{settings.EMAILS_FROM_NAME} <{settings.EMAILS_FROM_EMAIL}>"
        msg["To"] = settings.ADMIN_NOTIFICATION_EMAIL

        part = MIMEText(html_body, "html", "utf-8")
        msg.attach(part)

        # Connect and send
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=10) as server:
            server.ehlo()
            if settings.SMTP_PORT == 587:
                server.starttls()
                server.ehlo()
            if settings.SMTP_USER and settings.SMTP_PASSWORD:
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
            server.sendmail(settings.EMAILS_FROM_EMAIL, [settings.ADMIN_NOTIFICATION_EMAIL], msg.as_string())
            logger.info(f"[SMTP] Order notification sent for order #{order_data.get('order_number')}")

    except Exception as e:
        logger.warning(f"[SMTP] Failed to send order email notification: {str(e)}")
