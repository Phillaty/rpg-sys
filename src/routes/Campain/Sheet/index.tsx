import React, { useEffect, useState } from 'react';
import { Container, ContainerHability, ContainerHealth } from './styles';
import { alertType, avatarDataType, campainType, classeDataType, habilityDataType, itemDataType, subclassDataType } from '../../../types';
import logo from '../../../imgs/profile-user-icon-2048x2048-m41rxkoe.png';
import { skillFiltr, skillTy } from '..';
import Roll from '../../../commom/ROLL';
import { getAttrubuteMod, getPercentage } from '../../../utils';
import SheetDetails from './SheetDetails';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../../../commom/Modal';
import Backpack from './Backpack';
import { Alert, Avatar, Stack, TextField } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';

type prop = {
    charcater?: avatarDataType;
    campain?: campainType;
    skills: skillFiltr;
    skillsAll: skillTy[];
}

const Sheet = ({ charcater, campain, skills, skillsAll }: prop) => {

    const location = useLocation();
    const navigate = useNavigate();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const [wentFromCreate, setWentFromCreate] = useState<boolean>(Boolean(urlParams.get('wentFromCreate')));

    const campainId = urlParams.get('camp') ?? '';

    const [dice, setdice] = useState<number[]>();
    const [diceMod, setdiceMod] = useState<number[]>();

    const [dicePers, setdicePers] = useState<number[]>([]);
    const [dicePersMod, setdicePersMod] = useState<number[]>([]);
    const [dicePersToRoll, setdicePersToRoll] = useState<number[]>();
    
    const [showSheetDetails, setShowSheetDetails] = useState<boolean>(false);
    const [isToCloseSheet, setIsToCloseSheet] = useState<boolean>(false);

    const [habilities, setHabilities] = useState<habilityDataType[]>([]);
    const [subclasses, setSubclasses] = useState<subclassDataType[]>([]);
    const [classChar, setClassChar] = useState<classeDataType>();

    const [habilitiesChar, setHabilitiesChar] = useState<habilityDataType[]>();

    const [charSubclass, setCharSubclass] = useState<subclassDataType>();

    const [backpackModal, setBackpackModal] = useState<boolean>(false);

    const [healthModal, sethealthModal] = useState<boolean>(false);

    const [habilityModal, setHabilityModal] = useState<boolean>(false);
    const [habilitySelected, setHabilitySelected] = useState<habilityDataType>();

    const [itemsAll, setItemsALL] = useState<itemDataType[]>([]);
    const [itemsCharInventory, setItemsCharInventory] = useState<itemDataType[]>([]);

    const [itensGeral, setItensGeral] = useState<itemDataType[]>([]);
    const [itensWeapon, setItensWeapon] = useState<itemDataType[]>([]);
    const [itensArmadure, setItensArmadure] = useState<itemDataType[]>([]);

    const [lifeValue, setlifeValue] = useState<number>();
    const [sanityValue, setsanityValue] = useState<number>();
    const [peValue, setPeValue] = useState<number>();
    const [cyberValue, setCyberValue] = useState<number>();

    const [alertsList, setAlertsList] = useState<alertType[]>([]);

    const handleCloseDicePer = () => {
        setdicePers([]);
        setdicePersMod([]);
        setdicePersToRoll([]);
    }

    const handleCloseSheet = () => {
        setIsToCloseSheet(true);

        setTimeout(() => {
            setShowSheetDetails(false);
            setIsToCloseSheet(false);
        }, 500);
    }

    const handleCloseBackpack = () => {
        setBackpackModal(false);
    }

    const handleCloseHability = () => {
        setHabilityModal(false);
        setHabilitySelected(undefined);
    }

    const handleCloseHealth = () => {
        sethealthModal(false);
        setlifeValue(undefined);
        setsanityValue(undefined);
        setPeValue(undefined);
        setCyberValue(undefined);
    }

    useEffect(() => {
        if(habilitySelected) {
            setHabilityModal(true);
        } else {
            setHabilityModal(false);
        }
    }, [habilitySelected])

    const removeWentFromCreateParam = () => {
        urlParams.delete('wentFromCreate');
        navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
        setWentFromCreate(false);
    };

    useEffect(() => {
        if (wentFromCreate) {
            setShowSheetDetails(true);
            removeWentFromCreateParam();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(charcater) {
            const q = query(
                collection(db, 'hability'),
                where('classId', '==', charcater?.data.class.id),
            );

            onSnapshot(q, (querySnapshot) => {
                const habilitiesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })) as habilityDataType[];
                
                
                setHabilities(habilitiesData);
            });
        }

    }, [charcater]);

    useEffect(() => {
        if(campain && charcater) {
            const p = query(
                collection(db, 'subclass'),
                where('classId', 'in', campain?.classes)
            );

            onSnapshot(p, (querySnapshot) => {
                const subclassData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })) as subclassDataType[];

                if (charcater?.data.subclass) {
                    const findCharSubclass = subclassData.find((i) => i.id === charcater?.data.subclass.id);

                    findCharSubclass && setCharSubclass(findCharSubclass);
                }
                
                setSubclasses(subclassData);
            });
        }
    }, [campain, charcater]);

    useEffect(() => {
        const body = document.getElementById('body');
        if (showSheetDetails && skills) {
            if(body)
                body.classList.add('modalOn');
        } else {
            if(body)
                body.classList.remove('modalOn');
        }
    }, [showSheetDetails, skills]);

    useEffect(() => {
        if (charcater && habilities) {
            const habilitiesFind = habilities.filter((i) => charcater?.data?.hability?.some((j) => j === i.id));
            const sorted = habilitiesFind.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setHabilitiesChar(sorted);
        }
    }, [charcater, habilities]);

    const getItems = async () => {
        const p = query(
            collection(db, 'item'),
            where('campainId', '==', campainId)
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as itemDataType[];

            const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setItemsALL(sorted);
        });
    }

    const getClass = async () => {
        const docRef = doc(db, 'classes', charcater?.data.class.id ?? "");

        onSnapshot(docRef, (querySnapshot) => {
            const docData = {
                id: querySnapshot.id,
                data: querySnapshot.data(),
            } as classeDataType;
            setClassChar(docData);
        });
    }

    useEffect(() => {
        if(campainId) {
            getItems();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campainId]);

    useEffect(() => {
        if(charcater && charcater.data.class.id){
            getClass();
        }

        if(charcater) {
            let warnings:alertType[] = [];

            if(charcater.data.unlock.levelPoint > 0) warnings.push({message: "Você pode subir de nível! Abra a ficha completa para continuar", type: 'info'});
            if(charcater.data.unlock.attributePoints > 0) warnings.push({message: "Você tem pontos de atributos! Abra a ficha completa para continuar", type: 'info'});
            if(charcater.data.unlock.habilityPoints > 0) warnings.push({message: "Você tem pontos de habilidade! Abra a ficha completa para continuar", type: 'info'});
            if(charcater.data.unlock.perkPoints > 0) warnings.push({message: "Você tem pontos de perícia! Abra a ficha completa para continuar", type: 'info'});

            if(warnings.length > 0) setAlertsList(warnings);
            else setAlertsList([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [charcater])

    useEffect(() => {
        if (itemsAll) {
            const chatItensGet = itemsAll.filter((i) => i.data.position.idGetter === charcater?.id);

            setItemsCharInventory(chatItensGet);

            const geralItenGet = chatItensGet.filter((i) => !['weapon', 'armadure'].includes(i.data.type));
            const weaponsItenGet = chatItensGet.filter((i) => ['weapon'].includes(i.data.type));
            const armadureItenGet = chatItensGet.filter((i) => ['armadure'].includes(i.data.type));

            setItensGeral(geralItenGet);
            setItensWeapon(weaponsItenGet);
            setItensArmadure(armadureItenGet);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsAll]);

    const handleRollBackpack = (dices: number[], mods: number[]) => {
        if(dices.length > 0) {
            if(mods.length > 0)setdiceMod(dices);

            setdice(dices);

            handleCloseBackpack();
        }
    }

    const handleRoll = (item: skillTy, aditionalMod?: number) => {
        let totalModify:number[] = [];

        if (item.expertise) {
            totalModify = [item.expertise];
        }

        if (aditionalMod) totalModify.push(aditionalMod);

        const totalDice = [20];

        if(!!habilitiesChar) {
            habilitiesChar.forEach((i) => {
                i.data.buff?.modifyRoll?.forEach((j) => {
                    if(j.perkId === item.id && i.data.type === "passive") totalModify.push(j.value);
                })
            });

            habilitiesChar.forEach((i) => {
                i.data.buff?.rollVantage?.forEach((j) => {
                    if(j.perkId === item.id && i.data.type === "passive") totalDice.push(20);
                })
            });
        }

        if(itemsCharInventory.length > 0) {
            itemsCharInventory.forEach((i) => {
                if(i.data.buff?.modifyRoll) {
                    i.data.buff?.modifyRoll.forEach((j) => {
                        if(j.perkId === item.id) totalModify.push(j.value);
                    })
                }
            })
        }

        if(charcater){
            const attributeMod = getAttrubuteMod(item.base ?? '', charcater?.data);
            if (attributeMod && attributeMod > 0) {
                totalModify.push(attributeMod);
            }
        }

        setdiceMod(totalModify);
        setdice(totalDice);
    }

    const handleHealth = async (type: 'life' | 'pe' | 'sanity' | 'cyberpsicosy', value: number, option: 'add' | 'remove' ) => {
        const userDocRef = doc(db, "character", charcater?.id ?? '');

        let total = option === 'add' ? (charcater?.data.basics[type].actual ?? 0) + value : (charcater?.data.basics[type].actual ?? 0) - value;

        if (total > (charcater?.data.basics[type].max ?? 0)) total = (charcater?.data.basics[type].max ?? 0);
        if (total < 0) total = 0;

        await updateDoc(userDocRef, {
            basics: {
                ...charcater?.data.basics,
                [type]: {
                    max: charcater?.data.basics[type].max ?? 0,
                    actual: total,
                }
            }
        }).then(() => {
            toast.success("Saúde editada!");
            handleCloseHealth();
        });
        
    }

    useEffect(() => {
        if (!!itemsCharInventory.length && charcater) {
            const weightTotalBackpack = itemsCharInventory.reduce((a, b) => a + b.data.weight, 0);

            if(charcater?.data.slotManagement?.actual !== weightTotalBackpack) {
                const userDocRef = doc(db, "character", charcater?.id ?? '');
                updateDoc(userDocRef, {
                    slotManagement: {
                        ...charcater?.data.slotManagement,
                        actual: weightTotalBackpack,
                    }
                });
            }
        }
    }, [itemsCharInventory, charcater]);

    return (
        <>
            <Container>
                {!!alertsList.length &&
                    <div className='warnings'>
                        <Stack sx={{ width: '100%' }} spacing={1}>
                            {alertsList.map((i, key) => (
                                <Alert severity={i.type} key={key}>{i.message}</Alert>
                            ))}
                        </Stack>
                    </div>
                }
                <div className='topInfo'>
                    <div className='buttonsChar'>
                        <button className='backpack' onClick={() => {setBackpackModal(true)}}><i className="fa-solid fa-list"></i> Mochila {itemsCharInventory.length > 0 ? `(${itemsCharInventory.length})` : ''}</button>
                        <button className='sheet' onClick={() => {setShowSheetDetails(true)}}><i className="fa-solid fa-address-book"></i> Ficha completa</button>
                    </div>
                    <div className='charInfo'>
                        <div className='charimage'>
                            <span>
                                <Avatar src={charcater?.data.img ?? logo} sx={{ width: 100, height: 100 }} />
                            </span>
                        </div>
                        <div className='charInfos'>
                            <p className='name'>{charcater?.data.name}</p>
                            <div className='info'>
                                <p>{charcater?.data.class.title} - nível {charcater?.data.level}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='health'>
                    {campain?.basics.life &&
                        <div>
                            <p className='label'>Vida</p>
                            <div className='bar life'>
                                <div>
                                    <span style={{ width: `${getPercentage(charcater?.data.basics.life.max ?? 0, charcater?.data.basics.life.actual ?? 0)}%` }}></span>
                                    <p>{charcater?.data.basics.life.actual}/{charcater?.data.basics.life.max}</p>
                                </div>
                            </div>
                        </div>
                    }
                    {campain?.basics.sanity &&
                        <div>
                            <p className='label'>Sanidade</p>
                            <div className='bar sanity'>
                                <span style={{ width: `${getPercentage(charcater?.data.basics.sanity.max ?? 0, charcater?.data.basics.sanity.actual ?? 0)}%` }}></span>
                                <p>{charcater?.data.basics.sanity.actual}/{charcater?.data.basics.sanity.max}</p>
                            </div>
                        </div>
                    }
                    {campain?.basics.cyberpsicosy &&
                        <div>
                            <p className='label'>Cyberpsicose</p>
                            <div className='bar cyberpsicosy'>
                                <span style={{ width: `${getPercentage(charcater?.data.basics.cyberpsicosy.max ?? 0, charcater?.data.basics.cyberpsicosy.actual ?? 0)}%` }}></span>
                                <p>{charcater?.data.basics.cyberpsicosy.actual}/{charcater?.data.basics.cyberpsicosy.max}</p>
                            </div>
                        </div>
                    }
                    {campain?.basics.pe &&
                        <div>
                            <p className='label'>PE</p>
                            <div className='bar pe'>
                                <span style={{ width: `${getPercentage(charcater?.data.basics.pe.max ?? 0, charcater?.data.basics.pe.actual ?? 0)}%` }}></span>
                                <p>{charcater?.data.basics.pe.actual}/{charcater?.data.basics.pe.max}</p>
                            </div>
                        </div>
                    }
                
                    <div className='editHealth'>
                        <button onClick={() => sethealthModal(true)}>Editar saúde</button>
                    </div>
                </div>
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
                                    <button onClick={() => {setdicePersMod([...dicePersMod, -5])}}>-5</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod, -4])}}>-4</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod, -3])}}>-3</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod, -2])}}>-2</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod, -1])}}>-1</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod, 1])}}>+1</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod, 2])}}>+2</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod, 3])}}>+3</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod, 4])}}>+4</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod, 5])}}>+5</button>
                                </div>
                            </div>
                    
                            <div className='preVisuTitle'><p>Dados para rolagem</p></div>
                            {dicePersMod.length > 0 && 
                                <div className='preVisuMod'>
                                    <div className='dicesPerMod'>
                                        <p>Modificações:</p>
                                        {dicePersMod.map((mod, keyMod) => (
                                            <div key={keyMod} onClick={(() => {
                                                const newDices = dicePersMod.filter((i, index) => index !== keyMod);
                                                setdicePersMod(newDices);
                                            })}><span className='diceitem'>{mod >= 0 ? '+' : ''}{mod}</span><span className='error'><i className="fa-solid fa-xmark"></i></span></div>
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
                {!!itensWeapon.length && 
                    <div className='weapons'>
                        <div className='weaponList'>
                            {itensWeapon.map((item, key) => (
                                <div className='itemWeapon' key={key}>
                                    <p>{item.data.name}</p>
                                    <p>Dano: 
                                        [{item.data.weaponConfigs?.damage?.base?.join(', ')}] {' '}
                                        {item.data.weaponConfigs?.damage?.mod && <>
                                            + {item.data.weaponConfigs?.damage?.mod.join(' + ')}
                                        </>} | {item.data.weaponConfigs?.crit?.roll ?? 20}/{item.data.weaponConfigs?.crit?.multiply ?? 2}x
                                    </p>
                                    <div>
                                        <button className='test' onClick={() => {
                                            
                                            const getPerkItem = skillsAll.find(i => i.name === (item.data.weaponConfigs?.type === 'melee' ? 'Luta' : 'Pontaria'));
                                            if(getPerkItem) handleRoll(getPerkItem);

                                        }}>{item.data.weaponConfigs?.type === 'melee' ? 'Luta': 'Pontaria'}</button>

                                        <button className='dmg' onClick={() => {
                                            if(item.data.weaponConfigs?.damage?.mod) setdiceMod(item.data.weaponConfigs?.damage?.mod);
                                            setdice(item.data.weaponConfigs?.damage?.base);
                                        }}>Dano normal</button>

                                        <button className='dmg crit' onClick={() => {
                                            if(item.data.weaponConfigs?.damage?.mod) setdiceMod(item.data.weaponConfigs?.damage?.mod);
                                            
                                            const dicesDmg: number[] = []
                                            for (let index = 0; index < (item.data.weaponConfigs?.crit?.multiply ?? 2); index++) {
                                                item.data.weaponConfigs?.damage?.base?.forEach(element => {
                                                    dicesDmg.push(element);
                                                });
                                            }
                                            setdice(dicesDmg);
                                        }}>Dano crítico</button>
                                    </div>
                                    
                                </div>
                            ))}
                            
                        </div>
                    </div>
                }
                {!!habilitiesChar?.length && 
                    <div className='habilities'>
                        <div className='habilityTitle'>Habilidades ativas <small>Clique para ver mais</small></div>
                        <div className='habilityList'>
                            {habilitiesChar?.map((item, key) => (
                                <div className='habilityItem' key={key} onClick={() => setHabilitySelected(item)}>{item.data.name}</div>
                            ))}
                        </div>
                    </div>
                }
                <div className='skill'>
                    <div className='skillItems'>
                        <div>
                            <p>Pericias treinadas</p>
                            <div className='skillsgrid'>
                                {skills.trained?.map((item, key) => (
                                    <div key={key} className='itemSkill' onClick={() => {
                                        handleRoll(item);
                                    }}>
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <p>Perícias não treinadas</p>
                            <div className='skillsgrid'>
                                {skills.notTrained.map((item, key) => ( 
                                    <div key={key} className='itemSkill' onClick={() => {
                                        handleRoll(item);
                                    }}>
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {dice && 
                <Roll dice={dice} mod={diceMod} setdice={setdice} setdiceMod={setdiceMod} discord={campain?.discord} char={charcater?.data} />
            }
            {dicePersToRoll && dicePersToRoll.length > 0 &&
                <Roll dice={dicePersToRoll} mod={dicePersMod} setdice={setdicePersToRoll} setdiceMod={setdicePersToRoll} onClose={() => {handleCloseDicePer()}} discord={campain?.discord} char={charcater?.data} />
            }

            {showSheetDetails && skills && 
                <SheetDetails 
                    isToCloseSheet={isToCloseSheet} 
                    charcater={charcater} 
                    campain={campain} 
                    skills={skills} 
                    skillsAll={skillsAll} 
                    onClose={handleCloseSheet}
                    habilities={habilities}
                    subclasses={subclasses}
                    charSubclass={charSubclass}
                    classChar={classChar}
                    toast={toast}
                />
            }
            
            <Modal isOpen={backpackModal} handleCloseModal={handleCloseBackpack} >
                <Backpack itens={itemsCharInventory} itensArmadure={itensArmadure} itensGeral={itensGeral} itensWeapon={itensWeapon} handleRollBackpack={handleRollBackpack} toast={toast} />
            </Modal>

            <Modal isOpen={habilityModal} handleCloseModal={handleCloseHability} >
                <ContainerHability>
                    {habilitySelected && <>
                    
                    <div className='data'>
                        <p>Nome da habilidade</p>
                        <span>{habilitySelected.data.name}</span>
                    </div>
                    <div className='data'>
                        <p>Descrição</p>
                        <span>{habilitySelected.data.description}</span>
                    </div>
                    {!!habilitySelected.data.buff?.modifyRoll?.length && 
                        <div className='data'>
                            <p>Modificador de pericia ganho</p>
                            <span>
                                <div>
                                    {habilitySelected.data.buff?.modifyRoll?.map((i, key) => (
                                        <div key={key} className='perkItem' onClick={() => {
                                            const getPerkItem = skillsAll.find((j) => i.perkId === j.id);
                                            if (getPerkItem) {
                                                handleRoll(getPerkItem, Number(i.value));
                                            }
                                            handleCloseHability();
                                        }}>{i.perkName} | valor: {i.value}</div>
                                    ))}
                                </div>
                            </span>
                        </div>
                    }
                    
                    </>}
                </ContainerHability>
            </Modal>
            <Modal isOpen={healthModal} handleCloseModal={handleCloseHealth} >
                <ContainerHealth>
                    <div className='label'>Editar saúde</div>
                    <div className='life'>
                        <div className='inputs'>
                            <button onClick={() => handleHealth('life', lifeValue ?? 0 ,'remove')}>Remover</button>
                            <TextField id="standard-basic" size='small' type='number' label="Pv" variant="filled" inputMode='numeric' value={lifeValue} onChange={(e) => {
                                setlifeValue(Number(e.target.value));
                            }} />
                            <button onClick={() => handleHealth('life', lifeValue ?? 0 ,'add')}>Adicionar</button>
                        </div>
                    </div>
                    <div className='sanity'>
                        <div className='inputs'>
                            <button onClick={() => handleHealth('sanity', sanityValue ?? 0 ,'remove')}>Remover</button>
                            <TextField id="standard-basic" size='small' type='number' label="Sanidade" variant="filled" inputMode='numeric' value={sanityValue} onChange={(e) => {
                                setsanityValue(Number(e.target.value));
                            }} />
                            <button onClick={() => handleHealth('sanity', sanityValue ?? 0 ,'add')}>Adicionar</button>
                        </div>
                    </div>
                    <div className='pe'>
                        <div className='inputs'>
                            <button onClick={() => handleHealth('pe', peValue ?? 0 ,'remove')}>Remover</button>
                            <TextField id="standard-basic" size='small' type='number' label="PE" variant="filled" inputMode='numeric' value={peValue} onChange={(e) => {
                                setPeValue(Number(e.target.value));
                            }} />
                            <button onClick={() => handleHealth('pe', peValue ?? 0 ,'add')}>Adicionar</button>
                        </div>
                    </div>
                    <div className='cyber'>
                        <div className='inputs'>
                            <button onClick={() => handleHealth('cyberpsicosy', cyberValue ?? 0 ,'remove')}>Remover</button>
                            <TextField id="standard-basic" size='small' type='number' label="Cyberpsicose" variant="filled" inputMode='numeric' value={cyberValue} onChange={(e) => {
                                setCyberValue(Number(e.target.value));
                            }} />
                            <button onClick={() => handleHealth('cyberpsicosy', cyberValue ?? 0 ,'add')}>Adicionar</button>
                        </div>
                    </div>
                </ContainerHealth>
            </Modal>
            <ToastContainer style={{zIndex: 9999999999999999}} />
        </>
    )
}

export default Sheet;