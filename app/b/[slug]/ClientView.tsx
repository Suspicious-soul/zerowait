const [joining, setJoining] = useState(false);
const [queuePosition, setQueuePosition] = useState<number | null>(null);
const [joinError, setJoinError] = useState<string | null>(null);

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
    } catch (err: any) {
        setJoinError(err.message || 'Unknown error');
    }
    setJoining(false);
}

// Inside JSX return after displaying business info:
<>
    <button
        disabled={joining || queuePosition !== null}
        onClick={joinQueue}
        className="px-4 py-2 mt-4 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
    >
        {joining ? 'Joining...' : queuePosition !== null ? 'You Joined!' : 'Join Queue'}
    </button>
    {queuePosition !== null && (
        <p>You are number <strong>{queuePosition}</strong> in the queue.</p>
    )}
    {joinError && <p className="text-red-600">Error: {joinError}</p>}
</>
