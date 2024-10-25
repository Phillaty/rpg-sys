import styled, { css, keyframes } from "styled-components";

const fadeIn = keyframes`
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
`

const fadeOut = keyframes`
  0% {
    transform: translateY(0%);
  }
  100% {
    transform: translateY(100%);
  }
`

export const Container = styled.div<{isToCloseSheet: boolean}>`
    position: fixed;
    left: 0;
    top: 0;
    width: 100vw;
    height: 100vh;

    z-index: 3;

    background-color: #181a1b;
    color: #d3d3d3;

    transform: translateY(-100%);

    
    ${({ isToCloseSheet }) => css`
        animation: 0.5s ${isToCloseSheet ? fadeOut : fadeIn} forwards;
    `}
    

    display: flex;
    flex-direction: column;
    align-items: center;

    p {
        margin: 0;
    }

    .close {
        margin-top: 24px;

        button {
            height: 32px;
            margin-left: 4px;
            padding: 0 16px;
            background-color: #d37373;
            color: white;
            border: 0;
            border-radius: 4px;
            cursor: pointer;
        }

        button:hover {
            opacity: 0.8;
            transition: 0.2s;
        }
    }

    .mainDetails {
        max-width: 1366px;
        display: flex;
        align-items: flex-start;
        flex-wrap: wrap;
        width: 100%;
        gap: 16px;
        margin-top: 24px;
    }

    .charInfo {
        background-color: white;
        color: black;
        padding: 32px 16px;
        border-radius: 4px;

        width: 420px;

        .img {
            text-align: center;

            img {
                width: 80px;
            }
        }

        .infos {
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 4px;

            text-align: center;
        }

        .label {
            font-size: 18px;
            font-weight: 600px;
        }

        .info {
            font-size: 14px;
            font-weight: 500px;

            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 3;
                    line-clamp: 3; 
            -webkit-box-orient: vertical;
        }

        .button {
            margin-top: 16px;
            text-align: center;

            button {
                height: 32px;
                margin-left: 4px;
                padding: 0 16px;
                background-color: #737ad3;
                color: white;
                border: 0;
                border-radius: 4px;
                cursor: pointer;
            }

            button:hover {
                opacity: 0.8;
                transition: 0.2s;
            }
        }
    }

    .habilitys {
        color: black;
        width: 615px;

        > div {
            background-color: white;
            padding: 24px 16px 32px 16px;
            border-radius: 4px;
            margin-bottom: 16px;
        }

        .title {
            font-size: 24px;
            margin-bottom: 16px;
        }

        .itens {
            display: flex;
            flex-direction: column;
            gap: 4px;

            .add {
                padding: 16px;
                border: 1px dashed gray;
                display: flex;
                display: flex;
                flex-direction: column;
                align-items: center;
                cursor: pointer;
                border-radius: 4px;

                height: 85px;

                i {
                    font-size: 28px;
                    color: green;
                }
            }

            .add:hover {
                background-color: #f1f1f1;
                transition: 0.2s;
            }


            .item {
                border: 1px solid #c3c3c3;
                border-radius: 4px;
                padding: 8px;
                cursor: pointer;

                .detail {
                    font-size: 14px;
                }

                .name {
                    font-weight: 600;
                }
            }

        }
    }

    .skills {
        background-color: white;
        color: black;
        padding: 24px 16px 32px 16px;
        border-radius: 4px;

        width: 295px;

        .title {
            font-size: 24px;
            margin-bottom: 16px;

            button {
                height: 32px;
                margin-left: 4px;
                padding: 0 16px;
                background-color: #737ad3;
                color: white;
                border: 0;
                border-radius: 4px;
                cursor: pointer;

                display: block;
                float: inline-end;
            }

            button:hover {
                opacity: 0.8;
                transition: 0.2s;
            }
        }

        .base {
            font-size: 16px;
            color: #a3a3a3;
            width: 27px;
            display: block;
        }

        .expertise {
            background-color: #737ad3;
            color: white;
            padding: 2px 4px;
            border-radius: 4px;
            margin-right: 4px;
            font-size: 12px;
        }

        .item{
            border: 1px solid #d1d1d1;
            padding: 8px 8px 8px 4px;
            border-radius: 4px;

            > p {
                display: flex;
                justify-content: space-between;
            }
        }

        .itens {
            display: flex;
            gap: 4px;
            flex-direction: column;
        }

        .detailsSkills {
            display: flex;
        }
    }


    @media screen and (max-width: 1362px) {
        .skills {
            width: 420px;
        }
    }

    @media screen and (max-width: 1051px) {
        .charInfo, .habilitys, .skills {
            width: 100%;
        }

        .mainDetails {
            overflow-y: auto;
            overflow-x: hidden;
            padding-bottom: 100px;
        }
    }
`;

export const ContainerModal = styled.div`
    background-color: white;
    color: black;
    padding: 16px 16px 24px;
    border-radius: 4px;

    max-width: 1000px;

    p {
        margin: 0;
    }

    .title {
        text-align: center;
        padding: 16px;
        font-size: 18px;
        font-weight: 600;
    }

    .itens {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 4px;

        max-height: 60vh;
        overflow: auto;

        .item {
            max-width: 300px;
            border: 1px solid gray;
            padding: 8px;
            cursor: pointer;

            .detail {
                font-size: 14px;
            }

            .name {
                font-weight: 600;
            }
        }

        .item:hover {
            background-color: #737ad3;
            color: white;
            border-color: transparent;
            transition: 0.1s;
        }

        .selected {
            background-color: #739ed3;
            color: white;
            border-color: transparent;
        }
    }

    .buttons {
        display: flex;
        justify-content: center;
        margin-top: 16px;

        button {
            background-color: #737ad3;
            color: white;
            border: 0;
            border-radius: 4px;
            padding: 8px 32px;
            cursor: pointer;
        }

        button:hover {
            opacity: 0.8;
            transition: 0.2s;
        }

        .disabled {
            background-color: #a7a7a7;
            cursor: auto;
        }

        .disabled:hover {
            opacity: 1;
        }
    }


    .subclass {
        display: flex;
        justify-content: center;

        .subclassItens {
            max-width: 380px;

            .item {
                padding: 4px 8px;
                border-radius: 4px;
                border: 1px solid gray;
                margin-bottom: 4px;
                font-size: 14px;
                cursor: pointer;
            }

            .selected {
                background-color: #739ed3;
                color: white;
                border-color: transparent;
            }
        }

        .subclassItensDetails {
            max-width: 600px;
            padding: 0 16px;
            height: 300px;
            overflow: auto;

            .subclassTitle {
                font-weight: 600;
                font-size: 18px;
                margin-bottom: 8px;
            }

            .subclassDescription, .subclassskillsItens {
                font-size: 14px;
            }

            .subclassskillsItens {
                margin-top: 8px;

                p {
                    font-weight: 600;
                }
            }
        }
    }

    @media screen and (max-width: 1051px) {
        width: 100vw;

        .subclass .subclassItens {
            max-height: 60vh;
            overflow-y: auto;
            min-width: 120px;
        }

        .subclass .subclassItensDetails {
            height: 60vh;
            max-height: 60vh;
        }
    }
`