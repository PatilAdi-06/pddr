import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate
from reportlab.pdfgen import canvas
from reportlab.lib import colors
from report_styles import (
    get_report_styles, PAGE_WIDTH, PAGE_HEIGHT,
    LEFT_MARGIN, RIGHT_MARGIN, TOP_MARGIN, BOTTOM_MARGIN, USABLE_WIDTH,
    NumberedCanvas
)
from report_preliminary import generate_preliminary_pages
from report_ch1_to_ch3 import generate_chapters_1_to_3
from report_ch4_to_ch6 import generate_chapters_4_to_6
from report_ch7_to_ch10 import generate_chapters_7_to_10

class ChapterTrackerCanvas(canvas.Canvas):
    chapter_pages = {}
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        print(f"Total Pages in Report: {num_pages}")
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, total_pages):
        page_num = self._pageNumber
        if page_num > 6:
            body_page = page_num - 6
            self.setFont("Times-Roman", 9)
            self.drawString(LEFT_MARGIN, PAGE_HEIGHT - 38, "Personalized Diet and Daily Routine Recommendation System")
            self.drawRightString(PAGE_WIDTH - RIGHT_MARGIN, PAGE_HEIGHT - 38, "Aug - Dec 2026")
            self.setStrokeColor(colors.HexColor("#b0bec5"))
            self.setLineWidth(0.6)
            self.line(LEFT_MARGIN, PAGE_HEIGHT - 42, PAGE_WIDTH - RIGHT_MARGIN, PAGE_HEIGHT - 42)
            
            self.drawString(LEFT_MARGIN, 34, "PES University | Department of Computer Applications")
            self.drawRightString(PAGE_WIDTH - RIGHT_MARGIN, 34, str(body_page))
            self.line(LEFT_MARGIN, 44, PAGE_WIDTH - RIGHT_MARGIN, 44)

def check_pages():
    styles = get_report_styles()
    
    # We can track where headings land by injecting a special Flowable or checking Flowables
    # Let's inspect the compiled story:
    prelim = generate_preliminary_pages(styles, USABLE_WIDTH)
    ch1_3 = generate_chapters_1_to_3(styles, USABLE_WIDTH)
    ch4_6 = generate_chapters_4_to_6(styles, USABLE_WIDTH)
    ch7_10 = generate_chapters_7_to_10(styles, USABLE_WIDTH)
    
    story = prelim + ch1_3 + ch4_6 + ch7_10
    
    # Let's find chapter indices in story
    for idx, f in enumerate(story):
        if hasattr(f, 'text'):
            if 'CHAPTER' in f.text or 'BIBLIOGRAPHY' in f.text:
                print(f"Flowable {idx}: {f.text}")

if __name__ == '__main__':
    check_pages()
