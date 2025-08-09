import ClientBusinessView from './ClientView';

// Force dynamic so Next doesn't try to statically type-gen the route
export const dynamic = 'force-dynamic';

export default function Page({ params }: { params: { slug: string } }) {
    return <ClientBusinessView slug={params.slug} />;
}