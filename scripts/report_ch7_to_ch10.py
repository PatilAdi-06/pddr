from reportlab.platypus import Paragraph, Spacer, PageBreak, Image, Table, TableStyle
from reportlab.lib import colors
import os

def generate_chapters_7_to_10(styles, usable_width):
    story = []
    
    # =========================================================================
    # CHAPTER 7: DETAILED DESIGN
    # =========================================================================
    story.append(Paragraph("CHAPTER 7", styles['ChapterHeading']))
    story.append(Paragraph("DETAILED DESIGN", styles['ChapterHeading']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("7.1 Process Flow Diagram with Design Methodology", styles['SectionHeading']))
    p_proc = (
        "The system's operational workflow is structured into a seven-stage sequential execution pipeline, "
        "translating raw user anthropometric inputs into adaptive meal schedules, habit logging, and automated reminders. "
        "Figure 7.1 illustrates the process flow:"
    )
    story.append(Paragraph(p_proc, styles['ReportBody']))
    story.append(Spacer(1, 5))
    
    proc_img_path = 'report_assets/diagrams/process_flow.png'
    if os.path.exists(proc_img_path):
        img_proc = Image(proc_img_path, width=usable_width, height=usable_width * 0.76)
        img_proc.hAlign = 'CENTER'
        story.append(img_proc)
        story.append(Paragraph("Fig. 7.1: Process Flow Diagram of the Daylight Wellness Platform", styles['FigCaption']))
    story.append(Spacer(1, 8))
    
    p_proc_desc = (
        "The pipeline begins with user profile ingestion, computing BMR and TDEE. Stage 3 allocates calories across five meal slots, "
        "filtering recipes in Stage 4 against preferences and allergens. Stage 5 synchronizes circadian routine milestones. "
        "Stage 6 computes meal-completion driven calorie progress percentages (0%, 20%, 40%, 60%, 80%, 100%), and Stage 7 persists "
        "state into PostgreSQL and dispatches automated email reminders."
    )
    story.append(Paragraph(p_proc_desc, styles['ReportBody']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("7.2 Use Case Modeling & Actor Descriptions", styles['SectionHeading']))
    p_uc = (
        "System functionality is modeled through UML Use Case Diagrams defining actor interactions across functional boundaries. "
        "Figure 7.2 depicts the primary system use cases:"
    )
    story.append(Paragraph(p_uc, styles['ReportBody']))
    story.append(Spacer(1, 5))
    
    uc_img_path = 'report_assets/diagrams/use_case_diagram.png'
    if os.path.exists(uc_img_path):
        img_uc = Image(uc_img_path, width=usable_width, height=usable_width * 0.70)
        img_uc.hAlign = 'CENTER'
        story.append(img_uc)
        story.append(Paragraph("Fig. 7.2: UML Use Case Diagram of the Daylight Wellness Platform", styles['FigCaption']))
    story.append(Spacer(1, 8))
    
    p_uc_desc = (
        "The diagram identifies two human actors and one external system actor:<br/>"
        "• <b>Registered Member:</b> Interacts with profile configuration, meal plan visualization, recipe swaps, meal completion checkboxes, Daylight AI Coach consultation, habit logging, and grocery sharing.<br/>"
        "• <b>System Administrator:</b> Interacts with user directory audits, system statistics, and recipe catalog management.<br/>"
        "• <b>Gemini AI Engine:</b> Processes dietary natural language queries and streams non-prescriptive nutrition explanations."
    )
    story.append(Paragraph(p_uc_desc, styles['ReportBody']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("7.3 Behavioral Modeling: Sequence Diagrams", styles['SectionHeading']))
    p_seq = (
        "Dynamic behavioral interactions during meal plan retrieval and conversational AI coaching are modeled "
        "in the UML Sequence Diagram shown in Figure 7.3:"
    )
    story.append(Paragraph(p_seq, styles['ReportBody']))
    story.append(Spacer(1, 5))
    
    seq_img_path = 'report_assets/diagrams/sequence_diagram.png'
    if os.path.exists(seq_img_path):
        img_seq = Image(seq_img_path, width=usable_width, height=usable_width * 0.65)
        img_seq.hAlign = 'CENTER'
        story.append(img_seq)
        story.append(Paragraph("Fig. 7.3: UML Sequence Diagram: Meal Plan Retrieval and Daylight AI Coach Interaction", styles['FigCaption']))
    story.append(Spacer(1, 8))
    
    p_seq_desc = (
        "The sequence delineates exact message passing: the PWA client initiates `GET /api/user/diet-plans/active`. "
        "The Express API queries PostgreSQL, formats the 5-meal plan, and returns JSON. When the user asks a question, "
        "`POST /api/ai/chat` proxies the prompt to Gemini 1.5 Flash, returning structured answers back to the UI."
    )
    story.append(Paragraph(p_seq_desc, styles['ReportBody']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("7.4 Behavioral Modeling: Activity Diagrams", styles['SectionHeading']))
    p_act = (
        "Figure 7.4 illustrates the UML Activity Diagram modeling the daily circadian routine execution lifecycle:"
    )
    story.append(Paragraph(p_act, styles['ReportBody']))
    story.append(Spacer(1, 5))
    
    act_img_path = 'report_assets/diagrams/activity_diagram.png'
    if os.path.exists(act_img_path):
        img_act = Image(act_img_path, width=usable_width, height=usable_width * 0.70)
        img_act.hAlign = 'CENTER'
        story.append(img_act)
        story.append(Paragraph("Fig. 7.4: UML Activity Diagram: Circadian Routine Execution and Progress Feedback", styles['FigCaption']))
    story.append(Spacer(1, 8))
    
    p_act_desc = (
        "The activity flow models user progression from morning wakeup, through hydration and meal adherence checks, "
        "triggering real-time recalculations of the 0%–100% calorie progress bar and scheduling evening progress reports."
    )
    story.append(Paragraph(p_act_desc, styles['ReportBody']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("7.5 Database Design & Relational Data Modeling", styles['SectionHeading']))
    p_db = (
        "The data layer utilizes PostgreSQL 16. Figure 7.5 illustrates the Entity-Relationship (ER) diagram, "
        "and Table 7.1 details the schema table structures, primary keys, foreign keys, and integrity constraints:"
    )
    story.append(Paragraph(p_db, styles['ReportBody']))
    story.append(Spacer(1, 5))
    
    er_img_path = 'report_assets/diagrams/er_diagram.png'
    if os.path.exists(er_img_path):
        img_er = Image(er_img_path, width=usable_width, height=usable_width * 0.70)
        img_er.hAlign = 'CENTER'
        story.append(img_er)
        story.append(Paragraph("Fig. 7.5: Entity-Relationship (ER) Diagram of the Daylight Wellness Database", styles['FigCaption']))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("Table 7.1: PostgreSQL Normalized Relational Table Definitions", styles['TblCaption']))
    tbl_schemas = [
        [Paragraph("<b>Table Name</b>", styles['TblCellBold']), Paragraph("<b>Field / Column</b>", styles['TblCellBold']), Paragraph("<b>Data Type</b>", styles['TblCellBold']), Paragraph("<b>Constraints / Description</b>", styles['TblCellBold'])],
        [Paragraph("<b>users</b>", styles['TblCellBold']), Paragraph("id<br/>email<br/>password<br/>role<br/>profile<br/>created_at", styles['TblCell']), Paragraph("UUID<br/>VARCHAR(255)<br/>VARCHAR(255)<br/>VARCHAR(50)<br/>JSONB<br/>TIMESTAMP", styles['TblCell']), Paragraph("PRIMARY KEY<br/>UNIQUE, NOT NULL<br/>NOT NULL (Bcrypt salted hash)<br/>DEFAULT 'user' ('admin'|'user')<br/>Stores age, gender, height, weight, goal<br/>DEFAULT CURRENT_TIMESTAMP", styles['TblCell'])],
        [Paragraph("<b>diet_plans</b>", styles['TblCellBold']), Paragraph("id<br/>user_id<br/>plan_name<br/>calorie_target<br/>total_calories<br/>meals<br/>created_at", styles['TblCell']), Paragraph("UUID<br/>UUID<br/>VARCHAR(255)<br/>INTEGER<br/>NUMERIC(8,2)<br/>JSONB<br/>TIMESTAMP", styles['TblCell']), Paragraph("PRIMARY KEY<br/>FOREIGN KEY REFERENCES users(id)<br/>NOT NULL (e.g. 'Daily Diet Plan')<br/>Calculated daily target (e.g. 1674 kcal)<br/>Sum of planned meal calories<br/>Structured JSON array of 5 meal slots<br/>DEFAULT CURRENT_TIMESTAMP", styles['TblCell'])],
        [Paragraph("<b>meal_completions</b>", styles['TblCellBold']), Paragraph("id<br/>user_id<br/>plan_date<br/>meal_index<br/>meal_name<br/>calories<br/>completed", styles['TblCell']), Paragraph("UUID<br/>UUID<br/>DATE<br/>INTEGER<br/>VARCHAR(255)<br/>NUMERIC(8,2)<br/>BOOLEAN", styles['TblCell']), Paragraph("PRIMARY KEY<br/>FOREIGN KEY REFERENCES users(id)<br/>NOT NULL (YYYY-MM-DD)<br/>0 to 4 (5 meal slots)<br/>Name of consumed dish<br/>Actual dish calories consumed<br/>DEFAULT false", styles['TblCell'])],
        [Paragraph("<b>reminders</b>", styles['TblCellBold']), Paragraph("id<br/>user_id<br/>reminder_type<br/>reminder_time<br/>is_enabled", styles['TblCell']), Paragraph("UUID<br/>UUID<br/>VARCHAR(100)<br/>TIME<br/>BOOLEAN", styles['TblCell']), Paragraph("PRIMARY KEY<br/>FOREIGN KEY REFERENCES users(id)<br/>'hydration' | 'activity' | 'sleep' | 'meal'<br/>IST Time (HH:MM)<br/>DEFAULT true", styles['TblCell'])],
        [Paragraph("<b>activity_logs</b>", styles['TblCellBold']), Paragraph("id<br/>user_id<br/>log_date<br/>water_ml<br/>exercise_min<br/>sleep_min", styles['TblCell']), Paragraph("UUID<br/>UUID<br/>DATE<br/>INTEGER<br/>INTEGER<br/>INTEGER", styles['TblCell']), Paragraph("PRIMARY KEY<br/>FOREIGN KEY REFERENCES users(id)<br/>NOT NULL (YYYY-MM-DD)<br/>DEFAULT 0 (Target 3007 ml)<br/>DEFAULT 0 (Target 30 min)<br/>DEFAULT 0 (Target 480 min)", styles['TblCell'])]
    ]
    t_schema = Table(tbl_schemas, colWidths=[usable_width*0.20, usable_width*0.22, usable_width*0.20, usable_width*0.38])
    t_schema.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#fff3e0")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#b0bec5")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
    ]))
    story.append(t_schema)
    story.append(PageBreak())
    
    # =========================================================================
    # CHAPTER 8: IMPLEMENTATION
    # =========================================================================
    story.append(Paragraph("CHAPTER 8", styles['ChapterHeading']))
    story.append(Paragraph("IMPLEMENTATION", styles['ChapterHeading']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("8.1 Algorithmic Methodology & Formulations", styles['SectionHeading']))
    p_algo_intro = (
        "The core intelligence of Daylight Wellness is encapsulated in five distinct mathematical formulations "
        "and algorithmic routines:"
    )
    story.append(Paragraph(p_algo_intro, styles['ReportBody']))
    story.append(Spacer(1, 4))
    
    # Algorithm 1
    story.append(Paragraph("<b>Algorithm 1: Anthropometric BMR and Daily Calorie Target Calibration</b>", styles['SubSectionHeading']))
    p_bmr_eq = (
        "The Basal Metabolic Rate (BMR) is determined via the clinically validated Mifflin-St Jeor formulation:<br/>"
        "<i>For Males:</i> BMR = (10 × weight [kg]) + (6.25 × height [cm]) - (5 × age [years]) + 5 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Eq. 8.1)<br/>"
        "<i>For Females:</i> BMR = (10 × weight [kg]) + (6.25 × height [cm]) - (5 × age [years]) - 161 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Eq. 8.2)<br/>"
        "<i>Total Daily Energy Expenditure:</i> TDEE = BMR × ActivityMultiplier &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(Eq. 8.3)"
    )
    story.append(Paragraph(p_bmr_eq, styles['EquationStyle']))
    story.append(Spacer(1, 4))
    
    algo1_code = (
        "Algorithm-1: ComputeCaloricTarget\n"
        "Input: weight (kg), height (cm), age (yrs), gender, activity_level, goal, conditions\n"
        "Output: BMR, TDEE, CalorieTarget\n"
        "1: IF gender == 'Male' THEN\n"
        "2:    BMR = (10 * weight) + (6.25 * height) - (5 * age) + 5\n"
        "3: ELSE\n"
        "4:    BMR = (10 * weight) + (6.25 * height) - (5 * age) - 161\n"
        "5: END IF\n"
        "6: multiplier = {'Sedentary': 1.2, 'Light': 1.375, 'Moderate': 1.55, 'Active': 1.725}[activity_level]\n"
        "7: TDEE = BMR * multiplier\n"
        "8: IF goal == 'Lose' AND NOT HasMedicalCondition(conditions) THEN\n"
        "9:    CalorieTarget = ROUND(TDEE - 350)\n"
        "10: ELSE IF goal == 'Gain' THEN\n"
        "11:   CalorieTarget = ROUND(TDEE + 350)\n"
        "12: ELSE\n"
        "13:   CalorieTarget = ROUND(TDEE)\n"
        "14: END IF\n"
        "15: RETURN BMR, TDEE, CalorieTarget"
    )
    story.append(Paragraph(algo1_code.replace('\n', '<br/>').replace(' ', '&nbsp;'), styles['AlgorithmBox']))
    story.append(Spacer(1, 8))
    
    # Algorithm 2
    story.append(Paragraph("<b>Algorithm 2: Five-Meal Adaptive Generation & Calorie Distribution</b>", styles['SubSectionHeading']))
    algo2_code = (
        "Algorithm-2: GenerateFiveMealPlan\n"
        "Input: CalorieTarget, preference, allergies, dataset_foods\n"
        "Output: Plan = [Meal_0, Meal_1, Meal_2, Meal_3, Meal_4]\n"
        "1: slots = [('Breakfast', 0.25), ('Morning Snack', 0.10), ('Lunch', 0.35),\n"
        "2:          ('Evening Snack', 0.10), ('Dinner', 0.20)]\n"
        "3: Plan = []\n"
        "4: FOR EACH (slot_name, ratio) IN slots DO\n"
        "5:    slot_target = CalorieTarget * ratio\n"
        "6:    candidates = FilterFoods(dataset_foods, preference, allergies, slot_name)\n"
        "7:    selected_food = FindBestCalorieMatch(candidates, slot_target)\n"
        "8:    portion = CalculatePortionGrams(selected_food, slot_target)\n"
        "9:    Plan.APPEND({'slot': slot_name, 'food': selected_food, 'portion': portion,\n"
        "10:                'calories': selected_food.cal_per_100g * (portion / 100)})\n"
        "11: END FOR\n"
        "12: CalibratePortionsToEnsureSumWithinBounds(Plan, CalorieTarget * 0.95, CalorieTarget * 1.0)\n"
        "13: RETURN Plan"
    )
    story.append(Paragraph(algo2_code.replace('\n', '<br/>').replace(' ', '&nbsp;'), styles['AlgorithmBox']))
    story.append(Spacer(1, 8))
    
    # Algorithm 3
    story.append(Paragraph("<b>Algorithm 3: Dual-Tier Daylight AI Coach Conversational Routing</b>", styles['SubSectionHeading']))
    algo3_code = (
        "Algorithm-3: DaylightAICoachRouting\n"
        "Input: user_query, user_profile, active_plan\n"
        "Output: AI_Response_Text\n"
        "1: IF NOT IsNutritionRelated(user_query) THEN\n"
        "2:    RETURN \"I am Daylight AI, your personal food and nutrition coach. Please ask questions related to meals, recipes, calories, and healthy habits.\"\n"
        "3: END IF\n"
        "4: sanitized_prompt = BuildSystemContext(user_profile, active_plan, user_query)\n"
        "5: TRY\n"
        "6:    gemini_resp = CallGeminiAPI(endpoint=\"gemini-1.5-flash\", prompt=sanitized_prompt, timeout=2.5s)\n"
        "7:    IF gemini_resp.status == 200 THEN\n"
        "8:       RETURN ParseAndFormat(gemini_resp.body)\n"
        "9:    END IF\n"
        "10: CATCH NetworkOrQuotaError\n"
        "11:   fallback_resp = LocalRuleBasedNutritionEngine(user_query, user_profile)\n"
        "12:   RETURN fallback_resp\n"
        "13: END TRY"
    )
    story.append(Paragraph(algo3_code.replace('\n', '<br/>').replace(' ', '&nbsp;'), styles['AlgorithmBox']))
    story.append(Spacer(1, 8))
    
    # Algorithm 4
    story.append(Paragraph("<b>Algorithm 4: Smart Grocery Aggregation & Selective Sharing</b>", styles['SubSectionHeading']))
    algo4_code = (
        "Algorithm-4: SelectiveGroceryShare\n"
        "Input: selected_item_ids, all_plan_grocery_items\n"
        "Output: formatted_share_text\n"
        "1: IF selected_item_ids.length == 0 THEN\n"
        "2:    RAISE \"Please select at least one grocery item to share.\"\n"
        "3: END IF\n"
        "4: consolidated_items = Map()\n"
        "5: FOR EACH id IN selected_item_ids DO\n"
        "6:    item = all_plan_grocery_items.GET(id)\n"
        "7:    IF consolidated_items.HAS(item.name) AND AreUnitsCompatible(item.unit, consolidated_items[item.name].unit) THEN\n"
        "8:       consolidated_items[item.name].quantity += item.quantity\n"
        "9:    ELSE\n"
        "10:      consolidated_items.PUT(item.name, item)\n"
        "11:   END IF\n"
        "12: END FOR\n"
        "13: formatted_share_text = \"🛒 *Daylight Wellness – Grocery List:*\\n\" + FormatAisles(consolidated_items)\n"
        "14: DispatchToSelectedChannel(formatted_share_text)  // WhatsApp, Telegram, Email, SMS\n"
        "15: RETURN Success"
    )
    story.append(Paragraph(algo4_code.replace('\n', '<br/>').replace(' ', '&nbsp;'), styles['AlgorithmBox']))
    story.append(Spacer(1, 8))
    
    # Algorithm 5
    story.append(Paragraph("<b>Algorithm 5: Meal-Completion Calorie Progress Display Logic</b>", styles['SubSectionHeading']))
    algo5_code = (
        "Algorithm-5: CalculateMealCompletionProgress\n"
        "Input: meals_array (length 5), completed_meal_indices_set, daily_target_calories\n"
        "Output: calorie_percent, actual_consumed, actual_remaining\n"
        "1: total_meals = meals_array.length > 0 ? meals_array.length : 5\n"
        "2: completed_count = CountCompletedMeals(completed_meal_indices_set)\n"
        "3: calorie_percent = ROUND((completed_count / total_meals) * 100)\n"
        "4: // Mapping: 0/5=0%, 1/5=20%, 2/5=40%, 3/5=60%, 4/5=80%, 5/5=100%\n"
        "5: actual_consumed = SumOfCalories(meals_array, completed_meal_indices_set)\n"
        "6: actual_remaining = MAX(0, daily_target_calories - actual_consumed)\n"
        "7: RenderProgressBar(width = calorie_percent + \"%\")\n"
        "8: RenderIndicators(percent = calorie_percent + \"%\", consumed = actual_consumed, remaining = actual_remaining)\n"
        "9: RETURN {calorie_percent, actual_consumed, actual_remaining}"
    )
    story.append(Paragraph(algo5_code.replace('\n', '<br/>').replace(' ', '&nbsp;'), styles['AlgorithmBox']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("8.2 User Interface Implementation & Screen Demonstrations", styles['SectionHeading']))
    p_ui_intro = (
        "The Daylight Wellness client user interface was implemented using responsive, mobile-first design patterns. "
        "Figures 8.1 through 8.4 demonstrate live production screens captured from the application:"
    )
    story.append(Paragraph(p_ui_intro, styles['ReportBody']))
    story.append(Spacer(1, 5))
    
    # UI Screen 1: Dashboard
    ui_today = 'pwa/screenshots/screenshot-today.jpg'
    if os.path.exists(ui_today):
        img_td = Image(ui_today, width=usable_width * 0.48, height=usable_width * 0.86)
        img_td.hAlign = 'CENTER'
        story.append(img_td)
        story.append(Paragraph("Fig. 8.1: Daylight Wellness Today Dashboard (BMR Target, Calorie Progress Bar, and Metrics)", styles['FigCaption']))
    story.append(Spacer(1, 8))
    
    p_today_desc = (
        "Figure 8.1 illustrates the primary Today dashboard view. Prominent visual elements include: (1) Indian Standard Time (IST) live clock; "
        "(2) Calorie target card showing recommended intake (1,674 kcal), meal-completion progress indicator (80% progress for 4 completed meals), "
        "and distinct footer indicators displaying actual calories consumed (472 kcal consumed) and remaining (1,202 kcal remaining); "
        "(3) Body composition metrics (68 kg current vs 65 kg target); (4) Macronutrient distribution trackers (Protein, Carbs, Fat); "
        "and (5) Circadian habit steppers for Hydration (+250 ml), Activity (+10 min), and Sleep (+1 hr)."
    )
    story.append(Paragraph(p_today_desc, styles['ReportBody']))
    story.append(Spacer(1, 10))
    
    # UI Screen 2: Plan
    ui_plan = 'pwa/screenshots/screenshot-plan.jpg'
    if os.path.exists(ui_plan):
        img_pl = Image(ui_plan, width=usable_width * 0.48, height=usable_width * 0.86)
        img_pl.hAlign = 'CENTER'
        story.append(img_pl)
        story.append(Paragraph("Fig. 8.2: Adaptive Meal Plan View (Five Meals, Macronutrients, and Ingredient Breakdown)", styles['FigCaption']))
    story.append(Spacer(1, 8))
    
    p_plan_desc = (
        "Figure 8.2 depicts the Adaptive Meal Plan view. The interface displays all five scheduled meal slots: "
        "Breakfast (Lassi), Morning Snack (Cheese & Chilli Sandwich), Lunch (Cucumber Sandwich), Evening Snack, and Dinner (Cheese & Pineapple Sandwich). "
        "Each card features a 1-tap completion checkbox, portion serving weights per 100g, macronutrient breakdowns, and alternative food swaps."
    )
    story.append(Paragraph(p_plan_desc, styles['ReportBody']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("8.3 Mobile Packaging & Android Deployment Pipeline", styles['SectionHeading']))
    p_pkg = (
        "The Daylight Wellness PWA was packaged into a native Android installable application using modern packaging protocols:<br/>"
        "• <b>Web App Manifest (`manifest.webmanifest`):</b> Configures standalone display mode, orientation locking (`portrait-primary`), high-resolution maskable icons (192x192 and 512x512 png), store screenshots, and quick shortcut actions for Today and Plan.<br/>"
        "• <b>Trusted Web Activity (TWA) & PWABuilder:</b> Generates a lightweight Android App Bundle (`.aab`) and installable `.apk` wrapping the PWA in a high-performance Chrome Custom Tab shell without browser address bar overhead.<br/>"
        "• <b>GitHub Actions CI/CD:</b> Dual workflows automate PWA deployment to GitHub Pages (`deploy-pwa.yml`) and Flutter Android APK builds (`build-android.yml`) upon code push to the `main` branch."
    )
    story.append(Paragraph(p_pkg, styles['ReportBody']))
    story.append(PageBreak())
    
    # =========================================================================
    # CHAPTER 9: SOFTWARE TESTING
    # =========================================================================
    story.append(Paragraph("CHAPTER 9", styles['ChapterHeading']))
    story.append(Paragraph("SOFTWARE TESTING", styles['ChapterHeading']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("9.1 Testing Strategy & Quality Assurance Methodology", styles['SectionHeading']))
    p_test_strat = (
        "Quality assurance for Daylight Wellness followed a rigorous multi-tier verification strategy encompassing Unit Testing, "
        "Integration Testing, End-to-End UI Verification, and Automated API Regression Testing. Testing objectives focused on verifying "
        "mathematical precision in nutritional formulas, transactional consistency in PostgreSQL completion records, conversational safety "
        "in AI coach responses, and exact compliance with the user's meal-completion calorie progress display specifications."
    )
    story.append(Paragraph(p_test_strat, styles['ReportBody']))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("9.2 Manual Test Cases for All Functional Modules", styles['SectionHeading']))
    p_tc_intro = (
        "Table 9.1 documents 22 comprehensive manual test cases executed across all ten functional modules:"
    )
    story.append(Paragraph(p_tc_intro, styles['ReportBody']))
    story.append(Paragraph("Table 9.1: Comprehensive Manual Test Case Execution Matrix", styles['TblCaption']))
    
    tc_headers = [
        Paragraph("<b>Test ID</b>", styles['TblCellBold']),
        Paragraph("<b>Module / Feature</b>", styles['TblCellBold']),
        Paragraph("<b>Test Case Description</b>", styles['TblCellBold']),
        Paragraph("<b>Expected Result</b>", styles['TblCellBold']),
        Paragraph("<b>Actual Result</b>", styles['TblCellBold']),
        Paragraph("<b>Status</b>", styles['TblCellBold'])
    ]
    
    tc_rows = [
        [Paragraph("TC-01", styles['TblCellBold']), Paragraph("Authentication", styles['TblCell']), Paragraph("Register with valid email, password, and profile data", styles['TblCell']), Paragraph("User record created, password hashed with Bcrypt, session cookie issued", styles['TblCell']), Paragraph("User registered, redirected to Today dashboard", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-02", styles['TblCellBold']), Paragraph("Authentication", styles['TblCell']), Paragraph("Attempt registration with duplicate email address", styles['TblCell']), Paragraph("Reject with HTTP 400 'Email already registered'", styles['TblCell']), Paragraph("Error message displayed, duplicate prevented", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-03", styles['TblCellBold']), Paragraph("Nutrition Math", styles['TblCell']), Paragraph("Calculate BMR for Male: 68kg, 174cm, 24 yrs", styles['TblCell']), Paragraph("BMR = 10(68) + 6.25(174) - 5(24) + 5 = 1,652.5 kcal", styles['TblCell']), Paragraph("BMR = 1,653 kcal calculated accurately", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-04", styles['TblCellBold']), Paragraph("Nutrition Math", styles['TblCell']), Paragraph("Calculate TDEE for Moderate Activity (multiplier 1.55)", styles['TblCell']), Paragraph("TDEE = 1,652.5 * 1.55 = 2,561 kcal", styles['TblCell']), Paragraph("TDEE = 2,561 kcal calculated accurately", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-05", styles['TblCellBold']), Paragraph("Meal Planning", styles['TblCell']), Paragraph("Generate 5-meal plan for Vegetarian preference", styles['TblCell']), Paragraph("All 5 meal slots populated with Vegetarian Indian dishes", styles['TblCell']), Paragraph("5 vegetarian meals generated without non-veg items", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-06", styles['TblCellBold']), Paragraph("Meal Planning", styles['TblCell']), Paragraph("Allergen exclusion: specify 'Dairy' allergy", styles['TblCell']), Paragraph("Exclude paneer, curd, milk, and cheese from all 5 meals", styles['TblCell']), Paragraph("No dairy items appear in generated plan", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-07", styles['TblCellBold']), Paragraph("Calorie Progress", styles['TblCell']), Paragraph("Mark 0 out of 5 meals completed", styles['TblCell']), Paragraph("Progress bar shows 0%, score shows 0%", styles['TblCell']), Paragraph("Displays 0% progress and width 0%", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-08", styles['TblCellBold']), Paragraph("Calorie Progress", styles['TblCell']), Paragraph("Mark 1 out of 5 meals completed", styles['TblCell']), Paragraph("Progress bar shows 20%, score shows 20%", styles['TblCell']), Paragraph("Displays 20% progress and width 20%", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-09", styles['TblCellBold']), Paragraph("Calorie Progress", styles['TblCell']), Paragraph("Mark 2 out of 5 meals completed", styles['TblCell']), Paragraph("Progress bar shows 40%, score shows 40%", styles['TblCell']), Paragraph("Displays 40% progress and width 40%", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-10", styles['TblCellBold']), Paragraph("Calorie Progress", styles['TblCell']), Paragraph("Mark 3 out of 5 meals completed", styles['TblCell']), Paragraph("Progress bar shows 60%, score shows 60%", styles['TblCell']), Paragraph("Displays 60% progress and width 60%", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-11", styles['TblCellBold']), Paragraph("Calorie Progress", styles['TblCell']), Paragraph("Mark 4 out of 5 meals completed (User Adarsh scenario)", styles['TblCell']), Paragraph("Progress bar shows 80%, Consumed = 472 kcal, Remaining = 1,202 kcal", styles['TblCell']), Paragraph("Displays 80% progress, 472 consumed, 1,202 remaining", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-12", styles['TblCellBold']), Paragraph("Calorie Progress", styles['TblCell']), Paragraph("Mark all 5 out of 5 meals completed", styles['TblCell']), Paragraph("Progress bar shows exactly 100%, score shows 100%", styles['TblCell']), Paragraph("Displays 100% progress and width 100%", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-13", styles['TblCellBold']), Paragraph("Daylight AI", styles['TblCell']), Paragraph("Query: 'Give me a healthy breakfast recipe'", styles['TblCell']), Paragraph("Return structured breakfast suggestion with calories and steps", styles['TblCell']), Paragraph("Gemini AI returns formatted healthy Indian breakfast recipe", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-14", styles['TblCellBold']), Paragraph("Daylight AI", styles['TblCell']), Paragraph("Query AI when offline / network disconnected", styles['TblCell']), Paragraph("Graceful fallback to local rule-based nutrition advice", styles['TblCell']), Paragraph("Fallback response returned without crash or error dialog", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-15", styles['TblCellBold']), Paragraph("Habit Logging", styles['TblCell']), Paragraph("Increment water stepper: tap '+ 250 ml'", styles['TblCell']), Paragraph("Hydration total increases by 250 ml, progress bar advances", styles['TblCell']), Paragraph("Water increased by 250 ml, persisted in state", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-16", styles['TblCellBold']), Paragraph("Habit Logging", styles['TblCell']), Paragraph("Decrement water stepper: tap '− 100 ml'", styles['TblCell']), Paragraph("Hydration total decreases by 100 ml (clamped at 0)", styles['TblCell']), Paragraph("Water decreased by 100 ml accurately", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-17", styles['TblCellBold']), Paragraph("Grocery List", styles['TblCell']), Paragraph("Select specific ingredients and tap Share", styles['TblCell']), Paragraph("Share text contains ONLY selected items with consolidated quantities", styles['TblCell']), Paragraph("Selected items shared without unselected items", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-18", styles['TblCellBold']), Paragraph("Grocery List", styles['TblCell']), Paragraph("Attempt to share when 0 items selected", styles['TblCell']), Paragraph("Alert: 'Please select at least one grocery item to share.'", styles['TblCell']), Paragraph("Validation message displayed, share halted", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-19", styles['TblCellBold']), Paragraph("Email Reminders", styles['TblCell']), Paragraph("Configure reminder for 08:30 AM IST and trigger runner", styles['TblCell']), Paragraph("SMTP email sent via Nodemailer without duplicate dispatch", styles['TblCell']), Paragraph("Email delivered to user inbox with correct IST timestamp", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-20", styles['TblCellBold']), Paragraph("Password Reset", styles['TblCell']), Paragraph("Submit Forgot Password request for registered email", styles['TblCell']), Paragraph("Generate secure reset token and email clickable URL", styles['TblCell']), Paragraph("Reset email sent; reset link opens password update form", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-21", styles['TblCellBold']), Paragraph("Admin Console", styles['TblCell']), Paragraph("Authenticate with admin role credentials", styles['TblCell']), Paragraph("Grant access to Admin Console, user audit table, and stats", styles['TblCell']), Paragraph("Admin Console rendered with user directory and analytics", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])],
        [Paragraph("TC-22", styles['TblCellBold']), Paragraph("Offline PWA", styles['TblCell']), Paragraph("Load app in Chrome with DevTools 'Offline' throttling", styles['TblCell']), Paragraph("Service Worker v50 serves shell and cached recipes seamlessly", styles['TblCell']), Paragraph("Application renders full Today and Plan views offline", styles['TblCell']), Paragraph("<b>PASS</b>", styles['TblCellBold'])]
    ]
    
    tc_table_data = [tc_headers] + tc_rows
    tc_table = Table(tc_table_data, colWidths=[usable_width*0.11, usable_width*0.16, usable_width*0.25, usable_width*0.24, usable_width*0.16, usable_width*0.08])
    tc_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e0f2f1")),
        ('GRID', (0,0), (-1,-1), 0.4, colors.HexColor("#b0bec5")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 2.5),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2.5),
        ('TEXTCOLOR', (5,1), (5,-1), colors.HexColor("#2e7d32")),
    ]))
    story.append(tc_table)
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("9.3 Automated Test Suite Execution & Verification", styles['SectionHeading']))
    p_autotest = (
        "In addition to manual quality assurance, two rigorous automated test suites were authored and executed against the live system:<br/>"
        "1. <b>Calorie Progress Display Logic Suite (`test_calorie_progress_logic.js`):</b> "
        "Formally verified the 0%, 20%, 40%, 60%, 80%, and 100% completion progression across all 5 meal slots; "
        "verified that consumed calories (472 kcal) and remaining calories (1,202 kcal) remain based on actual food nutrition; "
        "and confirmed that daily targets and macronutrient records are preserved without mutation. <b>Result: 31 out of 31 test assertions PASSED (100%).</b><br/>"
        "2. <b>Nutrition Consistency & API Regression Suite (`test_nutrition_consistency.js`):</b> "
        "Verified toggle completion, exact calorie subtraction upon unmarking meals, duplicate submission prevention, "
        "and Next Day Plan generation via `/api/plans/next-day`. <b>Result: All regression tests PASSED (100%).</b>"
    )
    story.append(Paragraph(p_autotest, styles['ReportBody']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("9.4 Security & Data Integrity Verification", styles['SectionHeading']))
    p_sec = (
        "Security audits confirmed robust defenses across primary vulnerability vectors:<br/>"
        "• <b>Authentication Integrity:</b> Password entropy enforced; salted Bcrypt hashes prevent rainbow-table exposure.<br/>"
        "• <b>SQL Injection Defense:</b> All PostgreSQL interactions utilize parameterized prepared statements, preventing SQL manipulation.<br/>"
        "• <b>Credential Isolation:</b> API keys (Gemini API, SMTP passwords) are strictly sequestered in backend `.env` variables and never leaked to frontend client scripts.<br/>"
        "• <b>Client App Lock:</b> Biometric / PIN App Lock shields sensitive personal health metrics on shared mobile hardware."
    )
    story.append(Paragraph(p_sec, styles['ReportBody']))
    story.append(PageBreak())
    
    # =========================================================================
    # CHAPTER 10: CONCLUSION AND FUTURE SCOPE
    # =========================================================================
    story.append(Paragraph("CHAPTER 10", styles['ChapterHeading']))
    story.append(Paragraph("CONCLUSION AND FUTURE SCOPE", styles['ChapterHeading']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("10.1 Summary of Phase-1 Achievements", styles['SectionHeading']))
    p_conc = (
        "Capstone Project Phase-1 has successfully designed, developed, and validated <b>Daylight Wellness (PDDR)</b>, "
        "surpassing the 80%+ implementation milestone. The project successfully resolves the critical limitations of conventional "
        "wellness applications by unifying anthropometrically calibrated 5-meal nutrition, circadian routine synchronization, "
        "conversational AI coaching, smart grocery intelligence, and offline-first mobile architecture into a cohesive platform."
    )
    story.append(Paragraph(p_conc, styles['ReportBody']))
    
    p_conc2 = (
        "All core architectural components—including Mifflin-St Jeor BMR/TDEE math, Indian Food Composition dataset curation, "
        "Google Gemini 1.5 Flash AI integration, PostgreSQL 16 persistence, Nodemailer SMTP reminder automation, and PWA/TWA Android packaging—"
        "have been engineered, integrated, and validated through extensive automated test suites. The platform provides a scientifically sound, "
        "user-friendly, and culturally resonant wellness ecosystem."
    )
    story.append(Paragraph(p_conc2, styles['ReportBody']))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("10.2 Technical Limitations", styles['SectionHeading']))
    p_lim = (
        "While Phase-1 delivers an advanced production-ready prototype, certain technical boundaries remain:<br/>"
        "• <b>Content-Based vs Collaborative Filtering:</b> Recommendations currently rely on content-based attribute matching and clinical formulas rather than collaborative user-to-user similarity filtering.<br/>"
        "• <b>Manual Logging Dependence:</b> Habit steppers and meal completion rely on deliberate user input rather than automated IoT sensor detection.<br/>"
        "• <b>Linguistic Localization:</b> The current interface is presented in English, though culinary datasets index Indian vernacular food nomenclature."
    )
    story.append(Paragraph(p_lim, styles['ReportBody']))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("10.3 Phase-2 Development Roadmap", styles['SectionHeading']))
    p_road = (
        "The planned engineering trajectory for Capstone Project Phase-2 encompasses the following enhancements:<br/>"
        "1. <b>Collaborative Filtering Recommender:</b> Implement matrix factorization and Scikit-learn k-nearest neighbors (k-NN) clustering to recommend meals based on behavioral patterns of users with similar physiological profiles.<br/>"
        "2. <b>Computer Vision Meal Logging:</b> Integrate lightweight TensorFlow Lite or MobileNet convolutional neural networks to classify food items directly from smartphone camera snapshots.<br/>"
        "3. <b>Wearable IoT Synchronization:</b> Ingest live heart rate, step count, and sleep architecture telemetry via Bluetooth Low Energy (BLE) integrations with wearable fitness bands.<br/>"
        "4. <b>Multilingual Regional Support:</b> Localize the user interface and AI coach dialogue into regional Indian languages (Hindi, Kannada, Marathi, Tamil, Telugu) to broaden demographic accessibility.<br/>"
        "5. <b>Clinical Dietitian Portal:</b> Develop an authenticated professional tier enabling certified dietitians to review, annotate, and supervise meal plans for clinical outpatients."
    )
    story.append(Paragraph(p_road, styles['ReportBody']))
    story.append(PageBreak())
    
    # =========================================================================
    # REFERENCES / BIBLIOGRAPHY
    # =========================================================================
    story.append(Paragraph("BIBLIOGRAPHY", styles['ChapterHeading']))
    story.append(Paragraph("(REFERENCES)", styles['DocSubtitle']))
    story.append(Spacer(1, 15))
    
    refs = [
        "[1] H. L. Tong and L. Laranjo, \"The use of social features in mobile health interventions to promote physical activity: A systematic review,\" <i>npj Digital Medicine</i>, vol. 1, 2018, Art. no. 43, doi: 10.1038/s41746-018-0051-3.",
        "[2] G. Flores Mateo, E. Granado-Font, C. Ferré-Grau, and X. Montaña-Carreras, \"Mobile phone apps to promote weight loss and increase physical activity: A systematic review and meta-analysis,\" <i>Journal of Medical Internet Research</i>, vol. 17, no. 9, 2015, Art. no. e253, doi: 10.2196/jmir.4836.",
        "[3] R. P. Joseph, K. E. Royse, and T. J. Benitez, \"A systematic review of electronic and mobile health physical activity interventions for African American and Hispanic women,\" <i>Journal of Physical Activity and Health</i>, vol. 16, no. 3, pp. 230-239, 2019, doi: 10.1123/jpah.2018-0103.",
        "[4] A. M. Muller, S. Alley, S. Schoeppe, and C. Vandelanotte, \"The effectiveness of e- and mHealth interventions to promote physical activity and healthy diets in developing countries: A systematic review,\" <i>International Journal of Behavioral Nutrition and Physical Activity</i>, vol. 13, 2016, Art. no. 109, doi: 10.1186/s12966-016-0434-2.",
        "[5] D. Wang and X. Zhao, \"Affective video recommender systems: A survey,\" <i>Frontiers in Neuroscience</i>, vol. 16, 2022, Art. no. 984404, doi: 10.3389/fnins.2022.984404.",
        "[6] S. Milano, M. Taddeo, and L. Floridi, \"Recommender systems and their ethical challenges,\" <i>AI & Society</i>, vol. 35, pp. 957-967, 2020, doi: 10.1007/s00146-020-00950-y.",
        "[7] F. Gille, A. Jobin, and M. Ienca, \"What we talk about when we talk about trust: Theory of trust for AI in healthcare,\" <i>Intelligence-Based Medicine</i>, vol. 1, 2020, Art. no. 100001, doi: 10.1016/j.ibmed.2020.100001.",
        "[8] Y. Zhang and X. Chen, \"Explainable recommendation: A survey and new perspectives,\" <i>Foundations and Trends in Information Retrieval</i>, vol. 14, no. 1, pp. 1-101, 2020, doi: 10.1561/1500000066.",
        "[9] A. Himeur et al., \"Latest trends of security and privacy in recommender systems: A comprehensive review and future perspectives,\" <i>Computers & Security</i>, vol. 118, 2022, Art. no. 102746, doi: 10.1016/j.cose.2022.102746.",
        "[10] O. Levina and S. Mattern, \"Ethical and legal analysis of machine learning based systems: A scenario analysis of a food recommender system,\" in <i>Recommender Systems: Legal and Ethical Issues</i>. Cham, Switzerland: Springer, 2023, pp. 165-185, doi: 10.1007/978-3-031-34804-4_9.",
        "[11] T. Longvah, R. Ananthan, K. Bhaskarachary, and K. Venkaiah, <i>Indian Food Composition Tables</i>. Hyderabad, India: National Institute of Nutrition, Indian Council of Medical Research, 2017.",
        "[12] U.S. Department of Agriculture, Agricultural Research Service, \"FoodData Central,\" [Online]. Available: https://fdc.nal.usda.gov. [Accessed: Oct. 5, 2026].",
        "[13] M. D. Mifflin, S. T. St Jeor, L. A. Hill, B. J. Scott, S. A. Daugherty, and Y. O. Koh, \"A new predictive equation for resting energy expenditure in healthy individuals,\" <i>The American Journal of Clinical Nutrition</i>, vol. 51, no. 2, pp. 241-247, 1990, doi: 10.1093/ajcn/51.2.241.",
        "[14] Google Developers, \"Flutter documentation and architecture guide,\" [Online]. Available: https://docs.flutter.dev. [Accessed: Nov. 2026].",
        "[15] Node.js Foundation, \"Node.js v24 LTS runtime documentation,\" [Online]. Available: https://nodejs.org/docs. [Accessed: Nov. 2026].",
        "[16] PostgreSQL Global Development Group, \"PostgreSQL 16 documentation,\" [Online]. Available: https://www.postgresql.org/docs/16/. [Accessed: Nov. 2026].",
        "[17] Google DeepMind, \"Google Gemini API documentation,\" [Online]. Available: https://ai.google.dev/docs. [Accessed: Nov. 2026].",
        "[18] W3C Web Application Working Group, \"Service Workers 1: W3C Candidate Recommendation,\" [Online]. Available: https://www.w3.org/TR/service-workers-1/. [Accessed: Nov. 2026]."
    ]
    
    for r in refs:
        story.append(Paragraph(r, styles['ReportBody']))
        story.append(Spacer(1, 4))
        
    return story
