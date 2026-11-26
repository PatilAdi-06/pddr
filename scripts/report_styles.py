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

PAGE_WIDTH, PAGE_HEIGHT = A4
LEFT_MARGIN = 90    # 1.25 in
RIGHT_MARGIN = 72   # 1.0 in
TOP_MARGIN = 54     # 0.75 in
BOTTOM_MARGIN = 54  # 0.75 in
USABLE_WIDTH = PAGE_WIDTH - LEFT_MARGIN - RIGHT_MARGIN

class NumberedCanvas(canvas.Canvas):
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
        # Preliminary pages are pages 1 through 7 (Title, Certificate, Declaration, Abstract, Acknowledgements, TOC)
        # Main body starts on Page 8 (Chapter 1: Introduction) as Body Page 1
        if page_num > 7:
            body_page = page_num - 7
            # Header
            self.setFont("Times-Roman", 9)
            self.setFillColor(colors.HexColor("#37474f"))
            self.drawString(LEFT_MARGIN, PAGE_HEIGHT - 38, "Personalized Diet and Daily Routine Recommendation System")
            self.drawRightString(PAGE_WIDTH - RIGHT_MARGIN, PAGE_HEIGHT - 38, "Aug - Dec 2026")
            
            # Header line
            self.setStrokeColor(colors.HexColor("#b0bec5"))
            self.setLineWidth(0.6)
            self.line(LEFT_MARGIN, PAGE_HEIGHT - 42, PAGE_WIDTH - RIGHT_MARGIN, PAGE_HEIGHT - 42)
            
            # Footer
            self.setFont("Times-Roman", 9)
            self.drawString(LEFT_MARGIN, 34, "PES University | Department of Computer Applications")
            self.drawRightString(PAGE_WIDTH - RIGHT_MARGIN, 34, str(body_page))
            self.line(LEFT_MARGIN, 44, PAGE_WIDTH - RIGHT_MARGIN, 44)

def get_report_styles():
    styles = getSampleStyleSheet()
    
    # Times New Roman font definitions
    styles.add(ParagraphStyle(
        'DocTitle',
        fontName='Times-Bold',
        fontSize=18,
        leading=24,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#0d47a1")
    ))
    styles.add(ParagraphStyle(
        'DocSubtitle',
        fontName='Times-Bold',
        fontSize=13,
        leading=18,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#263238")
    ))
    styles.add(ParagraphStyle(
        'UnivHeader',
        fontName='Times-Bold',
        fontSize=14,
        leading=18,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#b71c1c")
    ))
    styles.add(ParagraphStyle(
        'UnivSub',
        fontName='Times-Roman',
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        textColor=colors.HexColor("#37474f")
    ))
    styles.add(ParagraphStyle(
        'ChapterHeading',
        fontName='Times-Bold',
        fontSize=15,
        leading=20,
        alignment=TA_CENTER,
        spaceBefore=14,
        spaceAfter=20,
        textColor=colors.HexColor("#1a237e"),
        keepWithNext=True
    ))
    styles.add(ParagraphStyle(
        'SectionHeading',
        fontName='Times-Bold',
        fontSize=13,
        leading=17,
        alignment=TA_LEFT,
        spaceBefore=14,
        spaceAfter=6,
        textColor=colors.HexColor("#0d47a1"),
        keepWithNext=True
    ))
    styles.add(ParagraphStyle(
        'SubSectionHeading',
        fontName='Times-Bold',
        fontSize=11.5,
        leading=15,
        alignment=TA_LEFT,
        spaceBefore=10,
        spaceAfter=4,
        textColor=colors.HexColor("#263238"),
        keepWithNext=True
    ))
    styles.add(ParagraphStyle(
        'ReportBody',
        fontName='Times-Roman',
        fontSize=12,
        leading=18,  # 1.5 line spacing
        alignment=TA_JUSTIFY,
        spaceAfter=8,
        textColor=colors.HexColor("#1b1b1b")
    ))
    styles.add(ParagraphStyle(
        'ReportBodyIndent',
        fontName='Times-Roman',
        fontSize=12,
        leading=18,
        alignment=TA_JUSTIFY,
        firstLineIndent=24,
        spaceAfter=8,
        textColor=colors.HexColor("#1b1b1b")
    ))
    styles.add(ParagraphStyle(
        'ReportBullet',
        fontName='Times-Roman',
        fontSize=12,
        leading=18,
        alignment=TA_JUSTIFY,
        leftIndent=18,
        spaceAfter=4,
        textColor=colors.HexColor("#1b1b1b")
    ))
    styles.add(ParagraphStyle(
        'AlgorithmBox',
        fontName='Courier',
        fontSize=9,
        leading=13,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#1a237e")
    ))
    styles.add(ParagraphStyle(
        'FigCaption',
        fontName='Times-Italic',
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        spaceBefore=5,
        spaceAfter=12,
        textColor=colors.HexColor("#37474f")
    ))
    styles.add(ParagraphStyle(
        'TblCaption',
        fontName='Times-Bold',
        fontSize=10,
        leading=14,
        alignment=TA_CENTER,
        spaceBefore=10,
        spaceAfter=4,
        textColor=colors.HexColor("#263238")
    ))
    styles.add(ParagraphStyle(
        'TblCell',
        fontName='Times-Roman',
        fontSize=9.5,
        leading=13,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#212121")
    ))
    styles.add(ParagraphStyle(
        'TblCellBold',
        fontName='Times-Bold',
        fontSize=9.5,
        leading=13,
        alignment=TA_LEFT,
        textColor=colors.HexColor("#0d47a1")
    ))
    styles.add(ParagraphStyle(
        'EquationStyle',
        fontName='Times-Italic',
        fontSize=11,
        leading=16,
        alignment=TA_CENTER,
        spaceBefore=6,
        spaceAfter=6,
        textColor=colors.HexColor("#1b1b1b")
    ))
    return styles

print("Report styles configured successfully.")
