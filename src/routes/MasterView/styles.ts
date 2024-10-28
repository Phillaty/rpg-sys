import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% {
    opacity: 0;
    transform: scale(0);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
`

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
        margin-bottom: 36px;
        color: #bdbdbd;
       }
    }

    .itens {
        display: flex;
        flex-wrap: wrap;
        gap: 20px;
        /* animation: 1s ${fadeIn} ease-out; */
    }

    .itemCard:hover {
        > div {
            box-shadow: 0 0 65px -20px #898989;
            transition: 0.5s;
        }
        
    }

    .add {
        border: 1px dashed gray;
        border-radius: 4px;
        width: 30%;
        min-width: 350px;
        height: 180px;

        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        gap: 8px;

        cursor: pointer;
        animation: 0.5s ${fadeIn} forwards;

        p {
            margin: 0;
        }
    }

    .add:hover {
        background-color: #494949;
        transition: 0.2s;
    }

    .itemCard {
        width: 30%;
        min-width: 350px;
        height: 180px;
        
        cursor: pointer;
        transition: 0.2s;

        > div {
            background-color: white;
            border-radius: 8px;
            overflow: hidden;
            animation: 0.5s ${fadeIn} forwards;
        }

        .top{
            height: 130px;
            display: flex;
            align-items: flex-end;

            background: #eb01a5;

            font-size: 20px;
            padding: 16px;

            background-size: 120% auto;
        }

        .details {
            padding: 16px;
            color: black;
            gap: 8px;
            display: flex;
            flex-direction: column;

            p {
                margin: 0;
                font-size: 16px;
            }

            span {
                font-size: 14px;
                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 3; /* number of lines to show */
                        line-clamp: 3; 
                -webkit-box-orient: vertical;
            }
        }
    }
    

    @media screen and (max-width: 1123px){
        .campains {
            display: flex;
            flex-direction: column;
            align-items: center;
        }

        .itens {
            justify-content: center;
        }
    }
`

export const ContainerModal = styled.div`

    background-color: white;
    color: black;
    padding: 32px;
    border-radius: 4px;
    
    p {
        margin: 0;
    }

    .details {
        width: 300px;

        .image {
            img { width: 100%}
        }

        .infos {
            p {
                font-size: 18px;
                font-weight: 600;
                margin-top: 8px;
            }

            span {
                font-size: 14px;

                overflow: hidden;
                display: -webkit-box;
                -webkit-line-clamp: 3; /* number of lines to show */
                        line-clamp: 3; 
                -webkit-box-orient: vertical;
            }
        }
    }
    

    .options {
        display: flex;
        gap: 4px;
        margin-top: 16px;

        button {
            width: 49%;
        }

        button {
            background-color: #737ad3;
            color: white;
            border: 0;
            border-radius: 4px;
            padding: 8px 0;
            cursor: pointer;
        }

        button:hover {
            opacity: 0.8;
            transition: 0.2s;
        }
    }
`