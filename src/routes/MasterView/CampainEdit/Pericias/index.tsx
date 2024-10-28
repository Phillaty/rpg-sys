import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { avatarDataType, campainType, perkDataType, perkType } from '../../../../types';
import TextField from '@mui/material/TextField';
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
    perks: perkDataType[];
    characters: avatarDataType[]
}

const Pericias = ({toast, campain, characters, perks}: props) => {

    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';

    const [perkSelected, setPerkSelected] = useState<perkDataType>();

    const [isToAdd, setIsToAdd] = useState<boolean>(false);
    const [isToAddType, setIsToAddType] = useState<'import' | 'add'>();

    const [perksVerified, setPerksVerified] = useState<perkDataType[]>([]);
    const [perkToImport, setPerkToImport] = useState<perkDataType>();

    const [loading, setLoading] = useState<boolean>(false);

    const [perkForm, setPerkForm] = useState<perkType>({
        base: "",
        name: "",
    });

    useEffect(() => {
        if(perkSelected){
            setPerkForm(perkSelected.data);
            setIsToAdd(false);
            setIsToAddType(undefined);
        }
    }, [perkSelected]);

    const handleOrigin = async () => {
        setLoading(true);
        if (isToAdd) {
            await addDoc(collection(db, "skills"), perkForm).then(async (item) => {
                toast.success("Perícia criada!");

                const userDocRef = doc(db, "campains", campainId ?? '');

                await updateDoc(userDocRef, {
                    origins: arrayUnion(item.id ?? ''),
                });
                setPerkForm({
                    base: "",
                    name: "",
                    verified: true,
                });
            });

        } else {
            const userDocRef = doc(db, "skills", perkSelected?.id ?? '');

            await updateDoc(userDocRef, perkForm).then(() => {toast.success("Perícia atualizada!")});
        }

        setLoading(false);
    }

    const prepareToAdd = () => {
        setPerkForm({
            base: "",
            name: "",
            verified: true,
        });
        setIsToAdd(true);
        setIsToAddType(undefined);
        setPerkSelected(undefined);
    }

    const getPerksVerified = async () => {
         const p = query(
             collection(db, 'skills'),
             where('verified', '==', true),
             where('__name__', 'not-in', campain?.skills && campain?.skills.length > 0 ? campain?.skills : ['non'])
         );

         const querySnapshot = await getDocs(p);

         const classeArray = [] as perkDataType[];
         querySnapshot.forEach((doc) => {
             const data = {
                 id: doc.id,
                 data: doc.data(),
             } as perkDataType;
             classeArray.push(data);
         });

         const sorted = classeArray.sort((a, b) => a.data.name.localeCompare(b.data.name));

         setPerksVerified(sorted);
    }

    useEffect(() => {
        getPerksVerified();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const importPerk = async () => {
        if (perkToImport) {
            setLoading(true);
            const userDocRef = doc(db, "campains", campainId);

            await updateDoc(userDocRef, {
                skills: arrayUnion(perkToImport.id),
            }).then(() => {
                toast.success("Perícia importada!");
                setIsToAdd(true);
                setIsToAddType(undefined);
                setPerkSelected(undefined);
                setLoading(false);
            });
        }
        
    }

    const handleDeleteClass = async () => {
        if (perkSelected) {
            const docDelete = doc(db, "origin", perkSelected.id);
            await deleteDoc(docDelete).then(() => {
                toast.success("Origem deletada!");
                setIsToAdd(true);
                setIsToAddType(undefined);
                setPerkSelected(undefined);
                setLoading(false);
            });
        }
    }

    return (
        <>
        <Container>
            <div>
                <div className='left'>
                    {perks.map((i, key) => (
                        <button className={`${perkSelected === i ? 'selected' : ''}`} key={key} onClick={() => setPerkSelected(i)}>{i.data.name}</button>
                    ))}
                    <button className='add' onClick={prepareToAdd}><i className="fa-solid fa-plus"></i> {perks.length <= 0 ? 'Adicionar classe' : ''}</button>
                </div>
                <div className={`right ${perks.length <= 0 && !isToAdd ? 'noClasses' : ''}`}>
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
                            {perksVerified.length > 0 &&
                                <button onClick={() => {
                                    setIsToAddType('import');
                                    getPerksVerified();
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
                            {perksVerified.map((item, key) => (
                                <div className={`itemImport ${perkToImport === item ? 'selected' : ''}`} key={key} onClick={() => setPerkToImport(item)}>
                                    <p>{item.data.name}</p>
                                    <span>{item.data.name}</span>
                                </div>
                            ))}
                        </div>
                        <div className='buttons'>
                            <button onClick={importPerk}>Importar</button>
                        </div>
                    </div>
                    
                    </> : <>
                    {perkSelected || (isToAdd && isToAddType === 'add') ? <>
                    <div className='name'>
                        <TextField id="standard-basic" label="Nome da origem" variant="filled" value={perkForm.name} onChange={(e) => {
                            setPerkForm({
                                ...perkForm,
                                name: e.target.value
                            });
                        }} />
                    </div>
                    <div className='description'>
                        <FormControl variant="filled" sx={{ minWidth: 120 }}>
                            <InputLabel id="demo-simple-select-filled-label">Selecionar base</InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={perkForm.base}
                                label="perícia"
                                variant="filled"
                                onChange={(e) => {
                                    setPerkForm({
                                        ...perkForm,
                                        base: e.target.value
                                    });
                                }}
                            >
                                <MenuItem value={"AGI"}>Agilidade</MenuItem>
                                <MenuItem value={"INT"}>Inteligência</MenuItem>
                                <MenuItem value={"VIG"}>Vigor</MenuItem>
                                <MenuItem value={"PRE"}>Presença</MenuItem>
                                <MenuItem value={"FOR"}>Força</MenuItem>
                            </Select>
                        </FormControl>
                    </div>                    
                    <div className='buttons'>
                        {perkSelected && 
                        <>
                            {characters.some(i => i.data.skill.some(j => j.perk === perkSelected.id) ) ? <>
                                <small className='warning'>Personagens utilizando perícia!</small>
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

export default Pericias;