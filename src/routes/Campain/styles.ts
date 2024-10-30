import styled from "styled-components";


export const Container = styled.div`
    background-color: #181a1b;
    min-height: 100vh;
    color: #d3d3d3;

    display: flex;
    justify-content: center;

    .main {
        max-width: 1366px;
        display: flex;
        width: 100%;
    }

    .left {
        width: 410px;
    }

    .right {
        width: 956px;

        display: flex;
        flex-direction: column;
        align-items: center;

        padding: 24px 0 0 24px;
    }

    .left {
        color: #ffffff;
        border-right: 1px solid #2f2f2f;
        border-left: 1px solid #2f2f2f;
    }

    .image {
        width: 100%;
        img {
            width: 100%;
        }
    }

    .details{
        padding: 24px;

        p {
            margin: 0;
        }

        .title {
            font-size: 24px;
            margin-bottom: 16px;
        }

        .descriptionNormal {
            span {
                font-size: 16px;
            }

            p {
                font-size: 14px;
            }
        }
    }


    .charimage {
        display: flex;
        justify-content: center;

        img {
            width: 100%;
            margin: 0;
            padding: 0;
        }

        span {
            width: 80px;
            padding: 4px;
            background-color: white;
            border-radius: 9999px;

            display: flex;
            align-items: center;
            justify-content: center;
        }
    }

    .charInfos {
        text-align: center;
        margin-top: 16px;

        > p {
            font-size: 18px;
            margin: 0;
        }

        .info {
            p {
                font-size: 14px;
                margin: 0;
            }
        }
    }

    .skill {
        width: 100%;
        margin-top: 16px;
        padding: 16px;
        background-color: #39393982;
        color: white;
        border-radius: 4px;
        margin-bottom: 32px;


        .skillItems {
            display: flex;
            flex-direction: column;

            > div {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                flex-direction: column;

                .skillsgrid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .itemSkill {
                    border: 1px solid gray;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    transition: 0.2s;
                }

                .itemSkill:hover {
                    background-color: white;
                    border-color: white;
                    color: #181a1b; 
                    transition: 0.2s;
                }
            }
            
        }
    }

    .health {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 16px;

        padding: 4px 16px 16px 16px;

        .label {
            margin-bottom: 8px;
            text-align: center;
        }

        .editHealth {
            display: flex;
            justify-content: center;
            width: 100%;

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
        }
    }

    .bar {
        width: 200px;
        border: 1px solid #ffffff36;
        height: 30px;

        display: flex;
        justify-content: center;
        align-items: center;

        position: relative;

        border-radius: 999px;
        overflow: hidden;

        span {
            position: absolute;
            height: 100%;
            left: 0;
            top: 0;
            z-index: 0;
        }

        p {
            margin: 0;
            font-size: 14px;
            position: relative;
            color: white;
            z-index: 1;
        }
    }

    .life span {
        background-color: #930000;
    }

    .sanity span {
        background-color: #2e2ecd;
    }

    .cyberpsicosy span {
        background-color: #1392bb;
    }

    .pe span {
        background-color: #077f21;
    }

    .descriptionNormal {
        border-bottom: 1px solid #434343;
        padding: 8px 0;

        span {
            font-weight: 600;
            font-size: 18px !important;
        }
    }

    @media screen and (max-width: 1000px) {
        .main {
            flex-wrap: wrap;
            flex-direction: column-reverse;
        }

        .left {
            width: 100%;
            margin-top: 32px;
        }

        .right {
            width: 100%;
            padding: 16px;
        }

        .health {
            .bar {
                width: 150px;
            }
        }

        .buttonsChar {
            margin-bottom: 32px;
        }
    }

    @media screen and (max-width: 390px) {
        .health {
            gap: 8px;
            padding: 8px 0;

            .editHealth {
                justify-content: flex-end
            }

            > div {
                width: 100%;
                display: flex;
                align-items: center;

                > p {
                    width: 30%;
                    display: flex;
                    align-items: center;
                    margin: 0 !important;
                    height: 100%;
                }
            }

            

            .bar {
                width: 70%;
            }
        }
    }
`