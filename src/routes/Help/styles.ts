import styled from "styled-components";

export const Container = styled.div`
    background-color: #181a1b;
    min-height: 100vh;
    color: #d3d3d3;
    padding: 32px 0;
    display: flex;
    justify-content: center;

    >div {
        width: 1366px;

        * {
            width: 100%;
        }

        u {
            color:rgb(111, 184, 212);
        }
    }

    @media (max-width: 1366px) {
        > div {width: 100%;}
    }
`