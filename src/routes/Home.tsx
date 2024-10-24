import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import HomeMaster from './MasterView';
import HomePlayer from './PlayerView';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { decrypt } from '../crypt';
import { avatarDataType, campainDataType, userDataType } from '../types';

const Home = () => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') ?? ' ') as userDataType : {} as userDataType;
    const userId = decrypt(user.id);

    const [campains, setCampains] = useState<campainDataType[]>([]);
    const [campainsWithChar, setCampainsWithChar] = useState<campainDataType[]>([]);
    const [characters, setCharacters] = useState<avatarDataType[]>([]);

    useEffect(() => {
        const q = query(collection(db, "campains"), where("players", "array-contains", userId));
        const p = query(collection(db, "character"), where("playerId", "==", userId));

        onSnapshot(q, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as campainDataType[];
            setCampains(docData);
        });

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            })) as avatarDataType[];
            setCharacters(docData);
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(characters && campains) {
            const newCampains = campains.map((i) => {
                const player = characters.find((j) => i.data.characters.some((k) => j.id === k));
                i.playerChar = player;
                return i;
            });
            setCampainsWithChar(newCampains);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [characters, campains]);

    return (
        <Container>
            {user.rule === process.env.MASTER_RULE ? 
                <><HomeMaster campains={campainsWithChar} /></> 
                : 
                <><HomePlayer campains={campainsWithChar} /></>
            }
        </Container>
    )
}

export default Home;