import ClientBusinessView from './ClientView';

export const dynamic = 'force-dynamic';

type Props = {
    params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
    const { slug } = await params;
    return <ClientBusinessView slug={slug} />;
}
