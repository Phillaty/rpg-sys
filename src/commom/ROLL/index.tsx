import React, { useEffect, useState } from 'react';
import { Container } from './styles';
import Modal from '../Modal';
import diceGif from '../../imgs/dice.gif';
import { avatarType, discordType } from '../../types';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { randomColors } from '../../constants';

type prop = {
    dice: number[];
    mod?: number[];
    setdice: React.Dispatch<React.SetStateAction<number[] | undefined>>;
    setdiceMod?: React.Dispatch<React.SetStateAction<number[] | undefined>>;
    onClose?: () => void;
    discord?: discordType;
    char?: avatarType;
}

const Roll = ({dice, mod, setdice, setdiceMod, onClose, discord, char}: prop) => {

    const [isOpen, setIsOpen] = useState<boolean>(true);

    const [result, setResult] = useState<string>();
    const [resultEach, setResultEach] = useState<string>();
    const [resultTotal, setResultTotal] = useState<number>();
    const [resultTotalMod, setResultTotalMod] = useState<number>();

    const [total, setTotal] = useState<number>();

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
        
        const somaTotal = results.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);

        let somaMod:number = 0;

        if(!!mod?.length) {
            somaMod = mod.reduce((acumulador, valorAtual) => Number(acumulador) + Number(valorAtual), 0);
            setResultTotalMod(somaMod);
        }

        const resultsEachTotal = results.map(i => {
            const t = Number(i) + Number(somaMod);
            return t <= 0 ? 1 : t;
        })

        setResultEach(resultsEachTotal.join(', '))
        setResultTotal(somaTotal);
        setResult(results.join(", "));
        
        const total = somaTotal + somaMod;

        if (discord && discord.webhook && discord.sendDices && char) {

            let text = "";
            const media = somaTotal / results.length;
            const higherDice = Math.max.apply(null, results);
            
            
            if (higherDice === 20) {
                text = "O MAI GOOOD!! UM CRITICO! ( •̀ ω •́ )✧"
            } else if (media === 1) {
                text = "MEU DEUS OS DADO TÃO QUEBRADO CORRAM! (○´･д･)ﾉ"
            } else {
                text = "Waaaa dado! (oﾟvﾟ)ノ";
            }
            
            const body = {
                tts: false,
                embeds: [{
                    title: `${char.name} fez uma rolagem!`,
                    description: `## **Dados rolados:**\n dados: [d${dice.join(', d')}]\n### :sparkles: [${results.join(", ")}] :sparkles: \n${!!mod?.length ? `### Modificações: \n[${mod.join(', ')}]` : ''}\n## Total tudo somado: ${total}${!!mod?.length && dice.length > 1 ? `\n## Total dado separado:\n[${resultsEachTotal.join(', ')}]` : ''}`,
                    color: randomColors[Math.floor(Math.random() * 23)],
                    footer: {
                        text: text
                    }
                }]
            }
            sendToDiscord(body);
        }
    }

    const sendToDiscord = async (body: any) => {
        if (discord && discord.webhook && discord.sendDices){
            try {
                const data = await axios.post(
                    discord?.webhook,
                    body
                )

                console.log(data);
            } catch (error) {
                toast.error("Erro ao enviar para discord!");
            }
        }
    }

    useEffect(() => {
        if(resultTotal && resultTotalMod) {
            setTotal(Number(resultTotal) + Number(resultTotalMod));
        } else if (resultTotal) {
            setTotal(Number(resultTotal));
        }
    }, [resultTotal, resultTotalMod])
    return (
        <>
        <Modal isOpen={isOpen} handleCloseModal={handleClose}>
            <Container>
                <p>Rolando D{dice.join(", D")}</p>
                {mod && mod.length > 0 &&
                    <p>Modificadores: [{mod.join(", ")}]</p>
                }

                <div>
                    {result ? 
                        <div className='result'>
                            {result}
                            <div className='subResults'>Total: {total} {resultTotalMod && <span>({resultTotal} {resultTotalMod < 0 ? '' : '+'} {resultTotalMod})</span>}</div>
                            {dice.length > 1 && resultTotalMod && <div className='resultsEach'>Total por dado: [{resultEach}]</div>}
                        </div> 
                        : 
                        <img alt='' src={diceGif} /> 
                    }
                </div>

                {result ? <button className='closeBtn' onClick={() => handleClose()}>Fechar</button> : <button onClick={() => roll()}>Rolar</button>}
                
            </Container>
        </Modal>
        <ToastContainer style={{zIndex: 99999999999}} />
        </>
    )
}

export default Roll;