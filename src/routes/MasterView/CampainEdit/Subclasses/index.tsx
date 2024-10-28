import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { campainType, classeDataType, subclassDataType, subclassHabilitiesType, subclassType } from '../../../../types';
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { ColorRing } from 'react-loader-spinner';
import TextField from '@mui/material/TextField';
import { Accordion, AccordionDetails, AccordionSummary, FormControl, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type props = {
    classes: classeDataType[];
    toast: any;
    campain?: campainType;
    subclasses: subclassDataType[];
}

const Subclasses = ({classes, subclasses, toast, campain}: props) => {

    const [subclassSelected, setSubclassSelected] = useState<subclassDataType>();

    const [isToAdd, setIsToAdd] = useState<boolean>(false);
    const [isToAddType, setIsToAddType] = useState<'import' | 'add'>();

    const [classToImport, setClassToImport] = useState<subclassDataType>();

    const [loading, setLoading] = useState<boolean>(false);

    const [subclassForm, setSubClassForm] = useState<subclassType>({
        name: "",
        description: "",
        classId: "",
        habilities: [],
    });

    const [habilityToAdd, setHabilityToAdd] = useState<subclassHabilitiesType>({
        name: "",
        description: "",
        level: 0,
    });

    const [subclassesVerified, setSubclassesVerified] = useState<subclassDataType[]>([]);

    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
        };

    const getClassesVerified = async () => {
        const p = query(
            collection(db, 'subclass'),
            where('verified', '==', true),
            where('classId', 'not-in', campain?.classes && campain?.classes.length > 0 ? campain?.classes : ['non']),
        );

        const querySnapshot = await getDocs(p);

        const subclasseArray = [] as subclassDataType[];
        querySnapshot.forEach((doc) => {
            const data = {
                id: doc.id,
                data: doc.data(),
            } as subclassDataType;
            subclasseArray.push(data);
        });

        const sorted = subclasseArray.sort((a, b) => a.data.name.localeCompare(b.data.name));

        setSubclassesVerified(sorted);
    }

    useEffect(() => {
        if (classes.length > 0) {
            getClassesVerified();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classes]);

    useEffect(() => {
        if(subclassSelected){
            setSubClassForm(subclassSelected.data);
            setIsToAdd(false);
            setIsToAddType(undefined);
        }
    }, [subclassSelected]);

    const prepareToAdd = () => {
        setSubClassForm({
            name: "",
            description: "",
            classId: "",
            habilities: []
        });
        setHabilityToAdd({
            name: "",
            description: "",
            level: 0,
        })
        setIsToAdd(true);
        setIsToAddType(undefined);
        setSubclassSelected(undefined);
    }

    const importSubclass = () => {

    }

    const handleSubclass = async () => {
        setLoading(true);
        if (isToAdd) {
            await addDoc(collection(db, "subclass"), subclassForm).then(() => {
                toast.success("Subclasse criada!");
                setSubClassForm({
                    name: "",
                    description: "",
                    classId: "",
                    habilities: []
                });
                setHabilityToAdd({
                    name: "",
                    description: "",
                    level: 0,
                })
            });

        } else {
            const userDocRef = doc(db, "subclass", subclassSelected?.id ?? '');

            await updateDoc(userDocRef, subclassForm).then(() => {toast.success("Subclasse atualizada!")});
        }

        setLoading(false);
    }   

    const handleAddHability = () => {
        if(habilityToAdd.name.length > 0 && habilityToAdd.description.length > 0) {
            setSubClassForm({
                ...subclassForm,
                habilities: [
                    ...subclassForm.habilities,
                    habilityToAdd,
                ]
            });
            setHabilityToAdd({
                name: "",
                description: "",
                level: 0,
            })
        }
    }

    return (
        <>
        <Container>
            <div>
                <div className='left'>
                    {subclasses.map((i, key) => (
                        <button className={`${subclassSelected === i ? 'selected' : ''}`} key={key} onClick={() => setSubclassSelected(i)}>{i.data.name}</button>
                    ))}
                    <button className='add' onClick={prepareToAdd}><i className="fa-solid fa-plus"></i> {classes.length <= 0 ? 'Adicionar classe' : ''}</button>
                </div>
                <div className={`right ${classes.length <= 0 && !isToAdd ? 'noClasses' : ''}`}>
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
                            {subclassesVerified.length > 0 &&
                                <button onClick={() => {
                                    setIsToAddType('import');
                                    getClassesVerified();
                                }}>Importar classe verificada</button>
                            }
                            <button onClick={() => {
                                setIsToAddType('add');
                            }}>Adicionar novo</button>
                        </div>
                    </>}

                    {isToAdd && isToAddType === 'import' ? <>
                    
                    <div className='import'>
                        <div className='titleImport'>
                            <p>Selecione a classe para importar</p>
                            <span>Esse processo irá importar as subclasses junto!</span>
                        </div>
                        <div className='importList'>
                            {subclassesVerified.map((item, key) => (
                                <div className={`itemImport ${classToImport === item ? 'selected' : ''}`} key={key} onClick={() => setClassToImport(item)}>
                                    <p>{item.data.name}</p>
                                    <span>{item.data.description}</span>
                                </div>
                            ))}
                        </div>
                        <div className='buttons'>
                            <button onClick={importSubclass}>Importar</button>
                        </div>
                    </div>
                    
                    </> : <>
                    {subclassSelected || (isToAdd && isToAddType === 'add') ? <>
                    <div className='name'>
                        <TextField 
                            id="standard-basic" 
                            label="Nome da classe" 
                            variant="filled" 
                            value={subclassForm.name} 
                            onChange={(e) => {  
                                setSubClassForm({
                                    ...subclassForm,
                                    name: e.target.value
                                });
                            }}
                        />
                    </div>
                    <div className='description'>
                        <TextField
                            id="standard-multiline-static"
                            label="Descrição da classe"
                            multiline
                            rows={2}
                            value={subclassForm.description}
                            onChange={(e) => {  
                                setSubClassForm({
                                    ...subclassForm,
                                    description: e.target.value
                                });
                            }}
                            variant="filled"
                        />
                    </div>
                    <div className='name'>
                        <FormControl variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">Classe</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={subclassForm.classId}
                                label="Classe"
                                variant="filled"
                                onChange={(e) => {  
                                    setSubClassForm({
                                        ...subclassForm,
                                        classId: e.target.value
                                    });
                                }}
                            >
                                {classes.map((i, key) => (
                                    <MenuItem key={key} value={i.id}>{i.data.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    <div className='hability'>
                        <div className='toAdd'>
                            <div className='titleHability'>
                                <p>Habilidades</p>
                            </div>
                            <div className='duo'>
                                <TextField 
                                    id="standard-basic" 
                                    label="Nome da habilidade" 
                                    variant="filled" 
                                    value={habilityToAdd.name} 
                                    onChange={(e) => {
                                        setHabilityToAdd({
                                            ...habilityToAdd,
                                            name: e.target.value
                                        })
                                    }}
                                />
                                <TextField 
                                    id="standard-basic" 
                                    label="Nivel de aquisição" 
                                    variant="filled" 
                                    value={habilityToAdd.level} 
                                    type='number' 
                                    onChange={(e) => {
                                        setHabilityToAdd({
                                            ...habilityToAdd,
                                            level: Number(e.target.value)
                                        })
                                    }}
                                />
                            </div>
                            <div className='description'>
                                <TextField
                                    id="standard-multiline-static"
                                    label="Descrição da habilidade"
                                    multiline
                                    rows={4}
                                    value={habilityToAdd.description}
                                    variant="filled"
                                    onChange={(e) => {
                                        setHabilityToAdd({
                                            ...habilityToAdd,
                                            description: e.target.value
                                        })
                                    }}
                                />
                            </div>
                            <div className='buttons'>
                                <button onClick={handleAddHability}>Adicionar</button>
                            </div>
                        </div>
                        {subclassForm.habilities.length > 0 &&
                            <div className='titleAddedHability'>
                                <p>Habilidades adicionadas</p>
                            </div>
                        }
                        
                        <div className='habilityList'>
                        {subclassForm.habilities.map((i, key) => (
                            <Accordion key={key} expanded={expanded === `key${key}`} onChange={handleChange(`key${key}`)}>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                                >
                                <Typography sx={{ width: '100%', flexShrink: 0 }}>
                                    {i.name} - Nível {i.level}
                                </Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                <Typography>
                                    <div className='duo'>
                                        <TextField 
                                            id="standard-basic" 
                                            label="Nome da habilidade" 
                                            variant="filled" 
                                            value={i.name}
                                            onChange={(e) => {
                                                const newHabilities = subclassForm.habilities.map((j) => {
                                                    let hab:subclassHabilitiesType;

                                                    if(j === i) {
                                                        hab = {
                                                            name: e.target.value,
                                                            level: j.level,
                                                            description: j.description
                                                        } as subclassHabilitiesType
                                                    } else {
                                                        hab = j;
                                                    }

                                                    return hab;
                                                });

                                                setSubClassForm({
                                                    ...subclassForm,
                                                    habilities: newHabilities
                                                });
                                            }}
                                        />
                                        <TextField 
                                            id="standard-basic" 
                                            label="Nível de aquisição" 
                                            variant="filled" 
                                            value={i.level} 
                                            type='number'
                                            onChange={(e) => {
                                                const newHabilities = subclassForm.habilities.map((j) => {
                                                    let hab:subclassHabilitiesType;

                                                    if(j === i) {
                                                        hab = {
                                                            name: j.name,
                                                            level: Number(e.target.value),
                                                            description: j.description
                                                        } as subclassHabilitiesType
                                                    } else {
                                                        hab = j;
                                                    }

                                                    return hab;
                                                });

                                                setSubClassForm({
                                                    ...subclassForm,
                                                    habilities: newHabilities
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className='description'>
                                        <TextField
                                            id="standard-multiline-static"
                                            label="Descrição da habilidade"
                                            multiline
                                            rows={4}
                                            value={i.description}
                                            variant="filled"
                                            onChange={(e) => {
                                                const newHabilities = subclassForm.habilities.map((j) => {
                                                    let hab:subclassHabilitiesType;

                                                    if(j === i) {
                                                        hab = {
                                                            name: j.name,
                                                            level: j.level,
                                                            description: e.target.value
                                                        } as subclassHabilitiesType
                                                    } else {
                                                        hab = j;
                                                    }

                                                    return hab;
                                                });

                                                setSubClassForm({
                                                    ...subclassForm,
                                                    habilities: newHabilities
                                                });
                                            }}
                                        />
                                    </div>
                                    <div className='remove'>
                                        <button onClick={() => {
                                            const newHability = subclassForm.habilities.filter((item) => item !== i);
                                            setSubClassForm({
                                                ...subclassForm,
                                                habilities: newHability,
                                            })
                                        }}>Remover</button>
                                    </div>
                                </Typography>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                        
                        </div>
                        
                    </div>
                    
                    <div className='buttons'>
                        <button onClick={handleSubclass}>Salvar</button>
                    </div>
                    </> : <></>}
                    </>}
                    </>}
                </div>
            </div>
        </Container>
        </>
    )
}

export default Subclasses;