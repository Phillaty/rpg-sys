import styled from 'styled-components';

export const Container = styled.div`
    display: flex;
    height: 90vh;
    background-color: #f5f5f5;
    border-radius: 8px;
    overflow: hidden;

    .left {
        flex: 1;
        background-color: white;
        border-right: 1px solid #e0e0e0;
        display: flex;
        flex-direction: column;

        .title {
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            background-color: #343493;

            p {
                font-size: 18px;
                font-weight: bold;
                color: white;
                margin: 0;
            }
        }

        .divAdd {
            padding: 16px 20px;
            border-bottom: 1px solid #e0e0e0;

            button {
                background-color: #28a745;
                color: white;
                border: none;
                padding: 10px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                transition: background-color 0.2s;

                &:hover {
                    background-color: #218838;
                }

                i {
                    margin-right: 8px;
                }
            }
        }

        .list {
            flex: 1;
            overflow-y: auto;
            padding: 0;

            .item {
                padding: 16px 20px;
                border-bottom: 1px solid #f0f0f0;
                cursor: pointer;
                transition: background-color 0.2s;

                &:hover {
                    background-color: #f8f9fa;
                }

                &.selected {
                    background-color: #e3f2fd;
                    border-left: 4px solid #343493;
                }

                .info {
                    .name {
                        font-weight: bold;
                        font-size: 16px;
                        color: #333;
                        margin: 0 0 4px 0;
                    }

                    .character {
                        font-size: 14px;
                        color: #666;
                        margin: 0 0 4px 0;
                        font-style: italic;
                    }

                    .description {
                        font-size: 13px;
                        color: #888;
                        margin: 0;
                        line-height: 1.4;
                    }
                }
            }
        }
    }

    .right {
        flex: 1.5;
        background-color: white;
        display: flex;
        flex-direction: column;

        .title {
            padding: 20px;
            border-bottom: 1px solid #e0e0e0;
            background-color: #343493;

            p {
                font-size: 18px;
                font-weight: bold;
                color: white;
                margin: 0;
            }
        }

        .form {
            flex: 1;
            padding: 20px;
            overflow-y: auto;

            .actions {
                display: flex;
                gap: 12px;
                align-items: center;
                justify-content: flex-start;
                margin-top: 20px;

                button {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: bold;
                    transition: all 0.2s;

                    &:first-child {
                        background-color: #343493;
                        color: white;

                        &:hover {
                            background-color: #2c2f7a;
                        }
                    }

                    &.delete {
                        background-color: #dc3545;
                        color: white;

                        &:hover {
                            background-color: #c82333;
                        }
                    }

                    &.cancel {
                        background-color: #6c757d;
                        color: white;

                        &:hover {
                            background-color: #545b62;
                        }
                    }
                }
            }
        }
    }

    @media (max-width: 768px) {
        flex-direction: column;
        height: auto;

        .left {
            border-right: none;
            border-bottom: 1px solid #e0e0e0;
            max-height: 40vh;
        }

        .right {
            flex: 1;
        }
    }
`;