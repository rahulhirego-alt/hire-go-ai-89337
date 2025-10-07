-- Create enum for interview status
CREATE TYPE interview_status AS ENUM ('scheduled', 'completed', 'missed', 'cancelled');

-- Create enum for candidate status
CREATE TYPE candidate_status AS ENUM ('applied', 'screening', 'interview', 'assessment', 'offer', 'rejected', 'hired');

-- Create enum for job status
CREATE TYPE job_status AS ENUM ('active', 'closed', 'draft');

-- Create jobs table
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  requirements TEXT,
  location TEXT,
  salary_range TEXT,
  status job_status DEFAULT 'active',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create candidates table
CREATE TABLE public.candidates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  resume_url TEXT,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  status candidate_status DEFAULT 'applied',
  applied_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create interviews table
CREATE TABLE public.interviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  interviewer_id UUID REFERENCES auth.users(id),
  scheduled_at TIMESTAMPTZ NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  status interview_status DEFAULT 'scheduled',
  meeting_link TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create assessments table
CREATE TABLE public.assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  candidate_id UUID REFERENCES public.candidates(id) ON DELETE CASCADE,
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  video_url TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  tab_switches INTEGER DEFAULT 0,
  warnings_count INTEGER DEFAULT 0,
  proctoring_flags JSONB DEFAULT '[]'::jsonb,
  responses JSONB DEFAULT '{}'::jsonb,
  score NUMERIC,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- RLS Policies for jobs
CREATE POLICY "Anyone can view active jobs"
  ON public.jobs FOR SELECT
  USING (status = 'active' OR auth.uid() = created_by);

CREATE POLICY "Authenticated users can create jobs"
  ON public.jobs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Job creators can update their jobs"
  ON public.jobs FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);

-- RLS Policies for candidates
CREATE POLICY "Candidates can view their own data"
  ON public.candidates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.jobs WHERE jobs.id = candidates.job_id AND jobs.created_by = auth.uid()
  ));

CREATE POLICY "Users can create candidate records"
  ON public.candidates FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their candidate records"
  ON public.candidates FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

-- RLS Policies for interviews
CREATE POLICY "View interviews if involved"
  ON public.interviews FOR SELECT
  TO authenticated
  USING (
    auth.uid() = interviewer_id OR
    EXISTS (SELECT 1 FROM public.candidates WHERE candidates.id = interviews.candidate_id AND candidates.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = interviews.job_id AND jobs.created_by = auth.uid())
  );

CREATE POLICY "Interviewers can create interviews"
  ON public.interviews FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = interviewer_id);

CREATE POLICY "Interviewers can update interviews"
  ON public.interviews FOR UPDATE
  TO authenticated
  USING (auth.uid() = interviewer_id);

-- RLS Policies for assessments
CREATE POLICY "View assessments if involved"
  ON public.assessments FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.candidates WHERE candidates.id = assessments.candidate_id AND candidates.user_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.jobs WHERE jobs.id = assessments.job_id AND jobs.created_by = auth.uid())
  );

CREATE POLICY "Candidates can create assessments"
  ON public.assessments FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.candidates WHERE candidates.id = candidate_id AND candidates.user_id = auth.uid()
  ));

CREATE POLICY "Candidates can update their assessments"
  ON public.assessments FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.candidates WHERE candidates.id = assessments.candidate_id AND candidates.user_id = auth.uid()
  ));

-- Create indexes
CREATE INDEX idx_candidates_job_id ON public.candidates(job_id);
CREATE INDEX idx_candidates_user_id ON public.candidates(user_id);
CREATE INDEX idx_interviews_candidate_id ON public.interviews(candidate_id);
CREATE INDEX idx_interviews_scheduled_at ON public.interviews(scheduled_at);
CREATE INDEX idx_assessments_candidate_id ON public.assessments(candidate_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers
CREATE TRIGGER update_jobs_updated_at
  BEFORE UPDATE ON public.jobs
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_candidates_updated_at
  BEFORE UPDATE ON public.candidates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_interviews_updated_at
  BEFORE UPDATE ON public.interviews
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();