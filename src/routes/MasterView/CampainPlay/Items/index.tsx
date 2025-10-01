import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { 
    Chip, 
    TextField, 
    Select, 
    MenuItem, 
    FormControl, 
    Table, 
    TableBody, 
    TableCell, 
    TableContainer, 
    TableHead, 
    TableRow, 
    Paper,
    SelectChangeEvent
} from '@mui/material';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { avatarDataType, itemDataType } from '../../../../types';
import { getTypePosition } from '../../../../utils';
import { toast } from 'react-toastify';

const Container = styled.div`
    width: 100%;
    padding: 20px;
    background: white;
    border-radius: 4px;

    .header {
        display: flex;
        flex-direction: column;
        gap: 16px;
        margin-bottom: 20px;

        .search-section {
            display: flex;
            gap: 12px;
            align-items: center;
        }

        .filter-section {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            align-items: center;
        }
    }

    @media (min-width: 768px) {
        .header {
            flex-direction: row;
            justify-content: space-between;
            align-items: flex-start;
        }

        .filter-section {
            max-width: 60%;
        }
    }
`;

type ItemsProps = {
    campainId: string;
    characters: avatarDataType[];
}

const Items: React.FC<ItemsProps> = ({ campainId, characters }) => {
    const [items, setItems] = useState<itemDataType[]>([]);
    const [itemsFiltered, setItemsFiltered] = useState<itemDataType[]>([]);
    const [search, setSearch] = useState<string>("");
    const [filter, setFilter] = useState<string[]>([]);

    const getItems = async () => {
        if (campainId) {
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
                setItems(sorted);
                filterItemsF(sorted);
            });
        }
    }

    useEffect(() => {
        if(campainId) {
            getItems();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [campainId]);

    const filterItemsF = (itemsAll: itemDataType[]) => {
        let filteredItems = itemsAll;

        // Filtro por tipo de posição
        if (filter.length > 0) {
            filteredItems = itemsAll.filter(item => 
                filter.some((filterType) => filterType === item.data.position.type)
            );
        }

        // Filtro por pesquisa
        if (search) {
            filteredItems = filteredItems.filter(item => 
                item.data.name.toLowerCase().includes(search.toLowerCase()) ||
                item.data.description.toLowerCase().includes(search.toLowerCase())
            );
        }

        const sorted = filteredItems.sort((a, b) => a.data.name.localeCompare(b.data.name));
        setItemsFiltered(sorted);
    }

    useEffect(() => {
        filterItemsF(items);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, filter]);

    const handleFilterType = (type: string) => {
        if(filter.includes(type)) {
            const newFilter = filter.filter(k => k !== type);
            setFilter(newFilter);
        } else {
            setFilter([...filter, type]);
        }
    }

    const handlePositionChange = async (itemId: string, newPosition: string, currentItem: itemDataType) => {
        try {
            const docRef = doc(db, "item", itemId);
            
            // Se a nova posição for 'inventory', manter o idGetter atual ou limpar se necessário
            if (newPosition === 'inventory') {
                await updateDoc(docRef, {
                    'position.type': newPosition
                });
            } else {
                // Para outras posições, limpar o idGetter
                await updateDoc(docRef, {
                    'position.type': newPosition,
                    'position.idGetter': null
                });
            }
            
            toast.success("Posição do item atualizada!");
        } catch (error) {
            toast.error("Erro ao atualizar posição do item!");
        }
    }

    const handlePlayerChange = async (itemId: string, playerId: string) => {
        try {
            const docRef = doc(db, "item", itemId);
            await updateDoc(docRef, {
                'position.type': 'inventory',
                'position.idGetter': playerId
            });
            
            const playerName = characters.find(char => char.id === playerId)?.data.name || 'Jogador';
            toast.success(`Item transferido para ${playerName}!`);
        } catch (error) {
            toast.error("Erro ao transferir item!");
        }
    }

    const getPlayerName = (playerId: string) => {
        return characters.find(char => char.id === playerId)?.data.name || 'Jogador desconhecido';
    }

    return (
        <Container>
            <div className='header'>
                <div className='search-section'>
                    <TextField 
                        label="Pesquisar itens" 
                        variant="outlined" 
                        size="small"
                        value={search} 
                        onChange={(e) => setSearch(e.target.value)} 
                        sx={{ minWidth: 200 }}
                    />
                </div>
                
                <div className='filter-section'>
                    <Chip 
                        label="Inventário jogador" 
                        color={filter.includes('inventory') ? 'primary' : 'default'} 
                        onClick={() => handleFilterType('inventory')} 
                        clickable
                    />
                    <Chip 
                        label="Loja" 
                        color={filter.includes('store') ? 'primary' : 'default'} 
                        onClick={() => handleFilterType('store')} 
                        clickable
                    />
                    <Chip 
                        label="No chão" 
                        color={filter.includes('ground') ? 'primary' : 'default'} 
                        onClick={() => handleFilterType('ground')} 
                        clickable
                    />
                    <Chip 
                        label="Entidade" 
                        color={filter.includes('entity') ? 'primary' : 'default'} 
                        onClick={() => handleFilterType('entity')} 
                        clickable
                    />
                    <Chip 
                        label="Apenas mestre" 
                        color={filter.includes('masterHold') ? 'primary' : 'default'} 
                        onClick={() => handleFilterType('masterHold')} 
                        clickable
                    />
                </div>
            </div>

            <TableContainer component={Paper} sx={{ mt: 2 }}>
                <Table size="small">
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#1976d2' }}>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nome</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Tipo</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Posição Atual</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Proprietário</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Peso</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nova Posição</TableCell>
                            <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Transferir Para</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {itemsFiltered.map((item) => (
                            <TableRow key={item.id} hover>
                                <TableCell>
                                    <div>
                                        <strong>{item.data.name}</strong>
                                        <div style={{ fontSize: '0.8em', color: '#666', marginTop: 4 }}>
                                            {item.data.description.length > 50 
                                                ? item.data.description.substring(0, 50) + '...' 
                                                : item.data.description
                                            }
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={getTypePosition(item.data.type)} 
                                        color="secondary" 
                                        size="small" 
                                    />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={getTypePosition(item.data.position.type)} 
                                        color="primary" 
                                        size="small" 
                                    />
                                </TableCell>
                                <TableCell>
                                    {item.data.position.type === 'inventory' && item.data.position.idGetter 
                                        ? getPlayerName(item.data.position.idGetter)
                                        : '-'
                                    }
                                </TableCell>
                                <TableCell>{item.data.weight}kg</TableCell>
                                <TableCell sx={{ minWidth: 150 }}>
                                    <FormControl size="small" fullWidth>
                                        <Select
                                            value={item.data.position.type}
                                            onChange={(e: SelectChangeEvent) => 
                                                handlePositionChange(item.id, e.target.value, item)
                                            }
                                        >
                                            <MenuItem value="inventory">Inventário</MenuItem>
                                            <MenuItem value="store">Loja</MenuItem>
                                            <MenuItem value="ground">No chão</MenuItem>
                                            <MenuItem value="entity">Entidade</MenuItem>
                                            <MenuItem value="masterHold">Apenas mestre</MenuItem>
                                        </Select>
                                    </FormControl>
                                </TableCell>
                                <TableCell sx={{ minWidth: 150 }}>
                                    {item.data.position.type === 'inventory' ? (
                                        <FormControl size="small" fullWidth>
                                            <Select
                                                value={item.data.position.idGetter || ''}
                                                onChange={(e: SelectChangeEvent) => 
                                                    handlePlayerChange(item.id, e.target.value)
                                                }
                                                displayEmpty
                                            >
                                                <MenuItem value="">
                                                    <em>Selecionar jogador</em>
                                                </MenuItem>
                                                {characters.map((character) => (
                                                    <MenuItem key={character.id} value={character.id}>
                                                        {character.data.name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    ) : (
                                        <span style={{ color: '#999' }}>-</span>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {itemsFiltered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
                    {search || filter.length > 0 
                        ? 'Nenhum item encontrado com os filtros aplicados.'
                        : 'Nenhum item encontrado nesta campanha.'
                    }
                </div>
            )}
        </Container>
    );
}

export default Items;