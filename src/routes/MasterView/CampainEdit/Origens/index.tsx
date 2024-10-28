import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { avatarDataType, campainType, originDataType, originType, perkDataType } from '../../../../types';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { addDoc, arrayUnion, collection, deleteDoc, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { useLocation } from 'react-router-dom';
import { ColorRing } from 'react-loader-spinner';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type props = {
    toast: any;
    campain?: campainType;
    origins: originDataType[];
    perks: perkDataType[];
    characters: avatarDataType[]
}

const Origens = ({toast, campain, origins, perks, characters}: props) => {

    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';

    const [originSelected, setOriginSelected] = useState<originDataType>();

    const [isToAdd, setIsToAdd] = useState<boolean>(false);
    const [isToAddType, setIsToAddType] = useState<'import' | 'add'>();

    const [infoToAdd, setInfoToAdd] = useState<string>("");

    const [originsVerified, setOriginsVerified] = useState<originDataType[]>([]);
    const [originToImport, setOriginToImport] = useState<originDataType>();

    const [loading, setLoading] = useState<boolean>(false);

    const [originForm, setOriginForm] = useState<originType>({
        title: "",
        description: "",
        bonus: {
            skill: [],
        },
        verified: true,
    });

    useEffect(() => {
        if(originSelected){
            setOriginForm(originSelected.data);
            setIsToAdd(false);
            setIsToAddType(undefined);
        }
    }, [originSelected]);

    const handleOrigin = async () => {
        setLoading(true);
        if (isToAdd) {
            await addDoc(collection(db, "origin"), originForm).then(async (item) => {
                toast.success("Origem criada!");

                const userDocRef = doc(db, "campains", campainId ?? '');

                await updateDoc(userDocRef, {
                    origins: arrayUnion(item.id ?? ''),
                });
                setOriginForm({
                    title: "",
                    description: "",
                    bonus: {
                        skill: [],
                    },
                    verified: true,
                });
            });

        } else {
            const userDocRef = doc(db, "origin", originSelected?.id ?? '');

            await updateDoc(userDocRef, originForm).then(() => {toast.success("Origem atualizada!")});
        }

        setLoading(false);
    }

    const prepareToAdd = () => {
        setOriginForm({
            title: "",
            description: "",
            bonus: {
                skill: [],
            },
            verified: true,
        });
        setIsToAdd(true);
        setIsToAddType(undefined);
        setOriginSelected(undefined);
    }

    const getOriginsVerified = async () => {
         const p = query(
             collection(db, 'origin'),
             where('verified', '==', true),
             where('__name__', 'not-in', campain?.origins && campain?.origins.length > 0 ? campain?.origins : ['non'])
         );

         const querySnapshot = await getDocs(p);

         const classeArray = [] as originDataType[];
         querySnapshot.forEach((doc) => {
             const data = {
                 id: doc.id,
                 data: doc.data(),
             } as originDataType;
             classeArray.push(data);
         });

         const sorted = classeArray.sort((a, b) => a.data.title.localeCompare(b.data.title));

         setOriginsVerified(sorted);
    }

    useEffect(() => {
        getOriginsVerified();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const importOrigin = async () => {
        if (originToImport) {
            setLoading(true);
            const userDocRef = doc(db, "campains", campainId);

            await updateDoc(userDocRef, {
                origins: arrayUnion(originToImport.id),
            }).then(() => {
                toast.success("Classe importada!");
                setIsToAdd(true);
                setIsToAddType(undefined);
                setOriginSelected(undefined);
                setLoading(false);
            });
        }
        
    }

    const handleDeleteClass = async () => {
        if (originSelected) {
            const docDelete = doc(db, "origin", originSelected.id);
            await deleteDoc(docDelete).then(() => {
                toast.success("Origem deletada!");
                setIsToAdd(true);
                setIsToAddType(undefined);
                setOriginSelected(undefined);
                setLoading(false);
            });
        }
    }

    return (
        <>
        <Container>
            <div>
                <div className='left'>
                    {origins.map((i, key) => (
                        <button className={`${originSelected === i ? 'selected' : ''}`} key={key} onClick={() => setOriginSelected(i)}>{i.data.title}</button>
                    ))}
                    <button className='add' onClick={prepareToAdd}><i className="fa-solid fa-plus"></i> {origins.length <= 0 ? 'Adicionar classe' : ''}</button>
                </div>
                <div className={`right ${origins.length <= 0 && !isToAdd ? 'noClasses' : ''}`}>
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
                            {originsVerified.length > 0 &&
                                <button onClick={() => {
                                    setIsToAddType('import');
                                    getOriginsVerified();
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
                            <p>Selecione a origem para importar</p>
                        </div>
                        <div className='importList'>
                            {originsVerified.map((item, key) => (
                                <div className={`itemImport ${originToImport === item ? 'selected' : ''}`} key={key} onClick={() => setOriginToImport(item)}>
                                    <p>{item.data.title}</p>
                                    <span>{item.data.description}</span>
                                </div>
                            ))}
                        </div>
                        <div className='buttons'>
                            <button onClick={importOrigin}>Importar</button>
                        </div>
                    </div>
                    
                    </> : <>
                    {originSelected || (isToAdd && isToAddType === 'add') ? <>
                    <div className='name'>
                        <TextField id="standard-basic" label="Nome da origem" variant="filled" value={originForm.title} onChange={(e) => {
                            setOriginForm({
                                ...originForm,
                                title: e.target.value
                            });
                        }} />
                    </div>
                    <div className='description'>
                        <TextField
                            id="standard-multiline-static"
                            label="Descrição da origem"
                            multiline
                            rows={4}
                            value={originForm.description}
                            variant="filled"
                            onChange={(e) => {
                                setOriginForm({
                                    ...originForm,
                                    description: e.target.value
                                });
                            }}
                        />
                    </div>
                    <div className='infos'>
                        <div className='infoInput'>

                            <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-filled-label">Adicionar perícia</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={infoToAdd}
                                    label="perícia"
                                    variant="filled"
                                    onChange={(e) => {  
                                        setInfoToAdd(e.target.value);
                                    }}
                                >
                                    {perks.map((i, key) => (
                                        <MenuItem key={key} value={i.data.name}>{i.data.name}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            
                            <button onClick={() => {
                                setOriginForm({
                                    ...originForm,
                                    bonus: {
                                        skill: [...originForm.bonus.skill, infoToAdd]
                                    },
                                });
                                setInfoToAdd("");
                            }}>Adicionar</button>
                        </div>
                        <div className='infosList'>
                            {originForm.bonus.skill.map((info, keyInfo) => (
                                <div key={keyInfo}>
                                    <Chip label={info} variant="outlined" onDelete={() => {
                                        const newInfos = originForm.bonus.skill.filter((i) => i !== info);
                                        setOriginForm({
                                            ...originForm,
                                            bonus: {
                                                skill: newInfos
                                            },
                                        });
                                    }} />
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className='buttons'>
                        {originSelected && 
                        <>
                            {characters.some(i => i.data.originId === originSelected.id) ? <>
                                <small className='warning'>Personagens utilizando origem!</small>
                            </> : <>
                                <button onClick={handleDeleteClass}>Excluir classe</button>
                            </>}
                            
                        </>
                        
                        }
                        
                        <button onClick={handleOrigin}>Salvar</button>
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

export default Origens;