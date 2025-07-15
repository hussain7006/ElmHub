import os
import uuid
from jinja2 import Environment, FileSystemLoader
from playwright.sync_api import sync_playwright
import base64



def get_base64_logo(path="assets/logo1.svg"):
    with open(path, "rb") as f:
        return f"data:image/svg+xml;base64,{base64.b64encode(f.read()).decode('utf-8')}"


def render_page(env, template_name, context):
    template = env.get_template(template_name)
    return template.render(context)


def generate_pdf_from_named_data(data: dict, output_dir="output") -> str:
    os.makedirs(output_dir, exist_ok=True)
    env = Environment(loader=FileSystemLoader("templates"))

    # Ordered mapping from data key → template name
    page_map = {
        "cover": "cover.html",
        "session": "session.html",
        "observations": "observations.html",
        "recommendations": "recommendations.html"
    }

    pages_html = []
    
    logo_base64 = get_base64_logo()
    for key, template_name in page_map.items():
        page_data = data.get(key, {})
        page_data["logo_base64"] = logo_base64  # 👈 Inject base64 logo
        html = render_page(env, template_name, {key: page_data})
        pages_html.append(html)

    filename = f"report_{uuid.uuid4().hex[:8]}.pdf"
    filepath = os.path.join(output_dir, filename)

    with sync_playwright() as p:
        print("launching browser")
        browser = p.chromium.launch()
        print("browser launched")
        page = browser.new_page()
        print("got into new page")
        all_html = "".join([f"<div style='page-break-after: always'>{html}</div>" for html in pages_html])
        page.set_content(f"<html><body>{all_html}</body></html>")
        print("converting to pdf")
        page.pdf(
            path=filepath,
            format="A4",
            print_background=True,
            margin={"top": "0px", "bottom": "0px", "left": "0px", "right": "0px"}
        )
        print("pdf generated")
        browser.close()

    return filepath


input_data = {
    "cover": {
        "top_label": "منصة مركز التميز للتوحد",
        "heading": "تقرير جلسة تقييم الذكاء الاصطناعي",
        "platform_label": "المنصة: مركز التميز للتوحد - Elm",
        "intro": (
            "يستعرض هذا التقرير مراجعة دقيقة لجلسة التقييم بناءً على البيانات التي تم جمعها باستخدام "
            "تقنيات الذكاء الاصطناعي. يتضمن التحليل تتبع التفاعلات، وقياس معدل التركيز والاستجابة، ورصد "
            "الحركات والسلوكيات الطبيعية، مما يساهم في فهم نمط استجابة الطفل. كما يوفر التقرير توصيات "
            "تهدف إلى تحسين تجربة الطفل وتطوير استراتيجيات الدعم المناسبة بهدف تحقيق بيئة تعليمية "
            "وإدراكية أكثر فعالية."
        )
        
    },
    "session": {
    "title": "ملخص الجلسة",
    "child_info": {
        "child_name": "خالد عبدالعزيز محمد",
        "age": "7 سنوات",
        "gender": "ذكر",
        "severity": "توحد متوسطة",
        "speech": "توحد متوسط",
        "date": "21/02/2025",
        "time": "10:10 A.M.",
        "duration": "30 دقيقة"
    },
    "behavior_observed": "يظهر سلوكيات البكاء والاستلقاء على الأرض عند رفض طلب أو إجباره على المشي",
    "session_summary_heading": "ملخص الجلسة",
    "session_summary_text": (
        """تمت مراقبة سلوكيات الطفل خلال الجلسة باستخدام الذكاء الاصطناعي وتحليل الحركات المرصودة 
وتفاعل الطفل مع الأنشطة المختلفة. أظهرت الجلسة بعض التحديات في إدارة المشاعر، حيث تم 
تسجيل تعبيرات سلبية مثل الصراخ والبكاء، مع تكرار حركات الهروب والضرب، مما يشير إلى حاجة 
لدعم إضافي في إدارة الانفعالات. تمت ملاحظة سلوكيات الطفل خلال الجلسة باستخدام الذكاء 
الاصطناعي وتحليل الحركات المرصودة وتفاعل الطفل مع الأنشطة المختلفة. أظهرت الجلسة بعض 
التحديات في إدارة المشاعر، حيث تم تسجيل تعبيرات سلبية مثل الصراخ والبكاء، مع تكرار حركات 
الهروب والضرب، مما يشير إلى حاجة لدعم إضافي في إدارة الانفعالات. لدعم إضافي في إدارة الانفعالات.

تمت مراقبة سلوكيات الطفل خلال الجلسة باستخدام الذكاء الاصطناعي وتحليل الحركات المرصودة 
وتفاعل الطفل مع الأنشطة المختلفة. أظهرت الجلسة بعض التحديات في إدارة المشاعر، حيث تم 
تسجيل تعبيرات سلبية مثل الصراخ والبكاء، مع تكرار حركات الهروب والضرب، تسجيل تعبيرات سلبية 
مثل الصراخ والبكاء، مع تكرار حركات الهروب والضرب.
"""
    ),
    "analysis_heading": "النتائج التحليلية",
    "analysis_items": [
        "عدد الأنشطة المكتملة: 12 من أصل 20",
        "زمن التكرار السلوكي: 240.34 ثانية",
        "زمن التركيز والانتباه: 3 دقائق",
        "أكثر حركة متكررة: تحريك اليدين"
    ]
},
    "observations": {
        "heading": "تحليل السلوكيات والملاحظات"
    },
    "recommendations": {
        "heading": "التوصيات والملاحظات النهائية"
    }
}

pdf_path = generate_pdf_from_named_data(input_data)
print("PDF saved to:", pdf_path)