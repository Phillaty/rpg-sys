import React from 'react';
import { Container } from './styles';

const Help = () => {
    return (
        <>
            <Container>
                <div>
                    <h1>Ajuda</h1>
                    <h3>
                        Esse sistema se baseia <b>MUITO</b> em ordem paranormal e algumas pitadas de D&D, 
                        porém ele é formado por um sistema próprio, então não utilize o livro de Ordem como verdade
                        pra tudo, apesar de eu utilizar várias regras do livro, só perguntar qualquer duvida.
                    </h3>
                    <p>
                        Eu vou explicar aqui algumas regras básicas, algumas coisas eu deixei automático pra facilitar, mas algumas coisas vai ter que fazer manualmente
                        por causa de ter muitas situações específicas que é impossivel coloca no sistema, ou só não vale a pena gastar tempo naquilo, se realmente precisar automatizar só
                        me falar que tento ajustar quando eu puder.
                    </p>

                    <h2>BÁSICO</h2>

                    <h3>
                        - O sistema se baseia em fazer testes utilizando apenas 1 dado de 20 lados (d20).
                    </h3>
                    <h3>
                        - O resto é utilizado as pericias e habilidades para adicionar modificadores a essa rolagem,
                    </h3>
                    <h3>
                        - Todas as rolagem de pericias adicionam como modificador o seu atributo base, por exemplo, a perícia <u>investigação</u> utiliza <u>INTELIGÊNCIA</u> como base,
                        se no atributo inteligência tiver 2, isso significa que a rolagem receberá +2 como modificador adicional. 
                    </h3>
                    <h3>
                        - As pericias podem ser treinadas até 3 vezes, se tornando <u>treinado</u>, <u>experiente</u> e <u>veterano</u>, 
                        cada nivel você recebe +1 como modificador adicional na rolagem da perícia.
                    </h3>
                    <h3>
                        - Os classicos críticos são automáticos, o 1 no dado é erro critico e algo negativo acontece, o 20 no dado é sucesso crítico se o que está tentando fazer for 
                        além, algo mais impossivel de realizar, será levado em conta os modificadores junto, ou seja, se quer mandar um charme em um fucking devorador de mundos e tirar 20, e não tiver
                        nenhum modificador, máximo q tu consegue é fazer ele n pisa em tu, agora se tiver 213123123218738 de modificador, eu narro com detalhe o seu casamento com um devorador
                        de mundos :)
                    </h3>
                    <h3>
                        - Defesa é o valor que o inimigo tem que tirar no d20 pra te acertar, lembre-se que eles podem também ter modificadores adicionais!
                    </h3>
                    <h2>Reações</h2>
                    <p>Quando um inimigo te ataca corpo a corpo, você consegue reagir naturalmente, com <u>Esquiva</u> ou <u>Bloqueio</u> ou <u>contra ataque</u></p>
                    <h3>
                        - ESQUIVAR: Necessário estar treinado em <u>reflexo</u>, em respectivo nível você rola um unico d4 (nivel 1) | d6 (nível 2) | d8 (nível 3) pega o valor e adiciona em sua defesa,
                        por exemplo: Tem 8 de defesa, um inimigo te ataca, você escolhe esquivar, joga d4 (se nível 1), digamos que tirou 3, você adiciona na defesa 8 + 3 = 11, então, o inimigo precisa
                        tirar 11 pra te acertar.
                    </h3>
                    <h3>
                        - BLOQUEIO: Necessário estar treinado em <u>fortitude</u>, em respectivo nível você rola 1d10 (nivel 1) | 2d10 (nível 2) | 3d10 (nível 3) pega o valor e adiciona na resistencia a dano,
                        se o inimigo errar, nada acontece, se acertar você diminui do dano o valor retirado dos dados, então se o inimigo tirar 15 de dano, e nos dados você retirou 10, você toma apenas
                        5 de dano.
                    </h3>
                    <h3>
                        - CONTRA-ATAQUE: Necessário estar treinado em <u>luta</u>, esse é o classico, você só espera o ataque, se ele te acertar, é chorar no banho, se ele errar, você tem direito a um ataque
                        corpo a corpo padrão contra ele.
                    </h3>
                </div>
            </Container>
        </>
    )
}

export default Help;