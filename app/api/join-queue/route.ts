import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    console.log('API /join-queue called'); // Add this for debugging

    try {
        const body = await request.json();
        console.log('Request body:', body); // Add this for debugging

        const { slug, customer_name, phone } = body;

        if (!slug) {
            console.log('Missing slug');
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
        }

        // Find business by slug
        const { data: business, error: businessError } = await supabase
            .from('businesses')
            .select('id')
            .eq('slug', slug)
            .single();

        console.log('Business lookup result:', { business, businessError });

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

        console.log('Queue insert result:', { queueEntry, queueError });

        if (queueError) {
            return NextResponse.json({ error: queueError.message }, { status: 500 });
        }

        // Calculate position
        const { count } = await supabase
            .from('queues')
            .select('*', { count: 'exact', head: true })
            .eq('business_id', business.id)
            .lt('joined_at', queueEntry.joined_at)
            .is('position_served', null);

        const position = (count ?? 0) + 1;
        console.log('Calculated position:', position);

        return NextResponse.json({ position });
    } catch (error: any) {
        console.error('API /join-queue error:', error);
        return NextResponse.json(
            { error: error.message || 'Unknown internal error occurred' },
            { status: 500 }
        );
    }
}
