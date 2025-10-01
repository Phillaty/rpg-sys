import { useEffect, useState, useMemo } from 'react';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { habilityDataType } from '../types';

interface UseCharacterAbilitiesOptions {
  classId?: string;
  characterAbilities?: string[];
  enabled?: boolean;
}

export function useCharacterAbilities({ 
  classId, 
  characterAbilities = [], 
  enabled = true 
}: UseCharacterAbilitiesOptions) {
  const [abilities, setAbilities] = useState<habilityDataType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Memoize the character abilities array to prevent unnecessary re-renders
  const memoizedCharacterAbilities = useMemo(() => characterAbilities, [characterAbilities]);

  useEffect(() => {
    if (!enabled || !classId) {
      setAbilities([]);
      return;
    }

    setLoading(true);
    setError(null);

    const allAbilities = new Map<string, habilityDataType>();
    let completedQueries = 0;
    const totalQueries = memoizedCharacterAbilities.length > 0 ? 2 : 1;

    const updateAbilities = () => {
      completedQueries++;
      if (completedQueries === totalQueries) {
        const abilitiesData = Array.from(allAbilities.values())
          .sort((a, b) => a.data.name.localeCompare(b.data.name));
        setAbilities(abilitiesData);
        setLoading(false);
      }
    };

    const handleError = (err: Error) => {
      setError(err.message);
      setLoading(false);
    };

    try {
      // Query 1: Abilities by class
      const qClass = query(
        collection(db, 'hability'),
        where('classId', '==', classId)
      );

      const unsubscribeClass = onSnapshot(qClass, (querySnapshot) => {
        querySnapshot.docs.forEach(doc => {
          allAbilities.set(doc.id, {
            id: doc.id,
            data: doc.data(),
          } as habilityDataType);
        });
        updateAbilities();
      }, handleError);

      // Query 2: Character specific abilities (if any)
      let unsubscribeChar: (() => void) | undefined;
      if (memoizedCharacterAbilities.length > 0) {
        const qChar = query(
          collection(db, 'hability'),
          where('__name__', 'in', memoizedCharacterAbilities)
        );

        unsubscribeChar = onSnapshot(qChar, (querySnapshot) => {
          querySnapshot.docs.forEach(doc => {
            allAbilities.set(doc.id, {
              id: doc.id,
              data: doc.data(),
            } as habilityDataType);
          });
          updateAbilities();
        }, handleError);
      } else {
        // No character abilities, mark this query as complete
        updateAbilities();
      }

      // Cleanup function
      return () => {
        unsubscribeClass();
        if (unsubscribeChar) unsubscribeChar();
      };
    } catch (err) {
      handleError(err instanceof Error ? err : new Error('Unknown error'));
    }
  }, [classId, memoizedCharacterAbilities, enabled]);

  return { abilities, loading, error };
}