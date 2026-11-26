from reportlab.platypus import Paragraph, Spacer, PageBreak, Image, Table, TableStyle
from reportlab.lib import colors

def generate_chapters_1_to_3(styles, usable_width):
    story = []
    
    # =========================================================================
    # CHAPTER 1: INTRODUCTION
    # =========================================================================
    story.append(Paragraph("CHAPTER 1", styles['ChapterHeading']))
    story.append(Paragraph("INTRODUCTION", styles['ChapterHeading']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("1.1 Background and Motivation", styles['SectionHeading']))
    p1 = (
        "In the contemporary digital era, lifestyle-related non-communicable diseases (NCDs)—including obesity, "
        "type-2 diabetes mellitus, hypertension, metabolic syndrome, and cardiovascular ailments—have emerged as "
        "foremost public health emergencies globally. Epidemiological investigations conducted by the World Health "
        "Organization (WHO) and the Indian Council of Medical Research (ICMR) establish that a predominant proportion "
        "of these metabolic disorders stem directly from chronic behavioral patterns: excessive intake of energy-dense, "
        "nutrient-poor processed foods, erratic meal timing, insufficient cellular hydration, sedentary occupations, "
        "and disrupted circadian sleep cycles. While medical interventions are essential for acute conditions, long-term "
        "disease prevention and vitality fundamentally hinge upon sustained lifestyle modifications and proactive nutritional self-regulation."
    )
    story.append(Paragraph(p1, styles['ReportBody']))
    
    p2 = (
        "Despite heightened public awareness regarding physical fitness, individuals encounter profound practical hurdles "
        "when attempting to translate general dietary guidelines into sustainable daily habits. Traditional dietary consultation "
        "typically delivers static, printed diet charts that prescribe rigid meal schedules and inflexible ingredients. Such static "
        "recommendations rapidly fail in real-world environments because they overlook the inherent biological and situational variability "
        "of human life: fluctuating physical exertion, varying work shifts, ingredient unavailability in local markets, socioeconomic "
        "constraints, culinary preferences, and individual food intolerances. When a user cannot procure or prepare an exact prescribed item, "
        "the lack of intelligent substitution guidance leads to frustration and regimen abandonment."
    )
    story.append(Paragraph(p2, styles['ReportBody']))
    
    p3 = (
        "Concurrently, the rapid proliferation of smartphones has catalyzed the emergence of mobile health (mHealth) applications. "
        "However, the current commercial landscape is severely fragmented. Users typically find calorie counting isolated in one application "
        "(e.g., MyFitnessPal), water intake logged in a second application, exercise routines scheduled in a third, and grocery shopping "
        "managed manually in a separate notes document. This disjointed software ecosystem imposes substantial cognitive burden, requiring "
        "tedious context-switching and redundant manual data entry across multiple uncoordinated user interfaces. Consequently, user retention "
        "rates for conventional wellness apps decay precipitously within the first thirty days of installation. There exists an imperative "
        "necessity for a cohesive, scientifically calibrated digital platform that synergistically synthesizes personalized nutrition, circadian "
        "routine tracking, dynamic meal adaptations, and automated grocery intelligence within a unified, seamless mobile environment."
    )
    story.append(Paragraph(p3, styles['ReportBody']))
    
    story.append(Paragraph("1.2 Domain Overview", styles['SectionHeading']))
    p4 = (
        "The conceptual foundation of this project is positioned at the intersection of several rapidly advancing technological "
        "and scientific domains:"
    )
    story.append(Paragraph(p4, styles['ReportBody']))
    
    bullets_domain = [
        "<b>Nutritional Informatics and Chrononutrition:</b> The study of nutrient interactions with circadian biology, establishing that not only what an individual consumes, but the temporal synchronization of meal timing relative to biological wake-sleep rhythms profoundly impacts glycemic control, lipid metabolism, and metabolic homeostasis.",
        "<b>Content-Based and Constraint-Aware Recommender Systems:</b> Machine learning and algorithmic selection methodologies that filter complex item catalogs based on multidimensional user attributes, physiological constraints, food compatibility scores, and calorie distribution models.",
        "<b>Conversational Artificial Intelligence in Healthcare:</b> Natural Language Processing (NLP) models and Large Language Models (LLMs) that provide empathetic, accessible, and scientifically grounded wellness dialogues, translating complex biochemical concepts into practical dietary advice.",
        "<b>Mobile Computing and Offline-First Architectures:</b> Modern software engineering paradigms leveraging Progressive Web Applications (PWA), Service Workers, and local persistence stores to guarantee uninterrupted application utility regardless of remote network fluctuations."
    ]
    for b in bullets_domain:
        story.append(Paragraph(f"• {b}", styles['ReportBullet']))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("1.3 Target Audience and Stakeholder Profiles", styles['SectionHeading']))
    p5 = (
        "The Daylight Wellness (PDDR) system is engineered to serve diverse demographic cohorts encountering lifestyle optimization challenges:"
    )
    story.append(Paragraph(p5, styles['ReportBody']))
    
    audiences = [
        "<b>University Students and Academic Scholars:</b> Demographics prone to erratic academic schedules, late-night study sessions, budget constraints, and limited cooking infrastructure, requiring rapid, affordable, and nutritious Indian meal options.",
        "<b>Corporate Working Professionals:</b> Individuals subject to prolonged sedentary desk hours, high occupational stress, and irregular lunch breaks, who benefit substantially from automated hydration reminders, structured 5-meal pacing, and quick grocery exports.",
        "<b>Fitness Enthusiasts and Active Gym-goers:</b> Individuals pursuing explicit body composition targets (hypertrophy, fat loss, or weight maintenance) requiring strict macronutrient balance (Protein, Carbohydrate, and Fat targets) and calibrated caloric deficits or surpluses.",
        "<b>Workplace Wellness and Institutional Programs:</b> Corporate organizations seeking scalable digital wellness solutions to enhance employee vitality, reduce absenteeism, and promote healthy workplace culture without costly individual clinical consultations."
    ]
    for a in audiences:
        story.append(Paragraph(f"• {a}", styles['ReportBullet']))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("1.4 Objectives of Phase-1", styles['SectionHeading']))
    p6 = (
        "The primary objective of Capstone Project Phase-1 is to engineer, deploy, and validate a robust, production-grade prototype "
        "delivering over 80% of the envisioned system functionality. Specific engineering milestones achieved in Phase-1 include:"
    )
    story.append(Paragraph(p6, styles['ReportBody']))
    
    objs = [
        "Architecting an anthropometric energy expenditure calibration engine implementing the clinical Mifflin-St Jeor formulation to dynamically calculate Basal Metabolic Rate (BMR) and Total Daily Energy Expenditure (TDEE).",
        "Curating and structuring a verified Indian Food Composition dataset (comprising over 1,000 regional foods and authentic culinary recipes) with comprehensive macronutrient profiles (Calories, Protein, Carbohydrates, and Fats per 100g).",
        "Developing an adaptive five-meal daily generation algorithm that distributes calories across Breakfast (25%), Morning Snack (10%), Lunch (35%), Evening Snack (10%), and Dinner (20%), aligned strictly within 95–100% of the user's daily target.",
        "Integrating a conversational AI assistant—the Daylight AI Diet Coach—powered by Google Gemini 1.5 Flash API with localized fallback mechanisms for safe, non-hallucinatory nutrition and recipe queries.",
        "Engineering a circadian routine tracking suite encompassing hydration steppers, exercise logging, sleep duration tracking, and seven structured daily milestone cards.",
        "Implementing an exact meal-completion driven calorie progress visualization model scaling linearly across six milestones (0%, 20%, 40%, 60%, 80%, and 100% completed) while strictly preserving separate actual consumed versus remaining calorie displays.",
        "Configuring enterprise PostgreSQL relational persistence, automated Nodemailer SMTP reminder dispatchers, and packaging the system as a PWA / Android TWA WebAPK."
    ]
    for o in objs:
        story.append(Paragraph(f"• {o}", styles['ReportBullet']))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("1.5 Report Organization", styles['SectionHeading']))
    p7 = (
        "The remainder of this report is organized as follows: Chapter 2 details the project description, problem definition, "
        "proposed solution, purpose, and scope. Chapter 3 provides an exhaustive literature survey reviewing ten verified research "
        "papers and a comparative benchmark against existing systems. Chapter 4 specifies hardware, software, and toolchain requirements. "
        "Chapter 5 delineates the Software Requirements Specification (SRS), covering detailed functional and non-functional requirements. "
        "Chapter 6 presents high-level system design and architectural models. Chapter 7 elaborates detailed design, including process "
        "flows, UML use cases, sequence diagrams, activity models, and database schemas. Chapter 8 describes implementation algorithms "
        "and visual screen demonstrations. Chapter 9 documents quality assurance, manual test matrices, and automated test suite results. "
        "Chapter 10 concludes the report and presents the Phase-2 development roadmap."
    )
    story.append(Paragraph(p7, styles['ReportBody']))
    story.append(PageBreak())
    
    # =========================================================================
    # CHAPTER 2: PROJECT DESCRIPTION
    # =========================================================================
    story.append(Paragraph("CHAPTER 2", styles['ChapterHeading']))
    story.append(Paragraph("PROJECT DESCRIPTION", styles['ChapterHeading']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("2.1 Problem Definition", styles['SectionHeading']))
    p8 = (
        "The fundamental problem addressed by this project is the prevalence of dietary non-compliance and health goal failure "
        "resulting from static, uncalibrated nutritional guidance and fragmented wellness tooling. In quantitative terms, existing "
        "solutions suffer from four critical deficiencies:"
    )
    story.append(Paragraph(p8, styles['ReportBody']))
    
    probs = [
        "<b>Rigid Caloric Allocation:</b> Conventional diet charts prescribe fixed meal items without dynamically adjusting portion sizes to the user's metabolic rate, resulting in severe caloric deficits or unintentional surpluses that derail fitness progress.",
        "<b>Absence of Intelligent Food Substitutions:</b> When users encounter unavailable ingredients or dietary monotony, existing applications offer no context-aware, calorically equivalent culinary swaps, causing users to deviate completely from their plans.",
        "<b>Western Dataset Bias:</b> Mainstream commercial wellness applications predominantly index Western packaged foods, lacking accurate macronutrient data for complex, multi-ingredient regional Indian dishes (such as Moong Bean Dosa, Palak Paneer, or Vegetable Khichdi).",
        "<b>Disjointed Habit Tracking:</b> The separation of meal tracking from circadian biological rhythms (hydration, physical activity, and sleep recovery) forces users to navigate multiple fragmented tools, inducing cognitive exhaustion and high dropout rates."
    ]
    for pr in probs:
        story.append(Paragraph(f"• {pr}", styles['ReportBullet']))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("2.2 Proposed Solution: Daylight Wellness (PDDR)", styles['SectionHeading']))
    p9 = (
        "Daylight Wellness (Personalized Diet and Daily Routine Recommendation System) resolves these systemic deficiencies by "
        "unifying scientifically validated nutritional mathematics, regional culinary intelligence, circadian biological tracking, "
        "and conversational artificial intelligence into an offline-first mobile platform. Rather than presenting static charts, "
        "PDDR constructs a dynamic, adaptive daily wellness routine calibrated to the user's exact physiological baseline."
    )
    story.append(Paragraph(p9, styles['ReportBody']))
    
    p10 = (
        "The architecture introduces an intelligent 5-meal adaptive planning engine that queries an authentic Indian Food Composition "
        "dataset, calculating portion weights per 100 grams to achieve exact caloric and macronutrient harmony. To eliminate meal-planning "
        "friction, the application features an automated Smart Grocery List that aggregates ingredients across all scheduled meals, "
        "categorizes items into standardized culinary aisles (Dairy, Produce, Grains, Spices), and empowers users to selectively share "
        "specific shopping subsets directly via WhatsApp, Telegram, Email, or native device sharing. Real-time guidance is delivered "
        "via the Daylight AI Coach, which utilizes advanced prompt engineering over Google Gemini 1.5 Flash API to provide safe, non-prescriptive, "
        "educational nutrition consultation."
    )
    story.append(Paragraph(p10, styles['ReportBody']))
    
    story.append(Paragraph("2.3 Purpose and Core Objectives", styles['SectionHeading']))
    p11 = (
        "The overarching purpose of PDDR is to democratize personalized preventive wellness, providing users with the precision "
        "of clinical dietetics combined with the convenience of automated mobile technology. The explicit system objectives are:"
    )
    story.append(Paragraph(p11, styles['ReportBody']))
    
    objs2 = [
        "<b>Scientific Personalization:</b> Compute individualized BMR and TDEE utilizing validated clinical formulations, dynamically applying caloric adjustments based on user goals (Weight Loss: -350 kcal deficit; Weight Gain: +350 kcal surplus; Maintenance: baseline).",
        "<b>Nutritional Completeness:</b> Ensure daily meal recommendations contain appropriate proportions of macronutrients: Protein (20–25%), Carbohydrates (50–55%), and Healthy Fats (20–25%), while respecting strict dietary preferences (Vegetarian, Non-Vegetarian, Vegan) and allergen exclusions.",
        "<b>Circadian Behavioral Synchronization:</b> Structure the user's day around seven circadian milestones, reinforcing consistent hydration (3,000 ml daily goal), regular exercise (30 minutes active movement), adequate sleep (8 hours rest), and punctual meal consumption.",
        "<b>Transparent Progress Feedback:</b> Present intuitive visual indicators reflecting true meal completion (scaling at 0%, 20%, 40%, 60%, 80%, and 100%) while preserving distinct indicators for actual calories consumed versus calories remaining.",
        "<b>Enterprise Persistence and Offline Resilience:</b> Maintain local responsiveness and offline caching via Service Worker v50 while providing centralized PostgreSQL synchronization, administrative monitoring, and automated SMTP email reminders."
    ]
    for ob in objs2:
        story.append(Paragraph(f"• {ob}", styles['ReportBullet']))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("2.4 Scope and System Boundaries", styles['SectionHeading']))
    p12 = (
        "To establish rigorous engineering focus, the scope of Capstone Project Phase-1 is explicitly delineated:"
    )
    story.append(Paragraph(p12, styles['ReportBody']))
    
    scopes = [
        "<b>In-Scope (Phase-1 Delivery):</b> Complete responsive Progressive Web Application (PWA) and Android TWA WebAPK; Mifflin-St Jeor BMR/TDEE calculation; 5-meal daily planning using regional Indian food datasets; intelligent food substitution explorer; Daylight AI Coach integration with Gemini 1.5 Flash API; circadian habit steppers (Water, Activity, Sleep); selective grocery list sharing; PostgreSQL database schema; automated Nodemailer SMTP reminder runner; multi-role administrative console; and 100% test suite validation.",
        "<b>Out-of-Scope (Deferred to Phase-2):</b> Direct integration with proprietary clinical hospital Electronic Health Records (EHR); automated computer vision convolutional neural network food image classification; real-time Bluetooth Low Energy (BLE) wearable sensor ingestion (e.g., Apple HealthKit or Fitbit APIs); and prescription medical dietetics for acute clinical pathologies.",
        "<b>Medical Safety Boundary:</b> PDDR is explicitly classified as an educational and preventive wellness tool. It incorporates strict safety notices advising users with complex clinical conditions (e.g., chronic renal failure, severe cardiovascular pathologies, or advanced age) to consult qualified healthcare practitioners, suppressing automatic caloric deficits in high-risk profiles."
    ]
    for sc in scopes:
        story.append(Paragraph(f"• {sc}", styles['ReportBullet']))
    story.append(Spacer(1, 8))
    
    story.append(Paragraph("2.5 Key System Innovations", styles['SectionHeading']))
    p13 = (
        "Daylight Wellness introduces several distinct technological and methodological innovations compared to contemporary systems:"
    )
    story.append(Paragraph(p13, styles['ReportBody']))
    
    innovations = [
        "<b>Meal-Completion Driven Calorie Progress:</b> Solves the psychological ambiguity of traditional calorie bars by linking the visual progress bar directly to completed meals (1 of 5 = 20%, 2 of 5 = 40%, etc.), preventing premature 100% visual closure when only partial meals are logged.",
        "<b>Indian Food Composition Data Modeling:</b> Structures authentic recipes using real culinary ingredients per 100g serving weights, ensuring realistic caloric totals rather than inaccurate generic estimates.",
        "<b>Dual-Tier Conversational AI Architecture:</b> Couples remote Google Gemini API queries with an instant, localized rule-based fallback, guaranteeing that nutritional inquiries receive immediate, helpful responses even during internet outages or quota limits.",
        "<b>Selective Smart Grocery Consolidation:</b> Eliminates redundant entries by mathematically combining identical recipe ingredients across different meals and enabling checkbox-based selective export across communication channels."
    ]
    for inn in innovations:
        story.append(Paragraph(f"• {inn}", styles['ReportBullet']))
    story.append(PageBreak())
    
    # =========================================================================
    # CHAPTER 3: LITERATURE SURVEY
    # =========================================================================
    story.append(Paragraph("CHAPTER 3", styles['ChapterHeading']))
    story.append(Paragraph("LITERATURE SURVEY", styles['ChapterHeading']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("3.1 Overview of mHealth & Nutritional Recommender Systems", styles['SectionHeading']))
    p14 = (
        "The development of intelligent health recommendation systems represents a vibrant domain in medical informatics "
        "and applied artificial intelligence. Academic literature over the past decade underscores a decisive transition from "
        "passive health record repositories toward proactive, context-aware decision support systems. A comprehensive review "
        "of contemporary scholarly publications was executed to investigate theoretical methodologies, recommender algorithms, "
        "behavioral psychology models, and ethical considerations relevant to the design of the PDDR platform."
    )
    story.append(Paragraph(p14, styles['ReportBody']))
    
    story.append(Paragraph("3.2 Comprehensive Review of Verified Research Papers", styles['SectionHeading']))
    p15 = (
        "In accordance with project guidelines, ten verified, peer-reviewed research papers from prestigious journals "
        "(including Nature npj Digital Medicine, JMIR, Springer, and Elsevier) were thoroughly analyzed. Each review examines "
        "the core methodology, notable strengths, technical limitations, and specific takeaways integrated into the PDDR system:"
    )
    story.append(Paragraph(p15, styles['ReportBody']))
    
    # Paper 1
    story.append(Paragraph("<b>[1] Tong & Laranjo (2018) – \"The use of social features in mobile health interventions to promote physical activity: A systematic review\" (npj Digital Medicine)</b>", styles['SubSectionHeading']))
    p_lit1 = (
        "<i>Methodology:</i> The authors conducted a systematic meta-analysis of mHealth interventions across randomized controlled trials, "
        "evaluating the efficacy of social sharing, gamification, and peer competition on sustained physical activity.<br/>"
        "<i>Strengths:</i> Demonstrates conclusively that social accountability and structured habit feedback significantly increase 6-month user adherence.<br/>"
        "<i>Limitations:</i> The study identified that generic leaderboards often induce demotivation among lower-performing users.<br/>"
        "<i>Relevance to PDDR:</i> Inspired the design of PDDR's non-competitive, personal streak counter and selective grocery sharing mechanism, "
        "which emphasizes self-efficacy and family collaboration rather than intimidating public competition."
    )
    story.append(Paragraph(p_lit1, styles['ReportBody']))
    
    # Paper 2
    story.append(Paragraph("<b>[2] Flores Mateo et al. (2015) – \"Mobile phone apps to promote weight loss and increase physical activity: A systematic review and meta-analysis\" (Journal of Medical Internet Research)</b>", styles['SubSectionHeading']))
    p_lit2 = (
        "<i>Methodology:</i> Synthesized clinical trial data evaluating smartphone apps utilizing calorie tracking, weight monitoring, and behavioral nudges.<br/>"
        "<i>Strengths:</i> Statistically proved that regular digital self-monitoring results in clinically significant weight loss (-1.04 kg mean difference, p < 0.001) compared to standard care.<br/>"
        "<i>Limitations:</i> Highlighted high attrition rates caused by cumbersome food logging interfaces that require excessive typing.<br/>"
        "<i>Relevance to PDDR:</i> Directly motivated PDDR's 1-tap meal completion checkboxes and automated 5-meal generation, eliminating the tedious manual search-and-log burden of traditional apps."
    )
    story.append(Paragraph(p_lit2, styles['ReportBody']))
    
    # Paper 3
    story.append(Paragraph("<b>[3] Joseph, Royse & Benitez (2019) – \"A systematic review of electronic and mobile health physical activity interventions\" (Journal of Physical Activity and Health)</b>", styles['SubSectionHeading']))
    p_lit3 = (
        "<i>Methodology:</i> Evaluated mHealth interventions across culturally diverse demographics, assessing tailoring of physical activity messaging.<br/>"
        "<i>Strengths:</i> Established that culturally and contextually tailored interventions yield 2.4-fold higher engagement than generic interventions.<br/>"
        "<i>Limitations:</i> Pointed out that most mobile apps fail to provide culturally congruent nutritional options.<br/>"
        "<i>Relevance to PDDR:</i> Validated PDDR's focus on authentic regional Indian food composition datasets and culturally resonant dishes rather than generic Western meal plans."
    )
    story.append(Paragraph(p_lit3, styles['ReportBody']))
    
    # Paper 4
    story.append(Paragraph("<b>[4] Muller, Alley, Schoeppe & Vandelanotte (2016) – \"The effectiveness of e- and mHealth interventions to promote physical activity and healthy diets in developing countries\" (IJBNPA)</b>", styles['SubSectionHeading']))
    p_lit4 = (
        "<i>Methodology:</i> Comprehensive systematic review examining digital health technology deployment within developing and emerging economies.<br/>"
        "<i>Strengths:</i> Proved that mobile solutions are highly effective in low-resource settings when lightweight, resilient to connectivity disruptions, and affordable.<br/>"
        "<i>Limitations:</i> High-bandwidth, cloud-only systems suffered persistent failure due to intermittent cellular networks.<br/>"
        "<i>Relevance to PDDR:</i> Formed the architectural justification for PDDR's offline-first PWA design, Service Worker v50 caching, and zero-latency local fallback mechanisms."
    )
    story.append(Paragraph(p_lit4, styles['ReportBody']))
    
    # Paper 5
    story.append(Paragraph("<b>[5] Wang & Zhao (2022) – \"Affective video recommender systems: A survey\" (Frontiers in Neuroscience)</b>", styles['SubSectionHeading']))
    p_lit5 = (
        "<i>Methodology:</i> Explored emotion-aware, affective recommendation algorithms that adjust suggestions based on perceived user cognitive state.<br/>"
        "<i>Strengths:</i> Demonstrates that empathetic tone and adaptive conversational framing reduce user anxiety during health behavior change.<br/>"
        "<i>Limitations:</i> Emotion recognition via camera sensors introduces severe privacy concerns.<br/>"
        "<i>Relevance to PDDR:</i> Informed the conversational prompt engineering of the Daylight AI Coach, embedding supportive, non-judgmental, encouraging language without invasive biometric tracking."
    )
    story.append(Paragraph(p_lit5, styles['ReportBody']))
    
    # Paper 6
    story.append(Paragraph("<b>[6] Milano, Taddeo & Floridi (2020) – \"Recommender systems and their ethical challenges\" (AI & Society)</b>", styles['SubSectionHeading']))
    p_lit6 = (
        "<i>Methodology:</i> Foundational philosophical and algorithmic investigation into the ethical risks of autonomous recommenders, including autonomy loss, filter bubbles, and nudging manipulation.<br/>"
        "<i>Strengths:</i> Formulates an ethical framework requiring recommendation opacity to be replaced with transparent user agency.<br/>"
        "<i>Limitations:</i> Theoretical paper without concrete mobile software implementation.<br/>"
        "<i>Relevance to PDDR:</i> Led to PDDR's transparent calorie and macronutrient breakdown displays and user-controlled meal swapping, ensuring users retain complete autonomy over dietary decisions."
    )
    story.append(Paragraph(p_lit6, styles['ReportBody']))
    
    # Paper 7
    story.append(Paragraph("<b>[7] Gille, Jobin & Ienca (2020) – \"What we talk about when we talk about trust: Theory of trust for AI in healthcare\" (Intelligence-Based Medicine)</b>", styles['SubSectionHeading']))
    p_lit7 = (
        "<i>Methodology:</i> Qualitative and theoretical synthesis defining the components of user trust in medical and health AI systems: technical reliability, data privacy, and explainability.<br/>"
        "<i>Strengths:</i> Establishes that user adoption decays when AI operations operate as unverified black boxes.<br/>"
        "<i>Limitations:</i> Focuses primarily on clinical diagnostic AI rather than consumer preventive wellness.<br/>"
        "<i>Relevance to PDDR:</i> Governed the design of PDDR's prominent display of mathematical BMR formulas, dataset source attribution (NIN-ICMR), and explicit disclaimers regarding general wellness boundaries."
    )
    story.append(Paragraph(p_lit7, styles['ReportBody']))
    
    # Paper 8
    story.append(Paragraph("<b>[8] Zhang & Chen (2020) – \"Explainable recommendation: A survey and new perspectives\" (Foundations and Trends in Information Retrieval)</b>", styles['SubSectionHeading']))
    p_lit8 = (
        "<i>Methodology:</i> Exhaustive technical survey of explainability paradigms in collaborative filtering, knowledge graphs, and deep neural recommendation engines.<br/>"
        "<i>Strengths:</i> Proves that providing clear justifications (e.g., \"Recommended because of your goal: Maintain, 1,674 kcal\") increases recommendation acceptance by over 38%.<br/>"
        "<i>Limitations:</i> Complex graph neural networks impose excessive computational latency on mobile devices.<br/>"
        "<i>Relevance to PDDR:</i> Integrated into PDDR's meal card headers, which explicitly state the meal slot, percentage allocation, portion weight, and targeted macronutrient justification."
    )
    story.append(Paragraph(p_lit8, styles['ReportBody']))
    
    # Paper 9
    story.append(Paragraph("<b>[9] Himeur et al. (2022) – \"Latest trends of security and privacy in recommender systems: A comprehensive review\" (Computers & Security)</b>", styles['SubSectionHeading']))
    p_lit9 = (
        "<i>Methodology:</i> Technical evaluation of vulnerability vectors in modern recommenders, including data poisoning, profiling leakage, and session hijacking.<br/>"
        "<i>Strengths:</i> Proposes strict privacy-by-design architectures: client-side session hashing, minimal cloud data transmission, and role-based access control.<br/>"
        "<i>Limitations:</i> Strict encryption often degrades client-side recommendation responsiveness.<br/>"
        "<i>Relevance to PDDR:</i> Directly guided PDDR's security engineering: Bcrypt password salting, HTTP-only JWT session cookies, sanitized PostgreSQL parameterized queries, and an in-app biometric App Lock feature."
    )
    story.append(Paragraph(p_lit9, styles['ReportBody']))
    
    # Paper 10
    story.append(Paragraph("<b>[10] Levina & Mattern (2023) – \"Ethical and legal analysis of machine learning based systems: A scenario analysis of a food recommender system\" (Springer)</b>", styles['SubSectionHeading']))
    p_lit10 = (
        "<i>Methodology:</i> Scenario-based legal and technical compliance study examining food recommendation algorithms under GDPR, medical device regulations, and product liability.<br/>"
        "<i>Strengths:</i> Defines explicit boundary criteria distinguishing general lifestyle guidance from regulated medical advice to prevent hazardous allergen or medical contraindication liability.<br/>"
        "<i>Limitations:</i> Highly legalistic with limited code architecture guidance.<br/>"
        "<i>Relevance to PDDR:</i> Mandated the inclusion of PDDR's explicit Health Condition Guidance Banner and allergen exclusion filters, which automatically suppress automated caloric deficits for vulnerable profiles."
    )
    story.append(Paragraph(p_lit10, styles['ReportBody']))
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("3.3 Comparative Analysis with Existing Systems", styles['SectionHeading']))
    p16 = (
        "To establish the competitive differentiation and technical superiority of Daylight Wellness (PDDR), "
        "a rigorous multi-attribute benchmark was conducted comparing PDDR against the four leading commercial wellness applications: "
        "MyFitnessPal, HealthifyMe, Lifesum, and Cronometer. The evaluation matrix is presented in Table 3.1:"
    )
    story.append(Paragraph(p16, styles['ReportBody']))
    story.append(Paragraph("Table 3.1: Comparative Analysis of PDDR vs Leading Commercial Wellness Platforms", styles['TblCaption']))
    
    comp_headers = [
        Paragraph("<b>Evaluation Dimension</b>", styles['TblCellBold']),
        Paragraph("<b>MyFitnessPal</b>", styles['TblCell']),
        Paragraph("<b>HealthifyMe</b>", styles['TblCell']),
        Paragraph("<b>Lifesum</b>", styles['TblCell']),
        Paragraph("<b>Cronometer</b>", styles['TblCell']),
        Paragraph("<b>Daylight (PDDR)</b>", styles['TblCellBold'])
    ]
    
    comp_rows = [
        [Paragraph("Indian Food Composition", styles['TblCellBold']), Paragraph("Crowdsourced (Inaccurate)", styles['TblCell']), Paragraph("Proprietary (Paywalled)", styles['TblCell']), Paragraph("Minimal Coverage", styles['TblCell']), Paragraph("USDA Focused", styles['TblCell']), Paragraph("<b>NIN-ICMR Verified (Open)</b>", styles['TblCellBold'])],
        [Paragraph("5-Meal Calorie Splitting", styles['TblCellBold']), Paragraph("Manual Logging Only", styles['TblCell']), Paragraph("Partial / Paid Coaching", styles['TblCell']), Paragraph("Generic 3 Meals", styles['TblCell']), Paragraph("Manual Entry Only", styles['TblCell']), Paragraph("<b>Automated 95-100% Target</b>", styles['TblCellBold'])],
        [Paragraph("Calorie Progress Logic", styles['TblCellBold']), Paragraph("Calorie Bar (Misleading)", styles['TblCell']), Paragraph("Calorie Ratio", styles['TblCell']), Paragraph("Calorie Deficit Bar", styles['TblCell']), Paragraph("Energy Bar", styles['TblCell']), Paragraph("<b>Meal-Completion (0-100%)</b>", styles['TblCellBold'])],
        [Paragraph("Conversational AI Assistant", styles['TblCellBold']), Paragraph("None", styles['TblCell']), Paragraph("Ria (Commercial Chatbot)", styles['TblCell']), Paragraph("None", styles['TblCell']), Paragraph("None", styles['TblCell']), Paragraph("<b>Gemini 1.5 + Fallback</b>", styles['TblCellBold'])],
        [Paragraph("Smart Grocery Consolidation", styles['TblCellBold']), Paragraph("Paid Add-on", styles['TblCell']), Paragraph("E-commerce Upsell", styles['TblCell']), Paragraph("Basic List", styles['TblCell']), Paragraph("None", styles['TblCell']), Paragraph("<b>Aisle Categorized + Share</b>", styles['TblCellBold'])],
        [Paragraph("Circadian Routine Sync", styles['TblCellBold']), Paragraph("Separate Tracking", styles['TblCell']), Paragraph("Habit Cards (Paid)", styles['TblCell']), Paragraph("Water Logger Only", styles['TblCell']), Paragraph("Biometrics Only", styles['TblCell']), Paragraph("<b>7 Milestones Integrated</b>", styles['TblCellBold'])],
        [Paragraph("Offline Resilience", styles['TblCellBold']), Paragraph("Disabled (Cloud Only)", styles['TblCell']), Paragraph("Disabled (Cloud Only)", styles['TblCell']), Paragraph("Partial Sync", styles['TblCell']), Paragraph("Disabled", styles['TblCell']), Paragraph("<b>PWA / Service Worker v50</b>", styles['TblCellBold'])],
        [Paragraph("Cost / Subscription", styles['TblCellBold']), Paragraph("Subscription ($19.99/mo)", styles['TblCell']), Paragraph("Freemium ($15-50/mo)", styles['TblCell']), Paragraph("Subscription ($21.99/mo)", styles['TblCell']), Paragraph("Gold Tier ($8.99/mo)", styles['TblCell']), Paragraph("<b>Open Academic & Free</b>", styles['TblCellBold'])],
        [Paragraph("Privacy & Data Autonomy", styles['TblCellBold']), Paragraph("Third-party Ad Tracking", styles['TblCell']), Paragraph("Commercial Analytics", styles['TblCell']), Paragraph("Commercial Ad Tracking", styles['TblCell']), Paragraph("Moderate Privacy", styles['TblCell']), Paragraph("<b>Zero Tracking / Self-Host</b>", styles['TblCellBold'])]
    ]
    
    comp_table_data = [comp_headers] + comp_rows
    comp_table = Table(comp_table_data, colWidths=[usable_width*0.22, usable_width*0.15, usable_width*0.16, usable_width*0.15, usable_width*0.15, usable_width*0.17])
    comp_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#e8eaf6")),
        ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor("#b0bec5")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('TOPPADDING', (0,0), (-1,-1), 3),
        ('BOTTOMPADDING', (0,0), (-1,-1), 3),
        ('BACKGROUND', (5,1), (5,-1), colors.HexColor("#e8f5e9")),
    ]))
    story.append(comp_table)
    story.append(Spacer(1, 10))
    
    story.append(Paragraph("3.4 Identification of Research and Technological Gaps", styles['SectionHeading']))
    p17 = (
        "The literature survey and comparative analysis reveal three critical research and engineering gaps in current systems:<br/>"
        "1. <b>The Context Gap:</b> Existing tools treat nutritional guidance in isolation from circadian daily routines, failing to coordinate meal consumption with hydration, activity, and sleep rhythms.<br/>"
        "2. <b>The Cultural Data Gap:</b> International wellness platforms lack granular, authenticated regional Indian nutritional datasets, forcing Indian users to rely on inaccurate crowdsourced approximations.<br/>"
        "3. <b>The Psychological Progress Gap:</b> Traditional calorie progress meters cause premature psychological satisfaction when a user consumes low-calorie items early in the day, misleading them into believing their daily nutrition is accomplished. By tying the primary progress bar to completed meal count (0% to 100%), PDDR bridges this psychological divide while preserving strict consumed versus remaining calorie accountability."
    )
    story.append(Paragraph(p17, styles['ReportBody']))
    story.append(PageBreak())
    
    return story
