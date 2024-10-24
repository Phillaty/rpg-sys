import React, { useState } from 'react';
import { Container } from './styles';
import { avatarDataType, campainType } from '../../../types';
import logo from '../../../imgs/profile-user-icon-2048x2048-m41rxkoe.png';
import { skillFiltr } from '..';
import Roll from '../../../commom/ROLL';
import { getPercentage } from '../../../utils';

type prop = {
    charcater?: avatarDataType;
    campain?: campainType;
    skills: skillFiltr;
}

const Sheet = ({ charcater, campain, skills }: prop) => {

    const [dice, setdice] = useState<number[]>();
    const [diceMod, setdiceMod] = useState<number[]>();

    const [dicePers, setdicePers] = useState<number[]>([]);
    const [dicePersMod, setdicePersMod] = useState<number[]>([]);
    const [dicePersToRoll, setdicePersToRoll] = useState<number[]>();

    const handleCloseDicePer = () => {
        setdicePers([]);
        setdicePersMod([]);
        setdicePersToRoll([]);
    }

    return (
        <>
            <Container>
                <div className='buttonsChar'>
                    <button className='backpack'><i className="fa-solid fa-list"></i> Mochila</button>
                    <button className='sheet'><i className="fa-solid fa-address-book"></i> Ficha completa</button>
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
                                                const newDices = dicePers.filter((i, index) => index !== keyMod);
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
        </>
    )
}

export default Sheet;