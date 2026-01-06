-- Create users table for Neverland
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  login TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  coins INTEGER DEFAULT 0,
  prefix TEXT DEFAULT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  played_hours INTEGER DEFAULT 0,
  kills INTEGER DEFAULT 0,
  deaths INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  two_factor_enabled BOOLEAN DEFAULT FALSE,
  telegram_linked BOOLEAN DEFAULT FALSE,
  discord_linked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster login lookups
CREATE INDEX IF NOT EXISTS idx_users_login ON users(login);

-- Insert default admin user (relite with password admin123)
INSERT INTO users (login, password, is_admin, coins)
VALUES ('relite', 'admin123', true, 1000)
ON CONFLICT (login) DO NOTHING;
