-- Fix Availability RLS
-- This ensures ANY authenticated user (including patients) can VIEW professional availability.

DROP POLICY IF EXISTS "Public view active availability" ON public.professional_availability;

CREATE POLICY "Public view active availability" 
ON public.professional_availability 
FOR SELECT 
TO authenticated
USING (true);

-- Also ensure Profiles are viewable (for Smart Discovery)
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (true);
