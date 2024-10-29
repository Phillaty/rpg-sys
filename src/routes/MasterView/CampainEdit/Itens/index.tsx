import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { Chip, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../../../firebase/firebase';
import { itemDataType, storeDataType } from '../../../../types';
import { useLocation } from 'react-router-dom';
import ItemModal from './CreateUpdate';
import Modal from '../../../../commom/Modal';
import { getTypePosition } from '../../../../utils';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

type prop = {
    toast: any;
    stores: storeDataType[];
}

const Itens = ({toast, stores}: prop) => {

    const location = useLocation();

    const queryString = location.search;
    const urlParams = new URLSearchParams(queryString);
    const campainId = urlParams.get('camp') ?? '';

    const [itens, setItens] = useState<itemDataType[]>([]);
    const [itensFiltered, setItensFiltered] = useState<itemDataType[]>([]);

    const [selectIten, setSelectIten] = useState<itemDataType>();

    const [openModalItem, setOpenModalItem] = useState<boolean>(false);

    const [search, setSearch] = useState<string>("");

    const getClassesVerified = async () => {
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
                setItens(sorted);
                setItensFiltered(sorted);
    
                
            });
        }
    }

    useEffect(() => {
        if(campainId) {
            getClassesVerified();
        }
       
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleCloseMode = () => {
        setOpenModalItem(false);
        setSelectIten(undefined);
    };

    useEffect(() => {
        if (search) {
            const filtered = itens.filter(item => 
                item.data.name.toLowerCase().includes(search.toLowerCase()) ||
                item.data.description.toLowerCase().includes(search.toLowerCase())
            );
            const sorted = filtered.sort((a, b) => a.data.name.localeCompare(b.data.name));

            setItensFiltered(sorted);
        } else {
            setItensFiltered(itens);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search])

    return (
        <>
        <Container>
            <div>
                <div className='topOptions'>
                    <div className='search'>
                        <TextField id="outlined-basic" label="Pesquisar" variant="outlined" value={search} onChange={(e) => setSearch(e.target.value)} size='small' />
                        <button><i className="fa-solid fa-magnifying-glass"></i></button>
                    </div>
                    <div className='buttons'>
                        <button onClick={() => {
                            setSelectIten(undefined);
                            setOpenModalItem(true);
                        }}>Criar item <i className="fa-solid fa-plus"></i></button>
                    </div>
                </div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">Nome</StyledTableCell>
                            <StyledTableCell>Descrição</StyledTableCell>
                            <StyledTableCell align="right">Tipo</StyledTableCell>
                            <StyledTableCell align="right">Posição</StyledTableCell>
                            <StyledTableCell align="right">Categoria</StyledTableCell>
                            <StyledTableCell align="right">Carga</StyledTableCell>
                            <StyledTableCell align="right">Ações</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {itensFiltered.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell component="th" scope="row">
                                    {row.data.name}
                                </StyledTableCell>
                                <StyledTableCell style={{width: '40%'}} component="th" scope="row" >
                                    {row.data.description}
                                </StyledTableCell>
                                <StyledTableCell align="right"><Chip className={`chip-${row.data.type}`} label={getTypePosition(row.data.type)} color="success" /></StyledTableCell>
                                <StyledTableCell align="right"><Chip className={`chip-${row.data.position.type}`} label={getTypePosition(row.data.position.type)} color="success" /></StyledTableCell>
                                <StyledTableCell align="right">{row.data.category}</StyledTableCell>
                                <StyledTableCell align="right">{row.data.weight}</StyledTableCell>
                                <StyledTableCell align="right" className='actions'>
                                    <button className='remove'>Excluir</button>
                                    <button onClick={() => {
                                        setSelectIten(row);
                                        setOpenModalItem(true);
                                    }}>Editar</button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Container>
        <Modal isOpen={openModalItem} handleCloseModal={handleCloseMode}>
            <ItemModal toast={toast} stores={stores} itemSelected={selectIten} />
        </Modal>
        </>
    )
}

export default Itens;