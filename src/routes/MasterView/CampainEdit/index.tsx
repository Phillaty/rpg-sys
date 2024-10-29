import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { useLocation } from 'react-router-dom';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../firebase/firebase';
import { alertType, avatarDataType, campainType, classeDataType, elementDataType, habilityDataType, originDataType, perkDataType, storeDataType, subclassDataType } from '../../../types';
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

const Transition = React.forwardRef(function Transition(
    props: TransitionProps & {
      children: React.ReactElement<unknown>;
    },
    ref: React.Ref<unknown>,
  ) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

const CampainEdit = () => {

    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';

    const [campain, setCampain] = useState<campainType>();
    const [classes, setClasses] = useState<classeDataType[]>([]);

    const [showClassesModal, setShowClassesModal] = useState<boolean>(false);
    const [showSubclassesModal, setShowSubclassesModal] = useState<boolean>(false);
    const [showOrigensModal, setShowOrigensModal] = useState<boolean>(false);
    const [showPericiasModal, setShowPericiasModal] = useState<boolean>(false);
    const [showHabilidadesModal, setShowHabilidadesModal] = useState<boolean>(false);
    const [showElementsModal, setShowElementsModal] = useState<boolean>(false);

    const [subclasses, setSubclasses] = useState<subclassDataType[]>([]);

    const [habilities, setHabilities] = useState<habilityDataType[]>([]);

    const [origins, setOrigins] = useState<originDataType[]>([]);

    const [perks, setPerks] = useState<perkDataType[]>([]);

    const [characters, setCharacters] = useState<avatarDataType[]>([]);

    const [stores, setStores] = useState<storeDataType[]>([]);

    const [elements, setElements] = useState<elementDataType[]>([]);

    const [alertsList, setAlertsList] = useState<alertType[]>([]);

    const [openItemModal, setOpenItemModal] = React.useState(false);

    const handleClickItemOpen = () => {
        setOpenItemModal(true);
    };

    const handleCloseItem = () => {
        setOpenItemModal(false);
    };

    const handleCloseModals = () => {
        setShowClassesModal(false);
        setShowSubclassesModal(false);
        setShowOrigensModal(false);
        setShowPericiasModal(false);
        setShowHabilidadesModal(false);
        setShowElementsModal(false);
    }

    useEffect(() => {
        if (campainId) {
            const docRef = doc(db, 'campains', campainId);

            onSnapshot(docRef, (querySnapshot) => {
                const docData = querySnapshot.data() as campainType;
                setCampain(docData);
            });
        }
    }, [campainId]);

    useEffect(() => {
        if (campain && campain.classes.length > 0) {
            const qClasses = query(collection(db, "classes"), where("__name__", "in", campain.classes));

            onSnapshot(qClasses, (querySnapshot) => {
                const docData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })) as classeDataType[];
                setClasses(docData);
            });
        }

        if (campain) {
            const errors = getAlertsCampain(campain);
            setAlertsList(errors);
        }
    }, [campain])

    const getSubclasses = async () => {
        const p = query(
            collection(db, 'subclass'),
            where('classId', 'in', campain?.classes && campain?.classes.length > 0 ? campain?.classes : ['non'])
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
            where('classId', 'in', campain?.classes && campain?.classes.length > 0 ? campain?.classes : ['non'])
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
            where('__name__', 'in', campain?.origins && campain?.origins.length > 0 ? campain?.origins : ['non'])
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
            where('__name__', 'in', campain?.skills && campain?.skills.length > 0 ? campain?.skills : ['non'])
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
            where('__name__', 'in', campain?.characters && campain?.characters.length > 0 ? campain?.characters : ['non'])
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
            where('__name__', 'in', campain?.stores && campain?.stores.length > 0 ? campain?.stores : ['non'])
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

    const getElements = async () => {
        const p = query(
            collection(db, 'elements'),
            where('__name__', 'in', campain?.elements && campain?.elements.length > 0 ? campain?.elements : ['non'])
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

    useEffect(() => {
        if (classes.length > 0) {
            getSubclasses();
            getHabilities();
            getOrigins();
            getPerks();
            getCharacters();
            getStores();
            getElements();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [classes]);

    return (
        <>
        {campain ? 
        <>
        <Container>
            <div>
                <div className='left'>
                    <div className='title'>
                        <p>Opçãoes</p>
                    </div>
                    <div className='options'>
                        <button>Editar informações</button>
                        <button>Gerenciar Lojas</button>
                        <button>Gerenciar entidades</button>
                        <button>Gerenciar convite</button>
                        <button>Configurar bot Discord</button>
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
                                            <p className='quantity'><i className="fa-solid fa-cube"></i> {campain.classes.length}</p>
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
                                            <p className='quantity'><i className="fa-solid fa-cube"></i> {campain.origins.length}</p>
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
                                            <p className='quantity'><i className="fa-solid fa-cube"></i> {campain.skills.length}</p>
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
                                            <button>Editar</button>
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
                            <div className='item'>
                                <div className='img'>
                                    <Avatar alt="Cindy Baker" src={char.data.img ?? avatarlogo} />
                                </div>
                                <div className='option'>
                                    <p>{char.data.name}</p>
                                    <button>Editar</button>
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
            <Classes classes={classes} toast={toast} campain={campain} subclasses={subclasses} />
        </Modal>
        <Modal isOpen={showSubclassesModal} handleCloseModal={handleCloseModals}>
            <Subclasses classes={classes} subclasses={subclasses} toast={toast} campain={campain} />
        </Modal>
        <Modal isOpen={showOrigensModal} handleCloseModal={handleCloseModals}>
            <Origens toast={toast} campain={campain} origins={origins} perks={perks} characters={characters} />
        </Modal>
        <Modal isOpen={showPericiasModal} handleCloseModal={handleCloseModals}>
            <Pericias toast={toast} campain={campain} characters={characters} perks={perks} />
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
            <Itens toast={toast} stores={stores} perks={perks} />
        </Dialog>
        


        <ToastContainer style={{zIndex: '999999999999999999'}} />
        </>
    )
}

export default CampainEdit;