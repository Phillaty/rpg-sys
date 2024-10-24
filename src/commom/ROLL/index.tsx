import React, { useState } from 'react';
import { Container } from './styles';
import Modal from '../Modal';
import diceGif from '../../imgs/dice.gif';

type prop = {
    dice: number[];
    mod?: number[];
    setdice: React.Dispatch<React.SetStateAction<number[] | undefined>>;
    setdiceMod?: React.Dispatch<React.SetStateAction<number[] | undefined>>;
    onClose?: () => void;
}

const Roll = ({dice, mod, setdice, setdiceMod, onClose}: prop) => {

    const [isOpen, setIsOpen] = useState<boolean>(true);

    const [result, setResult] = useState<string>();
    const [resultTotal, setResultTotal] = useState<number>();
    const [resultTotalMod, setResultTotalMod] = useState<number>();

    const handleClose = () => {
        setIsOpen(false);
        setdice(undefined);

        setdiceMod && setdiceMod(undefined);

        onClose && onClose();
    }

    const roll = () => {
        const results = [] as number[];
        // eslint-disable-next-line array-callback-return
        dice?.map((r) => {
            const res = Math.floor(Math.random() * r) + 1;

            results.push(res);
        });
        
        let somaTotal = results.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);

        if(!!mod?.length) {
            const somaMod = mod.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
            setResultTotalMod(somaMod);
        }

        setResultTotal(somaTotal);
        setResult(results.join(", "));
    }

    return (
        <Modal isOpen={isOpen} handleCloseModal={handleClose}>
            <Container>
                <p>Rolando D{dice.join(", D")}</p>
                {mod && mod.length > 0 &&
                    <p>Modificadores: {mod.join(", ")}</p>
                }

                <div>
                    {result ? 
                        <div className='result'>
                            {result}
                            <div className='subResults'>Total: {(resultTotal ?? 0) + (resultTotalMod ?? 0)} {resultTotalMod && <span>({resultTotal} + {resultTotalMod})</span>}</div>
                        </div> 
                        : 
                        <img alt='' src={diceGif} /> 
                    }
                </div>


                

                {result ? <button className='closeBtn' onClick={() => handleClose()}>Fechar</button> : <button onClick={() => roll()}>Rolar</button>}
                
            </Container>
        </Modal>
    )
}

export default Roll;