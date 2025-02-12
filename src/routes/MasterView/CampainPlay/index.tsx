import React, { useEffect, useState } from 'react';
import { Container, ContainerAddModal } from './styles';
import { Avatar, Chip, TextField } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { avatarDataType, battleDataType, campainDataType, entityDataType, habilityDataType, rollModType } from '../../../types';
import Modal from '../../../commom/Modal';
import Roll from '../../../commom/ROLL';
import { toast, ToastContainer } from 'react-toastify';

const CampainPlay = () => {
    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';
    
    const [battle, setBattle] = useState<{
        id: string,
        type: 'entity' | 'player',
        iniciative: number,
        life?: number,
    }[]>([]);

    const [onTurn, setOnTurn] = useState<{
        id: string,
        type: 'entity' | 'player',
        iniciative: number,
        life?: number,
    }>();

    const [campain, setCampain] = useState<campainDataType>();
    const [entitys, setEntitys] = useState<entityDataType[]>([]);
    const [characters, setCharacters] = useState<avatarDataType[]>([]);

    const [modalAddEntity, setModalAddEntity] = useState<boolean>(false);
    const [modalAddChar, setModalAddChar] = useState<boolean>(false);
    const [modalshowHability, setModalshowHability] = useState<boolean>(false);
    const [modalshowHabilityDetails, setModalshowHabilityDetails] = useState<{
        title: string,
        description: string,
        roll?: number,
        rollMod?: number,
        damageRoll?: number[],
        damageMod?: number,
    }>();

    const [battleData, setBattleData] = useState<battleDataType>();


    const [playerIniciative, setPlayerIniciative] = useState<{
        iniciative: number,
        id: string,
    }>();

    const [dicePers, setdicePers] = useState<number[]>([]);
    const [dicePersMod, setdicePersMod] = useState<rollModType[]>();
    const [dicePersToRoll, setdicePersToRoll] = useState<number[]>();

    const [habilities, setHabilities] = useState<habilityDataType[]>([]);

    const [rollIniciativeEntity, setRollIniciativeEntity] = useState<{
        result: number,
        id: string,
        dice: number,
    }>();

    const handleCloseDicePer = () => {
        setdicePers([]);
        setdicePersMod([]);
        setdicePersToRoll([]);
    }

    const handleCloseModals = () => {
        setModalAddEntity(false);
        setModalAddChar(false);
        setModalshowHability(false);
        setRollIniciativeEntity(undefined);
    }

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
        const p = query(
            collection(db, 'hability'),
            where('classId', 'in', campain?.data?.classes && campain?.data?.classes.length > 0 ? campain?.data?.classes : ['non'])
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
        const p = query(
            collection(db, 'character'),
            where('__name__', 'in', campain?.data?.characters && campain?.data?.characters.length > 0 ? campain?.data?.characters : ['non'])
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

    const getBattle = async () => {
        const q = query(
            collection(db, 'battle'),
            where('campainId', '==', campainId)
        );

        onSnapshot(q, (querySnapshot) => {
            const filteredBattle = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
              })) as battleDataType[];
            if(filteredBattle.length > 0) {
                setBattleData(filteredBattle[0]);
                setBattle(filteredBattle[0].data.turns);
            }
        });
    }

    const handleCreateBattle = async () => {
        await addDoc(collection(db, "battle"), {
            campainId: campainId,
            turns: [],
        }).then(async (item) => {
            toast.success("Batalha criada!");
            setBattleData({
                id: item.id,
                data: {
                    campainId: campainId,
                    turns: [],
                }
            })
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

            getBattle();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campainId]);

    const updateBattle = async () => {
        const userDocRef = doc(db, "battle", battleData?.id ?? '');
        const battleTosave = battle;

        if(onTurn) battleTosave.push(onTurn)

        await updateDoc(userDocRef, {
            campainId: campainId,
            turns: battleTosave,
        }).then(() => {toast.success("batalha salva!")});
    }

    const rollIniciativeMonster = (mod: number, id: string) => {
        const dice = Math.floor(Math.random() * 20) + 1;
        const result = dice + mod;
        setRollIniciativeEntity({
            id: id,
            result: result,
            dice: dice
        });
    }

    const organize = () => {
        const sorted = [...battle].sort((a, b) => b.iniciative - a.iniciative);
        setBattle(sorted);
    }

    const next = () => {
        const [first, ...rest] = battle;
        
        if(!onTurn) {
            const updatedBattle = [...rest];

            setBattle(updatedBattle);
        } else {
            const updatedBattle = [...rest, onTurn as {
                id: string;
                type: "entity" | "player";
                iniciative: number;
                life?: number;
            }];

            setBattle(updatedBattle);
        }
        // Atualiza o estado
        setOnTurn(first); 
        
    }

    const Entity = (itemId: string) => {

        const findEntity = entitys.find((i) => i.id === itemId);

        return (
            <div className='item'>
                <div className='img'>
                    <Avatar sx={{ width: 70, height: 70 }} />
                </div>
                <div className='info'>
                    <p className='bold'>{findEntity?.data.name}</p>
                    <p>Vida: {findEntity?.data.life}</p>
                    <p>DEFESA: {findEntity?.data.defense}</p>
                </div>
                <div className='info'>
                    <div className='habilities'>
                    {findEntity?.data.actions.map((i) => (
                        <div className='actionItem'  onClick={() => {
                            setModalshowHability(true);
                            setModalshowHabilityDetails({
                                title: i.title,
                                description: i.description,
                                roll: i.testMod,
                                rollMod: i.mod,
                                damageRoll: i.damageRoll,
                                damageMod: i.damageMod,
                            })
                        }}>{i.title}</div>
                    ))}
                    </div>
                </div>
                <div className='info'>
                    <div className='habilities'>
                    {findEntity?.data.perks.map((i) => (
                        <div className='actionItem' onClick={() => {
                            if(i.mod) setdicePersMod([{
                                    type: 'pericia',
                                    name: i.name,
                                    roll: i.mod
                            }]);
                            setdicePersToRoll([20]);
                        }}>{i.name}</div>
                    ))}
                    <div className='actionItem'  onClick={() => {
                            if(findEntity?.data.senses.perseption) setdicePersMod([{
                                type: 'pericia',
                                name: 'Percepção',
                                roll: findEntity?.data.senses.perseption
                            }]);
                            setdicePersToRoll([20]);
                        }}>Perspectiva</div>
                    </div>
                </div>
                <div className='info'>
                    <button>Remover da batalha</button>
                </div>
            </div>
        )
    }
        

    const Player = (itemId: string) => {

        const findPlayer = characters.find((i) => i.id === itemId);

        const findHabilities = habilities.filter((i) => findPlayer?.data.hability.includes(i.id));

        return (
            <div className='item'>
                <div className='img'>
                    <Avatar sx={{ width: 70, height: 70 }} />
                </div>
                <div className='info'>
                    <p className='bold'>{findPlayer?.data.name}</p>
                    <p>Classe: {findPlayer?.data.class.title}</p>
                    <p>DEFESA: -</p>
                </div>
                <div className='info'>
                    <p className='bold'>Habilidades</p>
                    <div className='habilities'>
                        {findHabilities.map((i) => (
                            <Chip label={i.data.name} color='primary' onClick={() => {
                                setModalshowHability(true);
                                setModalshowHabilityDetails({
                                    title: i.data.name,
                                    description: i.data.description,
                                })
                            }} />
                        ))}
                    </div>
                </div>
                <div className='info'>
                    <p className='bold'>Status</p>
                    <p>Vida: {findPlayer?.data.basics.life.actual}/{findPlayer?.data.basics.life.max}</p>
                    <p>Sanidade: {findPlayer?.data.basics.sanity.actual}/{findPlayer?.data.basics.sanity.max}</p>
                    <p>PE: {findPlayer?.data.basics.pe.actual}/{findPlayer?.data.basics.pe.max}</p>
                </div>
                <div className='info'>
                    <button>Remover da batalha</button>
                </div>
            </div>
        )
    }

    return (
        <>
        <Container>
            <div>
                <div className='menu'>
                    <div className='title'>Menu de controle</div>
                    <div className='buttons'>
                        <button>Batalha</button>
                        <button>Lojas</button>
                        <button>Itens</button>
                        <button>Personagens</button>
                        <button>Editar campanha</button>
                    </div>
                </div>
                <div className='content'>
                    <div className='head'>
                        {!battleData && 
                            <>
                            <button onClick={() => handleCreateBattle()}>Criar batalha nova</button>
                            </>
                        }
                        {!!battleData && 
                            <>
                            <button onClick={() => updateBattle()}>Salvar</button>
                            <button onClick={() => setBattle([])}>Finalizar batalha</button>
                            <button onClick={() => organize()}>Organizar vez</button>
                            <button onClick={() => setModalAddChar(true)}>Adicionar player</button>
                            <button onClick={() => setModalAddEntity(true)}>Adicionar entidade</button>
                            </>
                        }

                        
                    </div>
                    {!!battleData && <>
                    <div className='body'>
                        <div className='rollPers'>
                            <div className='title'>
                                <p>Rolagem personalizadas</p>
                            </div>
                            <div className='buttons'>
                                <p>Adicionar dado: </p>
                                <div>
                                    <button onClick={() => {setdicePers([...dicePers, 2])}}>D2</button>
                                    <button onClick={() => {setdicePers([...dicePers, 4])}}>D4</button>
                                    <button onClick={() => {setdicePers([...dicePers, 6])}}>D6</button>
                                    <button onClick={() => {setdicePers([...dicePers, 8])}}>D8</button>
                                    <button onClick={() => {setdicePers([...dicePers, 10])}}>D10</button>
                                    <button onClick={() => {setdicePers([...dicePers, 12])}}>D12</button>
                                    <button onClick={() => {setdicePers([...dicePers, 20])}}>D20</button>
                                    <button onClick={() => {setdicePers([...dicePers, 60])}}>D60</button>
                                    <button onClick={() => {setdicePers([...dicePers, 100])}}>D100</button>
                                </div>
                            </div>
                            {dicePers.length > 0 && 
                                <>
                                    <div className='buttons'>
                                        <p>Adicionar modificações: </p>
                                        <div>
                                            <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: -5} as rollModType])}}>-5</button>
                                            <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: -4} as rollModType])}}>-4</button>
                                            <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: -3} as rollModType])}}>-3</button>
                                            <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: -2} as rollModType])}}>-2</button>
                                            <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: -1} as rollModType])}}>-1</button>
                                            <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: 1} as rollModType])}}>+1</button>
                                            <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: 2} as rollModType])}}>+2</button>
                                            <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: 3} as rollModType])}}>+3</button>
                                            <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: 4} as rollModType])}}>+4</button>
                                            <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: 5} as rollModType])}}>+5</button>
                                        </div>
                                    </div>
                            
                                    <div className='preVisuTitle'><p>Dados para rolagem</p></div>
                                    {dicePersMod && dicePersMod?.length > 0 && 
                                        <div className='preVisuMod'>
                                            <div className='dicesPerMod'>
                                                <p>Modificações:</p>
                                                {dicePersMod?.map((mod, keyMod) => (
                                                    <div key={keyMod} onClick={(() => {
                                                        const newDices = dicePersMod?.filter((i, index) => index !== keyMod);
                                                        setdicePersMod(newDices);
                                                    })}><span className='diceitem'>{mod.roll >= 0 ? '+' : ''}{mod.roll}</span><span className='error'><i className="fa-solid fa-xmark"></i></span></div>
                                                ))}
                                            </div>
                                        </div>
                                    }
                                    <div className='preVisu'>
                                        <div className='dicesPer'>
                                            {dicePers.map((dice, key) => (
                                                <div key={key} onClick={(() => {
                                                    const newDices = dicePers.filter((i, index) => index !== key);
                                                    setdicePers(newDices);
                                                })}><span className='diceitem'>{dice}</span><span className='error'><i className="fa-solid fa-xmark"></i></span></div>
                                            ))}
                                        </div>
                                        <div><button onClick={() => {
                                            setdicePersToRoll(dicePers);
                                        }}>Rolar</button></div>
                                    </div>
                                </>
                            }
                        </div>
                        <div className='game'>
                            <div className='onThePlay'>
                                <div className='top'>
                                    <p>É a vez de...</p>
                                    <div>
                                        <button>Turno anterior</button>
                                        <button onClick={() => next()}>Proximo turno</button>
                                    </div>
                                </div>
                                
                                {onTurn && <>
                                        {onTurn.type === 'entity' ? <>
                                            {Entity(onTurn.id)}
                                        </> : <>
                                            {Player(onTurn.id)}
                                        </>}
                                </>}
                            </div>



                            <div className='onTheWait'>
                                <div className='top'>
                                    <p>Os próximos são:</p>
                                </div>
                                
                                {battle.map((itemBattle) => (
                                    <>
                                        {itemBattle.type === 'entity' ? <>
                                            {Entity(itemBattle.id)}
                                        </> : <>
                                            {Player(itemBattle.id)}
                                        </>}
                                    </>
                                ))}
                                
                            </div>
                        </div>
                    </div>
                    </>}
                </div>
            </div>
        </Container>

        <Modal handleCloseModal={handleCloseModals} isOpen={modalAddEntity}>
            <ContainerAddModal>
                <div className='title'>Adicionar Entidades</div>
                <div className='list'>
                    {entitys.map((item, key) => (
                        <div key={key}>
                            <div>{item.data.name}</div>
                            <div className='roll'>
                                <button onClick={() => rollIniciativeMonster(item.data.senses.iniciative ?? 0, item.id)}>rolar iniciativa</button> 
                                {rollIniciativeEntity && rollIniciativeEntity.id === item.id ? `Resultado: (${rollIniciativeEntity.dice})${rollIniciativeEntity.result}` : ''}
                            </div>
                            <div>
                                {rollIniciativeEntity && 
                                    <button onClick={() => {
                                        setBattle([
                                            ...battle,
                                            {
                                                id: item.id,
                                                type: 'entity',
                                                iniciative: rollIniciativeEntity?.result ?? 0,
                                                life: item.data.life,
                                            }   
                                        ])
                                        handleCloseModals();
                                    }}>Adicionar</button>
                                }
                            </div>
                        </div>
                    ))}
                </div>
            </ContainerAddModal>
        </Modal>
        <Modal handleCloseModal={handleCloseModals} isOpen={modalAddChar}>
            <ContainerAddModal>
                <div className='title'>Adicionar personagens</div>
                <div className='list'>
                    {characters.map((item, key) => (
                        <div key={key}>
                            <div>{item.data.name}</div>
                            <div>
                                <TextField id="standard-basic" label="Iniciativa" type='number' variant="filled" value={playerIniciative?.id === item.id ? playerIniciative?.iniciative : ""} onChange={(e) => {
                                    setPlayerIniciative({
                                        iniciative: Number(e.target.value ?? 0),
                                        id: item.id
                                    });
                                }} />
                            </div>
                            <div>
                                <button onClick={() => {
                                    setBattle([
                                        ...battle,
                                        {
                                            id: item.id,
                                            type: 'player',
                                            iniciative: playerIniciative?.iniciative ?? 0,
                                        }   
                                    ])
                                    handleCloseModals();
                                }}>Adicionar</button>
                            </div>
                        </div>
                    ))}
                </div>
            </ContainerAddModal>
        </Modal>

        <Modal handleCloseModal={handleCloseModals} isOpen={modalshowHability}>
            <ContainerAddModal>
                <div className='title'>{modalshowHabilityDetails?.title}</div>
                <div className='list'>
                    {modalshowHabilityDetails?.description}

                    {modalshowHabilityDetails?.roll && <>
                        <p>Teste: d{modalshowHabilityDetails?.roll} {modalshowHabilityDetails?.rollMod && `+ ${modalshowHabilityDetails?.rollMod}`}</p>
                    </>}
                    {modalshowHabilityDetails?.damageRoll && <>
                        <p>Dano: [{modalshowHabilityDetails?.damageRoll.join(', ')}] {modalshowHabilityDetails?.damageMod && `+ ${modalshowHabilityDetails?.damageMod}`}</p>
                    </>}
                </div>
                <div className='buttons'>
                    {!!modalshowHabilityDetails?.roll && <>
                        <button onClick={() => {
                            if(modalshowHabilityDetails.rollMod) setdicePersMod([{
                                type: 'habilidade',
                                name: modalshowHabilityDetails.title,
                                roll: modalshowHabilityDetails.rollMod
                            }]);
                            setdicePersToRoll([modalshowHabilityDetails?.roll ?? 20]);
                        }}>rolar teste</button>
                    </>}

                    {!!modalshowHabilityDetails?.damageRoll && <>
                        <button onClick={() => {
                            if(modalshowHabilityDetails.damageMod) setdicePersMod([{
                                type: 'damage',
                                name: 'Dano adicional',
                                roll: modalshowHabilityDetails.damageMod
                            }]);
                            setdicePersToRoll(modalshowHabilityDetails?.damageRoll ?? []);
                        }}>rolar dano</button>
                    </>}
                </div>
            </ContainerAddModal>
        </Modal>
        {dicePersToRoll && dicePersToRoll.length > 0 &&
            <Roll dice={dicePersToRoll} mod={dicePersMod} setdice={setdicePersToRoll} setdiceMod={setdicePersMod} onClose={() => {handleCloseDicePer()}} />
        }
        <ToastContainer style={{zIndex: '999999999999999999'}} />
        </>
    )
}

export default CampainPlay;