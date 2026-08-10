"use client";

import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface ModalContextType {
  openModals: Record<string, boolean>;
  openModal: (id: string) => void;
  closeModal: (id: string) => void;
  toggleModal: (id: string) => void;
  isOpen: (id: string) => boolean;
}

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [openModals, setOpenModals] = useState<Record<string, boolean>>({});

  const openModal = useCallback((id: string) => {
    setOpenModals((prev) => ({ ...prev, [id]: true }));
  }, []);

  const closeModal = useCallback((id: string) => {
    setOpenModals((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }, []);

  const toggleModal = useCallback((id: string) => {
    setOpenModals((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      return next;
    });
  }, []);

  const isOpen = useCallback(
    (id: string) => Boolean(openModals[id]),
    [openModals],
  );

  const value = useMemo(
    () => ({
      openModals,
      openModal,
      closeModal,
      toggleModal,
      isOpen,
    }),
    [openModals, openModal, closeModal, toggleModal, isOpen],
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    // Graceful fallback if ModalProvider is omitted
    return {
      openModals: {},
      openModal: () => {},
      closeModal: () => {},
      toggleModal: () => {},
      isOpen: () => false,
    };
  }
  return context;
}
