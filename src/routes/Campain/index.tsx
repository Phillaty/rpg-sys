import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { useLocation } from 'react-router-dom';
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase/firebase';
import { avatarDataType, campainType, perkType, userDataType } from '../../types';
import { decrypt } from '../../crypt';
import Sheet from './Sheet';
import { ColorRing } from 'react-loader-spinner';

type skillTy = {
    name: string,
    id: string,
    expertise?: number,
}

export type skillFiltr = {
    trained: skillTy[],
    notTrained: string[]
}

const Campain = () => {
    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';

    const user = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user') ?? ' ') as userDataType : {} as userDataType;
    const userId = decrypt(user.id);

    const [campain, setCampain] = useState<campainType>();
    const [charcater, setCharcater] = useState<avatarDataType>();

    const [skills, setSkills] = useState<skillTy[]>();

    const [skillsFiltered, setSkillsFiltered] = useState<skillFiltr>({
        trained: [],
        notTrained: [],
    });

    const getPerks = async () => {
        const p = query(
            collection(db, 'skills'),
            where('__name__', 'in', campain?.skills)
        );

        const querySnapshot = await getDocs(p);

        const perksArray = [] as skillTy[];
        querySnapshot.forEach((doc) => {
            const data = doc.data() as perkType;
            perksArray.push({
                id: doc.id,
                name: data.name
            });
        });

        setSkills(perksArray);
    }

    useEffect(() => {

        const docRef = doc(db, 'campains', campainId);

        onSnapshot(docRef, (querySnapshot) => {
            const docData = querySnapshot.data() as campainType;
            setCampain(docData);
        });

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (campain) {

            const q = query(
                collection(db, 'character'),
                where('__name__', 'in', campain.characters),
                where('playerId', '==', userId)
            );

            getPerks();

            onSnapshot(q, (querySnapshot) => {
                const filteredCharacters = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                  })) as avatarDataType[];
                if(filteredCharacters.length > 0)
                    setCharcater(filteredCharacters[0]);
            });

        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campain]);

    useEffect(() => {
        
        const notTreined = skills?.filter((i) => !charcater?.data.skill.some((j) => j.perk === i.id)) ?? [];
        const treined = charcater?.data.skill.map((i) => {
            console.log(skills);
            console.log(charcater.data);
            const name = skills?.find((j) => j.id === i.perk)?.name;

            console.log(name);
            return {
                name: name,
                id: i.perk,
                expertise: i.expertise,
            }
        }) as skillTy[];

        setSkillsFiltered({
            trained: treined,
            notTrained: notTreined.map((i) => i.name)
        })

    }, [charcater, skills]);

    return (
        <Container>
            {campain && charcater && skills ? <>
                <div className='main'>
                    <div className='left'>
                        <div className='image'>
                            <img src={campain?.img} alt='' />
                        </div>
                        <div className='details'>
                            <p className='title'>{campain?.title}</p>
                            <div className='descriptionNormal'>
                                <span>Descrição</span>
                                <p>{campain?.description}</p>
                            </div>
                            <div className='descriptionNormal'>
                                <span>Estilo</span>
                                <p>{campain?.style}</p>
                            </div>
                            <div className='descriptionNormal'>
                                <span>Estado</span>
                                <p>{campain?.state}</p>
                            </div>
                        </div>
                    </div>
                    <div className='right'>
                        <Sheet charcater={charcater} campain={campain} skills={skillsFiltered} />
                    </div>
                </div>
            </> : 
            <>
                <div className='loading'>
                    <ColorRing
                    visible={true}
                    height="80"
                    width="80"
                    ariaLabel="color-ring-loading"
                    wrapperStyle={{}}
                    wrapperClass="color-ring-wrapper"
                    colors={['#d82c38', '#f4a860', '#fde350', '#53ac2a', '#3164c4']}
                    />
                </div>
            </>}
        </Container>
    )
}

export default Campain;