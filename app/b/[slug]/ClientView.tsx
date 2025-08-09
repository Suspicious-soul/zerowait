'use client';

import { supabase } from '@/lib/supabaseClient';
import { useEffect, useState } from 'react';

type Business = {
    id: string;
    name: string;
    address?: string | null;
    slug: string;
    qr_url?: string | null;
};

export default function ClientBusinessView({ slug }: { slug: string }) {
    // component logic ...
}
