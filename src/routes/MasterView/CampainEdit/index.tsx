import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Container } from './styles';
import { useLocation } from 'react-router-dom';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { alertType, avatarDataType, campainDataType, classeDataType, elementDataType, entityDataType, habilityDataType, habilityTranscendedDataType, magicDataType, perkDataType, storeDataType, subclassDataType, userDataTypeData } from '../../../types';
import { ColorRing } from 'react-loader-spinner';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import avatarlogo from '../../../imgs/profile-user-icon-2048x2048-m41rxkoe.png';
import Classes from './Classes';
import Modal from '../../../commom/Modal';
import Subclasses from './Subclasses';
import Origens from './Origens';
import Pericias from './Pericias';
import Habilidades from './Habilidades';
import HabilidadesTranscendidas from './HabilidadesTranscendidas';
import { ToastContainer, toast } from 'react-toastify';
import { getAlertsCampain } from '../../../utils';
import { AppBar, Dialog, IconButton, Slide, Toolbar, Typography } from '@mui/material';
import Itens from './Itens';
import { TransitionProps } from '@mui/material/transitions';
import Elements from './Elements';
import Magics from './Magics';
import Stores from './Stores';
import Discord from './Discord';
import Invite from './Invite';
import SheetDetails from '../../Campain/Sheet/SheetDetails';
import { skillTy } from '../../Campain';
import MagicPlayers from './MagicPlayers';
import Entity from './Entity';
import Info from './Info';

import { useOrigins } from '../../../hooks/useOrigins';
import { useModalState } from '../../../hooks/useModalState';

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

export type magicPlayerDestibution = {
    player: string;
    playerId: string;
    magic: string;
    magicId: string;
}

