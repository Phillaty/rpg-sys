import { useEffect, useState } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { originDataType } from '../types';

interface UseOriginsOptions {
  originIds: string[];
  enabled?: boolean;
}

const BATCH_SIZE = 30;

export function useOrigins({ originIds, enabled = true }: UseOriginsOptions) {
  const [data, setData] = useState<originDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!enabled || !originIds || originIds.length === 0 || (originIds.length === 1 && originIds[0] === 'non')) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    let cleanup: (() => void) | undefined;

    const executeQuery = () => {
      try {
        if (originIds.length <= BATCH_SIZE) {
          // Single query for small datasets
          const q = query(
            collection(db, 'origin'),
            where('__name__', 'in', originIds)
          );

          cleanup = onSnapshot(q, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
              id: doc.id,
              data: doc.data(),
            })) as originDataType[];

            const sorted = docData.sort((a, b) => a.data.title.localeCompare(b.data.title));
            setData(sorted);
            setLoading(false);
          }, (err) => {
            setError(err.message);
            setLoading(false);
          });
        } else {
          // Batch queries for large datasets
          const batches = createBatches(originIds, BATCH_SIZE);
          const allResults: originDataType[] = [];
          let completedBatches = 0;
          const unsubscribers: (() => void)[] = [];

          batches.forEach((batch) => {
            const q = query(
              collection(db, 'origin'),
              where('__name__', 'in', batch)
            );

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
              const batchData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
              })) as originDataType[];

              // Replace previous batch data
              const startIndex = allResults.findIndex(item => 
                batch.includes(item.id)
              );
              
              if (startIndex !== -1) {
                // Remove old batch data
                allResults.splice(startIndex, batch.length);
              }
              
              allResults.push(...batchData);
              completedBatches++;

              if (completedBatches === batches.length) {
                const uniqueResults = removeDuplicates(allResults);
                const sorted = uniqueResults.sort((a, b) => a.data.title.localeCompare(b.data.title));
                setData(sorted);
                setLoading(false);
              }
            }, (err) => {
              setError(err.message);
              setLoading(false);
            });

            unsubscribers.push(unsubscribe);
          });

          cleanup = () => {
            unsubscribers.forEach(unsubscribe => unsubscribe());
          };
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        setLoading(false);
      }
    };

    executeQuery();

    return cleanup;
  }, [originIds, enabled]);

  return { data, loading, error };
}

function createBatches<T>(array: T[], batchSize: number): T[][] {
  const batches: T[][] = [];
  for (let i = 0; i < array.length; i += batchSize) {
    batches.push(array.slice(i, i + batchSize));
  }
  return batches;
}

function removeDuplicates(origins: originDataType[]): originDataType[] {
  const seen = new Set();
  return origins.filter(item => {
    if (seen.has(item.id)) {
      return false;
    }
    seen.add(item.id);
    return true;
  });
}