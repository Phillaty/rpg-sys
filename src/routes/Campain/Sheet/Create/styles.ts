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
            max-width: 550px;

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
                > div {
                    display: flex;
                    flex-direction: column;

                    input, select{
                        height: 32px;
                        border-radius: 4px;
                        border: 1px solid #ababab;
                        outline: none;
                        padding: 0 4px;
                    }

                    textarea {
                        height: 150px;
                        border-radius: 4px;
                        border: 1px solid #ababab;
                        outline: none;
                        padding: 0 4px;
                    }

                    label {
                        margin-top: 8px;
                        margin-bottom: 4px;
                    }
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

            .originItem {
                border: 1px solid gray;
                padding: 8px;
                border-radius: 4px;
                cursor: pointer;
                width: 159px;

                span {
                    display: flex;
                    align-items: center;
                    font-size: 12px;
                    color: gray;
                    gap: 4px;
                    margin-left: 4px;
                }
            }

            .originItem:hover {
                background-color: #737ad3;
                color: white;
                border-color: transparent;

                span {
                    color: white;
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

                span {
                    font-size: 12px;
                    color: gray;
                }
            }

            .classItem:hover {
                background-color: #737ad3;
                color: white;
                border-color: transparent;

                span {
                    color: white;
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

            > div:hover {
                background-color: #737ad3;
                color: white;
                border-color: transparent;

                span {
                    color: white;
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
`