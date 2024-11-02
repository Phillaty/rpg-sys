import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { Box, Divider, Tab, Tabs } from '@mui/material';
import { a11yProps } from '../../../../utils/components';
import { itemDataType } from '../../../../types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';

type prop = {
    itens: itemDataType[];
    itensGeral: itemDataType[];
    itensWeapon: itemDataType[];
    itensArmadure: itemDataType[];
    handleRollBackpack: (dices: number[], mods: number[]) => void;
    toast: any;
    wheight?: number;
}

const Backpack = ({itens, itensGeral, itensWeapon, itensArmadure, handleRollBackpack, toast, wheight}: prop) => {
    const [value, setValue] = React.useState(0);
    const [actualWheigh, setActualWheigh] = useState<number>(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const handleSetToGroudItem = async (item: itemDataType) => {
        if (item) {
            const charImgDocRef = doc(db, "item", item?.id ?? '');
            await updateDoc(charImgDocRef, {
                position: {
                    idGetter: "",
                    type: "ground",
                }
            }).then(() => {
                toast.success("Item jogado no chão!");
            });
        }
    }

    useEffect(() => {
        let count = 0;
        itens.forEach((i) => {
            count = count + i.data.weight;
        });
        setActualWheigh(count);
    }, [itens])

    return (
        <>
        <Container>
            <div>
            <p className='weight'><i className="fa-solid fa-weight-hanging"></i> Peso: {actualWheigh}/{wheight ?? 0}</p>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="Itens Gerais" {...a11yProps(0)} />
                    <Tab label="Armas" {...a11yProps(1)} />
                    <Tab label="Armaduras" {...a11yProps(2)} />
                </Tabs>
            </Box>
            
            {value === 0 && 
                <div className='TabContainer'>
                    {itensGeral.map((item, key) => (
                        <div className='item' key={key}>
                            <div className='name'>{item.data.name}</div>
                            <div className='data'>{item.data.description}</div>
                            {item.data.weaponConfigs &&
                                <>
                                    <div className='data'>
                                        <span>Dano: </span>
                                        [{item.data.weaponConfigs?.damage?.base?.join(', ')}] 
                                        {item.data.weaponConfigs?.damage?.mod && ` + ${item.data.weaponConfigs?.damage?.mod?.join(', +')}` }
                                    </div>
                                    <div className='data'><span>Crítico: </span>
                                        {item.data.weaponConfigs?.crit?.roll}{' '}
                                        / {item.data.weaponConfigs?.crit?.multiply ?? 2}x
                                    </div>
                                    <div className='data'><span>Tipo: </span> {item.data.weaponConfigs?.type}</div>
                                </>
                            }
                            {item.data.armadureConfigs &&
                                <>
                                    <div className='data'><span>Tipo: </span> {item.data.armadureConfigs?.type}</div>
                                </>
                            }
                            <div className='data'><span>Carga: </span> {item.data.weight ?? 0}</div>
                            {item.data.roll &&
                                <>
                                    <div className='data'>
                                        <span>Utilização: </span> [{item.data.roll.base?.join(', ')}] {item.data.roll.mod && `+ ${item.data.roll.mod.join(', ')}`}
                                    </div>
                                </>
                            }
                            <div style={{margin: '8px 0 4px 0'}}>
                                <Divider />
                            </div>
                            <div className='buttons'>
                                {item.data.roll && <button onClick={() => {
                                    handleRollBackpack(item.data.roll?.base ?? [], item.data.roll?.mod ?? []);
                                }}>Rolar dado</button> }
                                <button onClick={() => handleSetToGroudItem(item)}>Jogar no chão</button>
                            </div>
                            
                        </div>
                    ))}
                </div>
            }
            {value === 1 && 
                <div className='TabContainer'>
                    {itensWeapon.map((item, key) => (
                        <div className='item' key={key}>
                            <div className='name'>{item.data.name}</div>
                            <div className='data'>{item.data.description}</div>
                            {item.data.weaponConfigs &&
                                <>
                                    <div className='data'>
                                        Dano: 
                                        [{item.data.weaponConfigs?.damage?.base?.join(', ')}] 
                                        {item.data.weaponConfigs?.damage?.mod && ` + ${item.data.weaponConfigs?.damage?.mod?.join(', +')}` }
                                    </div>
                                    <div className='data'>Crítico: 
                                        {item.data.weaponConfigs?.crit?.roll}{' '}
                                        / {item.data.weaponConfigs?.crit?.multiply ?? 2}x
                                    </div>
                                    <div className='data'>Tipo: {item.data.weaponConfigs?.type}</div>
                                </>
                            }
                            {item.data.armadureConfigs &&
                                <>
                                    <div className='data'>Tipo: {item.data.armadureConfigs?.type}</div>
                                </>
                            }
                            <div className='data'>Carga: {item.data.weight ?? 0}</div>
                            {item.data.roll &&
                                <>
                                    <div className='data'>
                                        Utilização: [{item.data.roll.base?.join(', ')}] {item.data.roll.mod && `+ ${item.data.roll.mod.join(', ')}`}
                                    </div>
                                </>
                            }
                            <div style={{margin: '8px 0 4px 0'}}>
                                <Divider />
                            </div>
                            <div className='buttons'>
                            {item.data.roll && <button>Rolar dado</button> }
                                <button>Jogar no chão</button>
                            </div>
                            
                        </div>
                    ))}
                </div>
            }
            {value === 2 && 
                <div className='TabContainer'>
                    {itensArmadure.map((item, key) => (
                        <div className='item' key={key}>
                            <div className='name'>{item.data.name}</div>
                            <div className='data'>{item.data.description}</div>
                            {item.data.weaponConfigs &&
                                <>
                                    <div className='data'>
                                        Dano: 
                                        [{item.data.weaponConfigs?.damage?.base?.join(', ')}] 
                                        {item.data.weaponConfigs?.damage?.mod && ` + ${item.data.weaponConfigs?.damage?.mod?.join(', +')}` }
                                    </div>
                                    <div className='data'>Crítico: 
                                        {item.data.weaponConfigs?.crit?.roll}{' '}
                                        / {item.data.weaponConfigs?.crit?.multiply ?? 2}x
                                    </div>
                                    <div className='data'>Tipo: {item.data.weaponConfigs?.type}</div>
                                </>
                            }
                            {item.data.armadureConfigs &&
                                <>
                                    <div className='data'>Tipo: {item.data.armadureConfigs?.type}</div>
                                </>
                            }
                            <div className='data'>Carga: {item.data.weight ?? 0}</div>
                            {item.data.roll &&
                                <>
                                    <div className='data'>
                                        Utilização: [{item.data.roll.base?.join(', ')}] {item.data.roll.mod && `+ ${item.data.roll.mod.join(', ')}`}
                                    </div>
                                </>
                            }
                            <div style={{margin: '8px 0 4px 0'}}>
                                <Divider />
                            </div>
                            <div className='buttons'>
                                {item.data.roll && <button>Rolar dado</button> }
                                <button>Jogar no chão</button>
                            </div>
                            
                        </div>
                    ))}
                </div>
            }
            </div>
        </Container>
        </>
    )
}

export default Backpack;