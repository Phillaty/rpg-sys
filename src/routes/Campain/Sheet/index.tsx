import React, { useEffect, useState } from 'react';
import { Container, ContainerHability, ContainerHealth, ContainerMagics } from './styles';
import { alertType, avatarDataType, campainType, classeDataType, documentDataType, elementDataType, habilityDataType, habilityTranscendedDataType, itemDataType, magicDataType, rollModType, subclassDataType } from '../../../types';
import logo from '../../../imgs/profile-user-icon-2048x2048-m41rxkoe.png';
import { skillFiltr, skillTy } from '..';
import Roll from '../../../commom/ROLL';
import { getAttrubuteMod, getPercentage } from '../../../utils';
import SheetDetails from './SheetDetails';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { useLocation, useNavigate } from 'react-router-dom';
import Modal from '../../../commom/Modal';
import Backpack from './Backpack';
import { Accordion, AccordionDetails, AccordionSummary, Alert, Avatar, Box, Button, Card, CardActions, CardContent, Chip, Dialog, DialogContent, IconButton, Stack, TextField, Typography } from '@mui/material';
import { toast, ToastContainer } from 'react-toastify';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

type prop = {
    charcater?: avatarDataType;
    campain?: campainType;
    skills: skillFiltr;
    skillsAll: skillTy[];
}

