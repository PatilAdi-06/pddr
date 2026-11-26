import os
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib import colors

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
        # Skip decorations on preliminary pages: 1 (Title), 2 (Cert), 3 (Decl), 4 (Abstract), 5 (TOC)
        # Let's say preliminary pages are marked or page_num <= 5
        if page_num > 5:
            body_page = page_num - 5
            # Header
            self.setFont("Times-Roman", 9)
            self.setFillColor(colors.HexColor("#37474f"))
            self.drawString(90, 841.89 - 42, "Personalized Diet & Daily Routine Recommendation System")
            self.drawRightString(595.27 - 72, 841.89 - 42, "Aug - Dec 2026")
            
            # Header line
            self.setStrokeColor(colors.HexColor("#cfd8dc"))
            self.setLineWidth(0.75)
            self.line(90, 841.89 - 46, 595.27 - 72, 841.89 - 46)
            
            # Footer
            self.setFont("Times-Roman", 9)
            self.drawString(90, 36, "PES University | Department of Computer Applications")
            self.drawRightString(595.27 - 72, 36, str(body_page))
            
            # Footer line
            self.line(90, 48, 595.27 - 72, 48)

print("NumberedCanvas prototype defined successfully!")
