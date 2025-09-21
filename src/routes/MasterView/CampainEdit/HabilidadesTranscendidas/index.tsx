import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { avatarDataType, buffPerkType, buffPerkVantageType, habilityTranscendedDataType, habilityTranscendedType, perkDataType } from '../../../../types';
import TextField from '@mui/material/TextField';
import { addDoc, arrayUnion, collection, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { ColorRing } from 'react-loader-spinner';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { Box, Tab, Tabs, Chip } from '@mui/material';
import { a11yProps } from '../../../../utils/components';
import DarkModeIcon from '@mui/icons-material/DarkMode';

type props = {
    toast: any;
    habilityTranscended: habilityTranscendedDataType[]
    characters: avatarDataType[];
    perks: perkDataType[];
    campainId?: string;
}

const HabilidadesTranscendidas = ({toast, characters, habilityTranscended, perks, campainId}: props) => {

    const [habilityTranscendedSelected, setHabilityTranscendedSelected] = useState<habilityTranscendedDataType>();

    const [isToAdd, setIsToAdd] = useState<boolean>(false);

    const [requireToAdd, setRequireToAdd] = useState<string>("");

    const [buffModPerkToAdd, setBuffModPerkToAdd] = useState<buffPerkType>({
        perkId: "",
        perkName: "",
        value: 0,
    });

    const [buffVantageToAdd, setBuffVantageToAdd] = useState<buffPerkVantageType>({
        perkId: "",
        perkName: "",
    });

    const [isToAddTotalPv, setIsToAddTotalPv] = useState<boolean>(false);
    const [isToAddPvPerLevel, setIsToAddPvPerLevel] = useState<boolean>(false);
    const [isToAddPerkBuff, setIsToAddPerkBuff] = useState<boolean>(false);
    const [isToAddVantage, setIsToAddVantage] = useState<boolean>(false);

    const [loading, setLoading] = useState<boolean>(false);

    const [habilityTranscendedForm, setHabilityTranscendedForm] = useState<habilityTranscendedType>({
        description: "",
        name: "",
        require: [],
        buff: {},
        type: "",
        verified: true,
    });

    useEffect(() => {
        if(habilityTranscendedSelected){
            setHabilityTranscendedForm(habilityTranscendedSelected.data);
            setIsToAdd(false);
            setRequireToAdd("");
            setBuffModPerkToAdd({
                perkId: "",
                perkName: "",
                value: 0,
            });

            if(habilityTranscendedSelected.data.buff?.lifePerLevel?.value) setIsToAddPvPerLevel(true);
                else setIsToAddPvPerLevel(false);
            if(habilityTranscendedSelected.data.buff?.lifeTotal?.value) setIsToAddTotalPv(true);
                else setIsToAddTotalPv(false);
            if(!!habilityTranscendedSelected.data.buff?.modifyRoll?.length) setIsToAddPerkBuff(true);
                else setIsToAddPerkBuff(false);
            if(!!habilityTranscendedSelected.data.buff?.rollVantage?.length) setIsToAddVantage(true);
                else setIsToAddVantage(false);
        }
    }, [habilityTranscendedSelected]);

    const handleHabilityTranscended = async () => {
        const newHabilityTranscendedDataForm: habilityTranscendedType = {
            description: habilityTranscendedForm.description,
            name: habilityTranscendedForm.name,
            require: habilityTranscendedForm.require ?? [],
            buff: {
                rollVantage: isToAddVantage ? habilityTranscendedForm.buff?.rollVantage : [],
                lifePerLevel: isToAddPvPerLevel ? habilityTranscendedForm.buff?.lifePerLevel : Object(),
                lifeTotal: isToAddTotalPv ? habilityTranscendedForm.buff?.lifeTotal : Object(),
                modifyRoll: isToAddPerkBuff ? habilityTranscendedForm.buff?.modifyRoll : [] as unknown as buffPerkType[] | undefined,
            },
            type: habilityTranscendedForm.type,
            verified: true,
        }

        setLoading(true);
        if (isToAdd) {
            await addDoc(collection(db, "habilityTrans"), newHabilityTranscendedDataForm).then(async (data) => {

                if (campainId) {
                    await updateDoc(doc(db, "campains", campainId), {
                        habilityTrans: arrayUnion(data.id)
                    });
                }

                toast.success("Habilidade transcendida criada!");
                setHabilityTranscendedForm({
                    description: "",
                    name: "",
                    require: [],
                    buff: {},
                    type: "",
                    verified: true,
                });
                setRequireToAdd("");
                setBuffModPerkToAdd({
                    perkId: "",
                    perkName: "",
                    value: 0,
                });

                setIsToAddPvPerLevel(false);
                setIsToAddTotalPv(false);
                setIsToAddPerkBuff(false);
                setIsToAddVantage(false);
            });

        } else {
            const habilityTranscendedDocRef = doc(db, "habilityTrans", habilityTranscendedSelected?.id ?? '');

            await updateDoc(habilityTranscendedDocRef, newHabilityTranscendedDataForm).then(() => {toast.success("Habilidade transcendida atualizada!")});
        }

        setLoading(false);
    }

    const prepareToAdd = () => {
        setHabilityTranscendedForm({
            description: "",
            name: "",
            require: [],
            buff: {},
            type: "",
            verified: true,
        });
        setRequireToAdd("");
        setBuffModPerkToAdd({
            perkId: "",
            perkName: "",
            value: 0,
        });
        setIsToAddPvPerLevel(false);
        setIsToAddTotalPv(false);
        setIsToAddPerkBuff(false);
        setIsToAddVantage(false);
        setIsToAdd(true);
        setHabilityTranscendedSelected(undefined);
    }

    const handleDeleteHabilityTranscended = async () => {
        if (habilityTranscendedSelected) {
            const docDelete = doc(db, "habilityTrans", habilityTranscendedSelected.id);
            await deleteDoc(docDelete).then(() => {
                toast.success("Habilidade transcendida deletada!");
                setIsToAdd(true);
                setHabilityTranscendedSelected(undefined);
                setLoading(false);
            });
        }
    }

    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <>
        <Container>
            <div>
                <div className='left'>
                    {habilityTranscended.map((i, key) => (
                        <button className={`${habilityTranscendedSelected === i ? 'selected' : ''}`} key={key} onClick={() => setHabilityTranscendedSelected(i)}>
                            <DarkModeIcon style={{fontSize: '16px'}} />
                            {i.data.name}
                        </button>
                    ))}
                    <button className='add' onClick={prepareToAdd}>
                        <i className="fa-solid fa-plus"></i> 
                        <DarkModeIcon style={{fontSize: '16px', marginLeft: '4px'}} />
                        {habilityTranscended.length <= 0 ? 'Adicionar habilidade transcendida' : ''}
                    </button>
                </div>
                <div className={`right ${habilityTranscended.length <= 0 && !isToAdd ? 'noClasses' : ''}`}>
                    {loading ? <>
                        <div className='isLoading'>
                            <ColorRing
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="color-ring-loading"
                                wrapperStyle={{}}
                                wrapperClass="color-ring-wrapper"
                                colors={['#6a1b9a', '#8e24aa', '#ab47bc', '#ba68c8', '#ce93d8']}
                            />
                        </div>
                    </> : <>
                        {(habilityTranscendedSelected || isToAdd) ? <>
                            <div className='name'>
                                <TextField 
                                    id="standard-basic" 
                                    label="Nome da habilidade transcendida" 
                                    variant="filled" 
                                    value={habilityTranscendedForm.name} 
                                    onChange={(e) => {
                                        setHabilityTranscendedForm({
                                            ...habilityTranscendedForm,
                                            name: e.target.value
                                        });
                                    }} 
                                />
                            </div>
                            <div className='description'>
                                <TextField
                                    id="standard-multiline-static"
                                    label="Descrição da habilidade transcendida"
                                    multiline
                                    rows={4}
                                    value={habilityTranscendedForm.description}
                                    variant="filled"
                                    onChange={(e) => {
                                        setHabilityTranscendedForm({
                                            ...habilityTranscendedForm,
                                            description: e.target.value
                                        });
                                    }}
                                />
                            </div>   
                            <div className='description'>
                                <FormControl variant="filled" sx={{ minWidth: 120 }}>
                                    <InputLabel id="demo-simple-select-filled-label">Tipo</InputLabel>
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={habilityTranscendedForm.type}
                                        label="tipo"
                                        variant="filled"
                                        onChange={(e) => {
                                            setHabilityTranscendedForm({
                                                ...habilityTranscendedForm,
                                                type: e.target.value
                                            });
                                        }}
                                    >
                                        <MenuItem value={'active'}>Ativa</MenuItem>
                                        <MenuItem value={'passive'}>Passiva</MenuItem>
                                    </Select>
                                </FormControl>
                            </div>

                            <div className='infos'>
                                <div className='infoInput'>
                                    <TextField 
                                        id="standard-basic" 
                                        label="Pré-requisito" 
                                        variant="filled" 
                                        value={requireToAdd} 
                                        onChange={(e) => {
                                            setRequireToAdd(e.target.value);
                                        }} 
                                    />
                                    <button onClick={() => {
                                        if (requireToAdd.trim()) {
                                            const newRequires = [...(habilityTranscendedForm.require || []), requireToAdd];
                                            setHabilityTranscendedForm({
                                                ...habilityTranscendedForm,
                                                require: newRequires
                                            });
                                            setRequireToAdd("");
                                        }
                                    }}>Adicionar</button>
                                </div>
                                <div className='requireList'>
                                    {habilityTranscendedForm.require?.map((req, key) => (
                                        <Chip 
                                            key={key} 
                                            label={req} 
                                            onDelete={() => {
                                                const newRequires = habilityTranscendedForm.require?.filter((_, index) => index !== key);
                                                setHabilityTranscendedForm({
                                                    ...habilityTranscendedForm,
                                                    require: newRequires
                                                });
                                            }} 
                                            variant="outlined" 
                                        />
                                    ))}
                                </div>
                            </div>

                            <Box sx={{ width: '100%' }}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                                        <Tab label="Buffs de Vida" {...a11yProps(0)} />
                                        <Tab label="Modificadores de Rolagem" {...a11yProps(1)} />
                                        <Tab label="Vantagens em Rolagem" {...a11yProps(2)} />
                                        <Tab label="Personagens Afetados" {...a11yProps(3)} />
                                    </Tabs>
                                </Box>

                                {/* Tab 0 - Buffs de Vida */}
                                <div role="tabpanel" hidden={value !== 0} className="tabPanel">
                                    {value === 0 && (
                                        <>
                                            <div className='buffSection'>
                                                <div className='buffTitle'>Vida por Nível</div>
                                                <div className='buffItem'>
                                                    <input
                                                        type="checkbox"
                                                        checked={isToAddPvPerLevel}
                                                        onChange={(e) => setIsToAddPvPerLevel(e.target.checked)}
                                                    />
                                                    <span>Ativar buff de vida por nível</span>
                                                </div>
                                                {isToAddPvPerLevel && (
                                                    <div className='buffItem'>
                                                        <input
                                                            type="number"
                                                            placeholder="Valor"
                                                            value={habilityTranscendedForm.buff?.lifePerLevel?.value || ''}
                                                            onChange={(e) => {
                                                                setHabilityTranscendedForm({
                                                                    ...habilityTranscendedForm,
                                                                    buff: {
                                                                        ...habilityTranscendedForm.buff,
                                                                        lifePerLevel: { value: Number(e.target.value) }
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                        <span>pontos de vida por nível</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className='buffSection'>
                                                <div className='buffTitle'>Vida Total</div>
                                                <div className='buffItem'>
                                                    <input
                                                        type="checkbox"
                                                        checked={isToAddTotalPv}
                                                        onChange={(e) => setIsToAddTotalPv(e.target.checked)}
                                                    />
                                                    <span>Ativar buff de vida total</span>
                                                </div>
                                                {isToAddTotalPv && (
                                                    <div className='buffItem'>
                                                        <input
                                                            type="number"
                                                            placeholder="Valor"
                                                            value={habilityTranscendedForm.buff?.lifeTotal?.value || ''}
                                                            onChange={(e) => {
                                                                setHabilityTranscendedForm({
                                                                    ...habilityTranscendedForm,
                                                                    buff: {
                                                                        ...habilityTranscendedForm.buff,
                                                                        lifeTotal: { value: Number(e.target.value) }
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                        <span>pontos de vida totais</span>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {/* Tab 1 - Modificadores de Rolagem */}
                                <div role="tabpanel" hidden={value !== 1} className="tabPanel">
                                    {value === 1 && (
                                        <div className='buffSection'>
                                            <div className='buffTitle'>Modificadores de Perícia</div>
                                            <div className='buffItem'>
                                                <select
                                                    value={buffModPerkToAdd.perkId}
                                                    onChange={(e) => {
                                                        const selectedPerk = perks.find(p => p.id === e.target.value);
                                                        setBuffModPerkToAdd({
                                                            ...buffModPerkToAdd,
                                                            perkId: e.target.value,
                                                            perkName: selectedPerk?.data.name || ""
                                                        });
                                                    }}
                                                >
                                                    <option value="">Selecionar perícia</option>
                                                    {perks.map((perk) => (
                                                        <option key={perk.id} value={perk.id}>{perk.data.name}</option>
                                                    ))}
                                                </select>
                                                <input
                                                    type="number"
                                                    placeholder="Modificador"
                                                    value={buffModPerkToAdd.value}
                                                    onChange={(e) => setBuffModPerkToAdd({
                                                        ...buffModPerkToAdd,
                                                        value: Number(e.target.value)
                                                    })}
                                                />
                                                <button onClick={() => {
                                                    if (buffModPerkToAdd.perkId && buffModPerkToAdd.value !== 0) {
                                                        const newModifyRoll = [...(habilityTranscendedForm.buff?.modifyRoll || []), buffModPerkToAdd];
                                                        setHabilityTranscendedForm({
                                                            ...habilityTranscendedForm,
                                                            buff: {
                                                                ...habilityTranscendedForm.buff,
                                                                modifyRoll: newModifyRoll
                                                            }
                                                        });
                                                        setBuffModPerkToAdd({ perkId: "", perkName: "", value: 0 });
                                                        setIsToAddPerkBuff(true);
                                                    }
                                                }}>Adicionar</button>
                                            </div>
                                            <div className='buffList'>
                                                {habilityTranscendedForm.buff?.modifyRoll?.map((buff, index) => (
                                                    <div key={index} className='buffListItem'>
                                                        <span>{buff.perkName}: {buff.value > 0 ? '+' : ''}{buff.value}</span>
                                                        <button className="remove" onClick={() => {
                                                            const newModifyRoll = habilityTranscendedForm.buff?.modifyRoll?.filter((_, i) => i !== index);
                                                            setHabilityTranscendedForm({
                                                                ...habilityTranscendedForm,
                                                                buff: {
                                                                    ...habilityTranscendedForm.buff,
                                                                    modifyRoll: newModifyRoll
                                                                }
                                                            });
                                                            if (!newModifyRoll?.length) setIsToAddPerkBuff(false);
                                                        }}>×</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Tab 2 - Vantagens em Rolagem */}
                                <div role="tabpanel" hidden={value !== 2} className="tabPanel">
                                    {value === 2 && (
                                        <div className='buffSection'>
                                            <div className='buffTitle'>Vantagens em Perícias</div>
                                            <div className='buffItem'>
                                                <select
                                                    value={buffVantageToAdd.perkId}
                                                    onChange={(e) => {
                                                        const selectedPerk = perks.find(p => p.id === e.target.value);
                                                        setBuffVantageToAdd({
                                                            perkId: e.target.value,
                                                            perkName: selectedPerk?.data.name || ""
                                                        });
                                                    }}
                                                >
                                                    <option value="">Selecionar perícia</option>
                                                    {perks.map((perk) => (
                                                        <option key={perk.id} value={perk.id}>{perk.data.name}</option>
                                                    ))}
                                                </select>
                                                <button onClick={() => {
                                                    if (buffVantageToAdd.perkId) {
                                                        const newRollVantage = [...(habilityTranscendedForm.buff?.rollVantage || []), buffVantageToAdd];
                                                        setHabilityTranscendedForm({
                                                            ...habilityTranscendedForm,
                                                            buff: {
                                                                ...habilityTranscendedForm.buff,
                                                                rollVantage: newRollVantage
                                                            }
                                                        });
                                                        setBuffVantageToAdd({ perkId: "", perkName: "" });
                                                        setIsToAddVantage(true);
                                                    }
                                                }}>Adicionar</button>
                                            </div>
                                            <div className='buffList'>
                                                {habilityTranscendedForm.buff?.rollVantage?.map((buff, index) => (
                                                    <div key={index} className='buffListItem'>
                                                        <span>Vantagem em: {buff.perkName}</span>
                                                        <button className="remove" onClick={() => {
                                                            const newRollVantage = habilityTranscendedForm.buff?.rollVantage?.filter((_, i) => i !== index);
                                                            setHabilityTranscendedForm({
                                                                ...habilityTranscendedForm,
                                                                buff: {
                                                                    ...habilityTranscendedForm.buff,
                                                                    rollVantage: newRollVantage
                                                                }
                                                            });
                                                            if (!newRollVantage?.length) setIsToAddVantage(false);
                                                        }}>×</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Tab 3 - Personagens Afetados */}
                                <div role="tabpanel" hidden={value !== 3} className="tabPanel">
                                    {value === 3 && (
                                        <div className='characters'>
                                            {characters
                                                .filter(char => char.data.habilityTranscended?.includes(habilityTranscendedSelected?.id || ""))
                                                .map((char, index) => (
                                                    <div key={index} className='character'>
                                                        <div className='name'>{char.data.name}</div>
                                                        <div className='info'>
                                                            Nível {char.data.level} - {char.data.class.title}
                                                        </div>
                                                    </div>
                                                ))
                                            }
                                            {characters.filter(char => char.data.habilityTranscended?.includes(habilityTranscendedSelected?.id || "")).length === 0 && (
                                                <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>
                                                    Nenhum personagem possui esta habilidade transcendida
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Box>

                            <div className='buttons'>
                                <button 
                                    onClick={() => {
                                        setIsToAdd(false);
                                        setHabilityTranscendedSelected(undefined);
                                        setValue(0);
                                    }}
                                    className="cancel"
                                >
                                    Cancelar
                                </button>
                                {!isToAdd && habilityTranscendedSelected && (
                                    <button 
                                        onClick={handleDeleteHabilityTranscended}
                                        className="delete"
                                    >
                                        Deletar
                                    </button>
                                )}
                                <button 
                                    onClick={handleHabilityTranscended}
                                    disabled={!habilityTranscendedForm.name}
                                >
                                    {isToAdd ? 'Criar' : 'Atualizar'}
                                </button>
                            </div>
                        </> : <>
                            <div style={{textAlign: 'center', padding: '40px', color: '#666'}}>
                                <DarkModeIcon style={{fontSize: '48px', marginBottom: '16px', opacity: 0.5}} />
                                <p>Selecione uma habilidade transcendida para editar ou clique em adicionar para criar uma nova.</p>
                            </div>
                        </>}
                    </>}
                </div>
            </div>
        </Container>
        </>
    );
};

export default HabilidadesTranscendidas;