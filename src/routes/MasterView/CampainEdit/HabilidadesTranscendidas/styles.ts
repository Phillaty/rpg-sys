import styled from "styled-components";

export const Container = styled.div`
    background-color: white;
    padding: 16px;
    border-radius: 4px;

    > div {
        display: flex;

        .left {
            display: flex;
            flex-direction: column;
            gap: 4px;
            max-height: 80vh;
            overflow: auto;
            padding-right: 4px;

            button {
                width: 100%;
                background-color: transparent;
                border: 1px solid gray;
                border-radius: 4px;
                padding: 8px 16px;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            button:hover {
                opacity: 0.8;
                transition: 0.2s;
            }

            .selected {
                background-color: #4a148c;
                color: white;
                border-color: transparent;
            }

            .add {
                background-color: #6a1b9a;
                color: white;
                border-color: transparent;
            }
        }

        .right {
            width: 40vw;
            padding: 0 16px;
            display: flex;
            flex-direction: column;
            gap: 8px;

            max-height: 90vh;
            min-height: 50vh;
            overflow: auto;

            .isLoading {
                width: 100%;
                height: 200px;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            > div {
                width: 100%;
            }

            .name, .description, .infos, .buttons {

                > div {
                    width: 100%;
                }
                
            }

            .infos {
                border: 1px solid #d5d5d5;
                border-radius: 4px;
                padding: 16px;

                .infoInput {
                    display: flex;

                    > div {
                        width: 100%;
                    }

                    button {
                        background-color: #6a1b9a;
                        color: white;
                        border: 0;
                        border-radius: 4px;
                        padding: 8px 16px;
                        cursor: pointer;
                    }

                    button:hover {
                        opacity: 0.8;
                        transition: 0.2s;
                    }

                    .cancel {
                        background-color: #ff6b6b;
                    }
                }

                .perkList {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                    margin-top: 8px;
                }

                .perkItem {
                    padding: 4px 8px;
                    background-color: #f0f0f0;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    border: 1px solid transparent;
                }

                .perkItem:hover {
                    border-color: #6a1b9a;
                }

                .perkItem.selected {
                    background-color: #6a1b9a;
                    color: white;
                }
            }

            .buttons {
                display: flex;
                gap: 8px;

                button {
                    background-color: #6a1b9a;
                    color: white;
                    border: 0;
                    border-radius: 4px;
                    padding: 8px 16px;
                    cursor: pointer;
                    flex: 1;
                }

                button:hover {
                    opacity: 0.8;
                    transition: 0.2s;
                }

                .cancel {
                    background-color: #ff6b6b;
                }

                .delete {
                    background-color: #dc3545;
                }

                button:disabled {
                    background-color: #ccc;
                    cursor: not-allowed;
                    opacity: 0.6;
                }

                button:disabled:hover {
                    opacity: 0.6;
                }
            }

            .characters {
                display: flex;
                flex-direction: column;
                gap: 8px;
                max-height: 200px;
                overflow: auto;
                border: 1px solid #d5d5d5;
                border-radius: 4px;
                padding: 8px;
                background-color: #f9f9f9;

                .character {
                    padding: 8px;
                    background-color: white;
                    border-radius: 4px;
                    border: 1px solid #e0e0e0;

                    .name {
                        font-weight: bold;
                        margin-bottom: 4px;
                    }

                    .info {
                        font-size: 12px;
                        color: #666;
                    }
                }
            }

            .requireList {
                display: flex;
                flex-wrap: wrap;
                gap: 4px;
                margin-top: 8px;
            }
        }
    }

    .tabPanel {
        padding: 16px 0;

        .buffSection {
            border: 1px solid #e0e0e0;
            border-radius: 4px;
            padding: 16px;
            margin-bottom: 16px;

            .buffTitle {
                font-weight: bold;
                margin-bottom: 12px;
                color: #6a1b9a;
            }

            .buffItem {
                display: flex;
                align-items: center;
                gap: 8px;
                margin-bottom: 8px;

                input, select {
                    padding: 4px 8px;
                    border: 1px solid #d5d5d5;
                    border-radius: 4px;
                }

                button {
                    background-color: #6a1b9a;
                    color: white;
                    border: 0;
                    border-radius: 4px;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 12px;
                }

                button:hover {
                    opacity: 0.8;
                }

                .remove {
                    background-color: #dc3545;
                }
            }

            .buffList {
                margin-top: 8px;
            }

            .buffListItem {
                padding: 8px;
                background-color: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 4px;
                margin-bottom: 4px;
                display: flex;
                justify-content: space-between;
                align-items: center;

                button {
                    background-color: #dc3545;
                    color: white;
                    border: 0;
                    border-radius: 4px;
                    padding: 2px 6px;
                    cursor: pointer;
                    font-size: 12px;
                }
            }
        }
    }

    @media screen and (max-width: 1200px) {
        > div {
            flex-direction: column;

            .left {
                max-height: 200px;
                margin-bottom: 16px;
            }

            .right {
                width: 100%;
                max-height: 60vh;
            }
        }
    }
`;