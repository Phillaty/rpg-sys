import React, { useEffect, useState } from 'react';
import { documentDataType, avatarDataType } from '../../../../types';
import { addDoc, collection, onSnapshot, query, where, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { uploadImage } from '../../../../utils';
import { toast } from 'react-toastify';
import { Chip, TextField, Select, MenuItem, FormControl, InputLabel, Autocomplete, Modal, Box, IconButton, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Container } from './styles';

type DocumentsProps = {
    campainId: string;
    characters: avatarDataType[];
}

const Documents: React.FC<DocumentsProps> = ({ campainId, characters }) => {
    const [documents, setDocuments] = useState<documentDataType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [searchTerm, setSearchTerm] = useState<string>('');
    
    const [formData, setFormData] = useState({
        name: '',
        importance: 'baixo' as 'baixo' | 'médio' | 'alto',
        difficulty: 'baixo' as 'baixo' | 'médio' | 'alto',
        location: '',
        characterId: ''
    });
    
    const [fileDocument, setFileDocument] = useState<File>();
    const [fileDocumentPreview, setFileDocumentPreview] = useState<string>();
    
    // Estados para o modal de visualização
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [selectedDocument, setSelectedDocument] = useState<documentDataType | null>(null);

    const getDocuments = async () => {
        if (campainId) {
            const q = query(
                collection(db, 'documents'),
                where('campainId', '==', campainId)
            );

            onSnapshot(q, (querySnapshot) => {
                const docData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                })) as documentDataType[];

                const sorted = docData.sort((a, b) => a.data.name.localeCompare(b.data.name));
                setDocuments(sorted);
            });
        }
    }

    useEffect(() => {
        getDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campainId]);

    const handleCreateDocument = async () => {
        if (!formData.name.trim()) {
            toast.error("Nome do documento é obrigatório!");
            return;
        }

        if (!fileDocument) {
            toast.error("Arquivo é obrigatório!");
            return;
        }

        setIsLoading(true);

        try {
            const resultDocument = await uploadImage(fileDocument, "documents");

            if (resultDocument.error) {
                toast.error(resultDocument.error);
                setIsLoading(false);
                return;
            }

            await addDoc(collection(db, "documents"), {
                name: formData.name,
                url: resultDocument.url ?? "",
                importance: formData.importance,
                difficulty: formData.difficulty,
                campainId: campainId,
                characterId: formData.characterId || null,
                location: formData.location,
            });

            toast.success("Documento criado com sucesso!");
            setShowAddForm(false);
            setFormData({
                name: '',
                importance: 'baixo',
                difficulty: 'baixo',
                location: '',
                characterId: ''
            });
            setFileDocument(undefined);
            setFileDocumentPreview(undefined);
        } catch (error) {
            toast.error("Erro ao criar documento!");
        } finally {
            setIsLoading(false);
        }
    }

    const handleTransferDocument = async (documentId: string, newCharacterId: string) => {
        try {
            const docRef = doc(db, "documents", documentId);
            await updateDoc(docRef, {
                characterId: newCharacterId || null
            });
            toast.success("Documento transferido!");
        } catch (error) {
            toast.error("Erro ao transferir documento!");
        }
    }

    const handleDeleteDocument = async (documentId: string) => {
        if (window.confirm("Tem certeza que deseja excluir este documento?")) {
            try {
                await deleteDoc(doc(db, "documents", documentId));
                toast.success("Documento excluído!");
            } catch (error) {
                toast.error("Erro ao excluir documento!");
            }
        }
    }

    const getCharacterName = (characterId: string) => {
        const character = characters.find(c => c.id === characterId);
        return character ? character.data.name : 'Personagem não encontrado';
    }

    const filteredDocuments = documents.filter((document) => {
        if (!searchTerm) return true;
        
        const searchLower = searchTerm.toLowerCase();
        const nameMatch = document.data.name.toLowerCase().includes(searchLower);
        const locationMatch = document.data.location?.toLowerCase().includes(searchLower);
        const ownerMatch = document.data.characterId 
            ? getCharacterName(document.data.characterId).toLowerCase().includes(searchLower)
            : 'disponível para todos'.includes(searchLower);
        
        return nameMatch || locationMatch || ownerMatch;
    });

    const getImportanceColor = (importance: string) => {
        switch (importance) {
            case 'baixo': return '#4caf50';
            case 'médio': return '#ff9800';
            case 'alto': return '#f44336';
            default: return '#4caf50';
        }
    }

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'baixo': return '#4caf50';
            case 'médio': return '#ff9800';
            case 'alto': return '#f44336';
            default: return '#4caf50';
        }
    }

    const handleOpenModal = (document: documentDataType) => {
        setSelectedDocument(document);
        setModalOpen(true);
    }

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedDocument(null);
    }

    return (
        <Container>
            <div className='header'>
                <h2>Gerenciamento de Documentos</h2>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <TextField
                        label="Pesquisar documentos"
                        variant="outlined"
                        size="small"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Digite o nome, localização ou proprietário..."
                        style={{ minWidth: '300px' }}
                        sx={{
                            '& .MuiInputLabel-root': {
                                color: 'gray',
                            },
                            '& .MuiInputLabel-root.Mui-focused': {
                                color: 'gray',
                            },
                            '& .MuiOutlinedInput-root': {
                                color: 'gray',
                                '& fieldset': {
                                    borderColor: 'gray',
                                },
                                '&:hover fieldset': {
                                    borderColor: 'gray',
                                },
                                '&.Mui-focused fieldset': {
                                    borderColor: 'gray',
                                },
                                '& input::placeholder': {
                                    color: 'gray',
                                    opacity: 0.7,
                                }
                            },
                        }}
                    />
                    <button 
                        className='add-button'
                        onClick={() => setShowAddForm(!showAddForm)}
                    >
                        {showAddForm ? 'Cancelar' : 'Adicionar Documento'}
                    </button>
                </div>
            </div>

            {showAddForm && (
                <div className='add-form'>
                    <h3>Adicionar Novo Documento</h3>
                    <div className='form-content'>
                        <div className='file-upload'>
                            {fileDocumentPreview ? (
                                <div className='file-preview'>
                                    {fileDocument?.type.startsWith('image/') ? (
                                        <img src={fileDocumentPreview} alt='Preview' />
                                    ) : (
                                        <div className='file-icon'>
                                            <i className="fa-solid fa-file"></i>
                                            <p>{fileDocument?.name}</p>
                                        </div>
                                    )}
                                    <button onClick={() => {
                                        setFileDocument(undefined);
                                        setFileDocumentPreview(undefined);
                                    }}>Remover</button>
                                </div>
                            ) : (
                                <div className='file-upload-area'>
                                    <p><i className="fa-solid fa-plus"></i> Adicionar arquivo</p>
                                    <input 
                                        type='file' 
                                        accept='image/*,.pdf,.doc,.docx,.txt'
                                        onChange={(e) => {
                                            if (e?.target?.files?.length) {
                                                setFileDocument(e.target.files[0]);
                                                setFileDocumentPreview(URL.createObjectURL(e.target.files[0]));
                                            }
                                        }} 
                                    />
                                </div>
                            )}
                        </div>

                        <div className='form-inputs'>
                            <TextField
                                label="Nome do documento"
                                variant="filled"
                                fullWidth
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />

                            <TextField
                                label="Localização no RPG"
                                variant="filled"
                                fullWidth
                                multiline
                                rows={2}
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />

                            <FormControl variant="filled" fullWidth>
                                <InputLabel>Importância</InputLabel>
                                <Select
                                    value={formData.importance}
                                    onChange={(e) => setFormData({ ...formData, importance: e.target.value as any })}
                                >
                                    <MenuItem value="baixo">Baixo</MenuItem>
                                    <MenuItem value="médio">Médio</MenuItem>
                                    <MenuItem value="alto">Alto</MenuItem>
                                </Select>
                            </FormControl>

                            <FormControl variant="filled" fullWidth>
                                <InputLabel>Dificuldade</InputLabel>
                                <Select
                                    value={formData.difficulty}
                                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as any })}
                                >
                                    <MenuItem value="baixo">Baixo</MenuItem>
                                    <MenuItem value="médio">Médio</MenuItem>
                                    <MenuItem value="alto">Alto</MenuItem>
                                </Select>
                            </FormControl>

                            <Autocomplete
                                options={[{ id: '', name: 'Nenhum (disponível para todos)' }, ...characters.map(c => ({ id: c.id, name: c.data.name }))]}
                                getOptionLabel={(option) => option.name}
                                onChange={(event, newValue) => {
                                    setFormData({ ...formData, characterId: newValue?.id || '' });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        variant="filled"
                                        label="Proprietário atual"
                                        placeholder="Selecione um personagem"
                                    />
                                )}
                            />
                        </div>

                        <div className='form-buttons'>
                            <button 
                                onClick={handleCreateDocument}
                                disabled={isLoading}
                                className='create-button'
                            >
                                {isLoading ? 'Criando...' : 'Criar Documento'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className='documents-list'>
                {filteredDocuments.length === 0 ? (
                    <p className='no-documents'>
                        {documents.length === 0 
                            ? 'Nenhum documento encontrado.' 
                            : 'Nenhum documento corresponde à pesquisa.'
                        }
                    </p>
                ) : (
                    filteredDocuments.map((document) => (
                        <div key={document.id} className='document-item'>
                            <div className='document-info'>
                                <div className='document-header'>
                                    <h4>{document.data.name}</h4>
                                    <div className='document-tags'>
                                        <Chip 
                                            label={`Importância: ${document.data.importance}`}
                                            size="small"
                                            style={{ backgroundColor: getImportanceColor(document.data.importance), color: 'white' }}
                                        />
                                        <Chip 
                                            label={`Dificuldade: ${document.data.difficulty}`}
                                            size="small"
                                            style={{ backgroundColor: getDifficultyColor(document.data.difficulty), color: 'white' }}
                                        />
                                    </div>
                                </div>
                                
                                <div className='document-details'>
                                    <p><strong>Localização:</strong> {document.data.location || 'Não informado'}</p>
                                    <p><strong>Proprietário:</strong> {
                                        document.data.characterId 
                                            ? getCharacterName(document.data.characterId)
                                            : 'Disponível para todos'
                                    }</p>
                                </div>

                                <div className='document-transfer'>
                                    <Autocomplete
                                        size="small"
                                        options={[
                                            { id: '', name: 'Disponível para todos' },
                                            ...characters.map(c => ({ id: c.id, name: c.data.name }))
                                        ]}
                                        getOptionLabel={(option) => option.name}
                                        value={characters.find(c => c.id === document.data.characterId) ? 
                                            { id: document.data.characterId || '', name: getCharacterName(document.data.characterId || '') } : 
                                            { id: '', name: 'Disponível para todos' }
                                        }
                                        onChange={(event, newValue) => {
                                            if (newValue && newValue.id !== undefined) {
                                                handleTransferDocument(document.id, newValue.id);
                                            }
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                size="small"
                                                label="Transferir para"
                                            />
                                        )}
                                        style={{ minWidth: 400 }}
                                    />
                                </div>
                            </div>

                            <div className='document-actions'>
                                <button 
                                    className='view-button'
                                    onClick={() => handleOpenModal(document)}
                                >
                                    <i className="fa-solid fa-eye"></i> Visualizar
                                </button>
                                <button 
                                    className='delete-button'
                                    onClick={() => handleDeleteDocument(document.id)}
                                >
                                    <i className="fa-solid fa-trash"></i> Excluir
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Modal de visualização */}
            <Modal
                open={modalOpen}
                onClose={handleCloseModal}
                aria-labelledby="document-modal-title"
                aria-describedby="document-modal-description"
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '90%',
                        maxWidth: 800,
                        maxHeight: '90%',
                        bgcolor: 'background.paper',
                        border: '2px solid #000',
                        boxShadow: 24,
                        p: 4,
                        borderRadius: 2,
                        outline: 'none',
                        overflow: 'auto'
                    }}
                >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <h2 id="document-modal-title" style={{ margin: 0 }}>
                            {selectedDocument?.data.name} <br/>
                            {selectedDocument && <>
                                <Chip 
                                    label={`Importância: ${selectedDocument.data.importance}`}
                                    size="small"
                                    sx={{ marginLeft: '4px' }}
                                    style={{ backgroundColor: getImportanceColor(selectedDocument.data.importance), color: 'white' }}
                                />
                                <Chip 
                                    label={`Dificuldade: ${selectedDocument.data.difficulty}`}
                                    size="small"
                                    sx={{ marginLeft: '4px' }}
                                    style={{ backgroundColor: getDifficultyColor(selectedDocument.data.difficulty), color: 'white' }}
                                />
                            </>}
                        </h2>
                        <IconButton onClick={handleCloseModal} size="large">
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Divider />
                    {selectedDocument && (
                        <div>
                            <div style={{ marginBottom: '15px' }}>
                                <p><strong>Proprietário:</strong> {
                                    selectedDocument.data.characterId 
                                        ? getCharacterName(selectedDocument.data.characterId)
                                        : 'Disponível para todos'
                                }</p>
                            </div>
                            
                            <div style={{ textAlign: 'center' }}>
                                {selectedDocument.data.url.includes('jpeg') || 
                                selectedDocument.data.url.includes('jpg') || 
                                selectedDocument.data.url.includes('gif') || 
                                selectedDocument.data.url.includes('png') || 
                                selectedDocument.data.url.includes('webp') ? (
                                    <img 
                                        src={selectedDocument.data.url} 
                                        alt={selectedDocument.data.name}
                                        style={{ 
                                            maxWidth: '100%', 
                                            maxHeight: '500px', 
                                            minHeight: '500px', 
                                            objectFit: 'contain',
                                            borderRadius: '8px'
                                        }}
                                    />
                                ) : (
                                    <div style={{ padding: '40px', border: '2px dashed #ccc', borderRadius: '8px' }}>
                                        <i className="fa-solid fa-file" style={{ fontSize: '48px', color: '#666', marginBottom: '15px' }}></i>
                                        <p style={{ margin: '10px 0', color: '#666' }}>Este arquivo não é uma imagem.</p>
                                        <button 
                                            onClick={() => window.open(selectedDocument.data.url, '_blank')}
                                            style={{
                                                background: '#5755bd',
                                                color: 'white',
                                                border: 'none',
                                                padding: '10px 20px',
                                                borderRadius: '5px',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Abrir em Nova Aba
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </Box>
            </Modal>
        </Container>
    );
}

export default Documents;