const Sheet = ({ charcater, campain, skills, skillsAll }: prop) => {

    const location = useLocation();
    const navigate = useNavigate();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const [wentFromCreate, setWentFromCreate] = useState<boolean>(Boolean(urlParams.get('wentFromCreate')));

    const campainId = urlParams.get('camp') ?? '';

    const [dice, setdice] = useState<number[]>();
    const [diceMod, setdiceMod] = useState<rollModType[]>();

    const [dicePers, setdicePers] = useState<number[]>([]);
    const [dicePersMod, setdicePersMod] = useState<rollModType[]>();
    const [dicePersToRoll, setdicePersToRoll] = useState<number[]>();
    
    const [showSheetDetails, setShowSheetDetails] = useState<boolean>(false);
    const [isToCloseSheet, setIsToCloseSheet] = useState<boolean>(false);

    const [habilities, setHabilities] = useState<habilityDataType[]>([]);
    const [habilityTranscended, setHabilityTranscended] = useState<habilityTranscendedDataType[]>([]);
    const [subclasses, setSubclasses] = useState<subclassDataType[]>([]);
    const [magics, setMagics] = useState<magicDataType[]>([]);
    const [magicsFiltered, setMagicsFiltered] = useState<magicDataType[]>([]);
    const [elements, setElements] = useState<elementDataType[]>([]);
    const [classChar, setClassChar] = useState<classeDataType>();

    const [habilitiesChar, setHabilitiesChar] = useState<habilityDataType[]>();

    const [charSubclass, setCharSubclass] = useState<subclassDataType>();

    const [backpackModal, setBackpackModal] = useState<boolean>(false);

    const [healthModal, sethealthModal] = useState<boolean>(false);

    const [magicModal, setMagicModal] = useState<boolean>(false);

    const [habilityModal, setHabilityModal] = useState<boolean>(false);
    const [habilitySelected, setHabilitySelected] = useState<habilityDataType>();

    const [documentsModal, setDocumentsModal] = useState<boolean>(false);
    const [documentViewModal, setDocumentViewModal] = useState<boolean>(false);
    const [selectedDocument, setSelectedDocument] = useState<documentDataType | null>(null);
    const [documents, setDocuments] = useState<documentDataType[]>([]);
    const [imageZoom, setImageZoom] = useState<number>(1);
    const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState<boolean>(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

    const [itemsAll, setItemsALL] = useState<itemDataType[]>([]);
    const [itemsCharInventory, setItemsCharInventory] = useState<itemDataType[]>([]);

    const [itensGeral, setItensGeral] = useState<itemDataType[]>([]);
    const [itensWeapon, setItensWeapon] = useState<itemDataType[]>([]);
    const [itensArmadure, setItensArmadure] = useState<itemDataType[]>([]);

    const [magicModalFilter, setMagicModalFilter] = useState<string>("");

    const [lifeValue, setlifeValue] = useState<number>();
    const [sanityValue, setsanityValue] = useState<number>();
    const [peValue, setPeValue] = useState<number>();
    const [cyberValue, setCyberValue] = useState<number>();

    const [alertsList, setAlertsList] = useState<alertType[]>([]);

    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChangeTagMagic =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
        setExpanded(isExpanded ? panel : false);
    };

    const handleCloseDicePer = () => {
        setdicePers([]);
        setdicePersMod([]);
        setdicePersToRoll([]);
    }

    const handleCloseSheet = () => {
        setIsToCloseSheet(true);

        setTimeout(() => {
            setShowSheetDetails(false);
            setIsToCloseSheet(false);
        }, 500);
    }

    const handleCloseBackpack = () => {
        setBackpackModal(false);
    }

    const handleCloseHability = () => {
        setHabilityModal(false);
        setHabilitySelected(undefined);
    }

    const handleCloseHealth = () => {
        sethealthModal(false);
        setlifeValue(undefined);
        setsanityValue(undefined);
        setPeValue(undefined);
        setCyberValue(undefined);
    }

    const handleCloseMagics = () => {
        setMagicModal(false);
    }

    const handleCloseDocuments = () => {
        setDocumentsModal(false);
    }

    const handleCloseDocumentView = () => {
        setDocumentViewModal(false);
        setSelectedDocument(null);
        setImageZoom(1);
        setImagePosition({ x: 0, y: 0 });
        setIsDragging(false);
    }

    const handleViewDocument = (document: documentDataType) => {
        setSelectedDocument(document);
        setDocumentViewModal(true);
    }

    const handleZoomIn = () => {
        setImageZoom(prev => Math.min(prev + 0.25, 3));
    }

    const handleZoomOut = () => {
        setImageZoom(prev => Math.max(prev - 0.25, 0.5));
    }

    const handleResetZoom = () => {
        setImageZoom(1);
        setImagePosition({ x: 0, y: 0 });
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        if (imageZoom > 1) {
            setIsDragging(true);
            setDragStart({
                x: e.clientX - imagePosition.x,
                y: e.clientY - imagePosition.y
            });
        }
    }

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && imageZoom > 1) {
            setImagePosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    }

    const handleMouseUp = () => {
        setIsDragging(false);
    }

    useEffect(() => {
        if(habilitySelected) {
            setHabilityModal(true);
        } else {
            setHabilityModal(false);
        }
    }, [habilitySelected])

    const removeWentFromCreateParam = () => {
        urlParams.delete('wentFromCreate');
        navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
        setWentFromCreate(false);
    };

    useEffect(() => {
        if (wentFromCreate) {
            setShowSheetDetails(true);
            removeWentFromCreateParam();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if(charcater && charcater?.data?.class?.id) {
            const allHabilities = new Map<string, habilityDataType>();
            let completedQueries = 0;
            const totalQueries = 2;

            const updateHabilities = () => {
                completedQueries++;
                if (completedQueries === totalQueries) {
                    const habilitiesData = Array.from(allHabilities.values());
                    setHabilities(habilitiesData);
                }
            };

            // Query 1: Habilidades por classe
            const qClass = query(
                collection(db, 'hability'),
                where('classId', '==', charcater.data.class.id)
            );

            const unsubscribeClass = onSnapshot(qClass, (querySnapshot) => {
                querySnapshot.docs.forEach(doc => {
                    allHabilities.set(doc.id, {
                        id: doc.id,
                        data: doc.data(),
                    } as habilityDataType);
                });
                updateHabilities();
            });

            // Query 2: Habilidades específicas do personagem (se existirem)
            let unsubscribeChar: (() => void) | undefined;
            if (charcater.data.hability && charcater.data.hability.length > 0) {
                const qChar = query(
                    collection(db, 'hability'),
                    where('__name__', 'in', charcater.data.hability)
                );

                unsubscribeChar = onSnapshot(qChar, (querySnapshot) => {
                    querySnapshot.docs.forEach(doc => {
                        allHabilities.set(doc.id, {
                            id: doc.id,
                            data: doc.data(),
                        } as habilityDataType);
                    });
                    updateHabilities();
                });
            } else {
                // Se não há habilidades específicas, marca esta query como completa
                updateHabilities();
            }

            // Cleanup function
            return () => {
                unsubscribeClass();
                if (unsubscribeChar) unsubscribeChar();
            };
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [charcater, campain]);

    // Separate useEffect for transcended abilities
    useEffect(() => {
        if (campain?.habilityTrans && campain.habilityTrans.length > 0) {
            const qTrans = query(
                collection(db, 'habilityTrans'),
                where('__name__', 'in', campain.habilityTrans),
            );

            const unsubscribe = onSnapshot(qTrans, (querySnapshot) => {
                const habilityTranscendedData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })) as habilityTranscendedDataType[];
                
                setHabilityTranscended(habilityTranscendedData);
            });

            return unsubscribe;
        } else {
            setHabilityTranscended([]);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [charcater, campain]);

    useEffect(() => {
        if(campain && charcater) {
            const p = query(
                collection(db, 'subclass'),
                where('classId', 'in', campain?.classes)
            );

            onSnapshot(p, (querySnapshot) => {
                const subclassData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })) as subclassDataType[];

                if (charcater?.data.subclass) {
                    const findCharSubclass = subclassData.find((i) => i.id === charcater?.data.subclass.id);

                    findCharSubclass && setCharSubclass(findCharSubclass);
                }
                
                setSubclasses(subclassData);
            });
        }
    }, [campain, charcater]);

    useEffect(() => {
        const body = document.getElementById('body');
        if (showSheetDetails && skills) {
            if(body)
                body.classList.add('modalOn');
        } else {
            if(body)
                body.classList.remove('modalOn');
        }
    }, [showSheetDetails, skills]);

    useEffect(() => {
        if (charcater && habilities) {
            const habilitiesFind = habilities.filter((i) => charcater?.data?.hability?.some((j) => j === i.id));
            const sorted = habilitiesFind.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setHabilitiesChar(sorted);
        }
    }, [charcater, habilities]);

    const getItems = async () => {
        const p = query(
            collection(db, 'item'),
            where('campainId', '==', campainId)
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as itemDataType[];

            const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setItemsALL(sorted);
        });
    }

    const getMagics = async () => {
        const p = query(
            collection(db, 'magics'),
            where('__name__', 'in', charcater?.data.magics)
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as magicDataType[];

            const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setMagics(sorted);
        });
    }

    const getElements = async () => {
        const p = query(
            collection(db, 'elements'),
            where('__name__', 'in', campain?.elements)
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as elementDataType[];

            const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setElements(sorted);
        });
    }

    const getClass = async () => {
        const docRef = doc(db, 'classes', charcater?.data?.class?.id ?? "");

        onSnapshot(docRef, (querySnapshot) => {
            const docData = {
                id: querySnapshot.id,
                data: querySnapshot.data(),
            } as classeDataType;
            setClassChar(docData);
        });
    }

    const getDocuments = async () => {
        if (!charcater?.id) return;
        
        const p = query(
            collection(db, 'documents'),
            where('characterId', '==', charcater.id)
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as documentDataType[];

            const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setDocuments(sorted);
        });
    }

    useEffect(() => {
        if(charcater && !!charcater?.data.magics?.length) {
            getMagics();
            getElements();
        } 

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [charcater])

    useEffect(() => {
        if(charcater) {
            getDocuments();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [charcater])

    useEffect(() => {
        if(campainId) {
            getItems();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campainId]);

    useEffect(() => {
        if(magics) {
            let filtermagicget = magics;
           
            if(magicModalFilter) {
                filtermagicget = magics.filter((i) => i.data.element.id === magicModalFilter);
            }
          
          
          setMagicsFiltered(filtermagicget)
        }
    }, [magics, magicModalFilter])

    useEffect(() => {
        if(charcater && charcater.data?.class?.id){
            getClass();
        }

        if(charcater) {
            let warnings:alertType[] = [];

            if(charcater.data.unlock.levelPoint > 0) warnings.push({message: "Você pode subir de nível! Abra a ficha completa para continuar", type: 'info'});
            if(charcater.data.unlock.attributePoints > 0) warnings.push({message: "Você tem pontos de atributos! Abra a ficha completa para continuar", type: 'info'});
            if(charcater.data.unlock.habilityPoints > 0) warnings.push({message: "Você tem pontos de habilidade! Abra a ficha completa para continuar", type: 'info'});
            if(charcater.data.unlock.perkPoints > 0) warnings.push({message: "Você tem pontos de perícia! Abra a ficha completa para continuar", type: 'info'});

            if(warnings.length > 0) setAlertsList(warnings);
            else setAlertsList([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [charcater])

    useEffect(() => {
        if (itemsAll) {
            const chatItensGet = itemsAll.filter((i) => i.data.position.idGetter === charcater?.id);

            setItemsCharInventory(chatItensGet);

            const geralItenGet = chatItensGet.filter((i) => !['weapon', 'armadure'].includes(i.data.type));
            const weaponsItenGet = chatItensGet.filter((i) => ['weapon'].includes(i.data.type));
            const armadureItenGet = chatItensGet.filter((i) => ['armadure'].includes(i.data.type));

            setItensGeral(geralItenGet);
            setItensWeapon(weaponsItenGet);
            setItensArmadure(armadureItenGet);
        }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [itemsAll]);

    const handleRollBackpack = (dices: number[], mods: rollModType[]) => {
        if(dices.length > 0) {
            if(mods.length > 0)setdiceMod(mods);

            setdice(dices);

            handleCloseBackpack();
        }
    }

    const handleRoll = (item: skillTy, aditionalMod?: rollModType) => {
        let totalModify:rollModType[] = [];

        if (item.expertise) {
            totalModify = [{
                type: 'pericia',
                name: `${item.name} Nível ${item.expertise}`,
                roll: item.expertise + item.expertise,
            } as rollModType];
        }

        if (aditionalMod) totalModify.push(aditionalMod);

        const totalDice = [20];

        if(!!habilitiesChar) {
            habilitiesChar.forEach((i) => {
                i.data.buff?.modifyRoll?.forEach((j) => {
                    if(j.perkId === item.id && i.data.type === "passive") totalModify.push({
                        type: 'habilidade',
                        name: i.data.name,
                        roll: j.value,
                    } as rollModType);
                })
            });

            habilitiesChar.forEach((i) => {
                i.data.buff?.rollVantage?.forEach((j) => {
                    if(j.perkId === item.id && i.data.type === "passive") totalDice.push(20);
                })
            });
        }

        if(itemsCharInventory.length > 0) {
            itemsCharInventory.forEach((i) => {
                if(i.data.buff?.modifyRoll) {
                    i.data.buff?.modifyRoll.forEach((j) => {
                        if(j.perkId === item.id) totalModify.push({
                            type: 'item',
                            name: i.data.name,
                            roll: j.value,
                        } as rollModType);
                    })
                }
            })
        }

        if(charcater){
            const attributeMod = getAttrubuteMod(item.base ?? '', charcater?.data);
            if (attributeMod && attributeMod !== 0) {
                totalModify.push({
                    type: 'atributo',
                    name: item.base,
                    roll: attributeMod,
                } as rollModType);
            }
        }

        setdiceMod(totalModify);
        setdice(totalDice);
    }

    const handleHealth = async (type: 'life' | 'pe' | 'sanity' | 'cyberpsicosy', value: number, option: 'add' | 'remove' ) => {
        const userDocRef = doc(db, "character", charcater?.id ?? '');

        let total = option === 'add' ? (charcater?.data.basics[type].actual ?? 0) + value : (charcater?.data.basics[type].actual ?? 0) - value;

        if (total > (charcater?.data.basics[type].max ?? 0)) total = (charcater?.data.basics[type].max ?? 0);
        if (total < 0) total = 0;

        await updateDoc(userDocRef, {
            basics: {
                ...charcater?.data.basics,
                [type]: {
                    max: charcater?.data.basics[type].max ?? 0,
                    actual: total,
                }
            }
        }).then(() => {
            toast.success("Saúde editada!");
            handleCloseHealth();
        });
        
    }

    useEffect(() => {
        if (!!itemsCharInventory.length && charcater) {
            const weightTotalBackpack = itemsCharInventory.reduce((a, b) => a + b.data.weight, 0);

            if(charcater?.data.slotManagement?.actual !== weightTotalBackpack) {
                const userDocRef = doc(db, "character", charcater?.id ?? '');
                updateDoc(userDocRef, {
                    slotManagement: {
                        ...charcater?.data.slotManagement,
                        actual: weightTotalBackpack,
                    }
                });
            }
        }
    }, [itemsCharInventory, charcater]);

    return (
        <>
            <Container>
                {!!alertsList.length &&
                    <div className='warnings'>
                        <Stack sx={{ width: '100%' }} spacing={1}>
                            {alertsList.map((i, key) => (
                                <Alert severity={i.type} key={key}>{i.message}</Alert>
                            ))}
                        </Stack>
                    </div>
                }
                <div className='topInfo'>
                    <div className='buttonsChar'>
                        <button className='sheet' onClick={() => {setShowSheetDetails(true)}}><i className="fa-solid fa-address-book"></i> Ficha completa</button>
                    </div>
                    <div className='charInfo'>
                        <div className='charimage'>
                            <span>
                                <Avatar src={charcater?.data.img ?? logo} sx={{ width: 100, height: 100 }} />
                            </span>
                        </div>
                        <div className='charInfos'>
                            <p className='name'>{charcater?.data.name}</p>
                            <div className='info'>
                                <p>{charcater?.data?.class?.title && `${charcater?.data?.class?.title} -`} nível {charcater?.data.level}</p>
                            </div>
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
                                <span style={{ width: `${getPercentage(charcater?.data.basics.pe.max ?? 0, charcater?.data.basics.pe.actual ?? 0)}%` }}></span>
                                <p>{charcater?.data.basics.pe.actual}/{charcater?.data.basics.pe.max}</p>
                            </div>
                        </div>
                    }
                
                    <div className='editHealth'>
                        <button onClick={() => sethealthModal(true)}>Gerenciar saúde</button>
                    </div>
                </div>
                <div className='rollPers'>
                    <div className='title'>
                        <p>Rolagem personalizadas</p>
                    </div>
                    <div className='buttons'>
                        <p>Adicionar dado: </p>
                        <div>
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
                    </div>
                    {dicePers.length > 0 && 
                        <>
                            <div className='buttons'>
                                <p>Adicionar modificações: </p>
                                <div>
                                    <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: -5} as rollModType])}}>-5</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: -4} as rollModType])}}>-4</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: -3} as rollModType])}}>-3</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: -2} as rollModType])}}>-2</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: -1} as rollModType])}}>-1</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: 1} as rollModType])}}>+1</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: 2} as rollModType])}}>+2</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: 3} as rollModType])}}>+3</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: 4} as rollModType])}}>+4</button>
                                    <button onClick={() => {setdicePersMod([...dicePersMod ?? [], {type: 'pers', name: 'Personalizado', roll: 5} as rollModType])}}>+5</button>
                                </div>
                            </div>
                    
                            <div className='preVisuTitle'><p>Dados para rolagem</p></div>
                            {dicePersMod && dicePersMod?.length > 0 && 
                                <div className='preVisuMod'>
                                    <div className='dicesPerMod'>
                                        <p>Modificações:</p>
                                        {dicePersMod?.map((mod, keyMod) => (
                                            <div key={keyMod} onClick={(() => {
                                                const newDices = dicePersMod.filter((i, index) => index !== keyMod);
                                                setdicePersMod(newDices);
                                            })}><span className='diceitem'>{mod.roll >= 0 ? '+' : ''}{mod.roll}</span><span className='error'><i className="fa-solid fa-xmark"></i></span></div>
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
                                    setdicePersToRoll(dicePers);
                                }}>Rolar</button></div>
                            </div>
                        </>
                    }
                </div>
                {!!itensWeapon.length && 
                    <div className='weapons'>
                        <div className='weaponList'>
                            {itensWeapon.map((item, key) => (
                                <div className='itemWeapon' key={key}>
                                    <p>{item.data.name}</p>
                                    <p>Dano: 
                                        [d{item.data.weaponConfigs?.damage?.base?.join(', d')}] {' '}
                                        {item.data.weaponConfigs?.damage?.mod && <>
                                            + {item.data.weaponConfigs?.damage?.mod.join(' + ')}
                                        </>} | {item.data.weaponConfigs?.crit?.roll ?? 20}/{item.data.weaponConfigs?.crit?.multiply ?? 2}x
                                    </p>
                                    <div>
                                        <button className='test' onClick={() => {
                                            
                                            const getPerkItem = skillsAll.find(i => i.name === (item.data.weaponConfigs?.type === 'melee' ? 'Luta' : 'Pontaria'));
                                            if(getPerkItem) handleRoll(getPerkItem);

                                        }}>{item.data.weaponConfigs?.type === 'melee' ? 'Luta': 'Pontaria'}</button>

                                        <button className='dmg' onClick={() => {
                                            
                                            item.data.weaponConfigs?.damage?.mod?.forEach((i) => {
                                                setdiceMod([
                                                    ...diceMod ?? [],
                                                    {
                                                        type: 'damage',
                                                        name: 'Dano adicional',
                                                        roll: i,
                                                    } as rollModType
                                                ]);
                                            })
                                                

                                            setdice(item.data.weaponConfigs?.damage?.base);
                                        }}>Dano normal</button>

                                        <button className='dmg crit' onClick={() => {
                                            item.data.weaponConfigs?.damage?.mod?.forEach((i) => {
                                                setdiceMod([
                                                    ...diceMod ?? [],
                                                    {
                                                        type: 'damage',
                                                        name: 'Dano adicional',
                                                        roll: i,
                                                    } as rollModType
                                                ]);
                                            })
                                            
                                            const dicesDmg: number[] = []
                                            for (let index = 0; index < (item.data.weaponConfigs?.crit?.multiply ?? 2); index++) {
                                                item.data.weaponConfigs?.damage?.base?.forEach(element => {
                                                    dicesDmg.push(element);
                                                });
                                            }
                                            setdice(dicesDmg);
                                        }}>Dano crítico</button>
                                    </div>
                                    
                                </div>
                            ))}
                            
                        </div>
                    </div>
                }
                <div className='buttonsInventory'>
                    {!!magics.length &&
                    <button className='magics' onClick={() => {setMagicModal(true)}}><i className="fa-solid fa-wand-magic-sparkles"></i> Magias</button>
                    }
                    {!!itemsCharInventory.length &&
                    <button className='backpack' onClick={() => {setBackpackModal(true)}}><i className="fa-solid fa-list"></i> Mochila {itemsCharInventory.length > 0 ? `(${itemsCharInventory.length})` : ''}</button>
                    }
                    <button className='documents' onClick={() => {setDocumentsModal(true)}}><i className="fa-solid fa-folder-open"></i> Documentos {documents.length > 0 ? ` (${documents.length})` : ''}</button>
                </div>
                {!!habilitiesChar?.length && 
                    <div className='habilities'>
                        <div className='habilityTitle'>Habilidades ativas <small>Clique para ver mais</small></div>
                        <div className='habilityList'>
                            {habilitiesChar?.map((item, key) => (
                                <div className='habilityItem' key={key} onClick={() => setHabilitySelected(item)}>{item.data.name}</div>
                            ))}
                        </div>
                    </div>
                }
                <div className='skill'>
                    <div className='skillItems'>
                        <div>
                            <p>Pericias treinadas</p>
                            <div className='skillsgrid'>
                                {skills.trained?.map((item, key) => (
                                    <div key={key} className='itemSkill' onClick={() => {
                                        handleRoll(item);
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
                                        handleRoll(item);
                                    }}>
                                        {item.name}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </Container>

            {dice && 
                <Roll dice={dice} mod={diceMod} setdice={setdice} setdiceMod={setdiceMod} discord={campain?.discord} char={charcater?.data} />
            }
            {dicePersToRoll && dicePersToRoll.length > 0 &&
                <Roll dice={dicePersToRoll} mod={dicePersMod} setdice={setdicePersToRoll} setdiceMod={setdicePersMod} onClose={() => {handleCloseDicePer()}} discord={campain?.discord} char={charcater?.data} />
            }

            {showSheetDetails && skills && 
                <SheetDetails 
                    isToCloseSheet={isToCloseSheet} 
                    charcater={charcater} 
                    campain={campain} 
                    skills={skills} 
                    skillsAll={skillsAll} 
                    onClose={handleCloseSheet}
                    habilities={habilities}
                    habilityTranscended={habilityTranscended}
                    subclasses={subclasses}
                    charSubclass={charSubclass}
                    classChar={classChar}
                    toast={toast}
                />
            }
            
            <Modal isOpen={backpackModal} handleCloseModal={handleCloseBackpack} >
                <Backpack wheight={charcater?.data.slotManagement.max} itens={itemsCharInventory} itensArmadure={itensArmadure} itensGeral={itensGeral} itensWeapon={itensWeapon} handleRollBackpack={handleRollBackpack} toast={toast} />
            </Modal>

            <Modal isOpen={habilityModal} handleCloseModal={handleCloseHability} >
                <ContainerHability>
                    {habilitySelected && <>
                    
                    <div className='data'>
                        <p>Nome da habilidade</p>
                        <span>{habilitySelected.data.name}</span>
                    </div>
                    <div className='data'>
                        <p>Descrição</p>
                        <span dangerouslySetInnerHTML={{ __html: habilitySelected.data.description.replace(/\n/g, '<br />') }} />
                    </div>
                    {!!habilitySelected.data.buff?.modifyRoll?.length && 
                        <div className='data'>
                            <p>Modificador de pericia ganho</p>
                            <span>
                                <div>
                                    {habilitySelected.data.buff?.modifyRoll?.map((i, key) => (
                                        <div key={key} className='perkItem' onClick={() => {
                                            const getPerkItem = skillsAll.find((j) => i.perkId === j.id);
                                            if (getPerkItem) {
                                                handleRoll(getPerkItem, {
                                                    type: 'habilidade',
                                                    name: `${i.perkName} Adicional`,
                                                    roll: i.value
                                                });
                                            }
                                            handleCloseHability();
                                        }}>{i.perkName} | valor: {i.value}</div>
                                    ))}
                                </div>
                            </span>
                        </div>
                    }
                    
                    </>}
                </ContainerHability>
            </Modal>
            <Modal isOpen={healthModal} handleCloseModal={handleCloseHealth} >
                <ContainerHealth>
                    <div className='label'>Gerenciar saúde</div>
                    {campain?.basics.life && 
                        <div className='life'>
                            <div className='inputs'>
                                <button onClick={() => handleHealth('life', lifeValue ?? 0 ,'remove')}>Remover</button>
                                <TextField id="standard-basic" size='small' type='number' label="Pv" variant="filled" inputMode='numeric' value={lifeValue} onChange={(e) => {
                                    setlifeValue(Number(e.target.value));
                                }} />
                                <button onClick={() => handleHealth('life', lifeValue ?? 0 ,'add')}>Adicionar</button>
                            </div>
                        </div>
                    }
                    {campain?.basics.sanity && 
                        <div className='sanity'>
                            <div className='inputs'>
                                <button onClick={() => handleHealth('sanity', sanityValue ?? 0 ,'remove')}>Remover</button>
                                <TextField id="standard-basic" size='small' type='number' label="Sanidade" variant="filled" inputMode='numeric' value={sanityValue} onChange={(e) => {
                                    setsanityValue(Number(e.target.value));
                                }} />
                                <button onClick={() => handleHealth('sanity', sanityValue ?? 0 ,'add')}>Adicionar</button>
                            </div>
                        </div>
                    }
                    {campain?.basics.pe && 
                        <div className='pe'>
                            <div className='inputs'>
                                <button onClick={() => handleHealth('pe', peValue ?? 0 ,'remove')}>Remover</button>
                                <TextField id="standard-basic" size='small' type='number' label="PE" variant="filled" inputMode='numeric' value={peValue} onChange={(e) => {
                                    setPeValue(Number(e.target.value));
                                }} />
                                <button onClick={() => handleHealth('pe', peValue ?? 0 ,'add')}>Adicionar</button>
                            </div>
                        </div>
                    }
                    {campain?.basics.cyberpsicosy && 
                        <div className='cyber'>
                            <div className='inputs'>
                                <button onClick={() => handleHealth('cyberpsicosy', cyberValue ?? 0 ,'remove')}>Remover</button>
                                <TextField id="standard-basic" size='small' type='number' label="Cyberpsicose" variant="filled" inputMode='numeric' value={cyberValue} onChange={(e) => {
                                    setCyberValue(Number(e.target.value));
                                }} />
                                <button onClick={() => handleHealth('cyberpsicosy', cyberValue ?? 0 ,'add')}>Adicionar</button>
                            </div>
                        </div>
                    }
                </ContainerHealth>
            </Modal>
            <Modal isOpen={magicModal} handleCloseModal={handleCloseMagics}>
                <ContainerMagics>
                    <div className='filters'>
                        <p>Filtrar por elemento:</p>
                        <div>{elements?.map((i, key) => (
                            <Chip key={key} label={i.data.name} onClick={() => setMagicModalFilter(i.id)} color={magicModalFilter === i.id ? 'primary' : 'default'} />
                        ))}</div>
                    </div>
                    
                    <div className='list'>
                        <div>
                        {magicsFiltered.map((i, key) => (
                            <Accordion key={key} expanded={expanded === `painer${i.id}`} onChange={handleChangeTagMagic(`painer${i.id}`)}>
                                <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1bh-content"
                                id="panel1bh-header"
                                >
                                    <Typography className='nameMagic' sx={{ width: '33%', flexShrink: 0 }}>
                                        {i.data.name}
                                    </Typography>
                                    <Typography sx={{ color: 'text.secondary' }} className='hideOnMoba'>{i.data.circle}º Circulo</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <div className='itemMagic'>
                                        <div className='detailsMagic'>
                                            <div>{i.data.circle}º Circulo</div>
                                            {i.data.execution && <div>Execução: <span>{i.data.execution}</span></div>}
                                            {i.data.reach && <div>Alcance: <span>{i.data.reach}</span></div>}
                                            {i.data.target && <div>Alvo: <span>{i.data.target}</span></div>}
                                            {i.data.duration && <div>Duração: <span>{i.data.duration}</span></div>}
                                            {i.data.resistance && <div>Resistência: <span>{i.data.resistance}</span></div>}
                                        </div>
                                        <Typography>
                                            <p className='description'>{i.data.description}</p>
                                        </Typography>
                                        {i.data.upgrades?.map((j, key) => (
                                            <div className='upgrade' key={key}>
                                                <div className='titleUpgrade'>{j.title} {j.peCost ? `- Custo adicional +${j.peCost}PE` : ''}</div>
                                                <div className='descriptionUpgrade'>
                                                    {j.description}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </AccordionDetails>
                            </Accordion>
                        ))}
                        </div>
                    </div>
                </ContainerMagics>
            </Modal>

            {/* Modal de lista de documentos */}
            <Modal isOpen={documentsModal} handleCloseModal={handleCloseDocuments}>
                <Box sx={{ 
                    width: '100%',
                    maxWidth: { xs: '95vw', sm: 500 },
                    minWidth: { xs: '95vw', sm: 300 },
                    maxHeight: '80vh',
                    overflow: 'auto',
                    backgroundColor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 2
                }}>
                    <Typography variant="h5" component="h2" sx={{ mb: 2, textAlign: 'center', color: 'text.primary' }}>
                        Documentos
                    </Typography>
                    
                    {documents.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                                Nenhum documento encontrado.
                            </Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {documents.map((document) => (
                                <Card key={document.id} sx={{ boxShadow: 2 }}>
                                    <CardContent sx={{ pb: 1 }}>
                                        <Typography variant="h6" component="div" gutterBottom>
                                            {document.data.name}
                                        </Typography>
                                    </CardContent>
                                    <CardActions sx={{ pt: 0 }}>
                                        <Button 
                                            size="small" 
                                            variant="contained"
                                            onClick={() => handleViewDocument(document)}
                                            fullWidth
                                        >
                                            Visualizar
                                        </Button>
                                    </CardActions>
                                </Card>
                            ))}
                        </Box>
                    )}
                </Box>
            </Modal>

            {/* Modal de visualização do documento */}
            <Dialog
                open={documentViewModal}
                onClose={handleCloseDocumentView}
                maxWidth="md"
                fullWidth
                sx={{
                    zIndex: "999999999999999999999999"
                }}
                PaperProps={{
                    sx: {
                        maxHeight: '90vh',
                        m: { xs: 1, sm: 2 },
                    },
                }}
            >
                <DialogContent sx={{ p: { xs: 1, sm: 2 }}}>
                    {selectedDocument && (
                        <Box>
                            {/* Header com título e controles */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                <Typography variant="h6" component="h3" sx={{ flexGrow: 1, mr: 2 }}>
                                    {selectedDocument.data.name}
                                </Typography>
                                
                                {/* Controles de zoom */}
                                <Box sx={{ display: 'flex', gap: 1, mr: 1 }}>
                                    <IconButton onClick={handleZoomOut} size="small" disabled={imageZoom <= 0.5}>
                                        <i className="fa-solid fa-magnifying-glass-minus"></i>
                                    </IconButton>
                                    <Typography variant="body2" sx={{ 
                                        alignSelf: 'center', 
                                        minWidth: '50px', 
                                        textAlign: 'center',
                                        fontSize: '0.75rem'
                                    }}>
                                        {Math.round(imageZoom * 100)}%
                                    </Typography>
                                    <IconButton onClick={handleZoomIn} size="small" disabled={imageZoom >= 3}>
                                        <i className="fa-solid fa-magnifying-glass-plus"></i>
                                    </IconButton>
                                    <IconButton onClick={handleResetZoom} size="small">
                                        <i className="fa-solid fa-arrows-rotate"></i>
                                    </IconButton>
                                </Box>
                                
                                <IconButton onClick={handleCloseDocumentView} size="small">
                                    <i className="fa-solid fa-xmark"></i>
                                </IconButton>
                            </Box>
                            
                            {/* Container da imagem com zoom */}
                            <Box sx={{ 
                                display: 'flex', 
                                justifyContent: 'center',
                                alignItems: 'center',
                                maxHeight: { xs: '70vh', sm: '75vh' },
                                overflow: 'hidden',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                position: 'relative',
                                cursor: imageZoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
                            }}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            >
                                <img 
                                    src={selectedDocument.data.url} 
                                    alt={selectedDocument.data.name}
                                    style={{
                                        transform: `scale(${imageZoom}) translate(${imagePosition.x / imageZoom}px, ${imagePosition.y / imageZoom}px)`,
                                        maxWidth: imageZoom === 1 ? '100%' : 'none',
                                        maxHeight: imageZoom === 1 ? '100%' : 'none',
                                        objectFit: 'contain',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                                        transition: isDragging ? 'none' : 'transform 0.2s ease',
                                        userSelect: 'none',
                                        pointerEvents: 'none'
                                    }}
                                    draggable={false}
                                />
                            </Box>
                            
                            {/* Instruções de uso */}
                            {imageZoom > 1 && (
                                <Typography variant="caption" sx={{ 
                                    display: 'block', 
                                    textAlign: 'center', 
                                    mt: 1, 
                                    color: 'text.secondary',
                                    fontSize: '0.7rem'
                                }}>
                                    Clique e arraste para mover a imagem
                                </Typography>
                            )}
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            <ToastContainer style={{zIndex: 9999999999999999}} />
        </>
    )
}

export default Sheet;