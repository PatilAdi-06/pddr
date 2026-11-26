import matplotlib.pyplot as plt
import matplotlib.patches as patches
import os

os.makedirs('report_assets/diagrams', exist_ok=True)

# 1. Architecture Diagram
def draw_architecture():
    fig, ax = plt.subplots(figsize=(8.5, 6), dpi=300)
    ax.axis('off')
    
    # Layer 1: Presentation Layer
    ax.add_patch(patches.FancyBboxPatch((0.5, 4.3), 7.5, 1.4, boxstyle="round,pad=0.1", fc="#e8f5e9", ec="#2e7d32", lw=2))
    ax.text(0.7, 5.4, "PRESENTATION LAYER (Client / Mobile)", fontsize=11, fontweight='bold', color="#1b5e20")
    
    # Boxes in Layer 1
    clients = [("Progressive Web App (PWA)\nHTML5 / CSS3 / Vanilla JS", 0.8), 
               ("Native Android Package\nTWA / WebAPK / Flutter", 3.3), 
               ("Service Worker v50\nOffline Shell & Cache API", 5.8)]
    for text, x in clients:
        ax.add_patch(patches.FancyBboxPatch((x, 4.5), 2.2, 0.75, boxstyle="round,pad=0.05", fc="#ffffff", ec="#388e3c", lw=1.2))
        ax.text(x + 1.1, 4.87, text, ha='center', va='center', fontsize=8.5, color="#1b5e20")

    # Layer 2: Business Logic / Application Layer
    ax.add_patch(patches.FancyBboxPatch((0.5, 2.3), 7.5, 1.6, boxstyle="round,pad=0.1", fc="#e3f2fd", ec="#1565c0", lw=2))
    ax.text(0.7, 3.65, "BUSINESS LOGIC & APPLICATION LAYER (Node.js / Express)", fontsize=11, fontweight='bold', color="#0d47a1")
    
    services = [("REST API Gateway\nRouter & Auth Middleware", 0.8),
                ("Adaptive Nutrition Engine\nMifflin-St Jeor / 5-Meal Splitter", 3.3),
                ("Reminder & Progress Service\nIST Cron & Nodemailer SMTP", 5.8)]
    for text, x in services:
        ax.add_patch(patches.FancyBboxPatch((x, 2.5), 2.2, 0.9, boxstyle="round,pad=0.05", fc="#ffffff", ec="#1976d2", lw=1.2))
        ax.text(x + 1.1, 2.95, text, ha='center', va='center', fontsize=8.5, color="#0d47a1")

    # Layer 3: AI Engine & External Services
    ax.add_patch(patches.FancyBboxPatch((0.5, 0.5), 3.5, 1.4, boxstyle="round,pad=0.1", fc="#f3e5f5", ec="#7b1fa2", lw=2))
    ax.text(0.7, 1.65, "AI & CONVERSATIONAL SERVICES", fontsize=10, fontweight='bold', color="#4a148c")
    ai_box = "Google Gemini 1.5 Flash API\n+ Zero-Latency Local Fallback\nRule-based Nutrition Validator"
    ax.add_patch(patches.FancyBboxPatch((0.8, 0.7), 2.9, 0.75, boxstyle="round,pad=0.05", fc="#ffffff", ec="#8e24aa", lw=1.2))
    ax.text(2.25, 1.07, ai_box, ha='center', va='center', fontsize=8, color="#4a148c")

    # Layer 4: Data Layer
    ax.add_patch(patches.FancyBboxPatch((4.5, 0.5), 3.5, 1.4, boxstyle="round,pad=0.1", fc="#fff3e0", ec="#e65100", lw=2))
    ax.text(4.7, 1.65, "DATA PERSISTENCE & STORAGE", fontsize=10, fontweight='bold', color="#bf360c")
    db_box = "PostgreSQL Relational DB\n(Users, Plans, Completions, Logs)\n+ Indian Food Composition CSV"
    ax.add_patch(patches.FancyBboxPatch((4.8, 0.7), 2.9, 0.75, boxstyle="round,pad=0.05", fc="#ffffff", ec="#f57c00", lw=1.2))
    ax.text(6.25, 1.07, db_box, ha='center', va='center', fontsize=8, color="#bf360c")

    # Connecting Arrows
    for x in [1.9, 4.4, 6.9]:
        ax.annotate('', xy=(x, 4.3), xytext=(x, 3.9), arrowprops=dict(arrowstyle="<->", color="#37474f", lw=1.5))
    ax.annotate('', xy=(2.25, 2.3), xytext=(2.25, 1.9), arrowprops=dict(arrowstyle="<->", color="#37474f", lw=1.5))
    ax.annotate('', xy=(6.25, 2.3), xytext=(6.25, 1.9), arrowprops=dict(arrowstyle="<->", color="#37474f", lw=1.5))

    ax.set_xlim(0, 8.5)
    ax.set_ylim(0, 6)
    plt.tight_layout()
    plt.savefig('report_assets/diagrams/architecture_diagram.png', dpi=300)
    plt.close()
    print("Saved architecture_diagram.png")

