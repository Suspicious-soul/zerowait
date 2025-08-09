'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

type Business = {
    id: string;
    name: string;
    address?: string | null;
    slug: string;
    qr_url?: string | null;
};

export default function ClientView({ slug }: { slug: string }) {
    // component implementation
}
