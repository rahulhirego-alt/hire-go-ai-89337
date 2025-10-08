-- Drop old tables and dependencies
DROP TABLE IF EXISTS public.assessments CASCADE;
DROP TABLE IF EXISTS public.interviews CASCADE;
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.candidates CASCADE;
DROP TABLE IF EXISTS public.jobs CASCADE;
DROP TYPE IF EXISTS public.candidate_status CASCADE;
DROP TYPE IF EXISTS public.interview_status CASCADE;
DROP TYPE IF EXISTS public.job_status CASCADE;

-- Create enums for various status types
CREATE TYPE public.user_role_type AS ENUM ('candidate', 'employer', 'admin');
CREATE TYPE public.application_status AS ENUM ('applied', 'screening', 'shortlisted', 'interview_scheduled', 'rejected', 'offered', 'hired');
CREATE TYPE public.interview_status AS ENUM ('scheduled', 'completed', 'cancelled', 'rescheduled', 'pending');
CREATE TYPE public.interview_type AS ENUM ('virtual', 'physical', 'hybrid');
CREATE TYPE public.interview_platform AS ENUM ('zoom', 'google_meet', 'microsoft_teams', 'phone', 'in_person');
CREATE TYPE public.employment_type AS ENUM ('full_time', 'part_time', 'contract', 'internship', 'freelance');
CREATE TYPE public.location_type AS ENUM ('onsite', 'remote', 'hybrid');
CREATE TYPE public.experience_level AS ENUM ('entry', 'mid', 'senior', 'lead', 'executive');
CREATE TYPE public.gender_type AS ENUM ('male', 'female', 'other', 'prefer_not_to_say');
CREATE TYPE public.job_status AS ENUM ('draft', 'active', 'closed', 'paused');

-- Profiles table (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  mobile_number TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role user_role_type NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Security definer function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role_type)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Candidates table
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  date_of_birth DATE,
  gender gender_type,
  current_city TEXT,
  current_state TEXT,
  current_country TEXT,
  home_city TEXT,
  home_state TEXT,
  home_country TEXT,
  resume_url TEXT,
  video_resume_url TEXT,
  video_resume_duration INTEGER,
  education JSONB DEFAULT '[]'::jsonb,
  experience JSONB DEFAULT '[]'::jsonb,
  skills TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own data"
  ON public.candidates FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Candidates can update own data"
  ON public.candidates FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Candidates can insert own data"
  ON public.candidates FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Employers can view candidate data"
  ON public.candidates FOR SELECT
  USING (public.has_role(auth.uid(), 'employer'));

-- Employers table
CREATE TABLE public.employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  company_name TEXT NOT NULL,
  company_logo_url TEXT,
  industry_type TEXT,
  number_of_employees TEXT,
  founded_year INTEGER,
  company_type TEXT,
  company_description TEXT,
  website_url TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  hr_contact_name TEXT,
  hr_email TEXT,
  hr_mobile TEXT,
  pan_number TEXT,
  gst_number TEXT,
  linkedin_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Employers can view own data"
  ON public.employers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Employers can update own data"
  ON public.employers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Employers can insert own data"
  ON public.employers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Public can view employer basic info"
  ON public.employers FOR SELECT
  USING (true);

-- Skills master table
CREATE TABLE public.skills_master (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL,
  skill_name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, skill_name)
);

ALTER TABLE public.skills_master ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view skills"
  ON public.skills_master FOR SELECT
  USING (true);

-- Jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID REFERENCES public.employers(id) ON DELETE CASCADE NOT NULL,
  job_title TEXT NOT NULL,
  job_category TEXT NOT NULL,
  job_type employment_type NOT NULL,
  experience_level experience_level NOT NULL,
  number_of_vacancies INTEGER DEFAULT 1,
  start_date DATE,
  application_deadline DATE,
  required_skills TEXT[] DEFAULT '{}',
  preferred_skills TEXT[] DEFAULT '{}',
  qualification TEXT,
  experience_years TEXT,
  salary_min NUMERIC,
  salary_max NUMERIC,
  salary_type TEXT,
  currency TEXT DEFAULT '₹',
  benefits TEXT[] DEFAULT '{}',
  location_type location_type NOT NULL,
  city TEXT,
  state TEXT,
  country TEXT,
  address TEXT,
  interview_type interview_type NOT NULL,
  interview_platform interview_platform,
  interview_address TEXT,
  work_schedule JSONB,
  job_description TEXT,
  banner_url TEXT,
  status job_status DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view active jobs"
  ON public.jobs FOR SELECT
  USING (status = 'active' OR auth.uid() IN (SELECT user_id FROM employers WHERE id = jobs.employer_id));

