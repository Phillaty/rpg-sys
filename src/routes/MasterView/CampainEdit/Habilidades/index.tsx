import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { avatarDataType, buffPerkType, buffPerkVantageType, classeDataType, habilityDataType, habilityType, perkDataType } from '../../../../types';
import TextField from '@mui/material/TextField';
import { addDoc, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { ColorRing } from 'react-loader-spinner';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Box, Tab, Tabs } from '@mui/material';
import { a11yProps } from '../../../../utils/components';

type props = {
    toast: any;
    habilities: habilityDataType[]
    characters: avatarDataType[];
    classes: classeDataType[];
    perks: perkDataType[];
}

const Habilidades = ({toast, characters, habilities, classes, perks}: props) => {

    const [habilitySelected, setHabilitySelected] = useState<habilityDataType>();

    const [isToAdd, setIsToAdd] = useState<boolean>(false);
    const [isToAddType, setIsToAddType] = useState<'import' | 'add'>();

    const [buffModPerkToAdd, setBuffModPerkToAdd] = useState<buffPerkType>({
        perkId: "",
        perkName: "",
        value: 0,
    });

    const [buffVantageToAdd, setBuffVantageToAdd] = useState<buffPerkVantageType>({
        perkId: "",
        perkName: "",
    });

    const [isToAddTotalPv, setIsToAddTotalPv] = useState<boolean>(false);
    const [isToAddPvPerLevel, setIsToAddPvPerLevel] = useState<boolean>(false);
    const [isToAddPerkBuff, setIsToAddPerkBuff] = useState<boolean>(false);
    const [isToAddVantage, setIsToAddVantage] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [habilityForm, setHabilityForm] = useState<habilityType>({
        classId: "",
        description: "",
        name: "",
        require: [],
        buff: {},
        type: "",
        verified: true,
    });

    useEffect(() => {
        if(habilitySelected){
            setHabilityForm(habilitySelected.data);
            setIsToAdd(false);
            setIsToAddType(undefined);
            setBuffModPerkToAdd({
                perkId: "",
                perkName: "",
                value: 0,
            });

            if(habilitySelected.data.buff?.lifePerLevel?.value) setIsToAddPvPerLevel(true);
                else setIsToAddPvPerLevel(false);
            if(habilitySelected.data.buff?.lifeTotal?.value) setIsToAddTotalPv(true);
                else setIsToAddTotalPv(false);
            if(!!habilitySelected.data.buff?.modifyRoll?.length) setIsToAddPerkBuff(true);
                else setIsToAddPerkBuff(false);
            if(!!habilitySelected.data.buff?.rollVantage?.length) setIsToAddVantage(true);
                else setIsToAddVantage(false);
        }
    }, [habilitySelected]);

    const handleHability = async () => {
        const newHabilityDataForm: habilityType = {
            classId: habilityForm.classId,
            description: habilityForm.description,
            name: habilityForm.name,
            require: habilityForm.require ?? [],
            buff: {
                rollVantage: isToAddVantage ? habilityForm.buff?.rollVantage : [],
                lifePerLevel: isToAddPvPerLevel ? habilityForm.buff?.lifePerLevel : Object(),
                lifeTotal: isToAddTotalPv ? habilityForm.buff?.lifeTotal : Object(),
                modifyRoll: isToAddPerkBuff ? habilityForm.buff?.modifyRoll : [] as unknown as buffPerkType[] | undefined,
            },
            type: habilityForm.type,
            verified: true,
        }

        setLoading(true);
        if (isToAdd) {
            await addDoc(collection(db, "hability"), newHabilityDataForm).then(async () => {
                toast.success("Habilidade criada!");
                setHabilityForm({
                    classId: "",
                    description: "",
                    name: "",
                    require: [],
                    buff: {},
                    type: "",
                    verified: true,
                });
                setBuffModPerkToAdd({
                    perkId: "",
                    perkName: "",
                    value: 0,
                });

                setIsToAddPvPerLevel(false);
                setIsToAddTotalPv(false);
                setIsToAddPerkBuff(false);
                setIsToAddVantage(false);
            });

        } else {
            const habilityDocRef = doc(db, "hability", habilitySelected?.id ?? '');

            await updateDoc(habilityDocRef, newHabilityDataForm).then(() => {toast.success("Habilidade atualizada!")});
        }

        setLoading(false);
    }

    const prepareToAdd = () => {
        setHabilityForm({
            classId: "",
            description: "",
            name: "",
            require: [],
            buff: {},
            type: "",
            verified: true,
        });
        setBuffModPerkToAdd({
            perkId: "",
            perkName: "",
            value: 0,
        });
        setIsToAddPvPerLevel(false);
        setIsToAddTotalPv(false);
        setIsToAddPerkBuff(false);
        setIsToAddVantage(false);
        setIsToAdd(true);
        setIsToAddType(undefined);
        setHabilitySelected(undefined);
    }

    const handleDeleteClass = async () => {
        if (habilitySelected) {
            const docDelete = doc(db, "origin", habilitySelected.id);
            await deleteDoc(docDelete).then(() => {
                toast.success("Origem deletada!");
                setIsToAdd(true);
                setIsToAddType(undefined);
                setHabilitySelected(undefined);
                setLoading(false);
            });
        }
    }

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
        <Container>
            <div>
                <div className='left'>
                    {habilities.map((i, key) => (
                        <button className={`${habilitySelected === i ? 'selected' : ''}`} key={key} onClick={() => setHabilitySelected(i)}>{i.data.name}</button>
                    ))}
                    <button className='add' onClick={prepareToAdd}><i className="fa-solid fa-plus"></i> {habilities.length <= 0 ? 'Adicionar classe' : ''}</button>
                </div>
                <div className={`right ${habilities.length <= 0 && !isToAdd ? 'noClasses' : ''}`}>
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
                    {isToAdd && !isToAddType && <>
                        <div className='isToAdd'>
                            <button onClick={() => {
                                setIsToAddType('add');
                            }}>Adicionar novo</button>
                        </div>
                    </>}
                    {habilitySelected || (isToAdd && isToAddType === 'add') ? <>
                    <div className='name'>
                        <TextField id="standard-basic" label="Nome da origem" variant="filled" value={habilityForm.name} onChange={(e) => {
                            setHabilityForm({
                                ...habilityForm,
                                name: e.target.value
                            });
                        }} />
                    </div>
                    <div className='description'>
                        <FormControl variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">Selecionar Classe</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={habilityForm.classId}
                                label="perícia"
                                variant="filled"
                                onChange={(e) => {
                                    setHabilityForm({
                                        ...habilityForm,
                                        classId: e.target.value
                                    });
                                }}
                            >
                                {classes.map((item, key) => (
                                    <MenuItem key={key} value={item.id}>{item.data.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>                 
                    <div className='description'>
                        <TextField
                            id="standard-multiline-static"
                            label="Descrição da origem"
                            multiline
                            rows={4}
                            value={habilityForm.description}
                            variant="filled"
                            onChange={(e) => {
                                setHabilityForm({
                                    ...habilityForm,
                                    description: e.target.value
                                });
                            }}
                        />
                    </div>   
                    <div className='description'>
                        <FormControl variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">Tipo</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={habilityForm.type}
                                label="perícia"
                                variant="filled"
                                onChange={(e) => {
                                    setHabilityForm({
                                        ...habilityForm,
                                        type: e.target.value
                                    });
                                }}
                            >
                                <MenuItem value={'active'}>Ativa</MenuItem>
                                <MenuItem value={'passive'}>Passiva</MenuItem>
                            </Select>
                        </FormControl>
                    </div>  

                    <div className='buffs'>
                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                <Tab label="Aumento de PV" {...a11yProps(0)} />
                                <Tab label="Vida por nível" {...a11yProps(1)} />
                                <Tab label="Buff Perícia" {...a11yProps(2)} />
                                <Tab label="Vantagem" {...a11yProps(3)} />
                                </Tabs>
                            </Box>
                            {value === 0 && <>
                                <div className='buffItem'>
                                    {isToAddTotalPv ? <>
                                        <div className='itembuffContainer'>
                                            <TextField id="standard-basic" type='number' label="Valor adicional no pontos de vida" variant="filled" value={habilityForm.buff?.lifeTotal?.value ?? 0} onChange={(e) => {
                                                setHabilityForm({
                                                    ...habilityForm,
                                                    buff: {
                                                        ...habilityForm.buff,
                                                        lifeTotal: {
                                                            value: Number(e.target.value ?? 0)
                                                        }
                                                    }
                                                });
                                            }} />

                                            <button onClick={() => setIsToAddTotalPv(false)} className='remove'>Remover Buff</button>
                                        </div>
                                    </> : <>
                                        <button onClick={() => setIsToAddTotalPv(true)}>Adicionar aumento de PV</button>
                                    </>}                                    
                                </div>
                            </>}
                            {value === 1 && <>
                                <div className='buffItem'>
                                    {isToAddPvPerLevel ? <>
                                        <div className='itembuffContainer'>
                                            <TextField id="standard-basic" type='number' label="Valor adicional nos pontos de vida ao subir de nível" variant="filled" value={habilityForm.buff?.lifePerLevel?.value ?? 0} onChange={(e) => {
                                                setHabilityForm({
                                                    ...habilityForm,
                                                    buff: {
                                                        ...habilityForm.buff,
                                                        lifePerLevel: {
                                                            value: Number(e.target.value ?? 0)
                                                        }
                                                    }
                                                });
                                            }} />

                                            <button onClick={() => setIsToAddPvPerLevel(false)} className='remove'>Remover Buff</button>
                                        </div>
                                    </> : <>
                                        <button onClick={() => setIsToAddPvPerLevel(true)}>Adicionar vida por nível</button>
                                    </>}
                                </div>
                            </>}
                            {value === 2 && <>
                                <div className='buffItem'>
                                    {isToAddPerkBuff ? <>
                                        <div className='itembuffContainer'>
                                            <div className='inputs'>
                                                <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                                    <InputLabel id="demo-simple-select-filled-label">Perícia</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={buffModPerkToAdd.perkId ? JSON.stringify({id: buffModPerkToAdd.perkId, name: buffModPerkToAdd.perkName}) : ""}
                                                        label="perícia"
                                                        variant="filled"
                                                        onChange={(e) => {
                                                            setBuffModPerkToAdd({
                                                                ...buffModPerkToAdd,
                                                                perkId: JSON.parse(e.target.value ?? "").id ?? "",
                                                                perkName: JSON.parse(e.target.value ?? "").name ?? ""
                                                            });
                                                        }}
                                                    >
                                                        {perks.map((i, key) => (
                                                            <MenuItem key={key} value={JSON.stringify({id: i.id, name: i.data.name})}>{i.data.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <TextField id="standard-basic" type='number' label="Valor da modificação no dado" variant="filled" value={buffModPerkToAdd.value} onChange={(e) => {
                                                    setBuffModPerkToAdd({
                                                        ...buffModPerkToAdd,
                                                        value: Number(e.target.value)
                                                    });
                                                }} />

                                                <button onClick={() => {
                                                    setHabilityForm({
                                                        ...habilityForm,
                                                        buff: {
                                                            ...habilityForm.buff,
                                                            modifyRoll: [
                                                                ...habilityForm.buff?.modifyRoll ?? [],
                                                                buffModPerkToAdd,
                                                            ],
                                                        }
                                                    });
                                                    setBuffModPerkToAdd({
                                                        perkId: "",
                                                        perkName: "",
                                                        value: 0,
                                                    })
                                                }}>Addicionar</button>
                                            </div>

                                            <div className='perkBuffList'>
                                                {habilityForm.buff?.modifyRoll?.map((i, key) => (
                                                    <div className='perkBuffListItem'>
                                                        <div>
                                                            <label>Nome da perícia</label>
                                                            <p>{i.perkName}</p>
                                                        </div>
                                                        <div>
                                                            <label>Valor da modificação</label>
                                                            <p>+{i.value}</p>
                                                        </div>
                                                        <div>
                                                            <button className='remove' onClick={(j) => {
                                                                const newModifyRoll = habilityForm.buff?.modifyRoll?.filter(k => k.perkId !== i.perkId);
                                                                setHabilityForm({
                                                                    ...habilityForm,
                                                                    buff: {
                                                                        ...habilityForm.buff,
                                                                        modifyRoll: newModifyRoll,
                                                                    }
                                                                })
                                                            }}>Remover</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <button onClick={() => setIsToAddPerkBuff(false)} className='remove'>Remover todos os buffs</button>
                                        </div>
                                    </> : <>
                                        <button onClick={() => setIsToAddPerkBuff(true)}>Adicionar modificador em perícia</button>
                                    </>}
                                </div>
                            </>}
                            {value === 3 && <>
                                <div className='buffItem'>
                                    {isToAddVantage ? <>
                                        <div className='itembuffContainer'>
                                            <div className='inputs inputsOne'>
                                                <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                                    <InputLabel id="demo-simple-select-filled-label">Perícia</InputLabel>
                                                    <Select
                                                        labelId="demo-simple-select-label"
                                                        id="demo-simple-select"
                                                        value={buffVantageToAdd.perkId ? JSON.stringify({id: buffVantageToAdd.perkId, name: buffVantageToAdd.perkName}) : ""}
                                                        label="perícia"
                                                        variant="filled"
                                                        onChange={(e) => {
                                                            setBuffVantageToAdd({
                                                                perkId: JSON.parse(e.target.value ?? "").id ?? "",
                                                                perkName: JSON.parse(e.target.value ?? "").name ?? ""                                                            
                                                            });
                                                        }}
                                                    >
                                                        {perks.map((i, key) => (
                                                            <MenuItem key={key} value={JSON.stringify({id: i.id, name: i.data.name})}>{i.data.name}</MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                                <button onClick={() => {
                                                    setHabilityForm({
                                                        ...habilityForm,
                                                        buff: {
                                                            ...habilityForm.buff,
                                                            rollVantage: [
                                                                ...habilityForm.buff?.rollVantage ?? [],
                                                                buffVantageToAdd,
                                                            ],
                                                        }
                                                    });
                                                    setBuffVantageToAdd({
                                                        perkId: "",
                                                        perkName: "",
                                                    })
                                                }}>Addicionar</button>
                                            </div>
                                            <div className='perkBuffList'>
                                                {habilityForm.buff?.rollVantage?.map((i, key) => (
                                                    <div className='perkBuffListItem'>
                                                        <div>
                                                            <label>Nome da perícia</label>
                                                            <p>{i.perkName}</p>
                                                        </div>
                                                        <div>
                                                            <button className='remove' onClick={(j) => {
                                                                const newModifyRoll = habilityForm.buff?.modifyRoll?.filter(k => k.perkId !== i.perkId);
                                                                setHabilityForm({
                                                                    ...habilityForm,
                                                                    buff: {
                                                                        ...habilityForm.buff,
                                                                        rollVantage: newModifyRoll,
                                                                    }
                                                                })
                                                            }}>Remover</button>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <button onClick={() => setIsToAddVantage(false)} className='remove'>Remover Buff</button>
                                        </div>
                                    </> : <>
                                        <button onClick={() => setIsToAddVantage(true)}>Adicionar Vantagem</button>
                                    </>}
                                </div>
                            </>}
                        </Box>
                    </div>
                    
                    <div className='buttons'>
                        {habilitySelected && 
                        <>
                            {characters.some(i => i.data.hability.some(j => j === habilitySelected.id) ) ? <>
                                <small className='warning'>Personagens utilizando Habilidade!</small>
                            </> : <>
                                <button onClick={handleDeleteClass}>Excluir Habilidade</button>
                            </>}
                            
                        </>
                        
                        }
                        
                        <button onClick={handleHability}>Salvar</button>
                    </div>
                    </> : <></>}
                    </>}
                </div>
            </div>
        </Container>
        </>
    )
}

export default Habilidades;