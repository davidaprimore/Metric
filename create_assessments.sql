-- Create Assessments Table
CREATE TABLE IF NOT EXISTS public.assessments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    patient_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    professional_id UUID REFERENCES public.profiles(id),
    appointment_id UUID REFERENCES public.appointments(id),
    
    type TEXT NOT NULL, -- 'pollock7', etc.
    status TEXT DEFAULT 'completed',
    
    measurements JSONB NOT NULL DEFAULT '{}'::jsonb, -- Stores skinfolds and perimeters
    
    weight NUMERIC,
    fat_percentage NUMERIC,
    muscle_mass NUMERIC,
    
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Professionals manage assessments" 
ON public.assessments 
FOR ALL 
USING (auth.uid() = professional_id);

CREATE POLICY "Patients view own assessments" 
ON public.assessments 
FOR SELECT 
USING (auth.uid() = patient_id);

-- Grant
GRANT ALL ON TABLE public.assessments TO authenticated;
