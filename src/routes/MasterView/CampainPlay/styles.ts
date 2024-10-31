import styled from "styled-components";

export const Container = styled.div`

    display: flex;
    align-items: flex-start;
    justify-content: center;

    background-color: #181a1b;
    color: white;
    min-height: calc(100vh - 105px);

    > div {
       max-width: 1366px;
       width: 100%;
       padding: 8px;

       h1 {
        margin-bottom: 8px;
       }

       p {
        margin: 0;
       }
    }
`