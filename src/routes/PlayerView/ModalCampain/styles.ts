import styled from "styled-components";

export const Container = styled.div`
    width: 800px;
    padding: 16px;
    display: flex;

    background: #343493;
    border-radius: 4px;

    .campain {
        width: 50%;
        background-color: white;
        border-radius: 4px;
        overflow: hidden;

        .top {
            height: 150px;
            display: flex;
            align-items: flex-end;
            padding: 16px;
            font-size: 24px;
            background-size: 130%;
            position: relative;

            .players {
                position: absolute;
                top: 8px;
                right: 8px;
                font-size: 14px;
                background-color: #8080807a;
                padding: 4px 8px;
                border-radius: 9999px;
            }
        }

        .details{
            padding: 16px;
            color: black;

            .detailItem{

                p{
                    margin: 0;
                    margin-top: 8px;
                    font-size: 18px;
                    font-weight: 600;
                }

                .lore {
                    overflow: hidden;
                    display: -webkit-box;
                    -webkit-line-clamp: 3; /* number of lines to show */
                            line-clamp: 3; 
                    -webkit-box-orient: vertical;

                    margin-bottom: 8px;
                }
            }
            
        }
    }

    .character {
        width: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        align-content: center;
        text-align: center;
        justify-content: center;

        .createDescriptions{
            padding: 16px;

            p {
                font-size: 20px;
                font-weight: 600;
            }

            span {
                font-size: 12px;
                line-height: 0.2;
            }

            b {
                font-size: 16px;
            }

            i {
                font-size: 36px;
                margin-bottom: 8px;
                color: #55ff6b;
            }
        }

        .characterImg {
            background-color: white;
            border-radius: 99999px;
            margin: 0;
            padding: 8px;
            margin-bottom: 16px;

            display: flex;
            align-items: center;
            justify-content: center;
            img {
                width: 100px;
            }
        }

        p {
            margin: 0;
        }

        .name {
            font-size: 18px;
            font-weight: 600;
        }

        .level {
            font-size: 16px;
        }

        .attributes {
            gap: 4px;
            display: flex;
            margin: 8px 0;

            .attribute {
                background-color: white;
                color: black;
                padding: 0 4px;
                font-size: 14px;
                border-radius: 4px;

                .attributeNum {
                    
                }
            }
        }
    }
`