const CampainEdit = () => {

    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';

    const [campain, setCampain] = useState<campainDataType>();
    const [classes, setClasses] = useState<classeDataType[]>([]);

    const [loading, setLoading] = useState<boolean>(false);

    // Modal state management using custom hook
    const { modals, openModal, closeModal, closeAllModals } = useModalState();

    const [subclasses, setSubclasses] = useState<subclassDataType[]>([]);
    const [habilities, setHabilities] = useState<habilityDataType[]>([]);
    const [habilityTranscended, setHabilityTranscended] = useState<habilityTranscendedDataType[]>([]);
    // Use custom hook for origins with automatic batching
    const originIds = useMemo(() => 
        campain?.data?.origins && campain?.data?.origins.length > 0 ? campain?.data?.origins : ['non'], 
        [campain?.data?.origins]
    );
    const { data: origins } = useOrigins({ 
        originIds, 
        enabled: Boolean(campain && classes.length > 0) 
    });
    const [perks, setPerks] = useState<perkDataType[]>([]);

    const [characters, setCharacters] = useState<avatarDataType[]>([]);
    const [characterSelected, setCharactersSelected] = useState<avatarDataType>();
    const [stores, setStores] = useState<storeDataType[]>([]);
    const [users, setUsers] = useState<userDataTypeData[]>([]);
    const [elements, setElements] = useState<elementDataType[]>([]);
    const [entitys, setEntitys] = useState<entityDataType[]>([]);
    const [alertsList, setAlertsList] = useState<alertType[]>([]);
    const [magicFiltered, setMagicFiltered] = useState<magicDataType[]>([]);
    const [magics, setMagics] = useState<magicDataType[]>([]);

    // Memoized computation of skills from perks
    const skills = useMemo(() => {
        if (!perks) return undefined;
        
        return perks.map(perk => ({
            id: perk.id,
            name: perk.data.name,
            base: perk.data.base,
        }));
    }, [perks]);

    // Memoized computation of filtered skills
    const skillsFiltered = useMemo(() => {
        if (!skills || !characterSelected) {
            return { trained: [], notTrained: [] };
        }

        const notTrained = skills.filter((skill) => 
            !characterSelected.data.skill.some((charSkill) => charSkill.perk === skill.id)
        );
        
        const trained = characterSelected.data.skill.map((charSkill) => {
            const skillData = skills.find((skill) => skill.id === charSkill.perk);
            return {
                name: skillData?.name,
                id: charSkill.perk,
                expertise: charSkill.expertise,
                base: skillData?.base,
            };
        }) as skillTy[];

        return { trained, notTrained };
    }, [skills, characterSelected]);


    const handleClickItemOpen = useCallback(() => {
        openModal('openItemModal');
    }, [openModal]);

    const handleClickMagicOpen = useCallback(() => {
        openModal('openMagicModal');
    }, [openModal]);

    const handleCloseItem = useCallback(() => {
        closeModal('openItemModal');
    }, [closeModal]);

    const handleCloseMagic = useCallback(() => {
        closeModal('openMagicModal');
    }, [closeModal]);

    const handleCloseSheet = useCallback(() => {
        closeModal('openSheetModal');
        setCharactersSelected(undefined);
    }, [closeModal]);

    useEffect(() => {
        if (campainId) {
            const docRef = doc(db, 'campains', campainId);

            onSnapshot(docRef, (querySnapshot) => {
                const docData = {
                    id: querySnapshot.id,
                    data: querySnapshot.data(),
                } as campainDataType;
                setCampain(docData);
            });
        }
    }, [campainId]);

    useEffect(() => {
        if (campain && campain.data.classes.length > 0) {
            const qClasses = query(collection(db, "classes"), where("__name__", "in", campain.data.classes));

            onSnapshot(qClasses, (querySnapshot) => {
                const docData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })) as classeDataType[];
                setClasses(docData);
            });
        }

        if (campain) {
            const errors = getAlertsCampain(campain.data);
            setAlertsList(errors);
        }
    }, [campain])

    const getSubclasses = async () => {
        const p = query(
            collection(db, 'subclass'),
            where('classId', 'in', campain?.data?.classes && campain?.data?.classes.length > 0 ? campain?.data?.classes : ['non'])
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as subclassDataType[];

            const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setSubclasses(sorted);
        });
    }

    const getHabilities = async () => {
        const p = query(
            collection(db, 'hability'),
            where('classId', 'in', campain?.data?.classes && campain?.data?.classes.length > 0 ? campain?.data?.classes : ['non'])
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as habilityDataType[];

            const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setHabilities(sorted);
        });
    }

    const getHabilityTranscended = async () => {
        const p = query(
            collection(db, 'habilityTrans'),
            where('__name__', 'in', campain?.data?.habilityTrans && campain?.data?.habilityTrans.length > 0 ? campain?.data?.habilityTrans : ['non'])
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as habilityTranscendedDataType[];

            const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setHabilityTranscended(sorted);
        });
    }



    const getPerks = async () => {
        const p = query(
            collection(db, 'skills'),
            where('__name__', 'in', campain?.data?.skills && campain?.data?.skills.length > 0 ? campain?.data?.skills : ['non'])
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as perkDataType[];

            const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setPerks(sorted);
        });
    }

    const getCharacters = async () => {
        const p = query(
            collection(db, 'character'),
            where('__name__', 'in', campain?.data?.characters && campain?.data?.characters.length > 0 ? campain?.data?.characters : ['non'])
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as avatarDataType[];

            const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setCharacters(sorted);
        });
    }

    const getStores = async () => {
        const p = query(
            collection(db, 'stores'),
            where('__name__', 'in', campain?.data?.stores && campain?.data?.stores.length > 0 ? campain?.data?.stores : ['non'])
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as storeDataType[];

            const sorted = docData.sort((a, b) => a.data.title.localeCompare(b.data.title));
            setStores(sorted);
        });
    }

    const getUsers = async () => {
        const p = query(
            collection(db, 'user'),
            where('__name__', 'in', campain?.data?.players && campain?.data?.players.length > 0 ? campain?.data?.players : ['non'])
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as userDataTypeData[];

            const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
            setUsers(sorted);
        });
    }

    const getElements = async () => {
        const p = query(
            collection(db, 'elements'),
            where('__name__', 'in', campain?.data?.elements && campain?.data?.elements.length > 0 ? campain?.data?.elements : ['non'])
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

    const getMagics = async () => {
        if (campainId) {
            const p = query(
                collection(db, 'magics'),
                where('campainId', '==', campainId)
            );
    
            onSnapshot(p, (querySnapshot) => {
                const docData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })) as magicDataType[];

                const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
                setMagics(sorted);
                setMagicFiltered(sorted);                
            });
        }
    }

    const getEntity = async () => {
        if (campainId) {
            const p = query(
                collection(db, 'entity'),
                where('campainId', '==', campainId)
            );
    
            onSnapshot(p, (querySnapshot) => {
                const docData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })) as entityDataType[];

                const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
                setEntitys(sorted);              
            });
        }
    }

    useEffect(() => {
        if (classes.length > 0) {
            getSubclasses();
            getHabilities();
            getHabilityTranscended();
            getPerks();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classes]);

    useEffect(() => {
        if (campain) {
            getCharacters();
            getStores();
            getElements();
            getUsers();
            getMagics();
            getEntity();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campain])

    // Memoized computation of magic player distribution
    const magicPlayer = useMemo(() => {
        if (!magics || !characters) return [];

        const separate: magicPlayerDestibution[] = [];

        magics.forEach((magic) => {
            characters.forEach(character => {
                if (character.data.magics?.includes(magic.id)) {
                    separate.push({
                        player: character.data.name,
                        playerId: character.id,
                        magic: magic.data.name,
                        magicId: magic.id,
                    });
                }
            });
        });

        return separate.sort((a, b) => a.player.localeCompare(b.player));
    }, [characters, magics]);

    // Memoized promote character function
    const promoteChar = useCallback(async (char: avatarDataType) => {
        if (!char) return;
        
        setLoading(true);
        try {
            const charDocRef = doc(db, "character", char.id);
            
            await updateDoc(charDocRef, {
                unlock: {
                    ...char.data.unlock,
                    levelPoint: char.data.unlock.levelPoint + 1
                },
            });
            
            toast.success("Personagem promovido!");
        } catch (error) {
            toast.error("Erro ao promover personagem!");
        } finally {
            setLoading(false);
        }
    }, []);
    return (
        <>
        {campain || loading ? 
        <>
        <Container>
            <div>
                <div className='left'>
                    <div className='title'>
                        <p>Opçãoes</p>
                    </div>
                    <div className='options'>
                        <button onClick={() => openModal('showInfoModal')}>Editar informações</button>
                        <button onClick={() => openModal('openStoreModal')}>Gerenciar Lojas</button>
                        <button onClick={() => openModal('showEntityModal')}>Gerenciar entidades</button>
                        <button onClick={() => openModal('showInviteModal')}>Gerenciar convite</button>
                        <button onClick={() => openModal('openDiscordModal')}>Configurar bot Discord</button>
                    </div>
                </div>
                <div className='center'>
                    <div className='alerts'>
                        <Stack sx={{ width: '100%' }} spacing={1}>
                            {alertsList.map((i, key) => (
                                <Alert severity={i.type} key={key}>{i.message}</Alert>
                            ))}
                        </Stack>
                    </div>
                    <div className='title'>
                        <p>Opções</p>
                    </div>
                    <div className='content'>
                        <div className='configurations'>
                            <div className='options'>
                                <div className='titleConfig'>
                                    <p>Configuração de personagem</p>
                                </div>
                                <div className='listConfig'>
                                    <div className='box'>
                                        <div>
                                            <p className='name'>Classes</p>
                                            <p className='quantity'><i className="fa-solid fa-cube"></i> {campain?.data.classes.length}</p>
                                        </div>
                                        <div>
                                            <button onClick={() => openModal('showClassesModal')}>Editar</button>
                                        </div>
                                    </div>
                                    <div className='box'>
                                        <div>
                                            <p className='name'>Subclasses</p>
                                            <p className='quantity'><i className="fa-solid fa-cube"></i> {subclasses.length}</p>
                                        </div>
                                        <div>
                                            <button onClick={() => openModal('showSubclassesModal')}>Editar</button>
                                        </div>
                                    </div>
                                    <div className='box'>
                                        <div>
                                            <p className='name'>Origens</p>
                                            <p className='quantity'><i className="fa-solid fa-cube"></i> {campain?.data.origins.length}</p>
                                        </div>
                                        <div>
                                            <button onClick={() => openModal('showOrigensModal')}>Editar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='options'>
                                <div className='titleConfig'>
                                    <p>Configuração de habilidades</p>
                                </div>
                                <div className='listConfig'>
                                    <div className='box'>
                                        <div>
                                            <p className='name'>Perícias</p>
                                            <p className='quantity'><i className="fa-solid fa-cube"></i> {campain?.data.skills.length}</p>
                                        </div>
                                        <div>
                                            <button onClick={() => openModal('showPericiasModal')}>Editar</button>
                                        </div>
                                    </div>
                                    <div className='box'>
                                        <div>
                                            <p className='name'>Habilidades</p>
                                            <p className='quantity'><i className="fa-solid fa-cube"></i> {habilities.length}</p>
                                        </div>
                                        <div>
                                            <button onClick={() => openModal('showHabilidadesModal')}>Editar</button>
                                        </div>
                                    </div>
                                    <div className='box'>
                                        <div>
                                            <p className='name'>Hab. Transcendidas</p>
                                            <p className='quantity'><i className="fa-solid fa-cube"></i> {habilityTranscended.length}</p>
                                        </div>
                                        <div>
                                            <button onClick={() => openModal('showHabilidadesTranscendidasModal')}>Editar</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='options'>
                                <div className='titleConfig'>
                                    <p>Configuração de itens e magias</p>
                                </div>
                                <div className='listConfig'>
                                    <div className='box'>
                                        <div>
                                            <p className='name'>Itens</p>
                                        </div>
                                        <div>
                                            <button onClick={handleClickItemOpen}>Editar</button>
                                        </div>
                                    </div>
                                    <div className='box'>
                                        <div>
                                            <p className='name'>Elementos</p>
                                        </div>
                                        <div>
                                            <button onClick={() => openModal('showElementsModal')}>Editar</button>
                                        </div>
                                    </div>
                                    <div className='box'>
                                        <div>
                                            <p className='name'>Magias</p>
                                        </div>
                                        <div>
                                            <button onClick={handleClickMagicOpen}>Editar</button>
                                        </div>
                                    </div>
                                </div>
                                <div className='options' style={{marginTop: "8px"}}>
                                    <div className='listConfig'>
                                        <div className='box'>
                                            <div>
                                                <p className='name'>Magias dos jogadores</p>
                                            </div>
                                            <div>
                                                <button onClick={() => openModal('showMagicPlayerModal')}>Editar</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='right'>
                    <div className='title'>
                        <p>Personagens</p>
                    </div>
                    <div className='charList'>
                        {characters.map((char, key) => (
                            <div className='item' key={key}>
                                <div className='img'>
                                    <Avatar sx={{ width: 56, height: 56 }} alt="" src={char.data.img ?? avatarlogo} />
                                </div>
                                <div className='option'>
                                    <p className='name'>{char.data.name}</p>
                                    <p>{users.find(a => a.id === char.data.playerId)?.data.name}</p>
                                    <p>Nível {char.data.level}</p>
                                    <p>Pontos de nível: {char.data.unlock.levelPoint}</p>
                                    <div className='buttons'>
                                        <button onClick={() => {
                                            setCharactersSelected(char);
                                            openModal('openSheetModal');
                                        }}><i className="fa-solid fa-pen-to-square"></i></button>
                                        <button onClick={() => promoteChar(char)}><i className="fa-solid fa-angles-up"></i> Nível</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Container>
        </> : <>
        <Container></Container>
        <div className='loading'>
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
        
        </>}

        <Modal isMinWidth isOpen={modals.showClassesModal} handleCloseModal={closeAllModals}>
            <Classes classes={classes} toast={toast} campain={campain?.data} subclasses={subclasses} habilities={habilities} />
        </Modal>
        <Modal isMinWidth isOpen={modals.showSubclassesModal} handleCloseModal={closeAllModals}>
            <Subclasses classes={classes} subclasses={subclasses} toast={toast} campain={campain?.data} />
        </Modal>
        <Modal isMinWidth isOpen={modals.showOrigensModal} handleCloseModal={closeAllModals}>
            <Origens toast={toast} campain={campain?.data} origins={origins} perks={perks} characters={characters} />
        </Modal>
        <Modal isMinWidth isOpen={modals.showPericiasModal} handleCloseModal={closeAllModals}>
            <Pericias toast={toast} campain={campain?.data} characters={characters} perks={perks} />
        </Modal>
        <Modal isMinWidth isOpen={modals.showHabilidadesModal} handleCloseModal={closeAllModals}>
            <Habilidades classes={classes} toast={toast} habilities={habilities} characters={characters} perks={perks} />
        </Modal>
        <Modal isMinWidth isOpen={modals.showHabilidadesTranscendidasModal} handleCloseModal={closeAllModals}>
            <HabilidadesTranscendidas toast={toast} campainId={campain?.id} habilityTranscended={habilityTranscended} characters={characters} perks={perks} />
        </Modal>
        <Modal isMinWidth isOpen={modals.showElementsModal} handleCloseModal={closeAllModals}>
            <Elements toast={toast} elements={elements} />
        </Modal>




        <Dialog
            fullScreen
            open={modals.openItemModal}
            onClose={handleCloseItem}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative', backgroundColor: '#343493' }}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseItem}
                aria-label="close"
                >
                    <i className="fa-solid fa-xmark"></i>
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Gerenciamento de itens
                </Typography>
            </Toolbar>
            </AppBar>
            <Itens toast={toast} stores={stores} perks={perks} characters={characters} />
        </Dialog>

        <Dialog
            fullScreen
            open={modals.openMagicModal}
            onClose={handleCloseMagic}
            TransitionComponent={Transition}
        >
            <AppBar sx={{ position: 'relative', backgroundColor: '#343493' }}>
            <Toolbar>
                <IconButton
                edge="start"
                color="inherit"
                onClick={handleCloseMagic}
                aria-label="close"
                >
                    <i className="fa-solid fa-xmark"></i>
                </IconButton>
                <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                    Gerenciamento de Magias
                </Typography>
            </Toolbar>
            </AppBar>
            <Magics toast={toast} elements={elements} magicFiltered={magicFiltered} magics={magics} setMagicFiltered={setMagicFiltered} />
        </Dialog>
        

        <Modal isOpen={modals.openStoreModal} handleCloseModal={closeAllModals} isMinWidth>
            <Stores toast={toast} stores={stores} />
        </Modal>
        <Modal isOpen={modals.openDiscordModal} handleCloseModal={closeAllModals} isMinWidth>
            <Discord toast={toast} campain={campain} />
        </Modal>
        <Modal isOpen={modals.showInviteModal} handleCloseModal={closeAllModals} isMinWidth>
            <Invite toast={toast} campain={campain} />
        </Modal>

        <Modal isOpen={modals.showMagicPlayerModal} handleCloseModal={closeAllModals} isMinWidth>
            <MagicPlayers toast={toast} magic={magics} char={characters} magicPlayer={magicPlayer} />
        </Modal>

        <Modal isOpen={modals.showEntityModal} handleCloseModal={closeAllModals} isMinWidth>
            <Entity toast={toast} entity={entitys} />
        </Modal>

        <Modal isOpen={modals.showInfoModal} handleCloseModal={closeAllModals} isMinWidth>
            {campain && <Info campain={campain} toast={toast} onClose={closeAllModals} />}
        </Modal>

        {modals.openSheetModal && skills && characterSelected && 
            <SheetDetails 
                isToCloseSheet={false} 
                charcater={characterSelected} 
                campain={campain?.data} 
                skills={skillsFiltered} 
                skillsAll={skills} 
                onClose={handleCloseSheet}
                habilities={habilities}
                habilityTranscended={habilityTranscended}
                subclasses={subclasses}
                charSubclass={subclasses.find(i => i.id === characterSelected?.data?.subclass?.id)}
                classChar={classes.find(i => i.id === characterSelected?.data?.class?.id)}
                toast={toast}
                isAdmin={true}
            />
        }

        <ToastContainer style={{zIndex: '999999999999999999'}} />
        </>
    )
}

export default CampainEdit;