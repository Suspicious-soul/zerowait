async function joinQueue() {
    setJoining(true);
    setJoinError(null);

    try {
        const customer_name = prompt('Enter your name')?.trim() || '';
        const phone = prompt('Enter your phone number')?.trim() || '';

        if (!customer_name) {
            throw new Error('Name is required');
        }

        console.log('Sending request to /api/join-queue with:', { slug, customer_name, phone });

        const response = await fetch('/api/join-queue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ slug, customer_name, phone }),
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', response.headers);

        // Check if response has content before parsing JSON
        const text = await response.text();
        console.log('Response text:', text);

        if (!text) {
            throw new Error('Empty response from server');
        }

        let data;
        try {
            data = JSON.parse(text);
        } catch (parseError) {
            throw new Error(`Invalid JSON response: ${text}`);
        }

        if (!response.ok) {
            throw new Error(data.error || 'Failed to join queue');
        }

        setQueuePosition(data.position);
    } catch (e: any) {
        console.error('Join queue error:', e);
        setJoinError(e.message || 'Unknown error');
    } finally {
        setJoining(false);
    }
}
