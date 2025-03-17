import { ReactNode } from "react";
import "./Modal.css";
import Image from "next/image";

import closeModal from "/public/image/close.png";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          <Image
            src={closeModal}
            alt="Icone de fechar modal"
            width={15}
            className="close-img"
          ></Image>
        </button>
        {children}
      </div>
    </div>
  );
}
