import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { useLocation } from 'react-router-dom';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { alertType, avatarDataType, campainDataType, classeDataType, elementDataType, habilityDataType, magicDataType, originDataType, perkDataType, storeDataType, subclassDataType, userDataTypeData } from '../../../types';
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
import { skillFiltr, skillTy } from '../../Campain';
import MagicPlayers from './MagicPlayers';

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

    const [showClassesModal, setShowClassesModal] = useState<boolean>(false);
    const [showSubclassesModal, setShowSubclassesModal] = useState<boolean>(false);
    const [showOrigensModal, setShowOrigensModal] = useState<boolean>(false);
    const [showPericiasModal, setShowPericiasModal] = useState<boolean>(false);
    const [showHabilidadesModal, setShowHabilidadesModal] = useState<boolean>(false);
    const [showElementsModal, setShowElementsModal] = useState<boolean>(false);
    const [showInviteModal, setShowInviteModal] = useState<boolean>(false);
    const [showMagicPlayerModal, setMagicPlayerModal] = useState<boolean>(false);

    const [subclasses, setSubclasses] = useState<subclassDataType[]>([]);

    const [habilities, setHabilities] = useState<habilityDataType[]>([]);

    const [origins, setOrigins] = useState<originDataType[]>([]);

    const [perks, setPerks] = useState<perkDataType[]>([]);

    const [magicPlayer, setMagicPlayer] = useState<magicPlayerDestibution[]>([]);

    const [characters, setCharacters] = useState<avatarDataType[]>([]);
    const [characterSelected, setCharactersSelected] = useState<avatarDataType>();

    const [stores, setStores] = useState<storeDataType[]>([]);

    const [users, setUsers] = useState<userDataTypeData[]>([]);

    const [elements, setElements] = useState<elementDataType[]>([]);

    const [alertsList, setAlertsList] = useState<alertType[]>([]);

    const [magicFiltered, setMagicFiltered] = useState<magicDataType[]>([]);
    const [magics, setMagics] = useState<magicDataType[]>([]);

    const [openItemModal, setOpenItemModal] = useState<boolean>(false);
    const [openMagicModal, setOpenMagicModal] = useState<boolean>(false);
    const [openStoreModal, setOpenStoreModal] = useState<boolean>(false);
    const [openDiscordModal, setOpenDiscordModal] = useState<boolean>(false);

    const [openSheetModal, setOpenSheetModal] = useState<boolean>(false);

    const [skills, setSkills] = useState<skillTy[]>();

    const [skillsFiltered, setSkillsFiltered] = useState<skillFiltr>({
        trained: [],
        notTrained: [],
    });


    useEffect(() => {
        if (skills) {
            const notTreined = skills?.filter((i) => !characterSelected?.data.skill.some((j) => j.perk === i.id)) ?? [];
            const treined = characterSelected?.data.skill.map((i) => {
                const skillData = skills?.find((j) => j.id === i.perk);
                return {
                    name: skillData?.name,
                    id: i.perk,
                    expertise: i.expertise,
                    base: skillData?.base,
                }
            }) as skillTy[];

            setSkillsFiltered({
                trained: treined,
                notTrained: notTreined,
            })
        }


    }, [characterSelected, skills]);

    useEffect(() => {
        if(perks) {
            const perksArray = [] as skillTy[];

            perks.forEach((i) => {
                perksArray.push({
                    id: i.id,
                    name: i.data.name,
                    base: i.data.base,
                });
            });

            setSkills(perksArray);
        }
    }, [perks])


    const handleClickItemOpen = () => {
        setOpenItemModal(true);
    };

    const handleClickMagicOpen = () => {
        setOpenMagicModal(true);
    };

    const handleCloseItem = () => {
        setOpenItemModal(false);
    };

    const handleCloseMagic = () => {
        setOpenMagicModal(false);
    };

    const handleCloseSheet = () => {
        setOpenSheetModal(false);
        setCharactersSelected(undefined);
    }

    const handleCloseModals = () => {
        setShowClassesModal(false);
        setShowSubclassesModal(false);
        setShowOrigensModal(false);
        setShowPericiasModal(false);
        setShowHabilidadesModal(false);
        setShowElementsModal(false);
        setOpenStoreModal(false);
        setOpenDiscordModal(false);
        setShowInviteModal(false);
        setMagicPlayerModal(false)
    }

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

    const getOrigins = async () => {
        const p = query(
            collection(db, 'origin'),
            where('__name__', 'in', campain?.data?.origins && campain?.data?.origins.length > 0 ? campain?.data?.origins : ['non'])
        );

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as originDataType[];

            const sorted = docData.sort((a, b) => a.data.title.localeCompare(b.data.title));
            setOrigins(sorted);
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

    useEffect(() => {
        if (classes.length > 0) {
            getSubclasses();
            getHabilities();
            getOrigins();
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
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campain])

    useEffect(() => {
        if(magics && characters) {

            const separate:magicPlayerDestibution[] = [];

            magics.forEach((i) => {
                characters.forEach(j => {
                    if(j.data.magics?.includes(i.id)){
                        separate.push({
                            player: j.data.name,
                            playerId: j.id,
                            magic: i.data.name,
                            magicId: i.id,
                        } as magicPlayerDestibution);
                    }
                })
            });

            const sorted = separate.sort((a, b) => a.player.localeCompare(b.player));

            setMagicPlayer(sorted);
        }
    }, [characters, magics])

    const promoteChar = async (char: avatarDataType) => {
        if (char) {
            setLoading(true);
            const charDocRef = doc(db, "character", char.id);

            await updateDoc(charDocRef, {
                unlock: {
                    ...char.data.unlock,
                    levelPoint: char.data.unlock.levelPoint + 1
                },
            }).then(() => {
                toast.success("Personagem promovido!");
            });
        }
    }
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
                        <button>Editar informações</button>
                        <button onClick={() => setOpenStoreModal(true)}>Gerenciar Lojas</button>
                        <button>Gerenciar entidades</button>
                        <button onClick={() => setShowInviteModal(true)}>Gerenciar convite</button>
                        <button onClick={() => setOpenDiscordModal(true)}>Configurar bot Discord</button>
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
                                            <button onClick={() => setShowClassesModal(true)}>Editar</button>
                                        </div>
                                    </div>
                                    <div className='box'>
                                        <div>
                                            <p className='name'>Subclasses</p>
                                            <p className='quantity'><i className="fa-solid fa-cube"></i> {subclasses.length}</p>
                                        </div>
                                        <div>
                                            <button onClick={() => setShowSubclassesModal(true)}>Editar</button>
                                        </div>
                                    </div>
                                    <div className='box'>
                                        <div>
                                            <p className='name'>Origens</p>
                                            <p className='quantity'><i className="fa-solid fa-cube"></i> {campain?.data.origins.length}</p>
                                        </div>
                                        <div>
                                            <button onClick={() => setShowOrigensModal(true)}>Editar</button>
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
                                            <button onClick={() => setShowPericiasModal(true)}>Editar</button>
                                        </div>
                                    </div>
                                    <div className='box'>
                                        <div>
                                            <p className='name'>Habilidades</p>
                                            <p className='quantity'><i className="fa-solid fa-cube"></i> {habilities.length}</p>
                                        </div>
                                        <div>
                                            <button onClick={() => setShowHabilidadesModal(true)}>Editar</button>
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
                                            <button onClick={() => setShowElementsModal(true)}>Editar</button>
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
                                                <button onClick={() => setMagicPlayerModal(true)}>Editar</button>
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
                                            setOpenSheetModal(true);
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

        <Modal isOpen={showClassesModal} handleCloseModal={handleCloseModals}>
            <Classes classes={classes} toast={toast} campain={campain?.data} subclasses={subclasses} habilities={habilities} />
        </Modal>
        <Modal isOpen={showSubclassesModal} handleCloseModal={handleCloseModals}>
            <Subclasses classes={classes} subclasses={subclasses} toast={toast} campain={campain?.data} />
        </Modal>
        <Modal isOpen={showOrigensModal} handleCloseModal={handleCloseModals}>
            <Origens toast={toast} campain={campain?.data} origins={origins} perks={perks} characters={characters} />
        </Modal>
        <Modal isOpen={showPericiasModal} handleCloseModal={handleCloseModals}>
            <Pericias toast={toast} campain={campain?.data} characters={characters} perks={perks} />
        </Modal>
        <Modal isOpen={showHabilidadesModal} handleCloseModal={handleCloseModals}>
            <Habilidades classes={classes} toast={toast} habilities={habilities} characters={characters} perks={perks} />
        </Modal>
        <Modal isOpen={showElementsModal} handleCloseModal={handleCloseModals}>
            <Elements toast={toast} elements={elements} />
        </Modal>




        <Dialog
            fullScreen
            open={openItemModal}
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
            open={openMagicModal}
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
        

        <Modal isOpen={openStoreModal} handleCloseModal={handleCloseModals}>
            <Stores toast={toast} stores={stores} />
        </Modal>
        <Modal isOpen={openDiscordModal} handleCloseModal={handleCloseModals}>
            <Discord toast={toast} campain={campain} />
        </Modal>
        <Modal isOpen={showInviteModal} handleCloseModal={handleCloseModals}>
            <Invite toast={toast} campain={campain} />
        </Modal>

        <Modal isOpen={showMagicPlayerModal} handleCloseModal={handleCloseModals}>
            <MagicPlayers toast={toast} magic={magics} char={characters} magicPlayer={magicPlayer} />
        </Modal>

        {openSheetModal && skills && characterSelected && 
            <SheetDetails 
                isToCloseSheet={false} 
                charcater={characterSelected} 
                campain={campain?.data} 
                skills={skillsFiltered} 
                skillsAll={skills} 
                onClose={handleCloseSheet}
                habilities={habilities}
                subclasses={subclasses}
                charSubclass={subclasses.find(i => i.id === characterSelected?.data?.subclass?.id)}
                classChar={classes.find(i => i.id === characterSelected?.data?.class?.id)}
                toast={toast}
            />
        }

        <ToastContainer style={{zIndex: '999999999999999999'}} />
        </>
    )
}

export default CampainEdit;