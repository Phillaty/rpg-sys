import React, {  useEffect, useState } from 'react';
import { Container } from './styles';
import { entityDataType, entityType } from '../../../../types';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { ColorRing } from 'react-loader-spinner';
import { Accordion, AccordionDetails, AccordionSummary, Box, FormControl, InputLabel, MenuItem, Select, Tab, Tabs, TextField, Typography } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { a11yProps } from '../../../../utils/components';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Dices } from '../../../../constants';

type props = {
    toast: any;
    entity: entityDataType[];
}

const Entity = ({toast, entity}: props) => {
    
    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';

    const [loading, setLoading] = useState<boolean>(false);

    const [entitySelected, setEntitySelected] = useState<entityDataType>();

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChangetab =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

    const [entityForm, setEntityForm] = useState<entityType>({
        name: "",
        description: "",
        senses: {
            perseption: 0,
            iniciative: 0,
        },
        defense: 0,
        life: 0,
        attributes: {
            AGI: 0,
            FOR: 0,
            INT: 0,
            PRE: 0,
            VIG: 0,
        },
        perks: [],
        walkDistance: 0,
        actions: [],
        campainId: '',
        resistence: '',
    });

    const [entityActionForm, setEntityActionForm] = useState<{
        title: string;
        description: string;
        testMod?: number;
        mod?: number;
        type: 'padrao' | 'livre' | 'bonus' | 'completa' | 'passiva';
        damageRoll: number[];
        damageMod: number;
    }>({
        title: "",
        description: "",
        testMod: 0,
        mod: 0,
        type: "padrao",
        damageRoll: [],
        damageMod: 0,
    });

    const [entityPerkForm, setEntityPerkForm] = useState<{
        name: string;
        mod: number;
    }>({
        name: "",
        mod: 0,
    });

    const [isToAdd, setIsToAdd] = useState<boolean>(false);

    const handleEntity = async () => {
        setLoading(true);
        if (isToAdd) {
            await addDoc(collection(db, "entity"), {
                ...entityForm,
                campainId: campainId ?? ''
            }).then(async () => {
                toast.success("Entidade criada!");

                setEntityForm({
                    name: "",
                    description: "",
                    senses: {
                        perseption: 0,
                        iniciative: 0,
                    },
                    defense: 0,
                    life: 0,
                    attributes: {
                        AGI: 0,
                        FOR: 0,
                        INT: 0,
                        PRE: 0,
                        VIG: 0,
                    },
                    perks: [],
                    walkDistance: 0,
                    actions: [],
                    campainId: '',
                    resistence: '',
                });
            });

        } else {
            const userDocRef = doc(db, "entity", entitySelected?.id ?? '');

            await updateDoc(userDocRef, entityForm).then(() => {toast.success("Entidade atualizada!")});
        }

        setLoading(false);
    }

    // const handleDeleteClass = async () => {
    //     if (magicSelected) {

    //         const newMagics = char.find(i => i.id === magicSelected.playerId)?.data.magics?.filter(i => i !== magicSelected.entityForm);

    //         const userDocRef = doc(db, "character", magicSelected?.playerId ?? '');
    //         await updateDoc(userDocRef, {
    //             magics: newMagics,
    //         }).then(async () => {
    //             toast.success("Magia removida do jogador!");
    //         });
    //     }
    // }

    const prepareToAdd = () => {
        setIsToAdd(true);
        setEntityForm({
            name: "",
            description: "",
            senses: {
                perseption: 0,
                iniciative: 0,
            },
            defense: 0,
            life: 0,
            attributes: {
                AGI: 0,
                FOR: 0,
                INT: 0,
                PRE: 0,
                VIG: 0,
            },
            perks: [],
            walkDistance: 0,
            actions: [],
            campainId: '',
            resistence: ''
        });
        setEntitySelected(undefined);
    }

    useEffect(() => {
        if(entitySelected){
            setEntityForm(entitySelected.data);
            setIsToAdd(false);
        }
    }, [entitySelected]);

    return (
        <>
        <Container>
            <div>
                <div className='left'>
                    <button className='add' onClick={prepareToAdd}><i className="fa-solid fa-plus"></i> {entity.length <= 0 ? 'Adicionar classe' : ''}</button>
                    {entity.map((i, key) => (
                        <button className={`${entitySelected?.id === i.id ? 'selected' : ''}`} key={key} onClick={() => {
                            setEntitySelected(i);
                        }}>{i.data.name}</button>
                    ))}
                </div>
                <div className={`right ${entity.length <= 0 && !isToAdd ? 'noClasses' : ''}`}>
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
                    {entitySelected || isToAdd  ? <>

                        <Box sx={{ width: '100%' }}>
                            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                    <Tab label="Informações básicas" {...a11yProps(0)} />
                                    <Tab label="Perícias" {...a11yProps(1)} />
                                    <Tab label="Ações" {...a11yProps(2)} />
                                </Tabs>
                            </Box>
                            {value === 0 && 
                                <div className='tab'>
                                    <div className='description'>
                                        <TextField id="standard-basic" label="Nome" variant="filled" value={entityForm.name} onChange={(e) => {
                                            setEntityForm({
                                                ...entityForm,
                                                name: e.target.value
                                            });
                                        }} />
                                    </div>
                                    <div className='description'>
                                        <TextField id="standard-basic" label="Descrição" variant="filled" value={entityForm.description} onChange={(e) => {
                                            setEntityForm({
                                                ...entityForm,
                                                description: e.target.value
                                            });
                                        }} />
                                    </div>
                                    <div className='description'>
                                        <TextField id="standard-basic" label="Perspectiva" type='number' variant="filled" value={entityForm.senses.perseption} onChange={(e) => {
                                            setEntityForm({
                                                ...entityForm,
                                                senses: {
                                                    ...entityForm.senses,
                                                    perseption: Number(e.target.value),
                                                }
                                                
                                            });
                                        }} />
                                        <TextField id="standard-basic" label="Iniciativa" type='number' variant="filled" value={entityForm.senses.iniciative} onChange={(e) => {
                                            setEntityForm({
                                                ...entityForm,
                                                senses: {
                                                    ...entityForm.senses,
                                                    iniciative: Number(e.target.value),
                                                }
                                            });
                                        }} />
                                    </div>
                                    <div className='description'>
                                        <TextField id="standard-basic" label="Defense" type='number' variant="filled" value={entityForm.defense} onChange={(e) => {
                                            setEntityForm({
                                                ...entityForm,
                                                defense: Number(e.target.value)
                                            });
                                        }} />
                                        <TextField id="standard-basic" label="Vida Max" type='number' variant="filled" value={entityForm.life} onChange={(e) => {
                                            setEntityForm({
                                                ...entityForm,
                                                life: Number(e.target.value)
                                            });
                                        }} />
                                    </div>
                                    <div className='description'>
                                        <TextField id="standard-basic" label="AGI" type='number' variant="filled" value={entityForm.attributes.AGI} onChange={(e) => {
                                            setEntityForm({
                                                ...entityForm,
                                                attributes: {
                                                    ...entityForm.attributes,
                                                    AGI: Number(e.target.value),
                                                }
                                            });
                                        }} />
                                        <TextField id="standard-basic" label="INT" type='number' variant="filled" value={entityForm.attributes.INT} onChange={(e) => {
                                            setEntityForm({
                                                ...entityForm,
                                                attributes: {
                                                    ...entityForm.attributes,
                                                    INT: Number(e.target.value),
                                                }
                                            });
                                        }} />
                                        <TextField id="standard-basic" label="VIG" type='number' variant="filled" value={entityForm.attributes.VIG} onChange={(e) => {
                                            setEntityForm({
                                                ...entityForm,
                                                attributes: {
                                                    ...entityForm.attributes,
                                                    VIG: Number(e.target.value),
                                                }
                                            });
                                        }} />
                                        <TextField id="standard-basic" label="PRE" type='number' variant="filled" value={entityForm.attributes.PRE} onChange={(e) => {
                                            setEntityForm({
                                                ...entityForm,
                                                attributes: {
                                                    ...entityForm.attributes,
                                                    PRE: Number(e.target.value),
                                                }
                                            });
                                        }} />
                                        <TextField id="standard-basic" label="FOR" type='number' variant="filled" value={entityForm.attributes.FOR} onChange={(e) => {
                                            setEntityForm({
                                                ...entityForm,
                                                attributes: {
                                                    ...entityForm.attributes,
                                                    FOR: Number(e.target.value),
                                                }
                                            });
                                        }} />
                                    </div>
                                    <div className='description'>
                                        <TextField id="standard-basic" label="Deslocamento (m)" type='number' variant="filled" value={entityForm.walkDistance} onChange={(e) => {
                                            setEntityForm({
                                                ...entityForm,
                                                walkDistance: Number(e.target.value)
                                            });
                                        }} />
                                    </div>
                                    <div className='description'>
                                        <TextField id="standard-basic" label="Resistência" variant="filled" value={entityForm.resistence} onChange={(e) => {
                                            setEntityForm({
                                                ...entityForm,
                                                resistence: e.target.value
                                            });
                                        }} />
                                    </div>
                                </div>
                            }
                            {value === 1 && 
                                <>
                                <div className='tab'>
                                    <div className='description'>
                                        <TextField id="standard-basic" label="Nome da ação" variant="filled" value={entityPerkForm.name} onChange={(e) => {
                                            setEntityPerkForm({
                                                ...entityPerkForm,
                                                name: e.target.value
                                            });
                                        }} />
                                    </div>
                                    <div className='description'>
                                        <TextField id="standard-basic" label="Modificação de dado" type='number' variant="filled" value={entityPerkForm.mod} onChange={(e) => {
                                            setEntityPerkForm({
                                                ...entityPerkForm,
                                                mod: Number(e.target.value)
                                            });
                                        }} />
                                    </div>
                                    <div className='buttons'>
                                        <button onClick={() => {
                                            setEntityForm({
                                                ...entityForm,
                                                perks: [
                                                    ...entityForm.perks,
                                                    entityPerkForm
                                                ]
                                            })
                                        }}>Adicionar perícia</button>
                                    </div>
                                </div>

                                <div>
                                    {entityForm.perks.map((item, key) => (
                                        <Accordion expanded={expanded === `painel-actions-${key}`} onChange={handleChangetab(`painel-actions-${key}`)}>
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                            >
                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                    {item.name}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    <p><b>Perk</b></p>
                                                    {item.name}
                                                    <p><b>Dado</b></p>
                                                    d20 + {item.mod}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}

                                </div>
                                </>
                            }
                            {value === 2 && 
                                <>
                                <div className='tab'>
                                    <div className='description'>
                                        <TextField id="standard-basic" label="Nome da ação" variant="filled" value={entityActionForm.title} onChange={(e) => {
                                            setEntityActionForm({
                                                ...entityActionForm,
                                                title: e.target.value
                                            });
                                        }} />
                                    </div>
                                    <div className='description'>
                                        <TextField id="standard-basic" label="Descrição" variant="filled" value={entityActionForm.description} onChange={(e) => {
                                            setEntityActionForm({
                                                ...entityActionForm,
                                                description: e.target.value
                                            });
                                        }} />
                                    </div>
                                    <div className='description'>
                                        <TextField id="standard-basic" label="Dado de teste" type='number' variant="filled" value={entityActionForm.testMod} onChange={(e) => {
                                            setEntityActionForm({
                                                ...entityActionForm,
                                                testMod: Number(e.target.value)
                                            });
                                        }} />
                                        <TextField id="standard-basic" label="modificação do teste" type='number' variant="filled" value={entityActionForm.mod} onChange={(e) => {
                                            setEntityActionForm({
                                                ...entityActionForm,
                                                mod: Number(e.target.value)
                                            });
                                        }} />
                                    </div>
                                    <div className='description'>
                                        <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                            <InputLabel id="demo-simple-select-filled-label">Alcance</InputLabel>
                                            <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={entityActionForm.type ?? ""}
                                                label="perícia"
                                                variant="filled"
                                                onChange={(e) => {
                                                    setEntityActionForm({
                                                        ...entityActionForm,
                                                        type: e.target.value as 'padrao' | 'livre' | 'bonus' | 'completa' | 'passiva',
                                                    })
                                                }}
                                            >
                                                <MenuItem value={"padrao"}>Ação padrão</MenuItem>
                                                <MenuItem value={"livre"}>Ação livre</MenuItem>
                                                <MenuItem value={"bonus"}>Ação bonus</MenuItem>
                                                <MenuItem value={"completa"}>Ação completa</MenuItem>
                                                <MenuItem value={"passiva"}>Passiva</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </div>
                                    <div>
                                        <div className='addDices'>
                                            <div className='title'>Adicionar dados de dano</div>
                                            <div className='dices'>
                                                {Dices.map((i, key) => (
                                                    <button key={key} onClick={(e) => {
                                                        let dmgBase: number[] = [];

                                                        if(entityActionForm.damageRoll)
                                                            dmgBase = entityActionForm.damageRoll;

                                                        dmgBase.push(i);

                                                        setEntityActionForm({
                                                            ...entityActionForm,
                                                            damageRoll: dmgBase,
                                                        });
                                                    }}>{i}</button>
                                                ))}
                                            </div>
                                            {!!entityActionForm.damageRoll.length && 
                                            <div className='dicesAdded'>
                                                <div>Dados adicionados: {entityActionForm.damageRoll.join(', ')}</div>
                                                <div>
                                                    <button className='button remove' onClick={() => {
                                                        setEntityActionForm({
                                                            ...entityActionForm,
                                                            damageRoll: [],
                                                        });
                                                    }}>Limpar</button>
                                                </div>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                    <div>
                                        <div className='addDices'>
                                            <div className='title'>Adicionar modificadores</div>
                                            <div className='dices'>
                                                {[1,2,3,4,5,6,7,8,9,10].map((i, key) => (
                                                    <button key={key} onClick={(e) => {
                                                        setEntityActionForm({
                                                            ...entityActionForm,
                                                            damageMod: i
                                                        });
                                                    }}>{i}</button>
                                                ))}
                                            </div>
                                            {!!entityActionForm.damageMod && 
                                            <div className='dicesAdded'>
                                                <div>Modificador: {entityActionForm.damageMod}</div>
                                                <div>
                                                    <button className='button remove' onClick={() => {
                                                        setEntityActionForm({
                                                            ...entityActionForm,
                                                            damageMod: 0
                                                        });
                                                    }}>Limpar</button>
                                                </div>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                    <div className='buttons'>
                                        <button onClick={() => {
                                            setEntityForm({
                                                ...entityForm,
                                                actions: [
                                                    ...entityForm.actions,
                                                    entityActionForm
                                                ]
                                            })
                                        }}>Adicionar ação</button>
                                    </div>
                                </div>

                                <div>
                                    {entityForm.actions.map((item, key) => (
                                        <Accordion expanded={expanded === `painel-actions-${key}`} onChange={handleChangetab(`painel-actions-${key}`)}>
                                            <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                            aria-controls="panel1bh-content"
                                            id="panel1bh-header"
                                            >
                                                <Typography sx={{ width: '33%', flexShrink: 0 }}>
                                                    {item.title}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Typography>
                                                    <p><b>Descrição</b></p>
                                                    {item.description}
                                                    <p><b>Dados</b></p>
                                                    d{item.testMod} + {item.mod}
                                                    <p><b>Tipo</b></p>
                                                    {item.type}
                                                </Typography>
                                            </AccordionDetails>
                                        </Accordion>
                                    ))}

                                </div>
                                </>
                            }
                            
                        </Box>
                    
                    
                    
                    <div className='buttons'>
                        {/* {entitySelected && <><button onClick={handleDeleteClass}>Excluir magia do usuário</button></>} */}
                        <button onClick={handleEntity}>Salvar</button>
                    </div>
                    </> : <></>}
                    </>}
                </div>
            </div>
        </Container>
        </>
    )
}

export default Entity;