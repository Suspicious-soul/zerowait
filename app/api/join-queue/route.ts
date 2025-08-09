import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    // Use the Supabase service role key for secure writes (make sure it's set in your environment variables)
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // Service role key required for insert operations
    );

    try {
        const { slug } = await request.json();

        // Find the business by slug
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('id')
            .eq('slug', slug)
            .single();

        if (businessError || !business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 });
        }

        // Add a new entry to the queues table for this business
        const { data: queueEntry, error: queueError } = await supabase
            .from('queues')
            .insert([{ business_id: business.id }])
            .select()
            .single();

        if (queueError) {
            return NextResponse.json({ error: queueError.message }, { status: 500 });
        }

        // Compute the position in the queue based on creation time
        const { count } = await supabase
            .from('queues')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', business.id)
            .lt('created_at', queueEntry.created_at);

        const position = (count || 0) + 1;

        return NextResponse.json({ position });
    } catch (error: any) {
        return NextResponse.json({ error: error.message || 'Unknown error occurred' }, { status: 500 });
    }
}
