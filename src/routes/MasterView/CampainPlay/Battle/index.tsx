import React, { useCallback, useEffect, useState } from 'react';
import { Container } from './styles';
import { Avatar, Chip, TextField, Card, CardContent, Typography, Button, Box, Grid, LinearProgress } from '@mui/material';
import { addDoc, collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { avatarDataType, battleDataType, campainDataType, entityDataType, habilityDataType, rollModType } from '../../../../types';
import Modal from '../../../../commom/Modal';
import Roll from '../../../../commom/ROLL';
import { toast } from 'react-toastify';

type BattleProps = {
    campainId: string;
    campain?: campainDataType;
    characters: avatarDataType[];
    entitys: entityDataType[];
    habilities: habilityDataType[];
}

const Battle: React.FC<BattleProps> = ({ campainId, campain, characters, entitys, habilities }) => {
    const [battle, setBattle] = useState<{
        id: string,
        type: 'entity' | 'player',
        iniciative: number,
        life?: number,
    }[]>([]);

    const [onTurn, setOnTurn] = useState<{
        id: string,
        type: 'entity' | 'player',
        iniciative: number,
        life?: number,
    }>();

    const [modalAddEntity, setModalAddEntity] = useState<boolean>(false);
    const [modalAddChar, setModalAddChar] = useState<boolean>(false);
    const [modalshowHability, setModalshowHability] = useState<boolean>(false);
    const [modalshowHabilityDetails, setModalshowHabilityDetails] = useState<{
        title: string,
        description: string,
        roll?: number,
        rollMod?: number,
        damageRoll?: number[],
        damageMod?: number,
    }>();

    const [battleData, setBattleData] = useState<battleDataType>();

    const [playerIniciative, setPlayerIniciative] = useState<{
        iniciative: number,
        id: string,
    }>();

    const [dicePers, setdicePers] = useState<number[]>([]);
    const [dicePersMod, setdicePersMod] = useState<rollModType[]>();
    const [dicePersToRoll, setdicePersToRoll] = useState<number[]>();

    const [rollIniciativeEntity, setRollIniciativeEntity] = useState<{
        result: number,
        id: string,
        dice: number,
    }>();

    const [entityLifeManager, setEntityLifeManager] = useState<{
        [entityId: string]: {
            currentLife: number,
            maxLife: number,
        }
    }>({});

    const handleCloseDicePer = () => {
        setdicePers([]);
        setdicePersMod([]);
        setdicePersToRoll([]);
    }

    const handleCloseModals = () => {
        setModalAddEntity(false);
        setModalAddChar(false);
        setModalshowHability(false);
        setRollIniciativeEntity(undefined);
    }

    const getBattle = async () => {
        const q = query(
            collection(db, 'battle'),
            where('campainId', '==', campainId)
        );

        onSnapshot(q, (querySnapshot) => {
            const filteredBattle = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
              })) as battleDataType[];
            if(filteredBattle.length > 0) {
                setBattleData(filteredBattle[0]);
                setBattle(filteredBattle[0].data.turns);
            }
        });
    }

    const handleCreateBattle = async () => {
        await addDoc(collection(db, "battle"), {
            campainId: campainId,
            turns: [],
        }).then(async (item) => {
            toast.success("Batalha criada!");
            setBattleData({
                id: item.id,
                data: {
                    campainId: campainId,
                    turns: [],
                }
            })
        });
    }

    useEffect(() => {
        if (campainId) {
            getBattle();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campainId]);

    const updateBattle = useCallback(async () => {
        if (!battleData?.id) return;
        
        const userDocRef = doc(db, "battle", battleData.id);
        const battleTosave = [...battle];

        if(onTurn) battleTosave.push(onTurn)

        await updateDoc(userDocRef, {
            campainId: campainId,
            turns: battleTosave,
        }).then(() => {toast.success("batalha salva!")});
    }, [battleData?.id, battle, onTurn, campainId]);

    // Auto-save batalha a cada 5 minutos
    useEffect(() => {
        if (battleData?.id && battle.length > 0) {
            const interval = setInterval(() => {
                updateBattle();
            }, 5 * 60 * 1000); // 5 minutos em milissegundos

            return () => clearInterval(interval);
        }
    }, [battleData?.id, battle.length, updateBattle]);

    const rollIniciativeMonster = (mod: number, id: string) => {
        const dice = Math.floor(Math.random() * 20) + 1;
        const result = dice + mod;
        setRollIniciativeEntity({
            id: id,
            result: result,
            dice: dice
        });
    }

    const organize = () => {
        const sorted = [...battle].sort((a, b) => b.iniciative - a.iniciative);
        setBattle(sorted);
    }

    const next = () => {
        const [first, ...rest] = battle;
        
        if(!onTurn) {
            const updatedBattle = [...rest];

            setBattle(updatedBattle);
        } else {
            const updatedBattle = [...rest, onTurn as {
                id: string;
                type: "entity" | "player";
                iniciative: number;
                life?: number;
            }];

            setBattle(updatedBattle);
        }
        // Atualiza o estado
        setOnTurn(first); 
    }

    const removeFromBattle = (itemId: string) => {
        // Remove da lista de batalha
        const updatedBattle = battle.filter(item => item.id !== itemId);
        setBattle(updatedBattle);

        // Se o item removido é o que está na vez, remove também
        if(onTurn && onTurn.id === itemId) {
            setOnTurn(undefined);
        }

        // Remove do gerenciador de vida também
        const updatedLifeManager = { ...entityLifeManager };
        delete updatedLifeManager[itemId];
        setEntityLifeManager(updatedLifeManager);

        toast.success("Removido da batalha!");
    }

    const initializeEntityLife = (entityId: string, maxLife: number) => {
        if (!entityLifeManager[entityId]) {
            setEntityLifeManager(prev => ({
                ...prev,
                [entityId]: {
                    currentLife: maxLife,
                    maxLife: maxLife
                }
            }));
        }
    }

    const updateEntityLife = (entityId: string, change: number) => {
        setEntityLifeManager(prev => {
            const current = prev[entityId];
            if (!current) return prev;

            const newCurrentLife = Math.max(0, Math.min(current.maxLife, current.currentLife + change));
            
            return {
                ...prev,
                [entityId]: {
                    ...current,
                    currentLife: newCurrentLife
                }
            };
        });
    }

    const getEntityCurrentLife = (entityId: string): number => {
        const entity = entitys.find(e => e.id === entityId);
        const lifeData = entityLifeManager[entityId];
        return lifeData?.currentLife ?? entity?.data.life ?? 0;
    }

    const Entity = (itemId: string) => {
        const findEntity = entitys.find((i) => i.id === itemId);

        return (
            <Card sx={{ mb: 2, boxShadow: 1 }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Avatar e Info Básica */}
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar sx={{ width: 40, height: 40 }} />
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {findEntity?.data.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        DEF: {findEntity?.data.defense}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Vida */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ px: 1 }}>
                                <Typography variant="caption" sx={{ mb: 0.5, display: 'block' }}>
                                    Vida: {getEntityCurrentLife(itemId)}/{findEntity?.data.life}
                                </Typography>
                                
                                <LinearProgress 
                                    variant="determinate" 
                                    value={(getEntityCurrentLife(itemId) / (findEntity?.data.life ?? 1)) * 100}
                                    sx={{ 
                                        height: 6, 
                                        borderRadius: 1,
                                        mb: 0.5,
                                        backgroundColor: 'grey.300',
                                        '& .MuiLinearProgress-bar': {
                                            backgroundColor: getEntityCurrentLife(itemId) > (findEntity?.data.life ?? 0) * 0.5 
                                                ? 'success.main' 
                                                : getEntityCurrentLife(itemId) > (findEntity?.data.life ?? 0) * 0.25 
                                                ? 'warning.main' 
                                                : 'error.main'
                                        }
                                    }}
                                />
                                
                                <Box sx={{ display: 'flex', gap: 0.3, justifyContent: 'center' }}>
                                    <Button 
                                        size="small" 
                                        variant="outlined" 
                                        color="error"
                                        onClick={() => updateEntityLife(itemId, -5)}
                                        sx={{ minWidth: '24px', p: 0.3, fontSize: '0.6rem' }}
                                    >
                                        -5
                                    </Button>
                                    <Button 
                                        size="small" 
                                        variant="outlined" 
                                        color="error"
                                        onClick={() => updateEntityLife(itemId, -1)}
                                        sx={{ minWidth: '24px', p: 0.3, fontSize: '0.6rem' }}
                                    >
                                        -1
                                    </Button>
                                    <Button 
                                        size="small" 
                                        variant="outlined" 
                                        color="success"
                                        onClick={() => updateEntityLife(itemId, 1)}
                                        sx={{ minWidth: '24px', p: 0.3, fontSize: '0.6rem' }}
                                    >
                                        +1
                                    </Button>
                                    <Button 
                                        size="small" 
                                        variant="outlined" 
                                        color="success"
                                        onClick={() => updateEntityLife(itemId, 5)}
                                        sx={{ minWidth: '24px', p: 0.3, fontSize: '0.6rem' }}
                                    >
                                        +5
                                    </Button>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Ações e Perícias */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                                        Ações:
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                        {findEntity?.data.actions.slice(0, 3).map((i, index) => (
                                            <Chip 
                                                key={index}
                                                label={i.title} 
                                                size="small"
                                                variant="outlined"
                                                color="primary"
                                                onClick={() => {
                                                    setModalshowHability(true);
                                                    setModalshowHabilityDetails({
                                                        title: i.title,
                                                        description: i.description,
                                                        roll: i.testMod,
                                                        rollMod: i.mod,
                                                        damageRoll: i.damageRoll,
                                                        damageMod: i.damageMod,
                                                    })
                                                }}
                                                sx={{ fontSize: '0.6rem', height: '20px' }}
                                            />
                                        ))}
                                        {(findEntity?.data.actions?.length ?? 0) > 3 && (
                                            <Chip 
                                                label={`+${(findEntity?.data.actions?.length ?? 0) - 3}`} 
                                                size="small"
                                                variant="filled"
                                                color="default"
                                                sx={{ fontSize: '0.6rem', height: '20px' }}
                                            />
                                        )}
                                    </Box>
                                </Box>
                                
                                <Box>
                                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.3 }}>
                                        Perícias:
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                                        {findEntity?.data.perks.slice(0, 2).map((i, index) => (
                                            <Chip 
                                                key={index}
                                                label={i.name} 
                                                size="small"
                                                variant="outlined"
                                                color="secondary"
                                                onClick={() => {
                                                    if(i.mod) setdicePersMod([{
                                                        type: 'pericia',
                                                        name: i.name,
                                                        roll: i.mod
                                                    }]);
                                                    setdicePersToRoll([20]);
                                                }}
                                                sx={{ fontSize: '0.6rem', height: '20px' }}
                                            />
                                        ))}
                                        <Chip 
                                            label="Percepção" 
                                            size="small"
                                            variant="outlined"
                                            color="secondary"
                                            onClick={() => {
                                                if(findEntity?.data.senses.perseption) setdicePersMod([{
                                                    type: 'pericia',
                                                    name: 'Percepção',
                                                    roll: findEntity?.data.senses.perseption
                                                }]);
                                                setdicePersToRoll([20]);
                                            }}
                                            sx={{ fontSize: '0.6rem', height: '20px' }}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Controles */}
                        <Grid item xs={12} md={1}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                                <Button 
                                    size="small" 
                                    variant="contained" 
                                    color="error"
                                    onClick={() => {
                                        const currentLife = getEntityCurrentLife(itemId);
                                        updateEntityLife(itemId, -currentLife);
                                    }}
                                    sx={{ minWidth: '32px', p: 0.5, backgroundColor: '#131313 !important' }}
                                >
                                    💀
                                </Button>
                                <Button 
                                    size="small" 
                                    variant="contained" 
                                    color="success"
                                    onClick={() => {
                                        const maxLife = findEntity?.data.life ?? 0;
                                        const currentLife = getEntityCurrentLife(itemId);
                                        updateEntityLife(itemId, maxLife - currentLife);
                                    }}
                                    sx={{ minWidth: '32px', p: 0.5 }}
                                >
                                    💚
                                </Button>
                                <Button 
                                    size="small" 
                                    variant="outlined" 
                                    color="error"
                                    onClick={() => removeFromBattle(itemId)}
                                    sx={{ minWidth: '32px', p: 0.5, backgroundColor: '#8b0000 !important' }}
                                >
                                    🗑️
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }

    const Player = (itemId: string) => {
        const findPlayer = characters.find((i) => i.id === itemId);
        const findHabilities = habilities.filter((i) => findPlayer?.data.hability.includes(i.id));

        const getStatusColor = (current: number, max: number) => {
            const percentage = (current / max) * 100;
            if (percentage > 75) return 'success.main';
            if (percentage > 50) return 'warning.main';
            if (percentage > 25) return 'error.light';
            return 'error.main';
        };

        return (
            <Card sx={{ mb: 2, boxShadow: 1, borderLeft: '4px solid #1976d2' }}>
                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                    <Grid container spacing={2} alignItems="center">
                        {/* Avatar e Info Básica */}
                        <Grid item xs={12} md={3}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Avatar 
                                    src={findPlayer?.data.img}
                                    sx={{ width: 40, height: 40 }}
                                >
                                    {findPlayer?.data.name?.charAt(0)}
                                </Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {findPlayer?.data.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {findPlayer?.data.class.title}
                                    </Typography>
                                    <br/>
                                    <Typography variant="caption" color="text.secondary">
                                        DEF {findPlayer?.data.defense.normal}
                                    </Typography>
                                </Box>
                            </Box>
                        </Grid>

                        {/* Status do Jogador */}
                        <Grid item xs={12} md={4}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                {/* Vida */}
                                <Box>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 0.2 }}>
                                        Vida: {findPlayer?.data.basics.life.actual}/{findPlayer?.data.basics.life.max}
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={((findPlayer?.data.basics.life.actual ?? 0) / (findPlayer?.data.basics.life.max ?? 1)) * 100}
                                        sx={{ 
                                            height: 4, 
                                            borderRadius: 1,
                                            backgroundColor: 'grey.300',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: getStatusColor(
                                                    findPlayer?.data.basics.life.actual ?? 0, 
                                                    findPlayer?.data.basics.life.max ?? 1
                                                )
                                            }
                                        }}
                                    />
                                </Box>

                                {/* Sanidade */}
                                <Box>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 0.2 }}>
                                        Sanidade: {findPlayer?.data.basics.sanity.actual}/{findPlayer?.data.basics.sanity.max}
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={((findPlayer?.data.basics.sanity.actual ?? 0) / (findPlayer?.data.basics.sanity.max ?? 1)) * 100}
                                        sx={{ 
                                            height: 4, 
                                            borderRadius: 1,
                                            backgroundColor: 'grey.300',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: '#9c27b0'
                                            }
                                        }}
                                    />
                                </Box>

                                {/* PE */}
                                <Box>
                                    <Typography variant="caption" sx={{ display: 'block', mb: 0.2 }}>
                                        PE: {findPlayer?.data.basics.pe.actual}/{findPlayer?.data.basics.pe.max}
                                    </Typography>
                                    <LinearProgress 
                                        variant="determinate" 
                                        value={((findPlayer?.data.basics.pe.actual ?? 0) / (findPlayer?.data.basics.pe.max ?? 1)) * 100}
                                        sx={{ 
                                            height: 4, 
                                            borderRadius: 1,
                                            backgroundColor: 'grey.300',
                                            '& .MuiLinearProgress-bar': {
                                                backgroundColor: '#ff9800'
                                            }
                                        }}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        {/* Habilidades */}
                        <Grid item xs={12} md={4}>
                            <Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
                                    Habilidades:
                                </Typography>
                                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', maxHeight: '60px', overflow: 'auto' }}>
                                    {findHabilities.slice(0, 6).map((i, index) => (
                                        <Chip 
                                            key={index}
                                            label={i.data.name} 
                                            size="small"
                                            variant="outlined"
                                            color="primary"
                                            onClick={() => {
                                                setModalshowHability(true);
                                                setModalshowHabilityDetails({
                                                    title: i.data.name,
                                                    description: i.data.description,
                                                })
                                            }}
                                            sx={{ fontSize: '0.6rem', height: '20px' }}
                                        />
                                    ))}
                                    {findHabilities.length > 6 && (
                                        <Chip 
                                            label={`+${findHabilities.length - 6}`} 
                                            size="small"
                                            variant="filled"
                                            color="default"
                                            sx={{ fontSize: '0.6rem', height: '20px' }}
                                        />
                                    )}
                                </Box>
                            </Box>
                        </Grid>

                        {/* Controles */}
                        <Grid item xs={12} md={1}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, alignItems: 'center' }}>
                                <Button 
                                    size="small" 
                                    variant="outlined" 
                                    color="primary"
                                    sx={{ 
                                        minWidth: '32px', 
                                        p: 0.5, 
                                        fontSize: '0.7rem',
                                        textTransform: 'none'
                                    }}
                                >
                                    📊
                                </Button>
                                <Button 
                                    size="small" 
                                    variant="outlined" 
                                    color="error"
                                    onClick={() => removeFromBattle(itemId)}
                                    sx={{ minWidth: '32px', p: 0.5, fontSize: '0.6rem' }}
                                >
                                    🗑️
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        )
    }

    return (
        <>
        <Container>
            <div className='head'>
                {!battleData && 
                    <>
                    <button onClick={() => handleCreateBattle()}>Criar batalha nova</button>
                    </>
                }
                {!!battleData && 
                    <>
                    <button onClick={() => updateBattle()}>Salvar</button>
                    <button onClick={() => setBattle([])}>Finalizar batalha</button>
                    <button onClick={() => organize()}>Organizar vez</button>
                    <button onClick={() => setModalAddChar(true)}>Adicionar player</button>
                    <button onClick={() => setModalAddEntity(true)}>Adicionar entidade</button>
                    </>
                }
            </div>
            {!!battleData && <>
            <div className='body'>
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
                                                const newDices = dicePersMod?.filter((i, index) => index !== keyMod);
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
                <div className='game'>
                    <div className='onThePlay'>
                        <div className='top'>
                            <p>É a vez de...</p>
                            <div>
                                <button>Turno anterior</button>
                                <button onClick={() => next()}>Proximo turno</button>
                            </div>
                        </div>
                        
                        {onTurn && <>
                                {onTurn.type === 'entity' ? <>
                                    {Entity(onTurn.id)}
                                </> : <>
                                    {Player(onTurn.id)}
                                </>}
                        </>}
                    </div>

                    <div className='onTheWait'>
                        <div className='top'>
                            <p>Os próximos são:</p>
                        </div>
                        
                        {battle.map((itemBattle) => (
                            <>
                                {itemBattle.type === 'entity' ? <>
                                    {Entity(itemBattle.id)}
                                </> : <>
                                    {Player(itemBattle.id)}
                                </>}
                            </>
                        ))}
                    </div>
                </div>
            </div>
            </>}
        </Container>

        <Modal handleCloseModal={handleCloseModals} isOpen={modalAddEntity}>
            <Box sx={{ maxWidth: 600, width: '600px' }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                    Adicionar Entidades
                </Typography>
                
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {entitys.map((item, key) => (
                        <Card key={key} sx={{ mb: 2, boxShadow: 2 }}>
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={4}>
                                        <Typography variant="h6" component="div">
                                            {item.data.name}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Vida: {item.data.life}
                                        </Typography>
                                    </Grid>
                                    
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Button 
                                                variant="contained" 
                                                color="primary" 
                                                size="small"
                                                onClick={() => rollIniciativeMonster(item.data.senses.iniciative ?? 0, item.id)}
                                                sx={{ mb: 1 }}
                                            >
                                                Rolar Iniciativa
                                            </Button>
                                            {rollIniciativeEntity && rollIniciativeEntity.id === item.id && (
                                                <Typography variant="body2" color="success.main">
                                                    Resultado: ({rollIniciativeEntity.dice}) {rollIniciativeEntity.result}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Grid>
                                    
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            {rollIniciativeEntity && rollIniciativeEntity.id === item.id && (
                                                <Button 
                                                    variant="contained" 
                                                    color="success" 
                                                    onClick={() => {
                                                        // Inicializa a vida da entidade
                                                        initializeEntityLife(item.id, item.data.life);
                                                        
                                                        setBattle([
                                                            ...battle,
                                                            {
                                                                id: item.id,
                                                                type: 'entity',
                                                                iniciative: rollIniciativeEntity?.result ?? 0,
                                                                life: item.data.life,
                                                            }   
                                                        ])
                                                        handleCloseModals();
                                                    }}
                                                >
                                                    Adicionar à Batalha
                                                </Button>
                                            )}
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Modal>
        
        <Modal handleCloseModal={handleCloseModals} isOpen={modalAddChar}>
            <Box sx={{ maxWidth: 800, width: '100%' }}>
                <Typography variant="h5" component="h2" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold' }}>
                    Adicionar Personagens
                </Typography>
                
                <Box sx={{ maxHeight: 400, overflow: 'auto' }}>
                    {characters.map((item, key) => (
                        <Card key={key} sx={{ mb: 2, boxShadow: 2 }}>
                            <CardContent>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Avatar 
                                                src={item.data.img} 
                                                alt={item.data.name}
                                                sx={{ width: 40, height: 40 }}
                                            />
                                            <Box>
                                                <Typography variant="h6" component="div">
                                                    {item.data.name}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    Jogador
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                    
                                    <Grid item xs={12} md={4}>
                                        <TextField 
                                            fullWidth
                                            label="Iniciativa" 
                                            type="number" 
                                            variant="outlined"
                                            size="small"
                                            value={playerIniciative?.id === item.id ? playerIniciative?.iniciative : ""} 
                                            onChange={(e) => {
                                                setPlayerIniciative({
                                                    iniciative: Number(e.target.value ?? 0),
                                                    id: item.id
                                                });
                                            }} 
                                        />
                                    </Grid>
                                    
                                    <Grid item xs={12} md={4}>
                                        <Box sx={{ textAlign: 'center' }}>
                                            <Button 
                                                variant="contained" 
                                                color="success"
                                                disabled={!playerIniciative || playerIniciative.id !== item.id || !playerIniciative.iniciative}
                                                onClick={() => {
                                                    setBattle([
                                                        ...battle,
                                                        {
                                                            id: item.id,
                                                            type: 'player',
                                                            iniciative: playerIniciative?.iniciative ?? 0,
                                                        }   
                                                    ])
                                                    handleCloseModals();
                                                }}
                                            >
                                                Adicionar à Batalha
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            </Box>
        </Modal>

        <Modal handleCloseModal={handleCloseModals} isOpen={modalshowHability}>
            <Box sx={{ maxWidth: 500, width: '100%', p: 3, backgroundColor: 'white', borderRadius: 1 }}>
                <Typography variant="h5" component="h2" sx={{ mb: 2, textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
                    {modalshowHabilityDetails?.title}
                </Typography>
                
                <Card sx={{ mb: 3, boxShadow: 2 }}>
                    <CardContent>
                        <Typography variant="body1" sx={{ mb: 2, textAlign: 'justify', lineHeight: 1.6 }}>
                            {modalshowHabilityDetails?.description}
                        </Typography>

                        {modalshowHabilityDetails?.roll && (
                            <Box sx={{ mb: 2, p: 2, backgroundColor: 'action.hover', borderRadius: 1 }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold', color: 'text.secondary' }}>
                                    <strong>Teste:</strong> d{modalshowHabilityDetails?.roll} 
                                    {modalshowHabilityDetails?.rollMod && ` + ${modalshowHabilityDetails?.rollMod}`}
                                </Typography>
                            </Box>
                        )}
                        
                        {modalshowHabilityDetails?.damageRoll && (
                            <Box sx={{ p: 2, backgroundColor: 'error.light', borderRadius: 1, color: 'white' }}>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    <strong>Dano:</strong> [{modalshowHabilityDetails?.damageRoll.join(', ')}]
                                    {modalshowHabilityDetails?.damageMod && ` + ${modalshowHabilityDetails?.damageMod}`}
                                </Typography>
                            </Box>
                        )}
                    </CardContent>
                </Card>

                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {!!modalshowHabilityDetails?.roll && (
                        <Button 
                            variant="contained" 
                            color="primary"
                            size="large"
                            startIcon={<i className="fa-solid fa-dice-d20" />}
                            onClick={() => {
                                if(modalshowHabilityDetails.rollMod) setdicePersMod([{
                                    type: 'habilidade',
                                    name: modalshowHabilityDetails.title,
                                    roll: modalshowHabilityDetails.rollMod
                                }]);
                                setdicePersToRoll([modalshowHabilityDetails?.roll ?? 20]);
                            }}
                            sx={{ minWidth: 140 }}
                        >
                            Rolar Teste
                        </Button>
                    )}

                    {!!modalshowHabilityDetails?.damageRoll && (
                        <Button 
                            variant="contained" 
                            color="error"
                            size="large"
                            startIcon={<i className="fa-solid fa-sword" />}
                            onClick={() => {
                                if(modalshowHabilityDetails.damageMod) setdicePersMod([{
                                    type: 'damage',
                                    name: 'Dano adicional',
                                    roll: modalshowHabilityDetails.damageMod
                                }]);
                                setdicePersToRoll(modalshowHabilityDetails?.damageRoll ?? []);
                            }}
                            sx={{ minWidth: 140 }}
                        >
                            Rolar Dano
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
        
        {dicePersToRoll && dicePersToRoll.length > 0 &&
            <Roll dice={dicePersToRoll} mod={dicePersMod} setdice={setdicePersToRoll} setdiceMod={setdicePersMod} onClose={() => {handleCloseDicePer()}} />
        }
        </>
    )
}

export default Battle;