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

    .result {
        min-width: 200px;
        height: 200px;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        padding: 0;
        margin: 0;

        font-size: 56px;
    }

    .subResults {
        font-size: 18px;

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