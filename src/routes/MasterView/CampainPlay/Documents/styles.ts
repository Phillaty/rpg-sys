import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  padding: 20px;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    h2 {
      color: #ddddddff;
      margin: 0;
    }

    .add-button {
      background: #5755bd;
      color: white;
      border: none;
      padding: 10px 20px;
      border-radius: 5px;
      cursor: pointer;
      font-weight: 500;
      transition: background 0.3s ease;

      &:hover {
        background: #4a48a5;
      }
    }
  }

  .add-form {
    background: #f5f5f5;
    border-radius: 10px;
    padding: 20px;
    margin-bottom: 30px;
    border: 1px solid #ddd;

    h3 {
      margin: 0 0 20px 0;
      color: #333;
    }

    .form-content {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .file-upload {
      .file-upload-area {
        border: 2px dashed #5755bd;
        border-radius: 10px;
        padding: 40px;
        text-align: center;
        position: relative;
        cursor: pointer;
        transition: border-color 0.3s ease;

        &:hover {
          border-color: #4a48a5;
        }

        p {
          margin: 0;
          color: #5755bd;
          font-weight: 500;
          
          i {
            font-size: 20px;
            margin-right: 10px;
          }
        }

        input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
        }
      }

      .file-preview {
        display: flex;
        align-items: center;
        gap: 15px;
        padding: 20px;
        background: white;
        border-radius: 10px;
        border: 1px solid #ddd;

        img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 5px;
        }

        .file-icon {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100px;
          height: 100px;
          background: #f0f0f0;
          border-radius: 5px;

          i {
            font-size: 40px;
            color: #666;
            margin-bottom: 10px;
          }

          p {
            font-size: 12px;
            text-align: center;
            margin: 0;
            color: #666;
            word-break: break-word;
          }
        }

        button {
          background: #f44336;
          color: white;
          border: none;
          padding: 8px 15px;
          border-radius: 5px;
          cursor: pointer;
          font-size: 12px;
          
          &:hover {
            background: #d32f2f;
          }
        }
      }
    }

    .form-inputs {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 20px;
    }

    .form-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 10px;

      .create-button {
        background: #4caf50;
        color: white;
        border: none;
        padding: 12px 25px;
        border-radius: 5px;
        cursor: pointer;
        font-weight: 500;
        transition: background 0.3s ease;

        &:hover:not(:disabled) {
          background: #45a049;
        }

        &:disabled {
          background: #ccc;
          cursor: not-allowed;
        }
      }
    }
  }

  .documents-list {
    .no-documents {
      text-align: center;
      color: #666;
      font-style: italic;
      padding: 40px;
      background: #f5f5f5;
      border-radius: 10px;
    }

    .document-item {
      background: white;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 20px;
      margin-bottom: 15px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      transition: box-shadow 0.3s ease;

      &:hover {
        box-shadow: 0 4px 8px rgba(0,0,0,0.15);
      }

      .document-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 15px;

        .document-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 15px;

          h4 {
            margin: 0;
            color: #333;
            font-size: 18px;
            flex: 1;
          }

          .document-tags {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
        }

        .document-details {
          color: #666;
          font-size: 14px;

          p {
            margin: 5px 0;
          }

          strong {
            color: #333;
          }
        }

        .document-transfer {
          display: flex;
          align-items: center;
          gap: 10px;

          button {
            background: transparent;
            color: gray;
          }
        }
      }

      .document-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;
        min-width: 120px;

        button {
          padding: 8px 15px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 12px;
          font-weight: 500;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          transition: background 0.3s ease;

          i {
            font-size: 14px;
          }
        }

        .view-button {
          background: #2196f3;
          color: white;

          &:hover {
            background: #1976d2;
          }
        }

        .delete-button {
          background: #f44336;
          color: white;

          &:hover {
            background: #d32f2f;
          }
        }
      }
    }
  }

  @media (max-width: 768px) {
    padding: 15px;

    .header {
      flex-direction: column;
      align-items: stretch;
      gap: 15px;

      h2 {
        text-align: center;
      }
    }

    .add-form .form-inputs {
      grid-template-columns: 1fr;
    }

    .document-item {
      flex-direction: column;
      align-items: stretch;

      .document-info .document-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .document-actions {
        flex-direction: row;
        justify-content: space-between;
        min-width: auto;
      }
    }
  }
`;