# 2. Context Flow Diagram (DFD Level 0)
def draw_dfd():
    fig, ax = plt.subplots(figsize=(8.5, 5), dpi=300)
    ax.axis('off')
    
    # Center Bubble: PDDR System
    circle = patches.Circle((4.25, 2.5), 1.3, fc="#e0f2f1", ec="#00796b", lw=2.5)
    ax.add_patch(circle)
    ax.text(4.25, 2.65, "0.0\nDaylight Wellness\nPDDR Platform", ha='center', va='center', fontsize=11, fontweight='bold', color="#004d40")
    
    # Entities
    entities = [
        ("End User / Member\n(Mobile / Web)", 0.5, 3.3, 1.6, 0.9, "#e8eaf6", "#283593"),
        ("System Administrator\n(Management Console)", 0.5, 0.8, 1.6, 0.9, "#efebe9", "#4e342e"),
        ("Google Gemini AI API\n(Conversational Engine)", 6.4, 3.3, 1.6, 0.9, "#f3e5f5", "#6a1b9a"),
        ("SMTP Mail Server\n(Gmail / Custom)", 6.4, 0.8, 1.6, 0.9, "#fbe9e7", "#d84315")
    ]
    for text, x, y, w, h, bg, border in entities:
        ax.add_patch(patches.Rectangle((x, y), w, h, fc=bg, ec=border, lw=2))
        ax.text(x + w/2, y + h/2, text, ha='center', va='center', fontsize=8.5, fontweight='bold', color=border)

    # Database Store
    ax.add_patch(patches.Rectangle((3.2, 0.4), 2.1, 0.5, fc="#fffde7", ec="#fbc02d", lw=1.5))
    ax.plot([3.2, 5.3], [0.9, 0.9], color="#f57f17", lw=1.5)
    ax.plot([3.2, 5.3], [0.4, 0.4], color="#f57f17", lw=1.5)
    ax.text(4.25, 0.65, "D1: PostgreSQL Database", ha='center', va='center', fontsize=8.5, fontweight='bold', color="#f57f17")

    # Arrows with labels
    # User to Center
    ax.annotate('', xy=(2.95, 2.8), xytext=(2.1, 3.5), arrowprops=dict(arrowstyle="->", color="#1a237e", lw=1.2))
    ax.text(2.2, 3.3, "Health profile, Meal completions,\nQueries, Routine logs", fontsize=7, color="#1a237e")
    
    ax.annotate('', xy=(2.1, 3.2), xytext=(2.95, 2.5), arrowprops=dict(arrowstyle="->", color="#1a237e", lw=1.2))
    ax.text(2.1, 2.65, "5-Meal Plan, Macros, AI answers,\nProgress updates", fontsize=7, color="#1a237e")

    # Admin to Center
    ax.annotate('', xy=(3.1, 2.0), xytext=(2.1, 1.3), arrowprops=dict(arrowstyle="->", color="#3e2723", lw=1.2))
    ax.text(2.1, 1.8, "User management, Recipe ops", fontsize=7, color="#3e2723")

    # Center to Gemini
    ax.annotate('', xy=(6.4, 3.6), xytext=(5.55, 2.9), arrowprops=dict(arrowstyle="->", color="#4a148c", lw=1.2))
    ax.text(5.5, 3.4, "Diet prompt", fontsize=7, color="#4a148c")
    ax.annotate('', xy=(5.55, 2.6), xytext=(6.4, 3.3), arrowprops=dict(arrowstyle="->", color="#4a148c", lw=1.2))
    ax.text(5.6, 2.8, "AI response", fontsize=7, color="#4a148c")

    # Center to SMTP
    ax.annotate('', xy=(6.4, 1.3), xytext=(5.3, 1.8), arrowprops=dict(arrowstyle="->", color="#bf360c", lw=1.2))
    ax.text(5.6, 1.4, "Reminders, Reset links", fontsize=7, color="#bf360c")

    # Center to DB
    ax.annotate('', xy=(4.25, 0.9), xytext=(4.25, 1.2), arrowprops=dict(arrowstyle="<->", color="#e65100", lw=1.2))

    ax.set_xlim(0, 8.5)
    ax.set_ylim(0, 5)
    plt.tight_layout()
    plt.savefig('report_assets/diagrams/dfd_diagram.png', dpi=300)
    plt.close()
    print("Saved dfd_diagram.png")

