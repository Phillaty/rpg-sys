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
import { elementDataType, magicDataType, magicType, magicTypeUpgrades } from '../../../../../types';
import { db } from '../../../../../firebase/firebase';
import { Box, Chip, Tab, Tabs } from '@mui/material';

type props = {
    toast: any;
    magicSelected?: magicDataType;
    elements: elementDataType[];
}

const MagicModal = ({toast, magicSelected, elements}: props) => {

    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';

    const [isToAdd, setIsToAdd] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [magicUpgradeToAdd, setMagicUpgradeToAdd] = useState<magicTypeUpgrades>({
        title: "",
        description: "",
        level: 1,
        peCost: 0,
    });

    const [value, setValue] = React.useState(0);

    const [magicForm, setMagicForm] = useState<magicType>({
        name: "",
        description: "",
        upgrades: [],
        element: {
            name: "",
            id: "",
        },
        circle: 1,
        campainId: "",
        duration: "",
        reach: "",
        target: "",
        execution: "",
    });

    useEffect(() => {
        if(magicSelected){
            setMagicForm(magicSelected.data);
            setIsToAdd(false);
        } else {
            prepareToAdd();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [magicSelected]);

    const handleMagic = async () => {
        const magicFormToGo = {
            name: magicForm.name,
            description: magicForm.description,
            campainId: campainId,
            circle: magicForm.circle,
            element: magicForm.element,
            verified: true,
            duration: magicForm.duration,
            reach: magicForm.reach,
            target: magicForm.target,
            execution: magicForm.execution,
            resistance: magicForm.resistance ?? "",
        } as magicType;

        if(!!magicForm.upgrades.length) magicFormToGo.upgrades = magicForm.upgrades;

        setLoading(true);
        if (isToAdd) {
            await addDoc(collection(db, "magics"), magicFormToGo).then(async (item) => {
                toast.success("Magia criada!");
                setMagicForm({
                    name: "",
                    description: "",
                    upgrades: [],
                    element: {
                        name: "",
                        id: "",
                    },
                    circle: 1,
                    campainId: "",
                    duration: "",
                    reach: "",
                    target: "",
                    execution: "",
                });
            });

        } else {
            const userDocRef = doc(db, "magics", magicSelected?.id ?? '');

            await updateDoc(userDocRef, magicForm).then(() => {toast.success("Magia atualizada!")});
        }

        setLoading(false);
    }

    const prepareToAdd = () => {
        setMagicForm({
            name: "",
            description: "",
            upgrades: [],
            element: {
                name: "",
                id: "",
            },
            circle: 1,
            campainId: "",
            duration: "",
            reach: "",
            target: "",
            execution: "",
        });
        setIsToAdd(true);
    }

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
                    {magicSelected || isToAdd ? <>

                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tabs value={value} aria-label="basic tabs example" centered>
                                <Tab label="Informações Básicas" onClick={() => setValue(0)} />
                                <Tab label="Buffs" onClick={() => setValue(1)} />
                            </Tabs>
                        </Box>
                        {value === 0 && 
                            <div className='tabPainel'>
                                <div className='one'>
                                    <TextField id="standard-basic" label="Nome do item" variant="filled" value={magicForm.name} onChange={(e) => {
                                        setMagicForm({
                                            ...magicForm,
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
                                        value={magicForm.description}
                                        onChange={(e) => {
                                            setMagicForm({
                                                ...magicForm,
                                                description: e.target.value
                                            });
                                        }}
                                        variant="filled"
                                    />
                                </div>
                                <div className='one'>
                                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                        <InputLabel id="demo-simple-select-filled-label">Elemento</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={magicForm.element?.id ?? ""}
                                            label="perícia"
                                            variant="filled"
                                            onChange={(e) => {
                                                const elementData = elements.find(i => i.id === e.target.value);
                                                setMagicForm({
                                                    ...magicForm,
                                                    element: {
                                                        name: elementData?.data?.name ?? "",
                                                        id: elementData?.id ?? "",
                                                        color: elementData?.data?.colors?.color ?? "",
                                                        backgroundColor: elementData?.data?.colors?.background ?? "",
                                                    }
                                                })
                                            }}
                                        >
                                            {elements.map((i, key) => (
                                                <MenuItem key={key} value={i.id}>{i.data.name}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='one'>
                                    <TextField id="standard-basic" label="Circulo da magia" type='number' variant="filled" value={magicForm.circle} onChange={(e) => {
                                        setMagicForm({
                                            ...magicForm,
                                            circle: Number(e.target.value)
                                        });
                                    }} />
                                </div>
                                <div className='duo'>
                                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                        <InputLabel id="demo-simple-select-filled-label">Duração</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={magicForm.duration ?? ""}
                                            label="perícia"
                                            variant="filled"
                                            onChange={(e) => {
                                                setMagicForm({
                                                    ...magicForm,
                                                    duration: e.target.value,
                                                })
                                            }}
                                        >
                                            <MenuItem value={"Cena"}>Cena</MenuItem>
                                            <MenuItem value={"Instantânea"}>Instantânea</MenuItem>
                                            <MenuItem value={"1 dia"}>1 dia</MenuItem>
                                            <MenuItem value={"Sustendada"}>Sustendada</MenuItem>
                                            <MenuItem value={"Até finalizar"}>Até finalizar</MenuItem>
                                            <MenuItem value={"Detalhe na descrição"}>Detalhe na descrição</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                        <InputLabel id="demo-simple-select-filled-label">Alcance</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={magicForm.reach ?? ""}
                                            label="perícia"
                                            variant="filled"
                                            onChange={(e) => {
                                                setMagicForm({
                                                    ...magicForm,
                                                    reach: e.target.value,
                                                })
                                            }}
                                        >
                                            <MenuItem value={"Pessoal"}>Pessoal</MenuItem>
                                            <MenuItem value={"Toque"}>Toque</MenuItem>
                                            <MenuItem value={"Médio"}>Médio</MenuItem>
                                            <MenuItem value={"Curto"}>Curto</MenuItem>
                                            <MenuItem value={"Longo"}>Longo</MenuItem>
                                            <MenuItem value={"1.5 m"}>1.5 m</MenuItem>
                                            <MenuItem value={"Ilimitado"}>Ilimitado</MenuItem>
                                            <MenuItem value={"Detalhe na descrição"}>Detalhe na descrição</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='duo'>
                                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                        <InputLabel id="demo-simple-select-filled-label">Alvo</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={magicForm.target ?? ""}
                                            label="perícia"
                                            variant="filled"
                                            onChange={(e) => {
                                                setMagicForm({
                                                    ...magicForm,
                                                    target: e.target.value,
                                                })
                                            }}
                                        >
                                            <MenuItem value={"1 pessoa"}>1 pessoa</MenuItem>
                                            <MenuItem value={"1 pessoa ou animal"}>1 pessoa ou animal</MenuItem>
                                            <MenuItem value={"Você"}>Você</MenuItem>
                                            <MenuItem value={"1 ser ou objeto"}>1 ser ou objeto</MenuItem>
                                            <MenuItem value={"1 ser"}>1 ser</MenuItem>
                                            <MenuItem value={"1 arma"}>1 arma</MenuItem>
                                            <MenuItem value={"Sem alvo"}>Sem alvo</MenuItem>
                                            <MenuItem value={"Detalhe na descrição"}>Detalhe na descrição</MenuItem>
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                        <InputLabel id="demo-simple-select-filled-label">Execução</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={magicForm.execution ?? ""}
                                            label="perícia"
                                            variant="filled"
                                            onChange={(e) => {
                                                setMagicForm({
                                                    ...magicForm,
                                                    execution: e.target.value,
                                                })
                                            }}
                                        >
                                            <MenuItem value={"Padrão"}>Padrão</MenuItem>
                                            <MenuItem value={"Completa"}>Completa</MenuItem>
                                            <MenuItem value={"Reação"}>Reação</MenuItem>
                                            <MenuItem value={"Livre"}>Livre</MenuItem>
                                            <MenuItem value={"Detalhe na descrição"}>Detalhe na descrição</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                                <div className='one'>
                                    <TextField id="standard-basic" label="Resistência" variant="filled" value={magicForm.resistance} onChange={(e) => {
                                        setMagicForm({
                                            ...magicForm,
                                            resistance: e.target.value
                                        });
                                    }} />
                                </div>
                                
                            </div>
                        }
                        {value === 1 && 
                            <div className='tabPainel'>
                                <div className='one'>
                                    <TextField id="standard-basic" defaultValue={1} label="Titulo do upgrade" variant="filled" value={magicUpgradeToAdd.title} onChange={(e) => {
                                        setMagicUpgradeToAdd({
                                            ...magicUpgradeToAdd,
                                            title: e.target.value
                                        });
                                    }} />
                                </div>
                                <div className='one'>
                                    <TextField
                                        id="standard-multiline-static"
                                        label="Descrição do item"
                                        multiline
                                        rows={2}
                                        value={magicUpgradeToAdd.description}
                                        onChange={(e) => {
                                            setMagicUpgradeToAdd({
                                                ...magicUpgradeToAdd,
                                                description: e.target.value
                                            });
                                        }}
                                        variant="filled"
                                    />
                                </div>
                                <div className='one'>
                                    <TextField id="standard-basic" label="Custo PE adicional (opcional)" type='number' variant="filled" value={magicUpgradeToAdd.peCost} onChange={(e) => {
                                        setMagicUpgradeToAdd({
                                            ...magicUpgradeToAdd,
                                            peCost: Number(e.target.value)
                                        });
                                    }} />
                                </div>
                                <div className='one buttons'>
                                    <button className='button' onClick={() => {
                                        const magicUpgradeToAddNew = {
                                            title: magicUpgradeToAdd.title,
                                            description: magicUpgradeToAdd.description,
                                            level: (magicForm.upgrades.length ?? 0) + 1,
                                        } as magicTypeUpgrades;

                                        if(!!magicUpgradeToAdd.peCost) magicUpgradeToAddNew.peCost = magicUpgradeToAdd.peCost;
                                        
                                        const newUp = magicForm.upgrades ?? [];

                                        newUp.push(magicUpgradeToAddNew);

                                        setMagicForm({
                                            ...magicForm,
                                            upgrades: newUp
                                        });
                                        setMagicUpgradeToAdd({
                                            title: "",
                                            description: "",
                                            level: 1,
                                            peCost: 0,
                                        });
                                    }}>Adicionar</button>
                                </div>
                                <div className='listMod'>
                                    {magicForm?.upgrades?.map((i, key) => (
                                        <div key={key} className='itemMod'>
                                            <div className='itemModName'>{i.title}</div>
                                            <div className='itemModLevel'><Chip label={`Nível ${i.level}`} color="primary" size='small' /></div>
                                            <div className='itemModLevel'><Chip label={`${i.peCost ? `${i.peCost} PE` : 'No cost'}`} color="warning" size='small' /></div>
                                            <div className='itemModDescription'>{i.description}</div>
                                            <div className='itemModButton'><button className='button remove' onClick={() => {
                                                const newMod = magicForm.upgrades.filter((j, keyJ) => key !== keyJ);
                                                setMagicForm({
                                                    ...magicForm,
                                                    upgrades: newMod,
                                                });
                                            }}>Remover</button></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        }
                    </Box>

                    <div className='buttons'>
                        <button onClick={handleMagic} className='button'>Salvar</button>
                    </div>
                    </> : <></>}
                    </>}
                </div>
            </div>
        </Container>
        </>
    )
}

export default MagicModal;