CREATE POLICY "Employers can manage own jobs"
  ON public.jobs FOR ALL
  USING (auth.uid() IN (SELECT user_id FROM employers WHERE id = jobs.employer_id))
  WITH CHECK (auth.uid() IN (SELECT user_id FROM employers WHERE id = jobs.employer_id));

-- Applications table
CREATE TABLE public.applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE NOT NULL,
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE NOT NULL,
  status application_status DEFAULT 'applied',
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(job_id, candidate_id)
);

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own applications"
  ON public.applications FOR SELECT
  USING (auth.uid() IN (SELECT user_id FROM candidates WHERE id = applications.candidate_id));

CREATE POLICY "Candidates can create applications"
  ON public.applications FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT user_id FROM candidates WHERE id = applications.candidate_id));

CREATE POLICY "Employers can view applications for their jobs"
  ON public.applications FOR SELECT
  USING (auth.uid() IN (
    SELECT e.user_id FROM employers e
    JOIN jobs j ON j.employer_id = e.id
    WHERE j.id = applications.job_id
  ));

CREATE POLICY "Employers can update application status"
  ON public.applications FOR UPDATE
  USING (auth.uid() IN (
    SELECT e.user_id FROM employers e
    JOIN jobs j ON j.employer_id = e.id
    WHERE j.id = applications.job_id
  ));

-- Interviews table
CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  interview_date DATE NOT NULL,
  interview_time TIME NOT NULL,
  interview_type interview_type NOT NULL,
  interview_platform interview_platform,
  meeting_link TEXT,
  interview_address TEXT,
  interviewer_name TEXT,
  status interview_status DEFAULT 'scheduled',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view own interviews"
  ON public.interviews FOR SELECT
  USING (auth.uid() IN (
    SELECT c.user_id FROM candidates c
    JOIN applications a ON a.candidate_id = c.id
    WHERE a.id = interviews.application_id
  ));

CREATE POLICY "Employers can manage interviews for their jobs"
  ON public.interviews FOR ALL
  USING (auth.uid() IN (
    SELECT e.user_id FROM employers e
    JOIN jobs j ON j.employer_id = e.id
    JOIN applications a ON a.job_id = j.id
    WHERE a.id = interviews.application_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT e.user_id FROM employers e
    JOIN jobs j ON j.employer_id = e.id
    JOIN applications a ON a.job_id = j.id
    WHERE a.id = interviews.application_id
  ));

-- Video assessments table
CREATE TABLE public.video_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  question_order INTEGER NOT NULL,
  video_response_url TEXT,
  response_duration INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.video_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Candidates can view and update own assessments"
  ON public.video_assessments FOR ALL
  USING (auth.uid() IN (
    SELECT c.user_id FROM candidates c
    JOIN applications a ON a.candidate_id = c.id
    WHERE a.id = video_assessments.application_id
  ))
  WITH CHECK (auth.uid() IN (
    SELECT c.user_id FROM candidates c
    JOIN applications a ON a.candidate_id = c.id
    WHERE a.id = video_assessments.application_id
  ));

CREATE POLICY "Employers can view assessments for their job applications"
  ON public.video_assessments FOR SELECT
  USING (auth.uid() IN (
    SELECT e.user_id FROM employers e
    JOIN jobs j ON j.employer_id = e.id
    JOIN applications a ON a.job_id = j.id
    WHERE a.id = video_assessments.application_id
  ));

-- Trigger function for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- Apply updated_at triggers
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.candidates FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.employers FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.applications FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.interviews FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.video_assessments FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Insert sample skills for AI suggestions
INSERT INTO public.skills_master (category, skill_name) VALUES
  ('Customer Support', 'Communication'),
  ('Customer Support', 'Empathy'),
  ('Customer Support', 'Problem Solving'),
  ('Customer Support', 'CRM Software'),
  ('Customer Support', 'Active Listening'),
  ('Developer', 'React'),
  ('Developer', 'Node.js'),
  ('Developer', 'TypeScript'),
  ('Developer', 'Python'),
  ('Developer', 'Git'),
  ('Developer', 'SQL'),
  ('Developer', 'REST APIs'),
  ('Sales', 'Negotiation'),
  ('Sales', 'Lead Generation'),
  ('Sales', 'CRM'),
  ('Sales', 'Presentation'),
  ('Sales', 'Client Relations'),
  ('Marketing', 'SEO'),
  ('Marketing', 'Content Creation'),
  ('Marketing', 'Social Media'),
  ('Marketing', 'Analytics'),
  ('Marketing', 'Email Marketing'),
  ('HR', 'Recruitment'),
  ('HR', 'Employee Relations'),
  ('HR', 'Performance Management'),
  ('HR', 'HRIS'),
  ('HR', 'Training & Development');