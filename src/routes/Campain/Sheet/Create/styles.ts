import styled from "styled-components";


export const Container = styled.div`
    background-color: #181a1b;
    min-height: 100vh;
    color: #d3d3d3;
    position: relative;

    display: flex;
    justify-content: center;

    .main {
        max-width: 1366px;
        display: flex;
        width: 100%;
    }

    .mainContainer {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        p {
            margin: 0;
        }

        > div {
            background-color: white;
            color: black;
            padding: 32px;
            margin-top: -64px;
            border-radius: 4px;
            min-width: 500px;
            max-width: 570px;

            .top {
                text-align: center;
                margin-bottom: 16px;
            }

            .title {
                font-size: 24px;
            }

            .description {
                font-size: 14px;
                color: gray;
            }

            .buttons {
                display: flex;
                gap: 4px;
                margin-top: 16px;

                button {
                    width: 50%;
                    height: 38px;
                    border: 0;
                    border-radius: 4px;
                    cursor: pointer;
                }

                button:hover {
                    opacity: 0.8;
                    transition: 0.2s;
                }

                .back {
                    background-color: transparent;
                    color: gray;
                    border: 1px solid gray;
                }

                .go {
                    background-color: #737ad3;
                    color: white;
                }

                .disable {
                    background-color: gray;
                }

                .disable:hover {
                    opacity: 1;
                    cursor: auto;
                }
            }
        }
    }

    .stage-create-name {

        > div {

            .inputs {
                display: flex;
                flex-direction: column;
                gap: 8px;
                > div {
                    display: flex;
                    flex-direction: column;
                }
            }

            .buttons {
                button {
                    width: 100%;
                }
            }
        }


    }

    .stage-select-origin{

        .origins {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;
            max-height: 60vh;
            overflow: auto;
            padding-bottom: 32px;

            .originItem {
                border: 1px solid gray;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                width: 159px;

                span {
                    display: flex;
                    font-size: 12px;
                    color: gray;
                    gap: 4px;
                    margin-left: 4px;
                    flex-wrap: wrap;
                    flex-direction: column;
                }
            }

            @media (min-width: 1000px) {
               .originItem:hover {
                    background-color: #737ad3;
                    color: white;
                    border-color: transparent;

                    span {
                        color: white;
                    }
                } 
            }
            

            .selected {
                background-color: #739ed3;
                color: white;
                border-color: transparent;

                span {
                    color: white;
                }
            }
        }
    }

    .stage-select-class {

        > div {
            min-width: 800px;
            max-width: 800px;
        }

        .classes {
            display: flex;
            flex-wrap: wrap;
            gap: 4px;

            .classItem {
                border: 1px solid gray;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                width: 32.9%;
                font-weight: 600;

                p {
                    font-size: 14px;
                    font-weight: 400;
                    margin-bottom: 4px;
                }

                span {
                    font-weight: 500;
                    font-size: 12px;
                    color: gray;
                }
            }

            @media (min-width: 1000px) {
                .classItem:hover {
                    background-color: #737ad3;
                    color: white;
                    border-color: transparent;

                    span {
                        color: white;
                    }
                }
            }

            

            .selected {
                background-color: #739ed3;
                color: white;
                border-color: transparent;

                span {
                    color: white;
                }
            }
        }
    }

    .stage-select-attributes-skills {
        > div {
            min-width: 800px;
            max-width: 800px;
        }

        .attributesDetail {
            text-align: center;
            margin: 0 0 16px 0;

            .data {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 4px;
                margin-top: 8px;

                .info {
                    border: 1px solid lightgrey;
                    border-radius: 4px;
                    padding: 4px 8px;
                }
            }

            .per {
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 14px;
                gap: 4px;

                > div {
                    background-color: #737ad3;
                    color: white;
                    padding: 2px 4px;
                    border-radius: 4px;
                }
            }
        }

        .skillsDetail {
            text-align: center;
            margin: 16px 0 16px 0;
        }

        .attributes {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 16px;

            .item {
                border: 1px solid #00000030;
                padding: 8px;
                border-radius: 8px;
                p {
                    text-align: center;
                }
            }

            .att {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;

                .plus, .minus {
                    padding: 4px;
                    font-size: 18px;
                    cursor: pointer;
                }

                .num {
                    font-size: 24px;
                }
            }
        }

        .skills {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 4px;

            > div {
                border: 1px solid gray;
                padding: 4px 8px;
                border-radius: 4px;
                font-weight: 500;
                cursor: pointer;

                span {
                    font-size: 12px;
                    color: gray;
                    font-weight: 400;
                }
            }

            @media (min-width: 1000px) {
                > div:hover {
                    background-color: #737ad3;
                    color: white;
                    border-color: transparent;

                    span {
                        color: white;
                    }
                }     
            }

                 

            .selected {
                background-color: #739ed3;
                color: white;
                border-color: transparent;

                span {
                    color: white;
                }
            }
        }
    }

    .load {
        > div {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            padding: 100px 0;
        }
    }

    .hability {
        margin-bottom: 16px;

        .titleHab {
            font-size: 18px;
        }

        .item {
            border-top: 1px solid lightgray;
            margin-top: 4px;
        }
    }

    @media screen and (max-width: 1000px) {
        .stage-select-origin .top {
            padding-top: 32px;
        }

        .mainContainer {
            align-items: flex-start;

            > div {
                min-width: 100%;
                max-width: 100%;
                margin-top: 0;
                height: 100%;
                padding: 32px 16px;
            }
        }
        
        .stage-select-origin .origins .originItem {
            width: 49%;
        }

        .stage-select-class .classes .classItem {
            width: 49%;
        }

        .attributes .item {
            width: 30%;
        }
    }
`