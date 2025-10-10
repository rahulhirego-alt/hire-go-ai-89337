-- Create interview sessions table for live interviews
CREATE TABLE IF NOT EXISTS public.interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  interview_id UUID REFERENCES public.interviews(id) ON DELETE CASCADE NOT NULL,
  session_token TEXT UNIQUE NOT NULL,
  status TEXT CHECK (status IN ('waiting', 'active', 'ended')) DEFAULT 'waiting',
  recording_url TEXT,
  recording_started_at TIMESTAMP WITH TIME ZONE,
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create session participants table
CREATE TABLE IF NOT EXISTS public.session_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID NOT NULL,
  role TEXT CHECK (role IN ('candidate', 'recruiter')) NOT NULL,
  display_name TEXT NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  left_at TIMESTAMP WITH TIME ZONE,
  is_connected BOOLEAN DEFAULT true,
  peer_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create candidate evaluations table
CREATE TABLE IF NOT EXISTS public.candidate_evaluations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE NOT NULL,
  evaluator_id UUID NOT NULL,
  communication_score INTEGER CHECK (communication_score BETWEEN 1 AND 5),
  technical_score INTEGER CHECK (technical_score BETWEEN 1 AND 5),
  confidence_score INTEGER CHECK (confidence_score BETWEEN 1 AND 5),
  overall_score INTEGER CHECK (overall_score BETWEEN 1 AND 5),
  notes TEXT,
  private_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create session chat messages table
CREATE TABLE IF NOT EXISTS public.session_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES public.interview_sessions(id) ON DELETE CASCADE NOT NULL,
  sender_id UUID NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  is_private BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_evaluations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.session_chat_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies for interview_sessions
CREATE POLICY "Users can view sessions they're part of"
ON public.interview_sessions FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.session_participants
    WHERE session_id = interview_sessions.id
  )
);

CREATE POLICY "Recruiters can create sessions"
ON public.interview_sessions FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'employer'::user_role_type)
);

CREATE POLICY "Recruiters can update their sessions"
ON public.interview_sessions FOR UPDATE
USING (
  has_role(auth.uid(), 'employer'::user_role_type)
);

-- RLS Policies for session_participants
CREATE POLICY "Participants can view session participants"
ON public.session_participants FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.session_participants sp
    WHERE sp.session_id = session_participants.session_id
    AND sp.user_id = auth.uid()
  )
);

CREATE POLICY "Users can join sessions"
ON public.session_participants FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation"
ON public.session_participants FOR UPDATE
USING (auth.uid() = user_id);

-- RLS Policies for candidate_evaluations
CREATE POLICY "Recruiters can manage evaluations"
ON public.candidate_evaluations FOR ALL
USING (
  has_role(auth.uid(), 'employer'::user_role_type)
)
WITH CHECK (
  has_role(auth.uid(), 'employer'::user_role_type) AND
  evaluator_id = auth.uid()
);

-- RLS Policies for session_chat_messages
CREATE POLICY "Participants can view chat messages"
ON public.session_chat_messages FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.session_participants sp
    WHERE sp.session_id = session_chat_messages.session_id
    AND sp.user_id = auth.uid()
  ) AND (
    is_private = false OR
    has_role(auth.uid(), 'employer'::user_role_type)
  )
);

CREATE POLICY "Participants can send messages"
ON public.session_chat_messages FOR INSERT
WITH CHECK (
  sender_id = auth.uid() AND
  EXISTS (
    SELECT 1 FROM public.session_participants sp
    WHERE sp.session_id = session_chat_messages.session_id
    AND sp.user_id = auth.uid()
  )
);

-- Triggers for updated_at
CREATE TRIGGER update_interview_sessions_updated_at
BEFORE UPDATE ON public.interview_sessions
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_candidate_evaluations_updated_at
BEFORE UPDATE ON public.candidate_evaluations
FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Enable realtime for live updates
ALTER PUBLICATION supabase_realtime ADD TABLE public.interview_sessions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_participants;
ALTER PUBLICATION supabase_realtime ADD TABLE public.session_chat_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.candidate_evaluations;