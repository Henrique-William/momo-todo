import { useState } from "react";
import "./CustomSelect.css";

const options = [
  { id: 1, title: "Low" },
  { id: 2, title: "Medium" },
  { id: 3, title: "High" },
];

interface CustomSelectProps {
  value: number; // Valor selecionado (controlado pelo componente pai)
  onChange: (value: number) => void; // Função para notificar o componente pai
}

export default function CustomSelect({ value, onChange }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Função para lidar com a seleção de uma opção
  const handleSelect = (id: number) => {
    onChange(id); // Notifica o componente pai sobre a mudança
    setIsOpen(false); // Fecha o dropdown
  };

  // Encontra o título da opção selecionada com base no `value`
  const selectedOption = options.find((option) => option.id === value);
  const selectedTitle = selectedOption ? selectedOption.title : "Select an option";

  return (
    <div className="custom-select">
      <div className="select-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="select-header-title">
          {selectedTitle}{" "}
          <img
            src="/image/arrow-down.png" // Substitua pela sua imagem
            alt="Seta"
            className={`toggle-image ${isOpen ? "flipped" : ""}`}
          />
        </div>
      </div>
      {isOpen && (
        <div className="select-options">
          {options.map((option) => (
            <div
              key={option.id}
              className="select-option"
              onClick={() => handleSelect(option.id)}
            >
              {option.title}{" "}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}