# 3. Process Flow Diagram
def draw_process_flow():
    fig, ax = plt.subplots(figsize=(8.5, 6.5), dpi=300)
    ax.axis('off')
    
    steps = [
        ("1. User Profile Input\n(Age, Gender, Height, Weight, Goal, Preference)", 4.25, 5.8, "#e8f5e9", "#2e7d32"),
        ("2. Health Metrics Calibration\n(BMR via Mifflin-St Jeor, TDEE, Calorie Target)", 4.25, 4.9, "#e3f2fd", "#1565c0"),
        ("3. Five-Meal Adaptive Generation\n(Breakfast 25%, Morning 10%, Lunch 35%, Eve 10%, Dinner 20%)", 4.25, 4.0, "#f3e5f5", "#7b1fa2"),
        ("4. Smart Recipe Substitution & Filter\n(Allergies, Vegetarian / Non-Veg, Portions per 100g)", 4.25, 3.1, "#fff3e0", "#e65100"),
        ("5. Circadian Routine Sync & Logging\n(7 Milestones: Water, Activity, Sleep, Meals)", 4.25, 2.2, "#e0f2f1", "#00796b"),
        ("6. Calorie Progress Calculation\n(0%, 20%, 40%, 60%, 80%, 100% Meal-Completion Driven)", 4.25, 1.3, "#fce4ec", "#c2185b"),
        ("7. Persistence & Analytics Feedback\n(PostgreSQL, Streak Counter, Email Reminders)", 4.25, 0.4, "#efebe9", "#4e342e")
    ]
    
    for text, x, y, bg, border in steps:
        ax.add_patch(patches.FancyBboxPatch((x - 2.5, y - 0.3), 5.0, 0.6, boxstyle="round,pad=0.08", fc=bg, ec=border, lw=1.8))
        ax.text(x, y, text, ha='center', va='center', fontsize=8.5, fontweight='bold', color=border)
    
    for i in range(len(steps) - 1):
        y_start = steps[i][2] - 0.3
        y_end = steps[i+1][2] + 0.3
        ax.annotate('', xy=(4.25, y_end), xytext=(4.25, y_start), arrowprops=dict(arrowstyle="->", color="#37474f", lw=1.8))

    ax.set_xlim(0, 8.5)
    ax.set_ylim(0, 6.5)
    plt.tight_layout()
    plt.savefig('report_assets/diagrams/process_flow.png', dpi=300)
    plt.close()
    print("Saved process_flow.png")

