import { useState, useCallback } from 'react';

export interface ModalState {
  showClassesModal: boolean;
  showSubclassesModal: boolean;
  showOrigensModal: boolean;
  showPericiasModal: boolean;
  showHabilidadesModal: boolean;
  showHabilidadesTranscendidasModal: boolean;
  showElementsModal: boolean;
  showInviteModal: boolean;
  showMagicPlayerModal: boolean;
  showEntityModal: boolean;
  showInfoModal: boolean;
  openItemModal: boolean;
  openMagicModal: boolean;
  openStoreModal: boolean;
  openDiscordModal: boolean;
  openSheetModal: boolean;
}

type ModalKey = keyof ModalState;

export function useModalState() {
  const [modals, setModals] = useState<ModalState>({
    showClassesModal: false,
    showSubclassesModal: false,
    showOrigensModal: false,
    showPericiasModal: false,
    showHabilidadesModal: false,
    showHabilidadesTranscendidasModal: false,
    showElementsModal: false,
    showInviteModal: false,
    showMagicPlayerModal: false,
    showEntityModal: false,
    showInfoModal: false,
    openItemModal: false,
    openMagicModal: false,
    openStoreModal: false,
    openDiscordModal: false,
    openSheetModal: false,
  });

  const openModal = useCallback((modalKey: ModalKey) => {
    setModals(prev => ({ ...prev, [modalKey]: true }));
  }, []);

  const closeModal = useCallback((modalKey: ModalKey) => {
    setModals(prev => ({ ...prev, [modalKey]: false }));
  }, []);

  const closeAllModals = useCallback(() => {
    setModals({
      showClassesModal: false,
      showSubclassesModal: false,
      showOrigensModal: false,
      showPericiasModal: false,
      showHabilidadesModal: false,
      showHabilidadesTranscendidasModal: false,
      showElementsModal: false,
      showInviteModal: false,
      showMagicPlayerModal: false,
      showEntityModal: false,
      showInfoModal: false,
      openItemModal: false,
      openMagicModal: false,
      openStoreModal: false,
      openDiscordModal: false,
      openSheetModal: false,
    });
  }, []);

  return {
    modals,
    openModal,
    closeModal,
    closeAllModals,
  };
}