import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { campainType, classeDataType, classeType, habilityDataType, subclassDataType } from '../../../../types';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { useLocation } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

type props = {
    classes: classeDataType[];
    toast: any;
    campain?: campainType;
    subclasses: subclassDataType[];
    habilities: habilityDataType[]
}

const Classes = ({classes, toast, campain, subclasses, habilities}: props) => {

    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';

    const [classSelected, setClassSelected] = useState<classeDataType>();

    const [isToAdd, setIsToAdd] = useState<boolean>(false);
    const [isToAddType, setIsToAddType] = useState<'import' | 'add'>();

    const [infoToAdd, setInfoToAdd] = useState<string>("");

    const [classesVerified, setClassesVerified] = useState<classeDataType[]>([]);
    const [classToImport, setClassToImport] = useState<classeDataType>();

    const [loading, setLoading] = useState<boolean>(false);

    const [classForm, setClassForm] = useState<classeType>({
        name: "",
        description: "",
        infos: [],
        life: {
            default: 0,
            perLevel: 0,
        },
        sanity: {
            default: 0,
            perLevel: 0,
        },
        pe: {
            default: 0,
            perLevel: 0,
        },
        perk: {
            beggining: 0,
            middle: 0,
            end: 0,
        },
        verified: true,
    });

    useEffect(() => {
        if(classSelected){
            setClassForm(classSelected.data);
            setIsToAdd(false);
            setIsToAddType(undefined);
        }
    }, [classSelected]);

    const handleClass = async () => {
        setLoading(true);
        if (isToAdd) {
            await addDoc(collection(db, "classes"), classForm).then(async (item) => {
                toast.success("Classe criada!");

                const userDocRef = doc(db, "campains", campainId ?? '');

                await updateDoc(userDocRef, {
                    classes: arrayUnion(item.id ?? ''),
                });
                setClassForm({
                    name: "",
                    description: "",
                    infos: [],
                    life: {
                        default: 0,
                        perLevel: 0,
                    },
                    sanity: {
                        default: 0,
                        perLevel: 0,
                    },
                    pe: {
                        default: 0,
                        perLevel: 0,
                    },
                    perk: {
                        beggining: 0,
                        middle: 0,
                        end: 0,
                    },
                });
            });

        } else {
            const userDocRef = doc(db, "classes", classSelected?.id ?? '');

            await updateDoc(userDocRef, classForm).then(() => {toast.success("Classe atualizada!")});
        }

        setLoading(false);
    }

    const prepareToAdd = () => {
        setClassForm({
            name: "",
            description: "",
            infos: [],
            life: {
                default: 0,
                perLevel: 0,
            },
            sanity: {
                default: 0,
                perLevel: 0,
            },
            pe: {
                default: 0,
                perLevel: 0,
            },
            perk: {
                beggining: 0,
                middle: 0,
                end: 0,
            },
        });
        setIsToAdd(true);
        setIsToAddType(undefined);
        setClassSelected(undefined);
    }

    const getClassesVerified = async () => {
         const p = query(
             collection(db, 'classes'),
             where('verified', '==', true),
             where('__name__', 'not-in', campain?.classes && campain?.classes.length > 0 ? campain?.classes : ['non'])
         );

         const querySnapshot = await getDocs(p);

         const classeArray = [] as classeDataType[];
         querySnapshot.forEach((doc) => {
             const data = {
                 id: doc.id,
                 data: doc.data(),
             } as classeDataType;
             classeArray.push(data);
         });

         const sorted = classeArray.sort((a, b) => a.data.name.localeCompare(b.data.name));

         setClassesVerified(sorted);
    }

    useEffect(() => {
        getClassesVerified();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const importClass = async () => {
        if (classToImport) {
            setLoading(true);
            const userDocRef = doc(db, "campains", campainId);

            await updateDoc(userDocRef, {
                classes: arrayUnion(classToImport.id),
            }).then(() => {
                toast.success("Classe importada!");
                setIsToAdd(true);
                setIsToAddType(undefined);
                setClassSelected(undefined);
                setLoading(false);
            });
        }
        
    }

    const handleDeleteClass = async () => {
        if (classSelected) {
            const docDelete = doc(db, "classes", classSelected.id);
            await deleteDoc(docDelete).then(() => {
                toast.success("Classe deletada!");
                setIsToAdd(true);
                setIsToAddType(undefined);
                setClassSelected(undefined);
                setLoading(false);
            });
        }
    }

    return (
        <>
        <Container>
            <div>
                <div className='left'>
                    {classes.map((i, key) => (
                        <button className={`${classSelected === i ? 'selected' : ''}`} key={key} onClick={() => setClassSelected(i)}>{i.data.name}</button>
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
                            {classesVerified.length > 0 &&
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
                            {classesVerified.map((item, key) => (
                                <div className={`itemImport ${classToImport === item ? 'selected' : ''}`} key={key} onClick={() => setClassToImport(item)}>
                                    <p>{item.data.name}</p>
                                    <span>{item.data.description}</span>
                                </div>
                            ))}
                        </div>
                        <div className='buttons'>
                            <button onClick={importClass}>Importar</button>
                        </div>
                    </div>
                    
                    </> : <>
                    {classSelected || (isToAdd && isToAddType === 'add') ? <>
                    <div className='name'>
                        <TextField id="standard-basic" label="Nome da classe" variant="filled" value={classForm.name} onChange={(e) => {
                            setClassForm({
                                ...classForm,
                                name: e.target.value
                            });
                        }} />
                    </div>
                    <div className='description'>
                        <TextField
                            id="standard-multiline-static"
                            label="Descrição da classe"
                            multiline
                            rows={2}
                            value={classForm.description}
                            variant="filled"
                            onChange={(e) => {
                                setClassForm({
                                    ...classForm,
                                    description: e.target.value
                                });
                            }}
                        />
                    </div>
                    <div className='infos'>
                        <div className='infoInput'>
                            <TextField id="standard-basic" label="Adicionar informação" variant="filled" value={infoToAdd} onChange={(e) => setInfoToAdd(e.target.value)} />
                            <button onClick={() => {
                                setClassForm({
                                    ...classForm,
                                    infos: [...classForm.infos, infoToAdd],
                                });
                                setInfoToAdd("");
                            }}>Adicionar</button>
                        </div>
                        <div className='infosList'>
                            {classForm.infos.map((info, keyInfo) => (
                                <div key={keyInfo}>
                                    <Chip label={info} variant="outlined" onDelete={() => {
                                        const newInfos = classForm.infos.filter((i) => i !== info);
                                        setClassForm({
                                            ...classForm,
                                            infos: newInfos,
                                        });
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='perks'>
                        <div className='titlePerk'>
                            <p>Pontos de pericias ganhos no nível:</p>
                        </div>
                        <div className='perksInputs'>
                            <TextField 
                                id="standard-basic" 
                                label="Nivel 0" 
                                type='number' 
                                variant="filled" 
                                value={classForm.perk.beggining}
                                size="small"
                                onChange={(e) => setClassForm({
                                    ...classForm,
                                    perk: {
                                        ...classForm.perk,
                                        beggining: Number(e.target.value),
                                    }
                                })} 
                            />
                            <TextField 
                                id="standard-basic" 
                                label="Nivel 7" 
                                type='number' 
                                variant="filled" 
                                value={classForm.perk.middle}
                                size="small" 
                                onChange={(e) => setClassForm({
                                    ...classForm,
                                    perk: {
                                        ...classForm.perk,
                                        middle: Number(e.target.value),
                                    }
                                })} 
                            />
                            <TextField 
                                id="standard-basic" 
                                label="Nivel 14" 
                                type='number' 
                                variant="filled" 
                                value={classForm.perk.end} 
                                size="small"
                                onChange={(e) => setClassForm({
                                    ...classForm,
                                    perk: {
                                        ...classForm.perk,
                                        end: Number(e.target.value),
                                    }
                                })} 
                            />
                        </div>
                    </div>

                    <div className='duo'>
                        <div className='titleDuo'>
                            <p>Pontos de vida</p>
                        </div>
                        <div className='duoInputs'>
                            <TextField 
                                id="standard-basic" 
                                label="Começar com" 
                                type='number' 
                                variant="filled" 
                                value={classForm.life.default}
                                size="small"
                                onChange={(e) => setClassForm({
                                    ...classForm,
                                    life: {
                                        ...classForm.life,
                                        default: Number(e.target.value),
                                    }
                                })} 
                            />
                            <TextField 
                                id="standard-basic" 
                                label="Ganho por nível" 
                                type='number' 
                                variant="filled" 
                                value={classForm.life.perLevel}
                                size="small" 
                                onChange={(e) => setClassForm({
                                    ...classForm,
                                    life: {
                                        ...classForm.life,
                                        perLevel: Number(e.target.value),
                                    }
                                })} 
                            />
                        </div>
                    </div>

                    <div className='duo'>
                        <div className='titleDuo'>
                            <p>Pontos de sanidade</p>
                        </div>
                        <div className='duoInputs'>
                            <TextField 
                                id="standard-basic" 
                                label="Começar com" 
                                type='number' 
                                variant="filled" 
                                value={classForm.sanity.default}
                                size="small"
                                onChange={(e) => setClassForm({
                                    ...classForm,
                                    sanity: {
                                        ...classForm.sanity,
                                        default: Number(e.target.value),
                                    }
                                })} 
                            />
                            <TextField 
                                id="standard-basic" 
                                label="Ganho por nível" 
                                type='number' 
                                variant="filled" 
                                value={classForm.sanity.perLevel}
                                size="small" 
                                onChange={(e) => setClassForm({
                                    ...classForm,
                                    sanity: {
                                        ...classForm.sanity,
                                        perLevel: Number(e.target.value),
                                    }
                                })} 
                            />
                        </div>
                    </div>

                    <div className='duo'>
                        <div className='titleDuo'>
                            <p>Pontos de esforço</p>
                        </div>
                        <div className='duoInputs'>
                            <TextField 
                                id="standard-basic" 
                                label="Começar com" 
                                type='number' 
                                variant="filled" 
                                value={classForm.pe.default}
                                size="small"
                                onChange={(e) => setClassForm({
                                    ...classForm,
                                    pe: {
                                        ...classForm.pe,
                                        default: Number(e.target.value),
                                    }
                                })} 
                            />
                            <TextField 
                                id="standard-basic" 
                                label="Ganho por nível" 
                                type='number' 
                                variant="filled" 
                                value={classForm.pe.perLevel}
                                size="small" 
                                onChange={(e) => setClassForm({
                                    ...classForm,
                                    pe: {
                                        ...classForm.pe,
                                        perLevel: Number(e.target.value),
                                    }
                                })} 
                            />
                        </div>
                    </div>
                    <div className='description'>
                        <FormControl variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">Alvo</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={classForm.habilityDefault ?? ""}
                                label="perícia"
                                variant="filled"
                                onChange={(e) => {
                                    setClassForm({
                                        ...classForm,
                                        habilityDefault: e.target.value
                                    });
                                }}
                            >
                                {habilities.map((item, key) => (
                                    <MenuItem value={item.id} key={key}>{item.data.name}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </div>
                    
                    <div className='buttons'>
                        {classSelected && 
                        <>
                            {subclasses.some(i => classSelected.id === i.data.classId) ? <>
                                <small className='warning'>Para deletar remova as subclasses!</small>
                            </> : <>
                                <button onClick={handleDeleteClass}>Excluir classe</button>
                            </>}
                            
                        </>
                        
                        }
                        
                        <button onClick={handleClass}>Salvar</button>
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

export default Classes;