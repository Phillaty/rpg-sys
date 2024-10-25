import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { avatarDataType, campainType, habilityDataType, subclassDataType } from '../../../types';
import logo from '../../../imgs/profile-user-icon-2048x2048-m41rxkoe.png';
import { skillFiltr, skillTy } from '..';
import Roll from '../../../commom/ROLL';
import { getPercentage } from '../../../utils';
import SheetDetails from './SheetDetails';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useLocation, useNavigate } from 'react-router-dom';

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

    const [dice, setdice] = useState<number[]>();
    const [diceMod, setdiceMod] = useState<number[]>();

    const [dicePers, setdicePers] = useState<number[]>([]);
    const [dicePersMod, setdicePersMod] = useState<number[]>([]);
    const [dicePersToRoll, setdicePersToRoll] = useState<number[]>();
    
    const [showSheetDetails, setShowSheetDetails] = useState<boolean>(false);
    const [isToCloseSheet, setIsToCloseSheet] = useState<boolean>(false);

    const [habilities, setHabilities] = useState<habilityDataType[]>([]);
    const [subclasses, setSubclasses] = useState<subclassDataType[]>([]);

    const [charSubclass, setCharSubclass] = useState<subclassDataType>();

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
        if(campain) {
            const q = query(
                collection(db, 'hability'),
                where('classId', 'in', campain?.classes)
            );

            onSnapshot(q, (querySnapshot) => {
                const habilitiesData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })) as habilityDataType[];
                
                
                setHabilities(habilitiesData);
            });
        }

    }, [campain]);

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

    return (
        <>
            <Container>
                <div className='buttonsChar'>
                    <button className='backpack'><i className="fa-solid fa-list"></i> Mochila</button>
                    <button className='sheet' onClick={() => {setShowSheetDetails(true)}}><i className="fa-solid fa-address-book"></i> Ficha completa</button>
                </div>
                <div className='charInfo'>
                    <div className='charimage'>
                        <span>
                            <img src={logo} alt='' />
                        </span>
                    </div>
                    <div className='charInfos'>
                        <p className='name'>{charcater?.data.name}</p>
                        <div className='info'>
                            <p>{charcater?.data.class.title} - nível {charcater?.data.level}</p>
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
                                <span style={{ width: `${getPercentage(charcater?.data.basics.cyberpsicosy.max ?? 0, charcater?.data.basics.cyberpsicosy.actual ?? 0)}%` }}></span>
                                <p>{charcater?.data.basics.cyberpsicosy.actual}/{charcater?.data.basics.cyberpsicosy.max}</p>
                            </div>
                        </div>
                    }
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
                                <button onClick={() => {setdicePersMod([...dicePersMod, 1])}}>+1</button>
                                <button onClick={() => {setdicePersMod([...dicePersMod, 2])}}>+2</button>
                                <button onClick={() => {setdicePersMod([...dicePersMod, 3])}}>+3</button>
                                <button onClick={() => {setdicePersMod([...dicePersMod, 4])}}>+4</button>
                                <button onClick={() => {setdicePersMod([...dicePersMod, 5])}}>+5</button>
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
                                            })}><span className='diceitem'>+{mod}</span><span className='error'><i className="fa-solid fa-xmark"></i></span></div>
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
                                    console.log(dicePers);
                                    setdicePersToRoll(dicePers);
                                }}>Rolar</button></div>
                            </div>
                        </>
                    }
                </div>
                <div className='skill'>
                    <div className='skillItems'>
                        <div>
                            <p>Pericias treinadas</p>
                            <div className='skillsgrid'>
                                {skills.trained?.map((item, key) => (
                                    <div key={key} className='itemSkill' onClick={() => {
                                        setdiceMod([item.expertise ?? 0]);
                                        setdice([20]);
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
                                        setdice([20]);
                                    }}>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {dice && 
                <Roll dice={dice} mod={diceMod} setdice={setdice} setdiceMod={setdiceMod} />
            }
            {dicePersToRoll && dicePersToRoll.length > 0 &&
                <Roll dice={dicePersToRoll} mod={dicePersMod} setdice={setdicePersToRoll} setdiceMod={setdicePersToRoll} onClose={() => {handleCloseDicePer()}} />
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
                />
            }
            
        </>
    )
}

export default Sheet;