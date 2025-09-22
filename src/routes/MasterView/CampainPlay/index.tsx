import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { useLocation } from 'react-router-dom';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { avatarDataType, campainDataType, entityDataType, habilityDataType } from '../../../types';
import { ToastContainer } from 'react-toastify';
import Documents from './Documents';
import Battle from './Battle';
import Characters from './Characters';

const CampainPlay = () => {
    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';
    
    const [activeModule, setActiveModule] = useState<'battle' | 'documents' | 'stores' | 'items' | 'characters'>('battle');
    
    const [campain, setCampain] = useState<campainDataType>();
    const [entitys, setEntitys] = useState<entityDataType[]>([]);
    const [characters, setCharacters] = useState<avatarDataType[]>([]);
    const [habilities, setHabilities] = useState<habilityDataType[]>([]);

    const getEntity = async () => {
        if (campainId) {
            const p = query(
                collection(db, 'entity'),
                where('campainId', '==', campainId)
            );
    
            onSnapshot(p, (querySnapshot) => {
                const docData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })) as entityDataType[];

                const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
                setEntitys(sorted);              
            });
        }
    }

    const getHabilities = async () => {
        if (!campain?.data?.classes || campain.data.classes.length === 0) {
            return;
        }
        
        const p = query(
            collection(db, 'hability'),
            where('classId', 'in', campain.data.classes)
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as habilityDataType[];

            const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setHabilities(sorted);
        });
    }

    const getCharacters = async () => {
        if (!campain?.data?.characters || campain.data.characters.length === 0) {
            return;
        }
        
        const p = query(
            collection(db, 'character'),
            where('__name__', 'in', campain.data.characters)
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as avatarDataType[];

            const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setCharacters(sorted);
        });
    }

    useEffect(() => {
        if(campain) {
            getEntity();
            getCharacters();
            getHabilities();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campain]);

    useEffect(() => {
        if (campainId) {
            const docRef = doc(db, 'campains', campainId);

            onSnapshot(docRef, (querySnapshot) => {
                const docData = {
                    id: querySnapshot.id,
                    data: querySnapshot.data(),
                } as campainDataType;
                setCampain(docData);
            });
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campainId]);

    return (
        <>
        <Container>
            <div>
                <div className='menu'>
                    <div className='title'>Menu de controle</div>
                    <div className='buttons'>
                        <button 
                            className={activeModule === 'battle' ? 'active' : ''}
                            onClick={() => setActiveModule('battle')}
                        >
                            Batalha
                        </button>
                        <button 
                            className={activeModule === 'stores' ? 'active' : ''}
                            onClick={() => setActiveModule('stores')}
                        >
                            Lojas
                        </button>
                        <button 
                            className={activeModule === 'items' ? 'active' : ''}
                            onClick={() => setActiveModule('items')}
                        >
                            Itens
                        </button>
                        <button 
                            className={activeModule === 'characters' ? 'active' : ''}
                            onClick={() => setActiveModule('characters')}
                        >
                            Personagens
                        </button>
                        <button 
                            className={activeModule === 'documents' ? 'active' : ''}
                            onClick={() => setActiveModule('documents')}
                        >
                            Documentos
                        </button>
                    </div>
                </div>
                <div className='content'>
                    {activeModule === 'battle' && (
                        <Battle 
                            campainId={campainId}
                            campain={campain}
                            characters={characters}
                            entitys={entitys}
                            habilities={habilities}
                        />
                    )}
                    
                    {activeModule === 'documents' && (
                        <Documents 
                            campainId={campainId} 
                            characters={characters} 
                        />
                    )}
                    
                    {activeModule === 'stores' && (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                            <p>Módulo de Lojas em desenvolvimento...</p>
                        </div>
                    )}
                    
                    {activeModule === 'items' && (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
                            <p>Módulo de Itens em desenvolvimento...</p>
                        </div>
                    )}
                    
                    {activeModule === 'characters' && (
                        <Characters 
                            characters={characters} 
                        />
                    )}
                </div>
            </div>
        </Container>
        <ToastContainer style={{zIndex: '999999999999999999'}} />
        </>
    )
}

export default CampainPlay;
