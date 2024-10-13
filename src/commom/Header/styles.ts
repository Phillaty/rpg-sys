import styled from "styled-components";


export const Container = styled.div`
    max-height: 55px;
    background-color: #343493;

    display: flex;
    align-items: center;
    justify-content: center;

    > div {
        max-width: 1366px;
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .logo {
        display: flex;
        align-items: center;
        color: white;
        img {
            width: 140px;
        }

        p {
            font-size: 14px;
            margin-left: 16px;
        }
    }

    .menu {
        display: flex;

        p {
            color: white;
            padding: 8px 16px;
            font-size: 14px;
            cursor: pointer;
        }

        p:hover{
            background-color: #0000003d;
            border: 0;
            border-radius: 4px;
        }

        .exit {
            color: #ff6f6f;
        }
    }

    .pc {
        display: block;
    }

    .mobile {
        display: none;
    }

    @media screen and (max-width: 800px){
        max-height: 15vh;

        > div {
            flex-direction: column;     
        }
        
        .pc {
            display: none;
        }

        .mobile {
            display: block;
        }
    }

    @media screen and (max-width: 450px){
        .logo {
            p {
                display: flex;
                flex-direction: column;
            }
        }
    }
`