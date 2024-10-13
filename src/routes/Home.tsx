import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import HomeMaster from './MasterView';
import HomePlayer from './PlayerView';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export type userDataType = {
    login: string,
    password: string,
    name: string,
    rule: string,
    id: string,
};

export type campainDataType = {
    id: string,
    data: {
        description: string,
        img: string,
        lore: string,
        style: string,
        title: string,
        players: string[],
        stores: string[],
        characters: string[]
    },
    playerChar?: avatarDataType,
};

export type avatarDataType = {
    id: string,
    data: {
        class: string,
        money: number,
        name: string,
        originId: string,
        playerId: string,
        level: number,
        AGI: string,
        FOR: string,
        INT: string,
        PRE: string,
        VIT: string,
        skill: {
            expertise: number,
            skillName: string,
        }
    };
};

const Home = () => {
    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') ?? ' ') as userDataType : {} as userDataType;

    const [campains, setCampains] = useState<campainDataType[]>([]);
    const [characters, setCharacters] = useState<avatarDataType[]>([]);

    const [trigger, setTrigger] = useState<boolean>(false);

    useEffect(() => {
        const q = query(collection(db, "campains"));
        const p = query(collection(db, "character"));

        onSnapshot(q, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as campainDataType[];
            setCampains(docData);
            setTrigger(true);
            setTimeout(() => {
                setTrigger(false);
            }, 1000);
        });

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            data: doc.data(),
            })) as avatarDataType[];
            setCharacters(docData);
            setTrigger(true);
            setTimeout(() => {
                setTrigger(false);
            }, 1000);
        });

    }, []);

    useEffect(() => {
        if(trigger) {
            const newCampains = campains.map((i) => {
                const player = characters.find((j) => i.data.characters.some((k) => j.id === k));
                i.playerChar = player;
                return i;
            })
            setCampains(newCampains);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trigger]);

    return (
        <Container>
            {user.rule === process.env.MASTER_RULE ? 
                <><HomeMaster campains={campains} /></> 
                : 
                <><HomePlayer campains={campains} /></>
            }
        </Container>
    )
}

export default Home;