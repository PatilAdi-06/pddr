import os
import sys

sys.path.insert(0, os.path.abspath('scripts'))

from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Flowable
from reportlab.pdfgen import canvas
from reportlab.lib import colors

from report_styles import (
    get_report_styles, PAGE_WIDTH, PAGE_HEIGHT,
    LEFT_MARGIN, RIGHT_MARGIN, TOP_MARGIN, BOTTOM_MARGIN, USABLE_WIDTH
)
from report_preliminary import generate_preliminary_pages
from report_ch1_to_ch3 import generate_chapters_1_to_3
from report_ch4_to_ch6 import generate_chapters_4_to_6
from report_ch7_to_ch10 import generate_chapters_7_to_10

chapter_page_map = {}

class BookmarkFlowable(Flowable):
    def __init__(self, key):
        super().__init__()
        self.key = key
        self.width = 0
        self.height = 0

    def draw(self):
        page = self.canv._pageNumber
        chapter_page_map[self.key] = page

def track():
    styles = get_report_styles()
    
    prelim = generate_preliminary_pages(styles, USABLE_WIDTH)
    ch1_3 = generate_chapters_1_to_3(styles, USABLE_WIDTH)
    ch4_6 = generate_chapters_4_to_6(styles, USABLE_WIDTH)
    ch7_10 = generate_chapters_7_to_10(styles, USABLE_WIDTH)
    
    story = []
    story.extend(prelim)
    
    # Let's inspect and tag each chapter
    for group in [ch1_3, ch4_6, ch7_10]:
        for item in group:
            if hasattr(item, 'text'):
                if item.text in ['CHAPTER 1', 'CHAPTER 2', 'CHAPTER 3', 'CHAPTER 4', 'CHAPTER 5', 'CHAPTER 6', 'CHAPTER 7', 'CHAPTER 8', 'CHAPTER 9', 'CHAPTER 10', 'BIBLIOGRAPHY']:
                    story.append(BookmarkFlowable(item.text))
            story.append(item)
            
    doc = SimpleDocTemplate(
        "test_track.pdf",
        pagesize=A4,
        leftMargin=LEFT_MARGIN,
        rightMargin=RIGHT_MARGIN,
        topMargin=TOP_MARGIN,
        bottomMargin=BOTTOM_MARGIN
    )
    
    doc.build(story)
    
    print("=== EXACT CHAPTER STARTING PAGES ===")
    for k, v in chapter_page_map.items():
        # Preliminary pages are pages 1 through 6
        body_p = v - 6
        print(f"{k}: PDF Page {v} -> Body Page {body_p}")

if __name__ == '__main__':
    track()
