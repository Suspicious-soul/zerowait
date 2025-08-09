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
    const [business, setBusiness] = useState<Business | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [joining, setJoining] = useState(false);
    const [queuePosition, setQueuePosition] = useState<number | null>(null);
    const [joinError, setJoinError] = useState<string | null>(null);

    useEffect(() => {
        let canceled = false;

        (async () => {
            const { data, error } = await supabase
                .from('businesses')
                .select('*')
                .eq('slug', slug)
                .single();

            if (!canceled) {
                if (error) setError(error.message);
                else setBusiness(data as Business);
            }
        })();

        return () => {
            canceled = true;
        };
    }, [slug]);

    async function joinQueue() {
        setJoining(true);
        setJoinError(null);

        try {
            const response = await fetch('/api/join-queue', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ slug }),
            });

            const data = await response.json();

            if (response.ok) {
                setQueuePosition(data.position);
            } else {
                throw new Error(data.error || 'Failed to join queue');
            }
        } catch (e: any) {
            setJoinError(e.message || 'Unknown error');
        }

        setJoining(false);
    }

    if (error) return <div className="p-6">Business not found: {error}</div>;
    if (!business) return <div className="p-6">Loading…</div>;

    return (
        <div className="p-6 space-y-4 max-w-md mx-auto">
            <h1 className="text-2xl font-semibold">{business.name}</h1>
            <p className="text-gray-600">{business.address}</p>
            <div className="border rounded p-4">
                <p>Public page for: {business.slug}</p>
                <p>QR: {business.qr_url || '—'}</p>
            </div>

            <button
                disabled={joining || queuePosition !== null}
                onClick={joinQueue}
                className="px-4 py-2 mt-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
                {joining ? 'Joining...' : queuePosition !== null ? 'You Joined!' : 'Join Queue'}
            </button>

            {queuePosition !== null && (
                <p className="mt-2 text-lg text-gray-700">
                    You are number <strong>{queuePosition}</strong> in the queue.
                </p>
            )}

            {joinError && (
                <p className="mt-2 text-red-600">
                    Error: {joinError}
                </p>
            )}
        </div>
    );
}
