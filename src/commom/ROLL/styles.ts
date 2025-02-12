import styled from "styled-components";


export const Container = styled.div`
    background-color: white;
    padding: 24px;
    color: black;

    display: flex;
    flex-direction: column;

    text-align: center;

    > p {
        margin: 0;
    }

    img {
        width: 200px;
        height: 200px;
    }

    //'pericia' | 'atributo' | 'habilidade' | 'item' | 'damage' | 'pers'

    .pericia {background-color: #ffb100;}
    .atributo {background-color: #65dbff;}
    .habilidade {background-color: #f784b4;}
    .item {background-color: #b6f784;}
    .damage {background-color: #f78484;}
    .pers {background-color: #bbbbbb;}
    .add {background-color: #3570ed; color: #fff; cursor: pointer;}
    .add:hover {background-color: #99b9ff;}

    .persRolls {
        display: flex;
        gap: 4px;
        margin-top: 4px;
        justify-content: center;
    }

    .mods {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        justify-content: center;
    }

    .result {
        min-width: 200px;
        height: 200px;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0;
        margin: 0;

        font-size: 50px;
    }

    .subResults {
        font-size: 18px;
        color:rgb(0, 0, 0);

        span {
            font-size: 14px;
            color: #a3a3a3;
        }
    }

    button {
        background-color: #478bf1;
        color: white;
        border: 0;
        border-radius: 4px;
        padding: 8px;
        cursor: pointer;
    }

    .closeBtn {
        background-color: #e37744;
    }

    .resultsEach {
        font-size: 14px;
    }
`