from reportlab.platypus import Paragraph, Spacer, PageBreak, Image, Table, TableStyle
from reportlab.lib import colors
import os

def generate_chapters_4_to_6(styles, usable_width):
    story = []
    
    # =========================================================================
    # CHAPTER 4: HARDWARE AND SOFTWARE REQUIREMENTS
    # =========================================================================
    story.append(Paragraph("CHAPTER 4", styles['ChapterHeading']))
    story.append(Paragraph("HARDWARE AND SOFTWARE REQUIREMENTS", styles['ChapterHeading']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("4.1 Hardware Requirements", styles['SectionHeading']))
    p_hw = (
        "The Daylight Wellness (PDDR) platform is engineered using modern lightweight web and mobile architectures, "
        "ensuring minimal hardware footprints across development, server, and end-user client environments. "
        "The concrete hardware specifications are detailed below:"
    )
    story.append(Paragraph(p_hw, styles['ReportBody']))
    
    story.append(Paragraph("Table 4.1: Hardware Specifications Across System Environments", styles['TblCaption']))
    hw_data = [
        [Paragraph("<b>Environment</b>", styles['TblCellBold']), Paragraph("<b>Component</b>", styles['TblCellBold']), Paragraph("<b>Minimum Specification</b>", styles['TblCellBold']), Paragraph("<b>Recommended Specification</b>", styles['TblCellBold'])],
        [Paragraph("<b>Development Host</b>", styles['TblCellBold']), Paragraph("Processor (CPU)<br/>RAM (Memory)<br/>Storage (Disk)<br/>Display", styles['TblCell']), Paragraph("Intel Core i5 (8th Gen) / AMD Ryzen 5<br/>8 GB DDR4<br/>256 GB SSD<br/>1920x1080 Full HD", styles['TblCell']), Paragraph("Intel Core i7 (12th+ Gen) / Apple M-Series<br/>16 GB DDR5<br/>512 GB NVMe SSD<br/>2K / 4K Multi-monitor Display", styles['TblCell'])],
        [Paragraph("<b>Client (Mobile Device)</b>", styles['TblCellBold']), Paragraph("Target OS<br/>RAM<br/>Screen Display<br/>Network Connectivity", styles['TblCell']), Paragraph("Android 8.0 (Oreo) or higher<br/>2 GB RAM<br/>720x1280 (HD) Touchscreen<br/>2G / 3G / Offline Cache", styles['TblCell']), Paragraph("Android 11.0 to Android 15.0<br/>4 GB – 8 GB RAM<br/>1080x2400 (FHD+ AMOLED)<br/>4G LTE / 5G / Wi-Fi", styles['TblCell'])],
        [Paragraph("<b>Server Hosting Node</b>", styles['TblCellBold']), Paragraph("Compute Instance<br/>Memory (RAM)<br/>Bandwidth", styles['TblCell']), Paragraph("1 vCPU (Shared Core)<br/>512 MB – 1 GB RAM<br/>Standard Cloud Tier (Render/AWS)", styles['TblCell']), Paragraph("2 vCPU (Dedicated Core)<br/>2 GB – 4 GB RAM<br/>High-availability CDN Edge", styles['TblCell'])]
    ]
    hw_table = Table(hw_data, colWidths=[usable_width*0.22, usable_width*0.20, usable_width*0.29, usable_width*0.29])
    hw_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e3f2fd")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#b0bec5")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 4),
        ('BOTTOMPADDING', (0,0), (-1,-1), 4),
    ]))
    story.append(hw_table)
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("4.2 Software Requirements", styles['SectionHeading']))
    p_sw = (
        "The software architecture utilizes robust, open-source enterprise runtimes, modern database engines, and validated "
        "cloud artificial intelligence APIs. Exact version numbers are maintained across the development and deployment pipelines:"
    )
    story.append(Paragraph(p_sw, styles['ReportBody']))
    
    story.append(Paragraph("Table 4.2: Software Stack, Runtimes, and Framework Versions", styles['TblCaption']))
    sw_data = [
        [Paragraph("<b>Software Layer</b>", styles['TblCellBold']), Paragraph("<b>Technology / Runtime</b>", styles['TblCellBold']), Paragraph("<b>Version</b>", styles['TblCellBold']), Paragraph("<b>Role / Architectural Purpose</b>", styles['TblCellBold'])],
        [Paragraph("<b>Operating System</b>", styles['TblCellBold']), Paragraph("Microsoft Windows 11 / Linux Ubuntu", styles['TblCell']), Paragraph("v23H2 / 22.04 LTS", styles['TblCell']), Paragraph("Primary development & server execution host", styles['TblCell'])],
        [Paragraph("<b>Backend Runtime</b>", styles['TblCellBold']), Paragraph("Node.js LTS", styles['TblCell']), Paragraph("v24.14.1 LTS", styles['TblCell']), Paragraph("Asynchronous V8 event-driven API runtime", styles['TblCell'])],
        [Paragraph("<b>Web Server</b>", styles['TblCellBold']), Paragraph("Express.js Framework", styles['TblCell']), Paragraph("v4.19.2", styles['TblCell']), Paragraph("REST API routing, middleware, and static serving", styles['TblCell'])],
        [Paragraph("<b>Database Management</b>", styles['TblCellBold']), Paragraph("PostgreSQL Relational DB", styles['TblCell']), Paragraph("v16.2", styles['TblCell']), Paragraph("ACID transactional persistence for users, plans & logs", styles['TblCell'])],
        [Paragraph("<b>Client Frontend</b>", styles['TblCellBold']), Paragraph("PWA / Vanilla Modern JS", styles['TblCell']), Paragraph("HTML5 / CSS3 / ES2023", styles['TblCell']), Paragraph("Zero-dependency high-performance reactive UI", styles['TblCell'])],
        [Paragraph("<b>Mobile Runtime</b>", styles['TblCellBold']), Paragraph("Flutter SDK / Android TWA", styles['TblCell']), Paragraph("v3.24 / WebAPK", styles['TblCell']), Paragraph("Native Android app compilation & store packaging", styles['TblCell'])],
        [Paragraph("<b>Conversational AI API</b>", styles['TblCellBold']), Paragraph("Google Gemini 1.5 Flash", styles['TblCell']), Paragraph("v1beta REST API", styles['TblCell']), Paragraph("Real-time nutrition query reasoning and generation", styles['TblCell'])],
        [Paragraph("<b>Email Transport</b>", styles['TblCellBold']), Paragraph("Nodemailer SMTP Client", styles['TblCell']), Paragraph("v6.9.13", styles['TblCell']), Paragraph("Automated daily progress reports & password reset", styles['TblCell'])],
        [Paragraph("<b>Offline Caching</b>", styles['TblCellBold']), Paragraph("Service Worker Cache API", styles['TblCell']), Paragraph("Cache v50", styles['TblCell']), Paragraph("Offline asset caching, shell fallback & API bypass", styles['TblCell'])],
        [Paragraph("<b>Security & Crypto</b>", styles['TblCellBold']), Paragraph("Bcrypt.js / Node Crypto", styles['TblCell']), Paragraph("v2.4.3 / Native", styles['TblCell']), Paragraph("Password salting/hashing & JWT session tokens", styles['TblCell'])]
    ]
    sw_table = Table(sw_data, colWidths=[usable_width*0.22, usable_width*0.24, usable_width*0.16, usable_width*0.38])
    sw_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#ede7f6")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#b0bec5")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(sw_table)
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("4.3 Development, Verification & Packaging Toolchain", styles['SectionHeading']))
    p_tools = (
        "To ensure continuous integration and code hygiene, the following development utilities were actively employed:<br/>"
        "• <b>Integrated Development Environment (IDE):</b> Visual Studio Code (v1.95+) configured with ESLint, Prettier, and Flutter/Dart extensions.<br/>"
        "• <b>Database Management & Exploration:</b> pgAdmin 4 (v8.4) and PostgreSQL CLI (`psql`) for schema migration execution and query optimization.<br/>"
        "• <b>API Testing & Verification:</b> Postman (v11.x) and custom Node.js automated test suites executing against live HTTP endpoints.<br/>"
        "• <b>Store Packaging & App Store Generation:</b> PWABuilder Suite (pwabuilder.com) for WebAPK / TWA manifest auditing, and GitHub Actions CI/CD pipelines."
    )
    story.append(Paragraph(p_tools, styles['ReportBody']))
    story.append(PageBreak())
    
    # =========================================================================
    # CHAPTER 5: SOFTWARE REQUIREMENTS SPECIFICATION (SRS)
    # =========================================================================
    story.append(Paragraph("CHAPTER 5", styles['ChapterHeading']))
    story.append(Paragraph("SOFTWARE REQUIREMENTS SPECIFICATION (SRS)", styles['ChapterHeading']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("5.1 Users and Stakeholder Characteristics", styles['SectionHeading']))
    p_srs_users = (
        "The system defines distinct user roles with differentiated privileges and operational workflows:"
    )
    story.append(Paragraph(p_srs_users, styles['ReportBody']))
    
    user_roles = [
        "<b>Registered Member (End User):</b> Authenticated individual with persistent profile. Permissions: edit personal health metrics, generate adaptive 5-meal plans, log meal adherence, chat with Daylight AI Coach, track hydration/exercise/sleep, selectively share grocery lists, and schedule automated IST email reminders.",
        "<b>Guest / Demo User:</b> Anonymous client exploring the platform without registration. Operates with local in-memory fallback state; changes are volatile and not synchronized to the central PostgreSQL database.",
        "<b>System Administrator:</b> High-privilege operator authenticated via dedicated admin credentials. Permissions: access the Admin Console, review system-wide registered user directories, inspect active plan distribution statistics, and manage the underlying recipe/food dataset catalog."
    ]
    for u in user_roles:
        story.append(Paragraph(f"• {u}", styles['ReportBullet']))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("5.2 Functional Requirements", styles['SectionHeading']))
    p_fr_intro = (
        "The functional capabilities of Daylight Wellness (PDDR) are formally organized into ten comprehensive modules (FR-01 through FR-10):"
    )
    story.append(Paragraph(p_fr_intro, styles['ReportBody']))
    
    frs = [
        ("FR-01: User Profile & Anthropometric Ingestion", 
         "The system shall accept, validate, and persist user anthropometric parameters: Name, Email, Password, Age (10–100 yrs), Biological Sex (Male/Female), Height (100–250 cm), Weight (30–300 kg), Target Weight, Physical Activity Multiplier (Sedentary, Light, Moderate, Active, Very Active), Goal (Maintain, Lose, Gain), Dietary Preference (Vegetarian, Non-Vegetarian, Vegan), Allergies, and Health Conditions."),
        
        ("FR-02: Scientific BMR & TDEE Caloric Calculation", 
         "The system shall compute Basal Metabolic Rate using the clinical Mifflin-St Jeor equation. It shall calculate Total Daily Energy Expenditure (TDEE = BMR × Activity Multiplier) and determine the daily caloric target by applying appropriate goal offsets (+350 kcal for weight gain, -350 kcal for weight loss, and 0 kcal for maintenance). Automatic deficits shall be suppressed for elderly or high-risk medical profiles."),
        
        ("FR-03: Five-Meal Adaptive Plan Generation", 
         "The system shall automatically generate a balanced daily plan comprising five distinct slots: Breakfast (25% calories), Morning Snack (10%), Lunch (35%), Evening Snack (10%), and Dinner (20%). It shall query the verified Indian Food Composition dataset to select authentic dishes satisfying the user's dietary preferences and excluding stated allergens, aligning combined meal calories within 95–100% of the target."),
        
        ("FR-04: Smart Recipe Exploration & Substitutions", 
         "For each planned meal, the system shall provide an interactive recipe view detailing required ingredients, serving portions (per 100g), preparation instructions, and estimated cooking time. It shall present intelligent food swaps providing calorically equivalent alternative dishes when ingredients are unavailable."),
        
        ("FR-05: Meal Adherence & Completion-Driven Calorie Progress", 
         "The system shall allow users to mark individual meals as eaten via interactive checkboxes. In response, the system shall dynamically update the primary calorie progress indicator and progress bar to reflect true meal completion (0/5 = 0%, 1/5 = 20%, 2/5 = 40%, 3/5 = 60%, 4/5 = 80%, 5/5 = 100%), while distinctly preserving separate displays for actual calories consumed and calories remaining."),
        
        ("FR-06: Conversational Nutrition Guidance (Daylight AI Coach)", 
         "The system shall provide a dedicated AI chat modal powered by Google Gemini 1.5 Flash API. The AI coach shall answer food, recipe, and nutrition queries with non-prescriptive, evidence-based wellness guidance. In the event of network disruption or quota exhaustion, it shall gracefully fall back to a localized rule-based nutrition advice engine without crashing."),
        
        ("FR-07: Circadian Daily Routine Synchronization & Habit Logging", 
         "The system shall structure the daily dashboard around seven circadian milestones: Morning Wakeup, Hydration Boost, Breakfast, Mid-day Movement & Lunch, Evening Snack, Dinner, and Sleep Rest. It shall provide interactive steppers to log water (+250 ml / -100 ml against a 3,000 ml target), exercise (+10 min / -5 min against 30 min), and sleep (+1 hr / -30 min against 8 hrs)."),
        
        ("FR-08: Smart Grocery List Consolidation & Selective Sharing", 
         "The system shall automatically extract and combine raw ingredients across all five scheduled meals into a consolidated shopping checklist, eliminating duplicates and aggregating compatible quantities. It shall allow users to select specific grocery items via checkboxes and share exclusively selected subsets via WhatsApp, Telegram, Email, SMS, or Clipboard."),
        
        ("FR-09: Automated IST Email Reminders & Password Reset", 
         "The system shall maintain a background scheduler configured to Indian Standard Time (Asia/Kolkata). It shall dispatch scheduled email reminders for hydration, meals, and evening summaries via Nodemailer SMTP. It shall support secure token-based password reset workflows with clickable reset links."),
        
        ("FR-10: Multi-Role System Administration Console", 
         "The system shall provide an authenticated administrative portal enabling authorized operators to inspect registered user records, monitor aggregate dietary goal distribution metrics, review active plan statuses, and manage recipe catalog items.")
    ]
    
    for title, desc in frs:
        story.append(Paragraph(f"<b>{title}:</b> {desc}", styles['ReportBody']))
        story.append(Spacer(1, 2))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("5.3 Non-Functional Requirements", styles['SectionHeading']))
    p_nfr_intro = (
        "Non-functional requirements specify qualitative engineering criteria ensuring system safety, responsiveness, and reliability:"
    )
    story.append(Paragraph(p_nfr_intro, styles['ReportBody']))
    
    nfrs = [
        "<b>NFR-01: Performance & Latency:</b> Initial PWA shell load time shall not exceed 1.5 seconds on a 4G connection. Local dashboard state transitions and habit stepper updates shall execute in under 50 milliseconds. Conversational AI responses shall stream or return in under 2.0 seconds.",
        "<b>NFR-02: Security & Data Privacy:</b> All user passwords shall be irreversibly salted and hashed using Bcrypt with a minimum work factor of 10. Web sessions shall be authenticated via secure, HTTP-only, SameSite cookies. Database operations shall exclusively employ parameterized SQL queries to prevent SQL injection vulnerabilities.",
        "<b>NFR-03: Reliability & Offline Availability:</b> The application shall remain fully functional offline for reviewing saved meal plans, recipes, grocery lists, and habit logging. The Service Worker Cache API shall intercept network requests, serving cached application assets when offline.",
        "<b>NFR-04: Usability & Human Factors:</b> The user interface shall adhere to responsive mobile-first design principles. Primary interactive controls (steppers, meal completion buttons) shall provide minimum touch targets of 44x44 pixels. Color palettes shall satisfy WCAG 2.1 AA contrast standards.",
        "<b>NFR-05: Maintainability & Modularity:</b> The codebase shall adhere to a clean layered Model-View-Controller (MVC) architecture, separating presentation components from backend business logic and database access layers.",
        "<b>NFR-06: Portability & Cross-Platform Compatibility:</b> The application shall execute identically across modern web browsers (Chrome, Edge, Safari, Firefox) and install natively on Android mobile devices via Progressive Web App and Trusted Web Activity (TWA) packaging."
    ]
    for n in nfrs:
        story.append(Paragraph(f"• {n}", styles['ReportBullet']))
    story.append(PageBreak())
    
    # =========================================================================
    # CHAPTER 6: SYSTEM DESIGN (HIGH LEVEL)
    # =========================================================================
    story.append(Paragraph("CHAPTER 6", styles['ChapterHeading']))
    story.append(Paragraph("SYSTEM DESIGN (HIGH LEVEL)", styles['ChapterHeading']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("6.1 Architectural Design & Tier Decomposition", styles['SectionHeading']))
    p_arch = (
        "The Daylight Wellness (PDDR) system is architected around a multi-tier, decoupled client-server paradigm "
        "designed for high availability, offline resilience, and seamless scalability. The architecture is segregated into "
        "four primary logical layers: the Presentation Layer, the Application/Business Logic Layer, the AI & External Services Layer, "
        "and the Data Persistence Layer. Figure 6.1 illustrates the structural composition and inter-tier communication interfaces:"
    )
    story.append(Paragraph(p_arch, styles['ReportBody']))
    story.append(Spacer(1, 5))
    
    # Architecture Diagram Image
    arch_img_path = 'report_assets/diagrams/architecture_diagram.png'
    if os.path.exists(arch_img_path):
        img_arch = Image(arch_img_path, width=usable_width, height=usable_width * 0.70)
        img_arch.hAlign = 'CENTER'
        story.append(img_arch)
        story.append(Paragraph("Fig. 6.1: High-Level Multi-Tier System Architecture of Daylight Wellness (PDDR)", styles['FigCaption']))
    story.append(Spacer(1, 8))
    
    p_arch_desc = (
        "1. <b>Presentation Layer (Client / Mobile):</b> Built using responsive web standards (HTML5, CSS3, ES2023 Vanilla JavaScript) "
        "and packaged as an Android Trusted Web Activity (TWA). It hosts the Service Worker (Cache v50), which intercepts fetch requests "
        "and serves the cached application shell offline.<br/>"
        "2. <b>Business Logic Layer (Node.js / Express):</b> Serves as the central coordination hub. It enforces authentication middleware, "
        "executes the Mifflin-St Jeor nutritional engine, schedules IST background reminder crons, and manages session state.<br/>"
        "3. <b>AI & External Services Layer:</b> Integrates the Google Gemini 1.5 Flash API via secure backend proxying (shielding API keys from client exposure) "
        "coupled with a localized rule-based fallback, and an SMTP transport service for email reminders.<br/>"
        "4. <b>Data Persistence Layer:</b> Houses the PostgreSQL 16 relational database containing normalized tables for user credentials, "
        "personalized diet plans, meal adherence records, and habit logs, alongside a high-density Indian Food Composition CSV dataset."
    )
    story.append(Paragraph(p_arch_desc, styles['ReportBody']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("6.2 Data Flow & Context Flow Modeling", styles['SectionHeading']))
    p_dfd = (
        "Data flow within PDDR is modeled through hierarchical Data Flow Diagrams (DFD). Figure 6.2 illustrates the Level 0 Context Flow Diagram, "
        "depicting system boundaries, external entities, and primary information exchanges:"
    )
    story.append(Paragraph(p_dfd, styles['ReportBody']))
    story.append(Spacer(1, 5))
    
    dfd_img_path = 'report_assets/diagrams/dfd_diagram.png'
    if os.path.exists(dfd_img_path):
        img_dfd = Image(dfd_img_path, width=usable_width, height=usable_width * 0.58)
        img_dfd.hAlign = 'CENTER'
        story.append(img_dfd)
        story.append(Paragraph("Fig. 6.2: Context Flow Diagram (DFD Level 0) of the Daylight Wellness Platform", styles['FigCaption']))
    story.append(Spacer(1, 8))
    
    p_dfd_desc = (
        "In DFD Level 0, the central PDDR engine exchanges structured information across four external boundaries:<br/>"
        "• <b>Member Interaction:</b> Submits anthropometric inputs, completion toggles, and AI chat queries; receives adaptive plans, macronutrient breakdowns, and real-time progress percentages.<br/>"
        "• <b>Administrator Console:</b> Issues administrative management queries; receives user auditing summaries and recipe dataset metrics.<br/>"
        "• <b>Gemini AI Engine:</b> Receives sanitized nutrition prompts; streams conversational wellness explanations.<br/>"
        "• <b>SMTP Dispatcher:</b> Receives formatted HTML reminder templates and dispatches time-sensitive notifications to user email inboxes.<br/>"
        "• <b>PostgreSQL Data Store (D1):</b> Executes bidirectional CRUD operations preserving relational integrity."
    )
    story.append(Paragraph(p_dfd_desc, styles['ReportBody']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("6.3 Offline-First Storage & Service Worker Caching Policies", styles['SectionHeading']))
    p_sw_arch = (
        "To guarantee high reliability in mobile environments with intermittent connectivity, PDDR implements an Offline-First caching strategy "
        "managed by Service Worker v50. The caching policy enforces a three-tier routing protocol:<br/>"
        "1. <b>Application Shell (HTML/CSS/JS):</b> Handled via a Network-First strategy with immediate fallback to cached assets, ensuring updates are picked up when online while offline access is preserved.<br/>"
        "2. <b>Static Assets (Images, Icons, Recipes JSON, Indian Food CSV):</b> Handled via a Cache-First strategy with background network revalidation, eliminating redundant bandwidth consumption.<br/>"
        "3. <b>Dynamic REST APIs (`/api/*`):</b> Completely bypasses the Service Worker cache, ensuring transactional queries (authentication, meal completions, AI chat) always interact directly with the live server without stale data contamination."
    )
    story.append(Paragraph(p_sw_arch, styles['ReportBody']))
    story.append(PageBreak())
    
    return story
