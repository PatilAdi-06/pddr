import os
from reportlab.platypus import Paragraph, Spacer, PageBreak, Image, Table, TableStyle
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT

def generate_preliminary_pages(styles, usable_width):
    story = []
    
    # -------------------------------------------------------------------------
    # PAGE 1: TITLE PAGE
    # -------------------------------------------------------------------------
    story.append(Paragraph("PES UNIVERSITY", styles['UnivHeader']))
    story.append(Paragraph("(Established under Karnataka Act No. 16 of 2013)", styles['UnivSub']))
    story.append(Paragraph("100-ft Ring Road, BSK III Stage, Bengaluru – 560 085, Karnataka, India", styles['UnivSub']))
    story.append(Spacer(1, 15))
    
    # University Logo
    logo_path = 'report_assets/image4.png'
    if os.path.exists(logo_path):
        img = Image(logo_path, width=80, height=136)
        img.hAlign = 'CENTER'
        story.append(img)
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Capstone Project Report (Phase-1)", styles['DocSubtitle']))
    story.append(Paragraph("on", styles['UnivSub']))
    story.append(Spacer(1, 5))
    story.append(Paragraph("PERSONALIZED DIET AND DAILY ROUTINE RECOMMENDATION SYSTEM", styles['DocTitle']))
    story.append(Spacer(1, 5))
    story.append(Paragraph("A Machine Learning & Conversational AI-Based Mobile Wellness Platform", styles['DocSubtitle']))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Submitted by", styles['UnivSub']))
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>ADARSH SHEETAL PATIL</b><br/>(SRN: PES1PG25CA008)", styles['DocSubtitle']))
    story.append(Spacer(1, 5))
    story.append(Paragraph("in partial fulfillment for the award of the degree of", styles['UnivSub']))
    story.append(Paragraph("<b>MASTER OF COMPUTER APPLICATIONS</b>", styles['DocSubtitle']))
    story.append(Paragraph("Course Code: UQ25CA741A", styles['UnivSub']))
    story.append(Spacer(1, 15))
    
    story.append(Paragraph("Under the guidance of", styles['UnivSub']))
    story.append(Spacer(1, 3))
    story.append(Paragraph("<b>Prof. P. Sreenivas</b><br/>Assistant Professor<br/>Department of Computer Applications<br/>PES University, Bengaluru – 560 085", styles['DocSubtitle']))
    story.append(Spacer(1, 20))
    story.append(Paragraph("<b>DEPARTMENT OF COMPUTER APPLICATIONS</b><br/>FACULTY OF ENGINEERING, PES UNIVERSITY<br/>August 2026 – December 2026", styles['UnivSub']))
    story.append(PageBreak())
    
    # -------------------------------------------------------------------------
    # PAGE 2: CERTIFICATE PAGE
    # -------------------------------------------------------------------------
    story.append(Paragraph("PES UNIVERSITY", styles['UnivHeader']))
    story.append(Paragraph("FACULTY OF ENGINEERING", styles['DocSubtitle']))
    story.append(Paragraph("DEPARTMENT OF COMPUTER APPLICATIONS", styles['DocSubtitle']))
    story.append(Paragraph("PROGRAM – MASTER OF COMPUTER APPLICATIONS", styles['UnivSub']))
    story.append(Spacer(1, 15))
    
    cert_title_style = styles['ChapterHeading']
    story.append(Paragraph("CERTIFICATE", cert_title_style))
    story.append(Spacer(1, 15))
    
    cert_body = (
        "This is to certify that the project entitled <b>\"Personalized Diet and Daily Routine "
        "Recommendation System\"</b> is a bonafide work carried out by <b>ADARSH SHEETAL PATIL "
        "(SRN: PES1PG25CA008)</b> in partial fulfillment for the completion of Capstone Project, "
        "Phase-1 work in the Program of Study <b>Master of Computer Applications (MCA)</b> under rules "
        "and regulations of PES University, Bengaluru during the academic semester August – December 2026. "
        "The project report has been examined and approved as it satisfies the academic requirements of "
        "the 3rd semester MCA Capstone Project Phase-1 curriculum."
    )
    story.append(Paragraph(cert_body, styles['ReportBody']))
    story.append(Spacer(1, 70))
    
    # Signature blocks
    sig_data = [
        [
            Paragraph("____________________________<br/><b>Signature with date</b><br/><b>Prof. P. Sreenivas</b><br/>Guide & Assistant Professor<br/>Dept. of Computer Applications<br/>PES University, Bengaluru – 560 085", styles['TblCell']),
            Paragraph("____________________________<br/><b>Signature with date & Seal</b><br/><b>Dr. Veena S</b><br/>Chairperson & Professor<br/>Dept. of Computer Applications<br/>PES University, Bengaluru – 560 085", styles['TblCell'])
        ]
    ]
    sig_table = Table(sig_data, colWidths=[usable_width * 0.5, usable_width * 0.5])
    sig_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(sig_table)
    story.append(PageBreak())
    
    # -------------------------------------------------------------------------
    # PAGE 3: DECLARATION PAGE
    # -------------------------------------------------------------------------
    story.append(Paragraph("DECLARATION", styles['ChapterHeading']))
    story.append(Spacer(1, 20))
    
    decl_body = (
        "I, <b>ADARSH SHEETAL PATIL</b>, bearing SRN <b>PES1PG25CA008</b>, student of 3rd Semester "
        "Master of Computer Applications (MCA), Department of Computer Applications, PES University, "
        "Bengaluru, hereby declare that the Capstone Project Phase-1 report entitled <b>\"Personalized "
        "Diet and Daily Routine Recommendation System\"</b> is an original work carried out by me under "
        "the guidance and supervision of <b>Prof. P. Sreenivas</b>, Assistant Professor, Department of "
        "Computer Applications, PES University, Bengaluru.<br/><br/>"
        "This project report is being submitted in partial fulfillment of the requirements for the "
        "completion of the 3rd Semester course <b>UQ25CA741A - Capstone Project Phase-1</b> in the Master "
        "of Computer Applications curriculum. I further declare that this report has not been submitted "
        "previously to any other university or institution for the award of any degree, diploma, or fellowship.<br/><br/>"
        "All suggestions, enhancements, and corrections indicated during internal reviews and guide "
        "evaluations have been diligently incorporated into this report."
    )
    story.append(Paragraph(decl_body, styles['ReportBody']))
    story.append(Spacer(1, 80))
    
    decl_sig_data = [
        [
            Paragraph("<b>Place:</b> Bengaluru<br/><b>Date:</b> November 27, 2026", styles['TblCell']),
            Paragraph("____________________________<br/><b>ADARSH SHEETAL PATIL</b><br/>SRN: PES1PG25CA008<br/>Department of Computer Applications<br/>PES University, Bengaluru", styles['TblCell'])
        ]
    ]
    decl_table = Table(decl_sig_data, colWidths=[usable_width * 0.5, usable_width * 0.5])
    decl_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 10),
    ]))
    story.append(decl_table)
    story.append(PageBreak())
    
    # -------------------------------------------------------------------------
    # PAGE 4: ABSTRACT
    # -------------------------------------------------------------------------
    story.append(Spacer(1, 10))
    story.append(Paragraph("ABSTRACT", styles['ChapterHeading']))
    story.append(Spacer(1, 10))
    
    abs_p1 = (
        "Maintaining a balanced diet and regular daily routine is increasingly critical in modern society "
        "due to the surging incidence of sedentary lifestyle disorders, including obesity, type-2 diabetes, "
        "and cardiovascular complications. However, individuals encounter substantial difficulties adhering "
        "to healthy regimens because existing digital health solutions present static, one-size-fits-all diet "
        "charts that fail to adapt to individual anthropometric variations, dynamic metabolic rates, regional "
        "food preferences, and ingredient availability. Furthermore, daily wellness tracking is fragmented across "
        "multiple disjoint applications for diet logging, water tracking, physical exercise, and sleep monitoring, "
        "inducing cognitive fatigue and high user attrition."
    )
    story.append(Paragraph(abs_p1, styles['ReportBody']))
    
    abs_p2 = (
        "To resolve these challenges, this Capstone Project develops <b>Daylight Wellness (PDDR)</b>, an integrated, "
        "machine learning and conversational artificial intelligence-based mobile wellness platform. The system "
        "synthesizes personal health parameters—including age, biological sex, height, body weight, physical "
        "activity multiplier, target goal, dietary preference, and allergies—to calibrate individual Basal Metabolic "
        "Rate (BMR) and Total Daily Energy Expenditure (TDEE) via the validated Mifflin-St Jeor formulation. "
        "Utilizing an authentic Indian Food Composition dataset curated by the National Institute of Nutrition (NIN-ICMR), "
        "the application automatically constructs an adaptive five-meal daily plan (Breakfast, Morning Snack, Lunch, "
        "Evening Snack, and Dinner) calibrated within 95–100% of the calculated caloric target."
    )
    story.append(Paragraph(abs_p2, styles['ReportBody']))
    
    abs_p3 = (
        "The platform introduces three innovative pillars: (1) <b>Daylight AI Diet Coach</b>, leveraging the Google "
        "Gemini 1.5 Flash API with a localized fallback engine for real-time conversational nutritional consultation; "
        "(2) a <b>Circadian Routine Synchronization Engine</b> comprising seven structured daily milestones with real-time "
        "meal-completion driven progress visualization (scaling precisely at 0%, 20%, 40%, 60%, 80%, and 100% completed); "
        "and (3) an <b>Offline-First Architecture</b> packaged via Progressive Web Application (PWA) standards and Trusted Web "
        "Activity (TWA) WebAPK for Android deployment. In this Phase-1 milestone, over 80% of total system capabilities "
        "have been engineered, integrated with PostgreSQL 16 persistence and automated Nodemailer SMTP reminder schedulers, "
        "and rigorously verified across automated test suites."
    )
    story.append(Paragraph(abs_p3, styles['ReportBody']))
    story.append(Spacer(1, 10))
    story.append(Paragraph("<b>Keywords:</b> Personalized Nutrition, Recommender Systems, mHealth, Mifflin-St Jeor Formula, Conversational AI, Circadian Synchronization, Offline-First PWA, Android TWA.", styles['ReportBody']))
    story.append(PageBreak())
    
    # -------------------------------------------------------------------------
    # PAGE 5: ACKNOWLEDGEMENTS
    # -------------------------------------------------------------------------
    story.append(Paragraph("ACKNOWLEDGEMENTS", styles['ChapterHeading']))
    story.append(Spacer(1, 15))
    
    ack_body = (
        "I express my profound gratitude to my project guide, <b>Prof. P. Sreenivas</b>, Assistant Professor, "
        "Department of Computer Applications, PES University, for his invaluable guidance, continuous encouragement, "
        "and meticulous technical feedback throughout the execution of this Capstone Project Phase-1.<br/><br/>"
        "I extend my sincere thanks to <b>Dr. Veena S</b>, Professor and Chairperson, Department of Computer Applications, "
        "PES University, for providing exceptional academic infrastructure, departmental facilities, and overall support "
        "that enabled the successful realization of this project.<br/><br/>"
        "I am grateful to all the faculty members of the Department of Computer Applications, PES University, for their "
        "scholarly insights and constructively evaluating project milestones during presentation reviews.<br/><br/>"
        "Finally, I express my heartfelt indebtedness to my parents, family members, and friends for their enduring patience, "
        "moral encouragement, and steadfast belief in my aspirations throughout this endeavor."
    )
    story.append(Paragraph(ack_body, styles['ReportBody']))
    story.append(Spacer(1, 40))
    story.append(Paragraph("<b>ADARSH SHEETAL PATIL</b><br/>SRN: PES1PG25CA008", styles['ReportBody']))
    story.append(PageBreak())
    
    # -------------------------------------------------------------------------
    # PAGE 6: TABLE OF CONTENTS
    # -------------------------------------------------------------------------
    story.append(Paragraph("TABLE OF CONTENTS", styles['ChapterHeading']))
    story.append(Spacer(1, 10))
    
    toc_data = [
        [Paragraph("<b>Chapter No.</b>", styles['TblCellBold']), Paragraph("<b>Chapter Title / Section</b>", styles['TblCellBold']), Paragraph("<b>Page No.</b>", styles['TblCellBold'])],
        [Paragraph("", styles['TblCell']), Paragraph("<b>Certificate</b>", styles['TblCell']), Paragraph("ii", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("<b>Declaration</b>", styles['TblCell']), Paragraph("iii", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("<b>Abstract</b>", styles['TblCell']), Paragraph("iv", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("<b>Acknowledgements</b>", styles['TblCell']), Paragraph("v", styles['TblCell'])],
        [Paragraph("<b>1</b>", styles['TblCellBold']), Paragraph("<b>INTRODUCTION</b>", styles['TblCellBold']), Paragraph("<b>1</b>", styles['TblCellBold'])],
        [Paragraph("", styles['TblCell']), Paragraph("1.1 Background and Motivation", styles['TblCell']), Paragraph("1", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("1.2 Domain Overview", styles['TblCell']), Paragraph("2", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("1.3 Target Audience and Stakeholder Profiles", styles['TblCell']), Paragraph("3", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("1.4 Objectives of Phase-1", styles['TblCell']), Paragraph("4", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("1.5 Report Organization", styles['TblCell']), Paragraph("4", styles['TblCell'])],
        [Paragraph("<b>2</b>", styles['TblCellBold']), Paragraph("<b>PROJECT DESCRIPTION</b>", styles['TblCellBold']), Paragraph("<b>5</b>", styles['TblCellBold'])],
        [Paragraph("", styles['TblCell']), Paragraph("2.1 Problem Definition", styles['TblCell']), Paragraph("5", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("2.2 Proposed Solution: Daylight Wellness (PDDR)", styles['TblCell']), Paragraph("6", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("2.3 Purpose and Objectives", styles['TblCell']), Paragraph("6", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("2.4 Scope and System Boundaries", styles['TblCell']), Paragraph("7", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("2.5 Key System Innovations", styles['TblCell']), Paragraph("7", styles['TblCell'])],
        [Paragraph("<b>3</b>", styles['TblCellBold']), Paragraph("<b>LITERATURE SURVEY</b>", styles['TblCellBold']), Paragraph("<b>8</b>", styles['TblCellBold'])],
        [Paragraph("", styles['TblCell']), Paragraph("3.1 Overview of mHealth & Nutritional Recommender Systems", styles['TblCell']), Paragraph("8", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("3.2 Comprehensive Review of Verified Research Papers (10 Papers)", styles['TblCell']), Paragraph("8", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("3.3 Comparative Analysis with Existing Systems", styles['TblCell']), Paragraph("12", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("3.4 Identification of Research and Technological Gaps", styles['TblCell']), Paragraph("13", styles['TblCell'])],
        [Paragraph("<b>4</b>", styles['TblCellBold']), Paragraph("<b>HARDWARE AND SOFTWARE REQUIREMENTS</b>", styles['TblCellBold']), Paragraph("<b>14</b>", styles['TblCellBold'])],
        [Paragraph("", styles['TblCell']), Paragraph("4.1 Hardware Requirements", styles['TblCell']), Paragraph("14", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("4.2 Software Requirements", styles['TblCell']), Paragraph("15", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("4.3 Development, Verification & Packaging Toolchain", styles['TblCell']), Paragraph("15", styles['TblCell'])],
        [Paragraph("<b>5</b>", styles['TblCellBold']), Paragraph("<b>SOFTWARE REQUIREMENTS SPECIFICATION (SRS)</b>", styles['TblCellBold']), Paragraph("<b>16</b>", styles['TblCellBold'])],
        [Paragraph("", styles['TblCell']), Paragraph("5.1 Users and Stakeholder Characteristics", styles['TblCell']), Paragraph("16", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("5.2 Functional Requirements (FR-01 to FR-10 Detailed Specs)", styles['TblCell']), Paragraph("16", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("5.3 Non-Functional Requirements (NFR-01 to NFR-06)", styles['TblCell']), Paragraph("18", styles['TblCell'])],
        [Paragraph("<b>6</b>", styles['TblCellBold']), Paragraph("<b>SYSTEM DESIGN (HIGH LEVEL)</b>", styles['TblCellBold']), Paragraph("<b>19</b>", styles['TblCellBold'])],
        [Paragraph("", styles['TblCell']), Paragraph("6.1 Architectural Design & Tier Decomposition", styles['TblCell']), Paragraph("19", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("6.2 Data Flow & Context Flow Diagrams (DFD Level 0 & Level 1)", styles['TblCell']), Paragraph("20", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("6.3 Offline-First Storage & Service Worker Caching Policies", styles['TblCell']), Paragraph("21", styles['TblCell'])],
        [Paragraph("<b>7</b>", styles['TblCellBold']), Paragraph("<b>DETAILED DESIGN</b>", styles['TblCellBold']), Paragraph("<b>22</b>", styles['TblCellBold'])],
        [Paragraph("", styles['TblCell']), Paragraph("7.1 Process Flow Diagram with Design Methodology", styles['TblCell']), Paragraph("22", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("7.2 Use Case Modeling & Actor Descriptions", styles['TblCell']), Paragraph("23", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("7.3 Behavioral Modeling: Sequence Diagrams", styles['TblCell']), Paragraph("24", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("7.4 Behavioral Modeling: Activity Diagrams", styles['TblCell']), Paragraph("25", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("7.5 Database Design (ER Diagram & Relational Schema Tables)", styles['TblCell']), Paragraph("26", styles['TblCell'])],
        [Paragraph("<b>8</b>", styles['TblCellBold']), Paragraph("<b>IMPLEMENTATION</b>", styles['TblCellBold']), Paragraph("<b>28</b>", styles['TblCellBold'])],
        [Paragraph("", styles['TblCell']), Paragraph("8.1 Algorithmic Methodology & Pseudo Code (5 Algorithms)", styles['TblCell']), Paragraph("28", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("8.2 User Interface Implementation & Screen Demonstrations", styles['TblCell']), Paragraph("30", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("8.3 Mobile Packaging & Android Deployment Pipeline", styles['TblCell']), Paragraph("33", styles['TblCell'])],
        [Paragraph("<b>9</b>", styles['TblCellBold']), Paragraph("<b>SOFTWARE TESTING</b>", styles['TblCellBold']), Paragraph("<b>34</b>", styles['TblCellBold'])],
        [Paragraph("", styles['TblCell']), Paragraph("9.1 Testing Strategy & Quality Assurance Methodology", styles['TblCell']), Paragraph("34", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("9.2 Manual Test Cases for All Modules (22 Detailed Test Cases)", styles['TblCell']), Paragraph("34", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("9.3 Automated Test Suite Execution & Verification", styles['TblCell']), Paragraph("37", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("9.4 Security & Data Integrity Verification", styles['TblCell']), Paragraph("37", styles['TblCell'])],
        [Paragraph("<b>10</b>", styles['TblCellBold']), Paragraph("<b>CONCLUSION AND FUTURE SCOPE</b>", styles['TblCellBold']), Paragraph("<b>38</b>", styles['TblCellBold'])],
        [Paragraph("", styles['TblCell']), Paragraph("10.1 Summary of Phase-1 Achievements (80%+ Milestone)", styles['TblCell']), Paragraph("38", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("10.2 Technical Limitations", styles['TblCell']), Paragraph("39", styles['TblCell'])],
        [Paragraph("", styles['TblCell']), Paragraph("10.3 Phase-2 Development Roadmap", styles['TblCell']), Paragraph("39", styles['TblCell'])],
        [Paragraph("<b>App.</b>", styles['TblCellBold']), Paragraph("<b>BIBLIOGRAPHY & REFERENCES</b>", styles['TblCellBold']), Paragraph("<b>40</b>", styles['TblCellBold'])]
    ]
    
    toc_table = Table(toc_data, colWidths=[usable_width * 0.15, usable_width * 0.70, usable_width * 0.15])
    toc_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('TOPPADDING', (0,0), (-1,-1), 2),
        ('LINEBELOW', (0,0), (-1,0), 1, colors.HexColor("#0d47a1")),
    ]))
    story.append(toc_table)
    story.append(PageBreak())
    
    return story
