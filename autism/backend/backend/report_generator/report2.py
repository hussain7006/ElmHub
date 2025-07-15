import os
import uuid
from jinja2 import Environment, FileSystemLoader
from playwright.async_api import async_playwright
import base64
from PyPDF2 import PdfMerger
import traceback


# Function to get base64 encoded logo
def get_base64_logo(path="report_generator/assets/logo1.svg"):
    with open(path, "rb") as f:
        return f"data:image/svg+xml;base64,{base64.b64encode(f.read()).decode('utf-8')}"


# Function to render HTML templates
def render_page(env, template_name, context):
    template = env.get_template(template_name)
    return template.render(context)


# Function to merge PDF files
def merge_pdfs(pdf_paths, output_path):
    merger = PdfMerger()
    for pdf in pdf_paths:
        print("merging pdfs: ", pdf)
        merger.append(pdf)
    merger.write(output_path)
    merger.close()


# Function to generate PDF from multiple pages
async def generate_pdf_from_named_data(
    sessionid: int, data: dict, output_dir="generated_reports"
) -> str:
    try:
        os.makedirs(output_dir, exist_ok=True)
        env = Environment(loader=FileSystemLoader("report_generator/templates"))

        page_map = ["cover", "session", "observations", "recommendations"]
        pages_html = []
        logo_base64 = get_base64_logo()

        for template in page_map:
            print("template adding:", template)
            page_data = data.get(template, {})
            page_data["logo_base64"] = logo_base64
            html = render_page(env, f"{template}.html", {template: page_data})
            pages_html.append(html)

        filename = f"report_{uuid.uuid4().hex[:8]}.pdf"
        filepath = os.path.join(output_dir, filename)
        pdf_paths = []

        async with async_playwright() as p:
            browser = await p.chromium.launch()
            page = await browser.new_page()

            for index, page_html in enumerate(pages_html):
                await page.set_content(page_html)
                page_pdf_path = os.path.join(output_dir, f"page_{index + 1}.pdf")
                await page.pdf(
                    path=page_pdf_path,
                    format="A4",
                    print_background=True,
                    margin={
                        "top": "60px",
                        "bottom": "40px",
                        "left": "60px",
                        "right": "60px",
                    },
                )
                pdf_paths.append(page_pdf_path)

            await browser.close()

        final_pdf_path = os.path.join(output_dir, f"final_report_{sessionid}.pdf")
        merge_pdfs(pdf_paths, final_pdf_path)

        return final_pdf_path

    except Exception as e:
        print("PDF generation error:", e)
        traceback.print_exc()
        raise  # Optional: re-raise or return None


# Example Input Data (you can replace this with actual data)
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
        ),
    },
    "session": {
        "top_label": "منصة مركز التميز للتوحد",
        "title": "ملخص الجلسة",
        "child_info": {
            "child_name": "خالد عبدالعزيز محمد",
            "age": "7 سنوات",
            "gender": "ذكر",
            "severity": "توحد متوسطة",
            "speech": "توحد متوسط",
            "date": "21/02/2025",
            "time": "10:10 A.M.",
            "duration": "30 دقيقة",
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
            "أكثر حركة متكررة: تحريك اليدين",
        ],
    },
    "observations": {"heading": "تحليل السلوكيات والملاحظات"},
    "recommendations": {"heading": "التوصيات والملاحظات النهائية"},
}

# # Generate the PDF and get the path
# pdf_path = generate_pdf_from_named_data(input_data)
# print("PDF saved to:", pdf_path)
