/*
  # Wellness App Database Schema
  
  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `email` (text)
      - `full_name` (text)
      - `work_hours_start` (time)
      - `work_hours_end` (time)
      - `break_frequency` (integer, minutes)
      - `calendar_connected` (boolean)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `break_sessions`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `scheduled_at` (timestamp)
      - `completed_at` (timestamp, nullable)
      - `skipped` (boolean)
      - `duration_seconds` (integer)
      - `type` (text: 'micro', 'stretch', 'rest')
      - `created_at` (timestamp)
    
    - `stretch_routines`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `duration_seconds` (integer)
      - `target_area` (text: 'neck', 'shoulders', 'back', 'wrists', 'full_body')
      - `difficulty` (text: 'easy', 'medium', 'hard')
      - `animation_url` (text)
      - `instructions` (text[])
      - `created_at` (timestamp)
    
    - `user_stretches`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `stretch_id` (uuid, references stretch_routines)
      - `completed_at` (timestamp)
      - `photo_url` (text, nullable)
      - `points_earned` (integer)
      - `created_at` (timestamp)
    
    - `gamification`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles, unique)
      - `total_points` (integer)
      - `current_streak` (integer)
      - `longest_streak` (integer)
      - `level` (integer)
      - `last_activity_date` (date)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `badges`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `icon` (text)
      - `requirement_type` (text)
      - `requirement_value` (integer)
      - `created_at` (timestamp)
    
    - `user_badges`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `badge_id` (uuid, references badges)
      - `earned_at` (timestamp)
      - `created_at` (timestamp)
    
    - `virtual_pet`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles, unique)
      - `name` (text)
      - `pet_type` (text)
      - `level` (integer)
      - `experience` (integer)
      - `happiness` (integer)
      - `health` (integer)
      - `last_fed` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chat_messages`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `message` (text)
      - `role` (text: 'user', 'assistant')
      - `sentiment` (text, nullable)
      - `created_at` (timestamp)
    
    - `stress_logs`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `stress_level` (integer, 1-10)
      - `notes` (text, nullable)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  work_hours_start time DEFAULT '09:00:00',
  work_hours_end time DEFAULT '17:00:00',
  break_frequency integer DEFAULT 45,
  calendar_connected boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create break_sessions table
CREATE TABLE IF NOT EXISTS break_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  scheduled_at timestamptz NOT NULL,
  completed_at timestamptz,
  skipped boolean DEFAULT false,
  duration_seconds integer DEFAULT 0,
  type text NOT NULL CHECK (type IN ('micro', 'stretch', 'rest')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE break_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own break sessions"
  ON break_sessions FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own break sessions"
  ON break_sessions FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own break sessions"
  ON break_sessions FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create stretch_routines table
CREATE TABLE IF NOT EXISTS stretch_routines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  duration_seconds integer NOT NULL,
  target_area text NOT NULL CHECK (target_area IN ('neck', 'shoulders', 'back', 'wrists', 'full_body')),
  difficulty text NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  animation_url text,
  instructions text[] NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stretch_routines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view stretch routines"
  ON stretch_routines FOR SELECT
  TO authenticated
  USING (true);

-- Create user_stretches table
CREATE TABLE IF NOT EXISTS user_stretches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stretch_id uuid REFERENCES stretch_routines(id) ON DELETE CASCADE NOT NULL,
  completed_at timestamptz DEFAULT now(),
  photo_url text,
  points_earned integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_stretches ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stretches"
  ON user_stretches FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stretches"
  ON user_stretches FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create gamification table
CREATE TABLE IF NOT EXISTS gamification (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_points integer DEFAULT 0,
  current_streak integer DEFAULT 0,
  longest_streak integer DEFAULT 0,
  level integer DEFAULT 1,
  last_activity_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gamification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gamification"
  ON gamification FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own gamification"
  ON gamification FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification"
  ON gamification FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create badges table
CREATE TABLE IF NOT EXISTS badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  requirement_type text NOT NULL,
  requirement_value integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view badges"
  ON badges FOR SELECT
  TO authenticated
  USING (true);

-- Create user_badges table
CREATE TABLE IF NOT EXISTS user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  badge_id uuid REFERENCES badges(id) ON DELETE CASCADE NOT NULL,
  earned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges"
  ON user_badges FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own badges"
  ON user_badges FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create virtual_pet table
CREATE TABLE IF NOT EXISTS virtual_pet (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  name text NOT NULL DEFAULT 'Buddy',
  pet_type text NOT NULL DEFAULT 'cat',
  level integer DEFAULT 1,
  experience integer DEFAULT 0,
  happiness integer DEFAULT 100,
  health integer DEFAULT 100,
  last_fed timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE virtual_pet ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own pet"
  ON virtual_pet FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own pet"
  ON virtual_pet FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pet"
  ON virtual_pet FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  role text NOT NULL CHECK (role IN ('user', 'assistant')),
  sentiment text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own chat messages"
  ON chat_messages FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own chat messages"
  ON chat_messages FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create stress_logs table
CREATE TABLE IF NOT EXISTS stress_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  stress_level integer NOT NULL CHECK (stress_level >= 1 AND stress_level <= 10),
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stress_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own stress logs"
  ON stress_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stress logs"
  ON stress_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert default stretch routines
INSERT INTO stretch_routines (name, description, duration_seconds, target_area, difficulty, instructions) VALUES
('Neck Relief', 'Gentle neck stretches to relieve tension', 45, 'neck', 'easy', ARRAY[
  'Sit up straight with shoulders relaxed',
  'Slowly tilt your head to the right, bringing your ear toward your shoulder',
  'Hold for 10 seconds',
  'Return to center and repeat on the left side',
  'Gently roll your head in a circle, clockwise then counterclockwise'
]),
('Shoulder Rolls', 'Release shoulder tension and improve mobility', 30, 'shoulders', 'easy', ARRAY[
  'Stand or sit with arms at your sides',
  'Roll shoulders forward in a circular motion 5 times',
  'Roll shoulders backward in a circular motion 5 times',
  'Shrug shoulders up to ears, hold for 3 seconds, release',
  'Repeat 3 times'
]),
('Wrist and Finger Stretch', 'Prevent carpal tunnel and typing strain', 40, 'wrists', 'easy', ARRAY[
  'Extend one arm forward, palm up',
  'Gently pull fingers back with other hand',
  'Hold for 10 seconds',
  'Switch hands and repeat',
  'Make gentle fist and release 10 times with each hand'
]),
('Seated Back Twist', 'Relieve lower back tension', 50, 'back', 'medium', ARRAY[
  'Sit up straight in your chair',
  'Place right hand on back of chair',
  'Twist torso to the right, looking over shoulder',
  'Hold for 15 seconds',
  'Return to center and repeat on left side'
]),
('Full Body Energizer', 'Complete routine to refresh entire body', 90, 'full_body', 'medium', ARRAY[
  'Stand up and reach arms overhead, stretching upward',
  'Gently bend side to side, 5 times each',
  'Roll shoulders backward 10 times',
  'Do 10 gentle neck rolls',
  'Shake out hands and arms',
  'Take 3 deep breaths, in through nose, out through mouth'
]);

-- Insert default badges
INSERT INTO badges (name, description, icon, requirement_type, requirement_value) VALUES
('First Steps', 'Complete your first break session', 'Award', 'breaks_completed', 1),
('Week Warrior', 'Maintain a 7-day streak', 'Flame', 'streak_days', 7),
('Stretch Master', 'Complete 25 stretch routines', 'Dumbbell', 'stretches_completed', 25),
('Century Club', 'Earn 100 total points', 'Star', 'total_points', 100),
('Consistency King', 'Maintain a 30-day streak', 'Crown', 'streak_days', 30),
('Wellness Champion', 'Reach level 10', 'Trophy', 'level', 10);