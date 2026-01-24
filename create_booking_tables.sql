-- 1. Availability Table (Recurring Weekly Schedule)
CREATE TABLE IF NOT EXISTS public.professional_availability (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    professional_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Dom, 1=Seg...
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(professional_id, day_of_week, start_time) -- Prevent duplicate slots
);

-- 2. Appointments Table (Specific Bookings)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    professional_id UUID NOT NULL REFERENCES public.profiles(id),
    patient_id UUID NOT NULL REFERENCES public.profiles(id),
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL, -- Calculated based on duration (usually 1h)
    status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'cancelled', 'completed'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RLS Policies

-- Availability
ALTER TABLE public.professional_availability ENABLE ROW LEVEL SECURITY;

-- Professionals manage their own availability
CREATE POLICY "Professionals manage own availability" 
ON public.professional_availability 
FOR ALL 
USING (auth.uid() = professional_id)
WITH CHECK (auth.uid() = professional_id);

-- Everyone (Patients) can VIEW active availability
CREATE POLICY "Public view active availability" 
ON public.professional_availability 
FOR SELECT 
USING (true);


-- Appointments
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Professionals view/manage appointments where they are the provider
CREATE POLICY "Professionals manage their appointments" 
ON public.appointments 
FOR ALL 
USING (auth.uid() = professional_id);

-- Patients view/manage appointments where they are the patient
CREATE POLICY "Patients manage their appointments" 
ON public.appointments 
FOR ALL 
USING (auth.uid() = patient_id);

-- Grant Permissions
GRANT ALL ON TABLE public.professional_availability TO authenticated;
GRANT ALL ON TABLE public.appointments TO authenticated;
