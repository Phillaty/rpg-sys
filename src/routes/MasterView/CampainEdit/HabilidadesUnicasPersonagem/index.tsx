import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { avatarDataType, habilityCharUniqueDataType, habilityCharUniqueType } from '../../../../types';
import TextField from '@mui/material/TextField';
import { addDoc, collection, deleteDoc, doc, updateDoc, query, onSnapshot } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { ColorRing } from 'react-loader-spinner';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

type props = {
    toast: any;
    characters: avatarDataType[];
}

const HabilidadesUnicasPersonagem = ({ toast, characters }: props) => {

    const [habilitySelected, setHabilitySelected] = useState<habilityCharUniqueDataType>();
    const [habilities, setHabilities] = useState<habilityCharUniqueDataType[]>([]);
    const [isToAdd, setIsToAdd] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);

    const [habilityForm, setHabilityForm] = useState<habilityCharUniqueType>({
        title: "",
        description: "",
        characterId: "",
    });

    useEffect(() => {
        if (habilitySelected) {
            setHabilityForm(habilitySelected.data);
            setIsToAdd(false);
        }
    }, [habilitySelected]);

    useEffect(() => {
        getHabilities();
    }, []);

    const getHabilities = async () => {
        const p = query(collection(db, 'habilityCharUnique'));

        onSnapshot(p, (querySnapshot) => {
            const docData = querySnapshot.docs.map(doc => ({
                id: doc.id,
                data: doc.data(),
            })) as habilityCharUniqueDataType[];

            const sorted = docData.sort((a, b) => a.data.title.localeCompare(b.data.title));
            setHabilities(sorted);
        });
    }

    const handleHability = async () => {
        if (!habilityForm.title || !habilityForm.description || !habilityForm.characterId) {
            toast.error('Preencha todos os campos obrigatórios!');
            return;
        }

        setLoading(true);
        try {
            if (isToAdd) {
                await addDoc(collection(db, 'habilityCharUnique'), habilityForm);
                toast.success('Habilidade única criada com sucesso!');
            } else {
                if (habilitySelected) {
                    const docRef = doc(db, 'habilityCharUnique', habilitySelected.id);
                    await updateDoc(docRef, habilityForm);
                    toast.success('Habilidade única atualizada com sucesso!');
                }
            }
            cleanForm();
        } catch (error) {
            toast.error('Erro ao processar habilidade única!');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteHability = async () => {
        if (!habilitySelected) return;

        if (window.confirm('Tem certeza que deseja excluir esta habilidade única?')) {
            setLoading(true);
            try {
                await deleteDoc(doc(db, 'habilityCharUnique', habilitySelected.id));
                toast.success('Habilidade única excluída com sucesso!');
                cleanForm();
            } catch (error) {
                toast.error('Erro ao excluir habilidade única!');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    const cleanForm = () => {
        setHabilityForm({
            title: "",
            description: "",
            characterId: "",
        });
        setHabilitySelected(undefined);
        setIsToAdd(false);
    };

    const handleFormChange = (field: keyof habilityCharUniqueType, value: string) => {
        setHabilityForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const getCharacterName = (characterId: string) => {
        const character = characters.find(char => char.id === characterId);
        return character?.data.name || 'Personagem não encontrado';
    };

    return (
        <Container>
            <div className='left'>
                <div className='title'>
                    <p>Habilidades Únicas de Personagem</p>
                </div>
                <div className='divAdd'>
                    <button 
                        onClick={() => {
                            cleanForm();
                            setIsToAdd(true);
                        }}
                    >
                        <i className="fa-solid fa-plus"></i> Adicionar
                    </button>
                </div>
                <div className='list'>
                    {habilities.map((hability, key) => (
                        <div 
                            className={`item ${habilitySelected?.id === hability.id ? 'selected' : ''}`} 
                            key={key}
                            onClick={() => setHabilitySelected(hability)}
                        >
                            <div className='info'>
                                <p className='name'>{hability.data.title}</p>
                                <p className='character'>{getCharacterName(hability.data.characterId)}</p>
                                <p className='description'>{hability.data.description.substring(0, 50)}...</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className='right'>
                <div className='title'>
                    <p>{isToAdd ? 'Adicionar' : 'Editar'} Habilidade Única</p>
                </div>
                <div className='form'>
                    <TextField
                        fullWidth
                        label="Título *"
                        variant="outlined"
                        value={habilityForm.title}
                        onChange={(e) => handleFormChange('title', e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />

                    <FormControl fullWidth style={{ marginBottom: '16px' }}>
                        <InputLabel>Personagem *</InputLabel>
                        <Select
                            value={habilityForm.characterId}
                            onChange={(e) => handleFormChange('characterId', e.target.value)}
                        >
                            {characters.map((character) => (
                                <MenuItem key={character.id} value={character.id}>
                                    {character.data.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        fullWidth
                        multiline
                        rows={8}
                        label="Descrição *"
                        variant="outlined"
                        value={habilityForm.description}
                        onChange={(e) => handleFormChange('description', e.target.value)}
                        style={{ marginBottom: '16px' }}
                    />

                    <div className='actions'>
                        {loading ? (
                            <ColorRing
                                visible={true}
                                height="40"
                                width="40"
                                ariaLabel="blocks-loading"
                                wrapperStyle={{}}
                                wrapperClass="blocks-wrapper"
                                colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
                            />
                        ) : (
                            <>
                                <button onClick={handleHability}>
                                    {isToAdd ? 'Criar' : 'Atualizar'}
                                </button>
                                {!isToAdd && habilitySelected && (
                                    <button className='delete' onClick={handleDeleteHability}>
                                        Excluir
                                    </button>
                                )}
                                <button className='cancel' onClick={cleanForm}>
                                    Cancelar
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default HabilidadesUnicasPersonagem;