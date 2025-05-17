import { useEffect, useState } from 'react';
import { fetchTranscripts } from '../utils/database';
import { TranscriptionHistory } from './TranscriptionHistory';

const PAGE_SIZE = 20;

export function MyHistory() {
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    loadMore();
  }, []);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      const data = await fetchTranscripts(page * PAGE_SIZE, PAGE_SIZE);
      if (data.length < PAGE_SIZE) {
        setHasMore(false);
      }
      const formatted = data.map((d) => ({
        text: d.content,
        timestamp: d.created_at,
        language: d.language,
      }));
      setHistory((prev) => [...prev, ...formatted]);
      setPage((p) => p + 1);
    } catch (err) {
      console.error('Failed to load transcripts', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <TranscriptionHistory history={history} onClearHistory={() => {}} />
      {hasMore && (
        <button
          onClick={loadMore}
          className="mt-2 text-xs px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Load more'}
        </button>
      )}
    </div>
  );
}
