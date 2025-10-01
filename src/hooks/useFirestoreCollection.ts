import { useEffect, useState, useMemo, useCallback } from 'react';
import { collection, query, onSnapshot, QueryConstraint } from 'firebase/firestore';
import { db } from '../firebase/firebase';

interface UseFirestoreCollectionOptions {
  collectionName: string;
  constraints?: QueryConstraint[];
  sortBy?: (a: any, b: any) => number;
  enabled?: boolean;
}

export function useFirestoreCollection<T>(options: UseFirestoreCollectionOptions) {
  const { collectionName, constraints = [], sortBy, enabled = true } = options;
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const constraintsKey = useMemo(() => 
    JSON.stringify(constraints), 
    [constraints]
  );

  const sortFunction = useCallback((docData: T[]) => {
    return sortBy ? docData.sort(sortBy) : docData;
  }, [sortBy]);

  useEffect(() => {
    if (!enabled || constraints.length === 0) {
      setData([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const q = query(collection(db, collectionName), ...constraints);

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const docData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data(),
        })) as T[];

        const sortedData = sortFunction(docData);
        setData(sortedData);
        setLoading(false);
      }, (err) => {
        setError(err.message);
        setLoading(false);
      });

      return unsubscribe;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setLoading(false);
    }
  }, [collectionName, constraintsKey, enabled, sortFunction, constraints]);

  return { data, loading, error };
}