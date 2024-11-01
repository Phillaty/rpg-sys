import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import { Chip, styled, Table, TableBody, TableCell, tableCellClasses, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import { elementDataType, magicDataType } from '../../../../types';
import Modal from '../../../../commom/Modal';
import MagicModal from './CreateUpdate';

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
    elements: elementDataType[];
    magicFiltered: magicDataType[];
    magics: magicDataType[];
    setMagicFiltered: React.Dispatch<React.SetStateAction<magicDataType[]>>
}

const Magics = ({toast, elements, magicFiltered, magics, setMagicFiltered}: prop) => {
   
    const [selectMagic, setSelectMagic] = useState<magicDataType>();

    const [openModalMagic, setOpenModalMagic] = useState<boolean>(false);

    const [search, setSearch] = useState<string>("");

    const handleCloseMode = () => {
        setOpenModalMagic(false);
        setSelectMagic(undefined);
    };

    useEffect(() => {
        if (search) {
            const filtered = magics.filter(item => 
                item.data.name.toLowerCase().includes(search.toLowerCase()) ||
                item.data.description.toLowerCase().includes(search.toLowerCase())
            );
            const sorted = filtered.sort((a, b) => a.data.name.localeCompare(b.data.name));

            setMagicFiltered(sorted);
        } else {
            setMagicFiltered(magics);
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
                            setSelectMagic(undefined);
                            setOpenModalMagic(true);
                        }}>Criar item <i className="fa-solid fa-plus"></i></button>
                    </div>
                </div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 700 }} aria-label="customized table">
                        <TableHead>
                        <TableRow>
                            <StyledTableCell align="left">Nome</StyledTableCell>
                            <StyledTableCell>Descrição</StyledTableCell>
                            <StyledTableCell align="right">Elemento</StyledTableCell>
                            <StyledTableCell align="right">Circulo</StyledTableCell>
                            <StyledTableCell align="right">Ações</StyledTableCell>
                        </TableRow>
                        </TableHead>
                        <TableBody>
                        {magicFiltered.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell component="th" scope="row">
                                    {row.data.name ?? ''}
                                </StyledTableCell>
                                <StyledTableCell style={{width: '40%'}} component="th" scope="row" >
                                    {row.data.description}
                                </StyledTableCell>
                                <StyledTableCell align="right">
                                    <Chip 
                                        className={`chip-${row?.data?.element?.name}`} 
                                        style={{backgroundColor: row?.data?.element?.backgroundColor ?? '', color: row?.data?.element?.color}} 
                                        label={row?.data?.element?.name} color="success" 
                                    />
                                </StyledTableCell>
                                <StyledTableCell align="right"><Chip className={`chip-${row.data.circle}`} label={`${row.data.circle}º Circulo`} color="success" /></StyledTableCell>
                                <StyledTableCell align="right" className='actions'>
                                    <button className='remove'>Excluir</button>
                                    <button onClick={() => {
                                        setSelectMagic(row);
                                        setOpenModalMagic(true);
                                    }}>Editar</button>
                                </StyledTableCell>
                            </StyledTableRow>
                        ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Container>
        <Modal isOpen={openModalMagic} handleCloseModal={handleCloseMode}>
            <MagicModal toast={toast} magicSelected={selectMagic} elements={elements} />
            <></>
        </Modal>
        </>
    )
}

export default Magics;