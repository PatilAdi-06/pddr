import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate

from report_styles import (
    get_report_styles, PAGE_WIDTH, PAGE_HEIGHT,
    LEFT_MARGIN, RIGHT_MARGIN, TOP_MARGIN, BOTTOM_MARGIN, USABLE_WIDTH,
    NumberedCanvas
)
from report_preliminary import generate_preliminary_pages
from report_ch1_to_ch3 import generate_chapters_1_to_3
from report_ch4_to_ch6 import generate_chapters_4_to_6
from report_ch7_to_ch10 import generate_chapters_7_to_10

def build_pdf():
    pdf_filename = "PDDR_Capstone_Phase1_Report.pdf"
    doc = SimpleDocTemplate(
        pdf_filename,
        pagesize=A4,
        leftMargin=LEFT_MARGIN,
        rightMargin=RIGHT_MARGIN,
        topMargin=TOP_MARGIN,
        bottomMargin=BOTTOM_MARGIN
    )
    
    styles = get_report_styles()
    
    story = []
    print("Compiling Preliminary Pages...")
    story.extend(generate_preliminary_pages(styles, USABLE_WIDTH))
    
    print("Compiling Chapters 1 to 3...")
    story.extend(generate_chapters_1_to_3(styles, USABLE_WIDTH))
    
    print("Compiling Chapters 4 to 6...")
    story.extend(generate_chapters_4_to_6(styles, USABLE_WIDTH))
    
    print("Compiling Chapters 7 to 10 and Bibliography...")
    story.extend(generate_chapters_7_to_10(styles, USABLE_WIDTH))
    
    print(f"Total Flowable elements: {len(story)}")
    print("Building PDF with two-pass NumberedCanvas...")
    doc.build(story, canvasmaker=NumberedCanvas)
    
    print(f"\nPDF successfully generated: {os.path.abspath(pdf_filename)}")
    size_mb = os.path.getsize(pdf_filename) / (1024 * 1024)
    print(f"File Size: {size_mb:.2f} MB")

if __name__ == '__main__':
    build_pdf()
