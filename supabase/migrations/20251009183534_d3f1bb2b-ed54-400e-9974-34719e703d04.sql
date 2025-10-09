-- Fix 1: Restrict employers table to only expose non-sensitive data publicly
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Public can view employer basic info" ON employers;

-- Create a restricted public view with only non-sensitive fields
CREATE OR REPLACE VIEW public.employers_public AS
SELECT 
  id,
  company_name,
  company_logo_url,
  company_description,
  industry_type,
  number_of_employees,
  company_type,
  website_url,
  city,
  state,
  country,
  founded_year,
  linkedin_url
FROM employers;

-- Grant access to the public view
GRANT SELECT ON public.employers_public TO authenticated, anon;

-- Keep the owner access policy for full data
-- (Already exists: "Employers can view own data")

-- Fix 2: Update handle_new_user() trigger to properly insert into user_roles table
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email
  );
  
  -- Insert role from metadata (validated against enum)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (
    NEW.id,
    COALESCE(
      (NEW.raw_user_meta_data->>'role')::user_role_type,
      'candidate'::user_role_type
    )
  );
  
  RETURN NEW;
END;
$$;

-- Add INSERT policy for user_roles table (needed for trigger)
DROP POLICY IF EXISTS "System can insert user roles" ON user_roles;
CREATE POLICY "System can insert user roles"
ON user_roles
FOR INSERT
WITH CHECK (true);

-- Fix 3: Fix video_assessments RLS policy to verify actual ownership
DROP POLICY IF EXISTS "Candidates can view and update own assessments" ON video_assessments;

CREATE POLICY "Candidates can manage own application assessments"
ON video_assessments
FOR ALL
USING (
  EXISTS (
    SELECT 1
    FROM applications a
    JOIN candidates c ON c.id = a.candidate_id
    WHERE a.id = video_assessments.application_id
      AND c.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM applications a
    JOIN candidates c ON c.id = a.candidate_id
    WHERE a.id = video_assessments.application_id
      AND c.user_id = auth.uid()
  )
);