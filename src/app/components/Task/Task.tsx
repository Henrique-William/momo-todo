import React from "react";
import "./task.css";

import Image from "next/image";
import finalizeTaskImg from "/public/image/complete.png";
import deleteTaskImg from "/public/image/delete.png";

interface TaskProps {
  name: string;
  description: string;
  isFinalized?: boolean;
  priority: number;
  dueDate: string;
  finalizeTask: () => void;
  deleteTask: () => void;
}
export default function Task({
  name: name,
  isFinalized: isFinalized,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  priority: priority,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars 
  dueDate: dueDate, 
  finalizeTask: finalizeTask,
  deleteTask: deleteTask,
}: TaskProps) {
  return (
    <div className="task">
      {isFinalized ? (
        <h3 className="task__title-hashed">{name}</h3>
      ) : (
        <h3 className="task__title">{name}</h3>
      )}
      {!isFinalized && (
        <div className="task__actions">
          <button className="task__finalize" onClick={finalizeTask}>
            <Image
              src={finalizeTaskImg}
              alt="finalize task"
              className="image__actions"
            />
          </button>
          <button className="task__delete" onClick={deleteTask}>
            <Image
              src={deleteTaskImg}
              alt="finalize task"
              className="image__actions"
            />
          </button>
        </div>
      )}
    </div>
  );
}
