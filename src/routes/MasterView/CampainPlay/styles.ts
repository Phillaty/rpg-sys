import styled from "styled-components";

export const Container = styled.div`

    display: flex;
    align-items: center;
    justify-content: center;

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