# 4. Use Case Diagram
def draw_use_case():
    fig, ax = plt.subplots(figsize=(8.5, 6), dpi=300)
    ax.axis('off')
    
    # Boundary box: System
    ax.add_patch(patches.Rectangle((2.3, 0.4), 4.6, 5.2, fill=False, ec="#00695c", lw=2, linestyle='--'))
    ax.text(4.6, 5.35, "Daylight Wellness (PDDR) Boundary", ha='center', fontsize=10, fontweight='bold', color="#004d40")
    
    # Actors
    # User Actor box
    ax.add_patch(patches.FancyBboxPatch((0.4, 3.2), 1.5, 0.8, boxstyle="round,pad=0.08", fc="#c8e6c9", ec="#2e7d32", lw=1.5))
    ax.text(1.15, 3.6, "ACTOR:\nRegistered Member", fontsize=8, fontweight='bold', ha='center', va='center', color="#1b5e20")

    # Admin Actor box
    ax.add_patch(patches.FancyBboxPatch((0.4, 1.2), 1.5, 0.8, boxstyle="round,pad=0.08", fc="#ffcdd2", ec="#b71c1c", lw=1.5))
    ax.text(1.15, 1.6, "ACTOR:\nSystem Admin", fontsize=8, fontweight='bold', ha='center', va='center', color="#b71c1c")

    # External AI Actor box
    ax.add_patch(patches.FancyBboxPatch((6.8, 2.3), 1.5, 0.8, boxstyle="round,pad=0.08", fc="#e1bee7", ec="#4a148c", lw=1.5))
    ax.text(7.55, 2.7, "ACTOR:\nGemini AI Engine", fontsize=8, fontweight='bold', ha='center', va='center', color="#4a148c")

    use_cases = [
        ("Register & Authenticate", 4.6, 4.8),
        ("Configure Health Profile", 4.6, 4.2),
        ("View Adaptive 5-Meal Plan", 4.6, 3.6),
        ("Swap Dishes & Check Recipes", 4.6, 3.0),
        ("Mark Meal & Track 0-100% Calories", 4.6, 2.4),
        ("Consult Daylight AI Coach", 4.6, 1.8),
        ("Log Circadian Routines", 4.6, 1.2),
        ("Manage Users & Recipes", 4.6, 0.6)
    ]

    for text, x, y in use_cases:
        ellipse = patches.Ellipse((x, y), 2.8, 0.45, fc="#e0f2f1", ec="#00796b", lw=1.2)
        ax.add_patch(ellipse)
        ax.text(x, y, text, ha='center', va='center', fontsize=8, color="#004d40", fontweight='semibold')

    # Connections from User
    for i in range(7):
        ax.plot([1.6, 3.2], [3.4, use_cases[i][2]], color="#2e7d32", lw=1.1)

    # Connections from Admin
    ax.plot([1.6, 3.2], [1.3, use_cases[0][2]], color="#c62828", lw=1.1)
    ax.plot([1.6, 3.2], [1.3, use_cases[7][2]], color="#c62828", lw=1.1)

    # Connections to AI
    ax.plot([6.0, 7.1], [use_cases[5][2], 2.5], color="#6a1b9a", lw=1.1, linestyle=':')

    ax.set_xlim(0, 8.5)
    ax.set_ylim(0, 6)
    plt.tight_layout()
    plt.savefig('report_assets/diagrams/use_case_diagram.png', dpi=300)
    plt.close()
    print("Saved use_case_diagram.png")

# 5. Sequence Diagram
def draw_sequence_diagram():
    fig, ax = plt.subplots(figsize=(8.5, 5.5), dpi=300)
    ax.axis('off')
    
    lifelines = [
        ("User", 1.0),
        ("PWA Client", 2.8),
        ("Express API", 4.6),
        ("PostgreSQL", 6.4),
        ("Gemini AI", 7.8)
    ]
    
    for name, x in lifelines:
        ax.add_patch(patches.FancyBboxPatch((x - 0.6, 4.8), 1.2, 0.45, boxstyle="round,pad=0.05", fc="#e1f5fe", ec="#0288d1", lw=1.5))
        ax.text(x, 5.02, name, ha='center', va='center', fontsize=8.5, fontweight='bold', color="#01579b")
        ax.plot([x, x], [4.8, 0.4], color="#b0bec5", lw=1.2, linestyle='--')

    # Messages
    msgs = [
        (1.0, 2.8, 4.4, "1: Open Today Dashboard", "->"),
        (2.8, 4.6, 4.0, "2: GET /api/user/diet-plans/active", "->"),
        (4.6, 6.4, 3.6, "3: Query active plan & completions", "->"),
        (6.4, 4.6, 3.2, "4: Return plan (1,674 kcal, 5 meals)", "<--"),
        (4.6, 2.8, 2.8, "5: Deliver JSON response", "<--"),
        (2.8, 1.0, 2.4, "6: Render 5 meals + 80% progress bar", "<--"),
        (1.0, 2.8, 2.0, "7: Ask Daylight AI: 'Healthy dinner recipe?'", "->"),
        (2.8, 4.6, 1.6, "8: POST /api/ai/chat", "->"),
        (4.6, 7.8, 1.2, "9: GenerateContent API Call", "->"),
        (7.8, 4.6, 0.8, "10: Stream AI verified answer", "<--"),
        (4.6, 2.8, 0.6, "11: Return structured response", "<--"),
        (2.8, 1.0, 0.4, "12: Display modal AI response", "<--")
    ]

    for x1, x2, y, text, arrow in msgs:
        if arrow == "->":
            ax.annotate('', xy=(x2, y), xytext=(x1, y), arrowprops=dict(arrowstyle="->", color="#1565c0", lw=1.2))
        else:
            ax.annotate('', xy=(x1, y), xytext=(x2, y), arrowprops=dict(arrowstyle="->", color="#2e7d32", lw=1.2, linestyle='--'))
        mid_x = (x1 + x2) / 2
        ax.text(mid_x, y + 0.08, text, ha='center', fontsize=7.2, color="#263238")

    ax.set_xlim(0, 8.5)
    ax.set_ylim(0, 5.5)
    plt.tight_layout()
    plt.savefig('report_assets/diagrams/sequence_diagram.png', dpi=300)
    plt.close()
    print("Saved sequence_diagram.png")

