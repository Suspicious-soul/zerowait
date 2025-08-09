import ClientBusinessView from './ClientView';

export default function Page({ params }: { params: { slug: string } }) {
    return <ClientBusinessView slug={params.slug} />;
}