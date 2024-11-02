import styled from "styled-components";


export const Container = styled.div`
    background-color: white;
    padding: 16px;
    border-radius: 4px;

    .weight {
        margin: 0;
        color: gray;
        text-align: center;

        i {
            color: #656565;
            font-size: 14px;
        }
    }

    .TabContainer {
        max-width: 400px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        margin-top: 4px;

        max-height: 80vh;
        overflow: auto;

        width: 400px;
        min-height: 80vh;

        button {
            background-color: #737ad3;
            color: white;
            border: 0;
            border-radius: 4px;
            padding: 4px 8px;
            cursor: pointer;
        }

        button:hover {
            opacity: 0.8;
            transition: 0.2s;
        }

        .item {
            padding: 8px;
            border-radius: 4px;
            border: 1px solid lightgray;
            color: #6d6d6d;

            .name {
                font-size: 18px;
                color: black;
                font-weight: 600;
            }

            span {
                color: black;
            }

            .buttons {
                display: flex;
                justify-content: flex-end;
                gap: 4px;

                button {
                    padding: 8px 16px;
                }
            }
        }
    }

    @media (max-width: 1000px) {
        .TabContainer {
            width: 100%;
        }
    }

    @media (max-height: 800px) {
        .TabContainer {
            max-height: 70vh;
            min-height: 70vh;
        }
    }
`