# 6. Entity Relationship Diagram
def draw_er_diagram():
    fig, ax = plt.subplots(figsize=(8.5, 6), dpi=300)
    ax.axis('off')
    
    tables = [
        ("users", 1.8, 4.2, ["id (UUID, PK)", "email (VARCHAR)", "password (HASH)", "role (VARCHAR)", "profile (JSONB)", "created_at (TIMESTAMP)"], "#e8f5e9", "#2e7d32"),
        ("diet_plans", 6.2, 4.2, ["id (UUID, PK)", "user_id (UUID, FK)", "plan_name (VARCHAR)", "calorie_target (INT)", "meals (JSONB)", "created_at (TIMESTAMP)"], "#e3f2fd", "#1565c0"),
        ("meal_completions", 6.2, 1.4, ["id (UUID, PK)", "user_id (UUID, FK)", "plan_date (DATE)", "meal_index (INT)", "calories (NUMERIC)", "completed (BOOLEAN)"], "#f3e5f5", "#7b1fa2"),
        ("reminders", 1.8, 1.4, ["id (UUID, PK)", "user_id (UUID, FK)", "reminder_type (VARCHAR)", "reminder_time (TIME)", "is_enabled (BOOLEAN)", "created_at (TIMESTAMP)"], "#fff3e0", "#e65100")
    ]

    for name, x, y, fields, bg, border in tables:
        # Header
        ax.add_patch(patches.Rectangle((x - 1.4, y + 0.8), 2.8, 0.4, fc=border, ec=border))
        ax.text(x, y + 1.0, f"TABLE: {name.upper()}", ha='center', va='center', fontsize=8.5, fontweight='bold', color="#ffffff")
        # Body
        h = len(fields) * 0.25 + 0.1
        ax.add_patch(patches.Rectangle((x - 1.4, y + 0.8 - h), 2.8, h, fc=bg, ec=border, lw=1.2))
        for i, f in enumerate(fields):
            ax.text(x - 1.3, y + 0.8 - 0.2 - i*0.25, f, fontsize=7.5, color="#212121", va='center')

    # Relationships
    # users -> diet_plans (1:N)
    ax.annotate('', xy=(4.8, 5.0), xytext=(3.2, 5.0), arrowprops=dict(arrowstyle="<->", color="#37474f", lw=1.5))
    ax.text(3.4, 5.15, "1", fontsize=9, fontweight='bold')
    ax.text(4.6, 5.15, "N", fontsize=9, fontweight='bold')
    ax.text(4.0, 5.15, "has", fontsize=7.5, color="#546e7a", ha='center')

    # users -> reminders (1:N)
    ax.annotate('', xy=(1.8, 2.5), xytext=(1.8, 3.6), arrowprops=dict(arrowstyle="<->", color="#37474f", lw=1.5))
    ax.text(1.9, 3.4, "1", fontsize=9, fontweight='bold')
    ax.text(1.9, 2.7, "N", fontsize=9, fontweight='bold')

    # users -> meal_completions (1:N)
    ax.annotate('', xy=(4.8, 2.1), xytext=(3.2, 4.3), arrowprops=dict(arrowstyle="<->", color="#37474f", lw=1.5))
    ax.text(3.5, 4.1, "1", fontsize=9, fontweight='bold')
    ax.text(4.6, 2.3, "N", fontsize=9, fontweight='bold')

    ax.set_xlim(0, 8.5)
    ax.set_ylim(0, 6)
    plt.tight_layout()
    plt.savefig('report_assets/diagrams/er_diagram.png', dpi=300)
    plt.close()
    print("Saved er_diagram.png")

