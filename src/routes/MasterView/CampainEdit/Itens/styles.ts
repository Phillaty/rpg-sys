import styled from "styled-components";

export const Container = styled.div`
    background-color: white;
    padding: 16px;
    border-radius: 4px;

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

    .remove {
        background-color: #d37373;
    }


    .actions {
        display: flex;
        gap: 4px;
    }

    .topOptions {
        display: flex;
        justify-content: space-between;
        margin-bottom: 4px;

        .search {
            display: flex;

            button {
                padding: 0 16px;
            }
        }

        .buttons {
            display: flex;
            button {
                padding: 0 16px;
            }
        }
    }
`