'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function TestPage() {
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchBusinesses = async () => {
            const { data, error } = await supabase.from('businesses').select('*');
            if (error) {
                console.error(error);
            } else {
                setData(data);
            }
        };
        fetchBusinesses();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-xl font-bold">Businesses</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