# 7. Activity Diagram (Circadian Routine Lifecycle)
def draw_activity_diagram():
    fig, ax = plt.subplots(figsize=(8.5, 6), dpi=300)
    ax.axis('off')
    
    # Start node (black filled circle)
    start = patches.Circle((4.25, 5.6), 0.15, fc="#212121", ec="#212121")
    ax.add_patch(start)
    ax.text(4.25, 5.85, "Start (User Day Begins)", ha='center', fontsize=8, fontweight='bold', color="#212121")
    
    nodes = [
        ("Fetch User Active Diet Plan & Check Date", 4.25, 4.9, "#e8f5e9", "#2e7d32"),
        ("Render 7 Circadian Milestones\n(Wake, Hydration, Breakfast, Lunch, Snack, Dinner, Sleep)", 4.25, 4.0, "#e3f2fd", "#1565c0"),
        ("User Logs Meal or Habit Completion", 4.25, 3.1, "#f3e5f5", "#7b1fa2"),
        ("Compute Real-time 0% - 100% Calorie Progress\n(1/5=20%, 2/5=40%, 3/5=60%, 4/5=80%, 5/5=100%)", 4.25, 2.2, "#fff3e0", "#e65100"),
        ("Update PostgreSQL State & Dispatch IST Reminder", 4.25, 1.3, "#e0f2f1", "#00796b")
    ]
    
    for text, x, y, bg, border in nodes:
        ax.add_patch(patches.FancyBboxPatch((x - 2.5, y - 0.28), 5.0, 0.56, boxstyle="round,pad=0.08", fc=bg, ec=border, lw=1.5))
        ax.text(x, y, text, ha='center', va='center', fontsize=8, fontweight='bold', color=border)

    # End node (bullseye circle)
    end_outer = patches.Circle((4.25, 0.4), 0.18, fc="none", ec="#212121", lw=1.5)
    end_inner = patches.Circle((4.25, 0.4), 0.11, fc="#212121", ec="#212121")
    ax.add_patch(end_outer)
    ax.add_patch(end_inner)
    ax.text(4.25, 0.12, "End (Daily Routine Closed)", ha='center', fontsize=8, fontweight='bold', color="#212121")

    # Connectors
    ax.annotate('', xy=(4.25, 5.18), xytext=(4.25, 5.45), arrowprops=dict(arrowstyle="->", color="#37474f", lw=1.5))
    ax.annotate('', xy=(4.25, 4.28), xytext=(4.25, 4.62), arrowprops=dict(arrowstyle="->", color="#37474f", lw=1.5))
    ax.annotate('', xy=(4.25, 3.38), xytext=(4.25, 3.72), arrowprops=dict(arrowstyle="->", color="#37474f", lw=1.5))
    ax.annotate('', xy=(4.25, 2.48), xytext=(4.25, 2.82), arrowprops=dict(arrowstyle="->", color="#37474f", lw=1.5))
    ax.annotate('', xy=(4.25, 1.58), xytext=(4.25, 1.92), arrowprops=dict(arrowstyle="->", color="#37474f", lw=1.5))
    ax.annotate('', xy=(4.25, 0.58), xytext=(4.25, 1.02), arrowprops=dict(arrowstyle="->", color="#37474f", lw=1.5))

    ax.set_xlim(0, 8.5)
    ax.set_ylim(0, 6)
    plt.tight_layout()
    plt.savefig('report_assets/diagrams/activity_diagram.png', dpi=300)
    plt.close()
    print("Saved activity_diagram.png")

if __name__ == '__main__':
    draw_architecture()
    draw_dfd()
    draw_process_flow()
    draw_use_case()
    draw_sequence_diagram()
    draw_er_diagram()
    draw_activity_diagram()
    print("All 7 diagrams generated successfully!")
