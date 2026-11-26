CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS profiles (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  age INTEGER NOT NULL CHECK (age BETWEEN 13 AND 120),
  gender TEXT NOT NULL,
  height_cm NUMERIC(5, 1) NOT NULL CHECK (height_cm BETWEEN 100 AND 250),
  weight_kg NUMERIC(5, 1) NOT NULL CHECK (weight_kg BETWEEN 30 AND 300),
  target_weight_kg NUMERIC(5, 1) NOT NULL CHECK (target_weight_kg BETWEEN 30 AND 300),
  activity_level TEXT NOT NULL,
  food_preference TEXT NOT NULL CHECK (food_preference IN ('Vegetarian', 'Vegan', 'Non-Vegetarian')),
  weight_goal TEXT NOT NULL CHECK (weight_goal IN ('Lose weight', 'Gain muscle', 'Maintain')),
  allergies TEXT NOT NULL DEFAULT 'None',
  health_conditions TEXT NOT NULL DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS foods (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  calories NUMERIC(8, 2) NOT NULL,
  carbohydrates NUMERIC(8, 2) NOT NULL,
  protein NUMERIC(8, 2) NOT NULL,
  fat NUMERIC(8, 2) NOT NULL,
  free_sugar_g NUMERIC(8, 2),
  fibre NUMERIC(8, 2) NOT NULL DEFAULT 0,
  sodium_mg NUMERIC(10, 2),
  portion_grams NUMERIC(8, 2) NOT NULL DEFAULT 100,
  dietary_type TEXT NOT NULL CHECK (dietary_type IN ('Vegetarian', 'Vegan', 'Non-Vegetarian')),
  source TEXT NOT NULL DEFAULT 'Kaggle CSV'
);

ALTER TABLE foods ADD COLUMN IF NOT EXISTS free_sugar_g NUMERIC(8, 2);
ALTER TABLE foods ADD COLUMN IF NOT EXISTS sodium_mg NUMERIC(10, 2);

CREATE TABLE IF NOT EXISTS diet_plans (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  plan_name TEXT NOT NULL DEFAULT 'Personalized Diet Plan',
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE NOT NULL DEFAULT CURRENT_DATE,
  number_of_days INTEGER NOT NULL DEFAULT 1 CHECK (number_of_days > 0),
  weight_goal TEXT NOT NULL DEFAULT 'Maintain' CHECK (weight_goal IN ('Lose weight', 'Gain muscle', 'Maintain')),
  food_preference TEXT NOT NULL DEFAULT 'Vegetarian' CHECK (food_preference IN ('Vegetarian', 'Vegan', 'Non-Vegetarian')),
  description TEXT NOT NULL DEFAULT '',
  day_date DATE NOT NULL,
  calorie_target INTEGER NOT NULL,
  meals JSONB NOT NULL,
  total_calories NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_protein NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_carbohydrates NUMERIC(10, 2) NOT NULL DEFAULT 0,
  total_fat NUMERIC(10, 2) NOT NULL DEFAULT 0,
  assigned_by UUID REFERENCES users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, day_date)
);

CREATE TABLE IF NOT EXISTS food_exchange_history (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  diet_plan_id UUID REFERENCES diet_plans(id) ON DELETE CASCADE,
  original_food TEXT NOT NULL,
  replacement_food TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS water_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  goal_ml INTEGER NOT NULL,
  consumed_ml INTEGER NOT NULL DEFAULT 0 CHECK (consumed_ml >= 0)
);

CREATE TABLE IF NOT EXISTS exercise_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  activity TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes >= 0),
  goal_minutes INTEGER NOT NULL DEFAULT 30,
  notes TEXT NOT NULL DEFAULT ''
);

CREATE TABLE IF NOT EXISTS sleep_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  minutes INTEGER NOT NULL CHECK (minutes >= 0),
  goal_minutes INTEGER NOT NULL DEFAULT 480
);

CREATE TABLE IF NOT EXISTS weight_records (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  record_date DATE NOT NULL,
  weight_kg NUMERIC(5, 1) NOT NULL CHECK (weight_kg BETWEEN 30 AND 300),
  UNIQUE (user_id, record_date)
);

CREATE TABLE IF NOT EXISTS login_activity (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  logged_in_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_address INET
);

