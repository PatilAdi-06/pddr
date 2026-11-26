import os
import sys
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, PageBreak, KeepTogether, Image, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT, TA_RIGHT

# Page geometry
PAGE_WIDTH, PAGE_HEIGHT = A4
LEFT_MARGIN = 90   # 1.25 in
RIGHT_MARGIN = 72  # 1.0 in
TOP_MARGIN = 54    # 0.75 in
BOTTOM_MARGIN = 54 # 0.75 in
USABLE_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN

class NumberedCanvas(canvas.Canvas):
    """
    Two-pass canvas that dynamically calculates the total number of pages
    and applies compliant running headers and footers per PES University guidelines.
    """
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_decorations(self, total_pages):
        page_num = self._pageNumber
        # Preliminary pages: Pages 1 to 5 (Title, Certificate, Declaration, Abstract, TOC)
        # Guidelines state: "Page number starts from Introduction only, Abstract should not have any page number."
        if page_num > 5:
            body_page = page_num - 5
            
            # Running Header
            self.setFont("Times-Roman", 9)
            self.setFillColor(colors.HexColor("#263238"))
            self.drawString(LEFT_MARGIN, PAGE_HEIGHT - 38, "Personalized Diet and Daily Routine Recommendation System")
            self.drawRightString(PAGE_WIDTH - RIGHT_MARGIN, PAGE_HEIGHT - 38, "Aug - Dec 2026")
            
            # Header separator rule
            self.setStrokeColor(colors.HexColor("#b0bec5"))
            self.setLineWidth(0.6)
            self.line(LEFT_MARGIN, PAGE_HEIGHT - 42, PAGE_WIDTH - RIGHT_MARGIN, PAGE_HEIGHT - 42)
            
            # Running Footer
            self.setFont("Times-Roman", 9)
            self.drawString(LEFT_MARGIN, 34, "PES University | Department of Computer Applications")
            self.drawRightString(PAGE_WIDTH - RIGHT_MARGIN, 34, str(body_page))
            
            # Footer separator rule
            self.line(LEFT_MARGIN, 44, PAGE_WIDTH - RIGHT_MARGIN, 44)

print("NumberedCanvas ready.")
