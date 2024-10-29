import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import TextField from '@mui/material/TextField';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { itemDataType, itemType, storeDataType } from '../../../../../types';
import { db } from '../../../../../firebase/firebase';
import { Box, Tab, Tabs } from '@mui/material';
import { Dices } from '../../../../../constants';

type props = {
    toast: any;
    itemSelected?: itemDataType;
    stores: storeDataType[];
}

type newListType = {
    id: string;
    name: string;
}

const ItemModal = ({toast, itemSelected, stores}: props) => {

    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';

    const [isToAdd, setIsToAdd] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [listGetter, setListGetter] = useState<newListType[]>([]);

    const [value, setValue] = React.useState(0);

    const [itemForm, setItemForm] = useState<itemType>({
        name: "",
        description: "",
        type: '',
        position: {
            type: 'ground',
        },
        weight: 0,
        category: 0,
        campainId: campainId,
        verified: true,
        cost: 0,
    });
    console.log(itemForm)

    useEffect(() => {
        if(itemSelected){
            setItemForm(itemSelected.data);
            setIsToAdd(false);
        } else {
            prepareToAdd();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemSelected]);

    const handleOrigin = async () => {
        const itemFormToGo = {
            name: itemForm.name,
            description: itemForm.description,
            type: itemForm.type,
            position: itemForm.position,
            weight: itemForm.weight,
            category: itemForm.category,
            campainId: campainId,
            verified: true,
        } as itemType;

        if (itemForm.type === 'weapon') {
            itemFormToGo.weaponConfigs = itemForm.weaponConfigs
        } 
        
        if (itemForm.type === 'armadure') {
            itemFormToGo.armadureConfigs = itemForm.armadureConfigs
        }

        if(itemForm.roll && !['weapon', 'armadure'].includes(itemForm.type)) {
            itemFormToGo.roll = itemForm.roll;
        }

        setLoading(true);
        if (isToAdd) {
            await addDoc(collection(db, "item"), itemFormToGo).then(async (item) => {
                toast.success("Item criado!");
                setItemForm({
                    name: "",
                    description: "",
                    type: '',
                    position: {
                        type: 'ground',
                    },
                    weight: 0,
                    category: 0,
                    campainId: campainId,
                    verified: true,
                    cost: 0,
                });
            });

        } else {
            const userDocRef = doc(db, "item", itemSelected?.id ?? '');

            await updateDoc(userDocRef, itemForm).then(() => {toast.success("Item atualizado!")});
        }

        setLoading(false);
    }

    const prepareToAdd = () => {
        setItemForm({
            name: "",
            description: "",
            type: '',
            position: {
                type: 'ground',
            },
            weight: 0,
            category: 0,
            campainId: campainId,
            verified: true,
            cost: 0,
        });
        setIsToAdd(true);
    }

    useEffect(() => {
        if (itemForm.position.type) {
            const newList: newListType[] = [];

            if (itemForm.position.type === 'store') {
                stores.forEach((i) => {
                    newList.push({
                        id: i.id,
                        name: i.data.title
                    } as newListType)
                })
            }

            if (itemForm.position.type === 'inventory') {
                stores.forEach((i) => {
                    newList.push({
                        id: i.id,
                        name: i.data.title
                    } as newListType)
                })
                
            }

            if (itemForm.position.type === 'entity') {
                stores.forEach((i) => {
                    newList.push({
                        id: i.id,
                        name: i.data.title
                    } as newListType)
                })
                
            }
            
            setListGetter(newList);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemForm.position.type])

    return (
        <>
        <Container>
            <div>
                <div className={`all`}>
                    {loading ? <>
                        <div className='isLoading'>
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
                    </> : <>
                    {itemSelected || isToAdd ? <>

                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} aria-label="basic tabs example" centered>
                                <Tab label="Informações Básicas" onClick={() => setValue(0)} />
                                {itemForm.type && itemForm.type === 'weapon' && <Tab label="Configuração de arma" onClick={() => setValue(1)} />}
                                {itemForm.type && itemForm.type === 'armadure' && <Tab label="Configuração de armadura" onClick={() => setValue(1)} />}
                                {itemForm.type && !['weapon', 'armadure'].includes(itemForm.type) && <Tab label="Gerenciamento de rolagem" onClick={() => setValue(1)} />}
                                <Tab label="Buffs" onClick={() => setValue(2)} />
                            </Tabs>
                        </Box>
                        {value === 0 && 
                            <div className='tabPainel'>
                                <div className='one'>
                                    <TextField id="standard-basic" label="Nome do item" variant="filled" value={itemForm.name} onChange={(e) => {
                                        setItemForm({
                                            ...itemForm,
                                            name: e.target.value
                                        });
                                    }} />
                                </div>
                                <div className='one'>
                                    <TextField
                                        id="standard-multiline-static"
                                        label="Descrição do item"
                                        multiline
                                        rows={2}
                                        value={itemForm.description}
                                        onChange={(e) => {
                                            setItemForm({
                                                ...itemForm,
                                                description: e.target.value
                                            });
                                        }}
                                        variant="filled"
                                    />
                                </div>
                                <div className='one'>
                                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                        <InputLabel id="demo-simple-select-filled-label">Tipo de item</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={itemForm.type}
                                            label="perícia"
                                            variant="filled"
                                            onChange={(e) => {
                                                setItemForm({
                                                    ...itemForm,
                                                    type: e.target.value as 'weapon' | 'armadure' | 'addon' | 'ammo' | 'general'
                                                });
                                            }}
                                        >
                                            <MenuItem value={"weapon"}>Arma</MenuItem>
                                            <MenuItem value={"armadure"}>Armadura</MenuItem>
                                            <MenuItem value={"addon"}>Addon</MenuItem>
                                            <MenuItem value={"ammo"}>Munição</MenuItem>
                                            <MenuItem value={"general"}>Geral</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='one'>
                                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                        <InputLabel id="demo-simple-select-filled-label">Posição</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={itemForm.position.type}
                                            label="perícia"
                                            variant="filled"
                                            onChange={(e) => {
                                                setItemForm({
                                                    ...itemForm,
                                                    position: {
                                                        ...itemForm.position,
                                                        type: e.target.value as "ground" | "inventory" | "store" | "entity"
                                                    }

                                                });
                                            }}
                                        >
                                            <MenuItem value={"ground"}>No chão</MenuItem>
                                            <MenuItem value={"inventory"}>Inventário jogador</MenuItem>
                                            <MenuItem value={"store"}>Loja</MenuItem>
                                            <MenuItem value={"entity"}>Inventárop entidade</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {itemForm.position.type !== 'ground' && 
                                        <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                            <InputLabel id="demo-simple-select-filled-label">Quem segura?</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={itemForm.position.idGetter ?? ""}
                                                label="perícia"
                                                variant="filled"
                                                onChange={(e) => {
                                                    setItemForm({
                                                        ...itemForm,
                                                        position: {
                                                            ...itemForm.position,
                                                            idGetter: String(e.target.value ?? ''),
                                                        }

                                                    });
                                                }}
                                            >
                                                {listGetter.map((i, key) => (
                                                    <MenuItem key={key} value={i.id}>Loja - {i.name}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    }
                                </div>
                                <div className='duo'>
                                    <TextField id="standard-basic" label="Categoria" type='number' variant="filled" value={itemForm.category} onChange={(e) => {
                                        setItemForm({
                                            ...itemForm,
                                            category: Number(e.target.value)
                                        });
                                    }} />
                                    <TextField id="standard-basic" label="Carga" type='number' variant="filled" value={itemForm.weight} onChange={(e) => {
                                        setItemForm({
                                            ...itemForm,
                                            weight: Number(e.target.value)
                                        });
                                    }} />
                                </div>

                                <div className='duo'>
                                    <TextField id="standard-basic" label="Tipo de dano (opcional)" variant="filled" value={itemForm.damagetype} onChange={(e) => {
                                        setItemForm({
                                            ...itemForm,
                                            damagetype: e.target.value
                                        });
                                    }} />
                                    <TextField id="standard-basic" label="Custo" variant="filled" type='number' value={itemForm.cost} onChange={(e) => {
                                        setItemForm({
                                            ...itemForm,
                                            cost: Number(e.target.value)
                                        });
                                    }} />
                                </div>
                                
                            </div>
                        }
                        {value === 1 && itemForm.type === 'weapon' && 
                            <div className='tabPainel'>
                                <div className='one'>
                                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                        <InputLabel id="demo-simple-select-filled-label">Tipo</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={itemForm.weaponConfigs?.type}
                                            label="perícia"
                                            variant="filled"
                                            onChange={(e) => {
                                                setItemForm({
                                                    ...itemForm,
                                                    weaponConfigs: {
                                                        ...itemForm.weaponConfigs,
                                                        type: e.target.value as "range" | "melee"
                                                    }

                                                });
                                            }}
                                        >
                                            <MenuItem value={"range"}>Longo alcance</MenuItem>
                                            <MenuItem value={"melee"}>Corpo a corpo</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='duo'>
                                    <TextField id="standard-basic" defaultValue={20} label="Dado de crítico" type='number' variant="filled" value={itemForm.weaponConfigs?.crit?.roll} onChange={(e) => {
                                        setItemForm({
                                            ...itemForm,
                                            weaponConfigs: {
                                                ...itemForm.weaponConfigs,
                                                crit: {
                                                    ...itemForm.weaponConfigs?.crit,
                                                    roll: Number(e.target.value),
                                                }
                                            }
                                        });
                                    }} />
                                    <TextField id="standard-basic" defaultValue={2} label="Multiplicação em vezes" type='number' variant="filled" value={itemForm.weaponConfigs?.crit?.multiply} onChange={(e) => {
                                        setItemForm({
                                            ...itemForm,
                                            weaponConfigs: {
                                                ...itemForm.weaponConfigs,
                                                crit: {
                                                    ...itemForm.weaponConfigs?.crit,
                                                    multiply: Number(e.target.value),
                                                }
                                            }
                                        });
                                    }} />
                                </div>
                                <div className='one'>
                                    <div className='addDices'>
                                        <div className='title'>Adicionar dados de dano</div>
                                        <div className='dices'>
                                            {Dices.map((i, key) => (
                                                <button key={key} onClick={(e) => {
                                                    let dmgBase: number[] = [];
                                                    
                                                    if(itemForm.weaponConfigs?.damage?.base)
                                                        dmgBase = itemForm.weaponConfigs?.damage?.base;

                                                    dmgBase.push(i);

                                                    setItemForm({
                                                        ...itemForm,
                                                        weaponConfigs: {
                                                            ...itemForm.weaponConfigs,
                                                            damage: {
                                                                ...itemForm.weaponConfigs?.damage,
                                                                base: dmgBase
                                                            }
                                                        }
                                                    });
                                                }}>{i}</button>
                                            ))}
                                        </div>
                                        {!!itemForm.weaponConfigs?.damage?.base?.length && 
                                        <div className='dicesAdded'>
                                            <div>Dados adicionados: {itemForm.weaponConfigs?.damage?.base?.join(', ')}</div>
                                            <div>
                                                <button className='button remove' onClick={() => {
                                                    setItemForm({
                                                        ...itemForm,
                                                        weaponConfigs: {
                                                            ...itemForm.weaponConfigs,
                                                            damage: {
                                                                ...itemForm.weaponConfigs?.damage,
                                                                base: []
                                                            }
                                                        }
                                                    });
                                                }}>Limpar</button>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                                <div className='one'>
                                <div className='addDices'>
                                        <div className='title'>Adicionar modificadores</div>
                                        <div className='dices'>
                                            {[1,2,3,4,5,6,7,8,9,10].map((i, key) => (
                                                <button key={key} onClick={(e) => {
                                                    let dmgMod: number[] = [];
                                                    
                                                    if(itemForm.weaponConfigs?.damage?.mod)
                                                        dmgMod = itemForm.weaponConfigs?.damage?.mod;

                                                    dmgMod.push(i);

                                                    setItemForm({
                                                        ...itemForm,
                                                        weaponConfigs: {
                                                            ...itemForm.weaponConfigs,
                                                            damage: {
                                                                ...itemForm.weaponConfigs?.damage,
                                                                mod: dmgMod
                                                            }
                                                        }
                                                    });
                                                }}>{i}</button>
                                            ))}
                                        </div>
                                        {!!itemForm.weaponConfigs?.damage?.mod?.length && 
                                        <div className='dicesAdded'>
                                            <div>Dados adicionados: {itemForm.weaponConfigs?.damage?.mod?.join(', ')}</div>
                                            <div>
                                                <button className='button remove' onClick={() => {
                                                    setItemForm({
                                                        ...itemForm,
                                                        weaponConfigs: {
                                                            ...itemForm.weaponConfigs,
                                                            damage: {
                                                                ...itemForm.weaponConfigs?.damage,
                                                                mod: []
                                                            }
                                                        }
                                                    });
                                                }}>Limpar</button>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        {value === 1 && itemForm.type === 'armadure' && 
                            <div className='tabPainel'>
                                <div className='duo'>
                                    <TextField id="standard-basic" defaultValue={20} label="Defesa" type='number' variant="filled" value={itemForm.armadureConfigs?.protection} onChange={(e) => {
                                        setItemForm({
                                            ...itemForm,
                                            armadureConfigs: {
                                                ...itemForm.armadureConfigs,
                                                protection: Number(e.target.value)
                                            }
                                        });
                                    }} />
                                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                        <InputLabel id="demo-simple-select-filled-label">Tipo</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={itemForm.armadureConfigs?.type}
                                            label="perícia"
                                            variant="filled"
                                            onChange={(e) => {
                                                setItemForm({
                                                    ...itemForm,
                                                    armadureConfigs: {
                                                        ...itemForm.position,
                                                        type: e.target.value as "heavy" | "light"
                                                    }

                                                });
                                            }}
                                        >
                                            <MenuItem value={"light"}>Leve</MenuItem>
                                            <MenuItem value={"heavy"}>Pesado</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>
                        }
                        {value === 1 && !['weapon', 'armadure'].includes(itemForm.type) && 
                            <div className='tabPainel'>
                                <div className='one'>
                                    <div className='addDices'>
                                        <div className='title'>Adicionar dados base</div>
                                        <div className='dices'>
                                            {Dices.map((i, key) => (
                                                <button key={key} onClick={(e) => {
                                                    let dmgBase: number[] = [];
                                                    
                                                    if(itemForm.roll?.base)
                                                        dmgBase = itemForm.roll?.base;

                                                    dmgBase.push(i);

                                                    setItemForm({
                                                        ...itemForm,
                                                        roll: {
                                                            ...itemForm.roll,
                                                            base: dmgBase
                                                        }
                                                    });
                                                }}>{i}</button>
                                            ))}
                                        </div>
                                        {!!itemForm.roll?.base?.length && 
                                        <div className='dicesAdded'>
                                            <div>Dados adicionados: {itemForm.roll?.base?.join(', ')}</div>
                                            <div>
                                                <button className='button remove' onClick={() => {
                                                    setItemForm({
                                                        ...itemForm,
                                                        roll: {
                                                            ...itemForm.roll,
                                                            base: []
                                                        }
                                                    });
                                                }}>Limpar</button>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                                <div className='one'>
                                    <div className='addDices'>
                                        <div className='title'>Adicionar modificadores</div>
                                        <div className='dices'>
                                            {[1,2,3,4,5,6,7,8,9,10].map((i, key) => (
                                                <button key={key} onClick={(e) => {
                                                    let dmgBase: number[] = [];
                                                    
                                                    if(itemForm.roll?.mod)
                                                        dmgBase = itemForm.roll?.mod;

                                                    dmgBase.push(i);

                                                    setItemForm({
                                                        ...itemForm,
                                                        roll: {
                                                            ...itemForm.roll,
                                                            mod: dmgBase
                                                        }
                                                    });
                                                }}>{i}</button>
                                            ))}
                                        </div>
                                        {!!itemForm.roll?.mod?.length && 
                                        <div className='dicesAdded'>
                                            <div>Dados adicionados: {itemForm.roll?.mod.join(', ')}</div>
                                            <div>
                                                <button className='button remove' onClick={() => {
                                                    setItemForm({
                                                        ...itemForm,
                                                        roll: {
                                                            ...itemForm.roll,
                                                            mod: []
                                                        }
                                                    });
                                                }}>Limpar</button>
                                            </div>
                                        </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }

                        {value === 2 && 
                            <div className='tabPainel'>
                            adsadas
                            </div>
                        }
                    </Box>

                    <div className='buttons'>
                        <button onClick={handleOrigin} className='button'>Salvar</button>
                    </div>
                    </> : <></>}
                    </>}
                </div>
            </div>
        </Container>
        </>
    )
}

export default ItemModal;