import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY! // ensure this environment variable is set
    );

    try {
        const { slug, customer_name, phone } = await request.json();

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // Lookup business by slug
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('id')
            .eq('slug', slug)
            .single();

        if (businessError || !business) {
            return NextResponse.json({ error: 'Business not found' }, { status: 404 });
        }

        // Insert queue entry
        const { data: queueEntry, error: queueError } = await supabase
            .from('queues')
            .insert([
                {
                    business_id: business.id,
                    customer_name,
                    phone,
                    joined_at: new Date().toISOString(),
                },
            ])
            .select()
            .single();

        if (queueError) {
            return NextResponse.json({ error: queueError.message }, { status: 500 });
        }

        // Calculate position in queue (only for those not served yet)
        const { count } = await supabase
            .from('queues')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', business.id)
            .lt('joined_at', queueEntry.joined_at)
            .is('position_served', null);

        const position = (count ?? 0) + 1;

        // Return JSON response with position
        return NextResponse.json({ position });
    } catch (error: any) {
        console.error('API /join-queue error:', error);
        return NextResponse.json(
            { error: error.message || 'Unknown internal error occurred' },
            { status: 500 }
        );
    }
}