CREATE TABLE IF NOT EXISTS admin_activity_logs (
  id BIGSERIAL PRIMARY KEY,
  admin_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS diet_plans_user_date_idx ON diet_plans(user_id, day_date DESC);
CREATE INDEX IF NOT EXISTS login_activity_user_idx ON login_activity(user_id, logged_in_at DESC);
CREATE INDEX IF NOT EXISTS admin_activity_logs_created_idx ON admin_activity_logs(created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS users_lower_email_idx ON users(LOWER(email));

ALTER TABLE login_activity ADD COLUMN IF NOT EXISTS device_type TEXT NOT NULL DEFAULT 'Desktop';
ALTER TABLE login_activity ADD COLUMN IF NOT EXISTS device_name TEXT NOT NULL DEFAULT 'Web Browser';
ALTER TABLE login_activity ADD COLUMN IF NOT EXISTS user_agent TEXT DEFAULT '';
ALTER TABLE login_activity ADD COLUMN IF NOT EXISTS session_token_hash TEXT;
ALTER TABLE login_activity ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'active';
ALTER TABLE login_activity ADD COLUMN IF NOT EXISTS logged_out_at TIMESTAMPTZ;
ALTER TABLE login_activity ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now();
CREATE INDEX IF NOT EXISTS login_activity_session_idx ON login_activity(session_token_hash);
CREATE INDEX IF NOT EXISTS login_activity_user_status_idx ON login_activity(user_id, status);

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS last_activity_at TIMESTAMPTZ NOT NULL DEFAULT now();
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS device_type TEXT NOT NULL DEFAULT 'Desktop';
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS device_name TEXT NOT NULL DEFAULT 'Web Browser';
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS user_agent TEXT DEFAULT '';
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS ip_address TEXT DEFAULT '';
ALTER TABLE foods ADD COLUMN IF NOT EXISTS fibre NUMERIC(8, 2) NOT NULL DEFAULT 0;
ALTER TABLE diet_plans ADD COLUMN IF NOT EXISTS plan_name TEXT NOT NULL DEFAULT 'Personalized Diet Plan';
ALTER TABLE diet_plans ADD COLUMN IF NOT EXISTS start_date DATE NOT NULL DEFAULT CURRENT_DATE;
ALTER TABLE diet_plans ADD COLUMN IF NOT EXISTS end_date DATE NOT NULL DEFAULT CURRENT_DATE;
ALTER TABLE diet_plans ADD COLUMN IF NOT EXISTS number_of_days INTEGER NOT NULL DEFAULT 1;
ALTER TABLE diet_plans ADD COLUMN IF NOT EXISTS weight_goal TEXT NOT NULL DEFAULT 'Maintain';
ALTER TABLE diet_plans ADD COLUMN IF NOT EXISTS food_preference TEXT NOT NULL DEFAULT 'Vegetarian';
ALTER TABLE diet_plans ADD COLUMN IF NOT EXISTS description TEXT NOT NULL DEFAULT '';
ALTER TABLE diet_plans DROP CONSTRAINT IF EXISTS diet_plans_user_id_day_date_key;
ALTER TABLE water_records DROP CONSTRAINT IF EXISTS water_records_user_id_record_date_key;
ALTER TABLE exercise_records DROP CONSTRAINT IF EXISTS exercise_records_user_id_record_date_activity_key;
ALTER TABLE sleep_records DROP CONSTRAINT IF EXISTS sleep_records_user_id_record_date_key;
ALTER TABLE exercise_records ADD COLUMN IF NOT EXISTS notes TEXT NOT NULL DEFAULT '';
CREATE INDEX IF NOT EXISTS water_records_user_date_idx ON water_records(user_id, record_date DESC);
CREATE INDEX IF NOT EXISTS exercise_records_user_date_idx ON exercise_records(user_id, record_date DESC);
CREATE INDEX IF NOT EXISTS sleep_records_user_date_idx ON sleep_records(user_id, record_date DESC);


CREATE TABLE IF NOT EXISTS recipes (
  id BIGSERIAL PRIMARY KEY,
  food_name TEXT NOT NULL UNIQUE,
  dish_title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'Main',
  dietary_type TEXT NOT NULL CHECK (dietary_type IN ('Vegetarian', 'Vegan', 'Non-Vegetarian')),
  prep_time_minutes INTEGER NOT NULL DEFAULT 10,
  cook_time_minutes INTEGER NOT NULL DEFAULT 0,
  cooking_time_desc TEXT NOT NULL DEFAULT 'No cooking required',
  cooking_method TEXT NOT NULL DEFAULT 'Mixing',
  difficulty TEXT NOT NULL DEFAULT 'Easy',
  serving_size TEXT NOT NULL DEFAULT '1 portion',
  base_serving_grams NUMERIC(8, 2) NOT NULL DEFAULT 100,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
  swaps JSONB NOT NULL DEFAULT '[]'::jsonb,
  allergens JSONB NOT NULL DEFAULT '[]'::jsonb,
  cooking_tips TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE recipes ADD COLUMN IF NOT EXISTS cooking_tips TEXT NOT NULL DEFAULT '';

CREATE INDEX IF NOT EXISTS recipes_food_name_idx ON recipes(food_name);

CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS password_reset_tokens_hash_idx ON password_reset_tokens(token_hash);
CREATE INDEX IF NOT EXISTS password_reset_tokens_user_idx ON password_reset_tokens(user_id);

CREATE TABLE IF NOT EXISTS user_reminders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL CHECK (reminder_type IN ('Hydration', 'Exercise', 'Sleep', 'Diet', 'General wellness')),
  reminder_time TIME NOT NULL,
  timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
  recipient_email TEXT,
  enabled BOOLEAN NOT NULL DEFAULT true,
  last_sent_at TIMESTAMPTZ,
  next_scheduled_at TIMESTAMPTZ NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS user_reminders_user_idx ON user_reminders(user_id);
CREATE INDEX IF NOT EXISTS user_reminders_next_sched_idx ON user_reminders(enabled, next_scheduled_at);
CREATE UNIQUE INDEX IF NOT EXISTS user_reminders_dedup_idx ON user_reminders(user_id, reminder_type, reminder_time);

CREATE TABLE IF NOT EXISTS reminder_delivery_history (
  id BIGSERIAL PRIMARY KEY,
  reminder_id UUID REFERENCES user_reminders(id) ON DELETE SET NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reminder_type TEXT NOT NULL,
  scheduled_time TIME NOT NULL,
  recipient_email TEXT NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivery_status TEXT NOT NULL CHECK (delivery_status IN ('sent', 'failed')),
  error_message TEXT,
  email_subject TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS reminder_delivery_history_user_idx ON reminder_delivery_history(user_id, sent_at DESC);

CREATE TABLE IF NOT EXISTS meal_completions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  diet_plan_id UUID REFERENCES diet_plans(id) ON DELETE SET NULL,
  plan_date DATE NOT NULL,
  meal_index INTEGER NOT NULL,
  meal_type TEXT NOT NULL,
  meal_name TEXT NOT NULL,
  calories NUMERIC(8, 2) NOT NULL DEFAULT 0,
  protein NUMERIC(8, 2) NOT NULL DEFAULT 0,
  carbohydrates NUMERIC(8, 2) NOT NULL DEFAULT 0,
  fat NUMERIC(8, 2) NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT true,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, plan_date, meal_index)
);

CREATE INDEX IF NOT EXISTS meal_completions_user_date_idx ON meal_completions(user_id, plan_date);

CREATE TABLE IF NOT EXISTS grocery_lists (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  diet_plan_id UUID REFERENCES diet_plans(id) ON DELETE SET NULL,
  plan_signature TEXT NOT NULL DEFAULT '',
  days_covered INTEGER NOT NULL DEFAULT 0,
  manually_edited BOOLEAN NOT NULL DEFAULT FALSE,
  last_generated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS grocery_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_key TEXT NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  quantity_value NUMERIC(12, 3),
  unit TEXT NOT NULL DEFAULT '',
  quantity_display TEXT NOT NULL DEFAULT 'Quantity unavailable',
  purchased BOOLEAN NOT NULL DEFAULT FALSE,
  source_meals JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, item_key)
);

CREATE INDEX IF NOT EXISTS grocery_items_user_cat_idx ON grocery_items(user_id, category, name);

CREATE TABLE IF NOT EXISTS grocery_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  diet_plan_id UUID REFERENCES diet_plans(id) ON DELETE SET NULL,
  snapshot_items JSONB NOT NULL DEFAULT '[]'::jsonb,
  purchased_count INTEGER NOT NULL DEFAULT 0,
  total_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS grocery_history_user_idx ON grocery_history(user_id, created_at DESC);




ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_report_enabled BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE users ADD COLUMN IF NOT EXISTS welcome_email_sent BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS ai_chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS ai_chat_messages (
  id BIGSERIAL PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES ai_chat_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  content TEXT NOT NULL,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS ai_chat_messages_session_idx ON ai_chat_messages(session_id, created_at);

CREATE TABLE IF NOT EXISTS daily_report_log (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  delivery_status TEXT NOT NULL CHECK (delivery_status IN ('sent', 'failed')),
  error_message TEXT,
  UNIQUE (user_id, report_date)
);

CREATE INDEX IF NOT EXISTS daily_report_log_user_idx ON daily_report_log(user_id, report_date DESC);
