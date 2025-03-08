"use client";
import "./page.css";
import Image from "next/image";
import Task from "./components/Task/Task";

import addImage from "/public/image/add.png";
import { useEffect, useState } from "react";

type Task = {
  id: number;
  name: string;
  description: string;
  isFinalized: boolean;
  priority: number;
  dueDate: string;
};

export default function Home() {
  const [data, setData] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  //lista todas as tarefas
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8080/tasks");
        const tasks: Task[] = await response.json();
        setData(tasks);
        setIsLoading(false);
      } catch (error) {
        console.error("Erro ao buscar dados", error);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const finalizeTask = async (task: Task) => {
    try {
      // Criamos um novo objeto com os mesmos dados da tarefa, apenas alterando o isFinalized
      const updatedTask = { ...task, isFinalized: !task.isFinalized };
      console.log(updatedTask);

      const response = await fetch(
        `http://localhost:8080/tasks/task?id=${task.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedTask), // Envia o objeto completo
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao atualizar status da tarefa");
      }

      // Atualiza o estado localmente para refletir a mudança sem precisar refazer a requisição GET
      setData((prevData) =>
        prevData.map((t) => (t.id === task.id ? updatedTask : t))
      );
    } catch (error) {
      console.error("Erro ao atualizar tarefa:", error);
    }
  };

  const deleteTask = async (task: Task) => {
    const confirmDelete = window.confirm(
      `Tem certeza que deseja excluir a tarefa "${task.name}"?`
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:8080/tasks/task?id=${task.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Erro ao deletar tarefa");
      }

      // Atualiza o estado removendo a tarefa deletada
      setData((prevData) => prevData.filter((t) => t.id !== task.id));
    } catch (error) {
      console.error("Erro ao deletar tarefa:", error);
      alert("Erro ao deletar tarefa. Tente novamente!");
    }
  };

  if (isLoading) {
    return <div>Carregando tarefas...</div>;
  }

  const tasksTodo = data.filter((task) => !task.isFinalized);
  const tasksFinished = data.filter((task) => task.isFinalized);

  return (
    <section className="page">
      <div className="search__container">
        <input
          type="text"
          className="search-field"
          placeholder="Search a task"
        />
        <button className="add-task">
          <Image
            src={addImage}
            alt="botao de adicionar task"
            className="add-task__img"
          />
        </button>
      </div>

      {/* Tasks to do */}
      <div className="tasks__container">
        <h2 className="title">Tasks to do {tasksTodo.length}</h2>
        {tasksTodo.map((task, index) => (
          <Task
            key={index}
            name={task.name}
            description={task.description}
            isFinalized={task.isFinalized}
            priority={task.priority}
            dueDate={task.dueDate}
            finalizeTask={() => finalizeTask(task)}
            deleteTask={() => deleteTask(task)}
          />
        ))}
      </div>

      {/* Tasks finished */}
      {tasksFinished.length > 0 && (
        <div className="tasks__finished">
          <h2 className="title">Done - {tasksFinished.length}</h2>
          {tasksFinished.map((task, index) => (
            <Task
              key={index}
              name={task.name}
              description={task.description}
              isFinalized={task.isFinalized}
              priority={task.priority}
              dueDate={task.dueDate}
              finalizeTask={() => finalizeTask(task)}
              deleteTask={() => deleteTask(task)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
