"use client";
import "./page.css";
import Image from "next/image";
import Task from "./components/Task/Task";

import addImage from "/public/image/add.png";
import {useEffect, useState} from "react";
import {apiDev} from "./service";
import Modal from "./components/Modal/Modal";
import CustomSelect from "./components/CustomSelect/CustomSelect";

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
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [taskName, setTaskName] = useState("");
    const [taskDescription, setTaskDescription] = useState("");
    const [taskPriority, setTaskPriority] = useState(2);
    const [taskDate, setTaskDate] = useState("");
    const [searchValue, setsearchValue] = useState("");

    // Função para buscar as tarefas do backend
    const fetchData = async () => {
        try {
            const response = await fetch(`${apiDev}/tasks`);
            const tasks: Task[] = await response.json();
            setData(tasks);
            setIsLoading(false);
        } catch (error) {
            console.error("Erro ao buscar dados", error);
            setIsLoading(false);
        }
    };

    // Chama fetchData ao montar o componente
    useEffect(() => {
        fetchData();
    }, []);

    const handleAddTask = async () => {
        const taskData = {
            name: taskName,
            description: taskDescription,
            priority: taskPriority,
            date: taskDate,
        };

        try {
            const response = await fetch(`${apiDev}/tasks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(taskData),
            });

            if (response.ok) {
                setTaskName("");
                setTaskDescription("");
                setTaskPriority(2);
                setTaskDate("");

                setIsModalOpen(false);
                fetchData();
            } else {
                console.error("Erro ao adicionar tarefa");
            }
        } catch (error) {
            console.error("Erro:", error);
        }
    };

    const finalizeTask = async (task: Task) => {
        try {
            const updatedTask = {...task, isFinalized: !task.isFinalized};

            const response = await fetch(`${apiDev}/tasks/task?id=${task.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok) {
                throw new Error("Erro ao atualizar status da tarefa");
            }

            fetchData(); // Atualiza a lista após finalizar uma tarefa
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
            const response = await fetch(`${apiDev}/tasks/task?id=${task.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erro ao deletar tarefa");
            }

            fetchData(); // Atualiza a lista após excluir uma tarefa
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

    const filteredTasksTodo = tasksTodo.filter((task) =>
        task.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    const filteredTasksFinished = tasksFinished.filter((task) =>
        task.name.toLowerCase().includes(searchValue.toLowerCase())
    );

    return (
        <section className="page">
            <div className="search__container">
                <input
                    type="text"
                    className="search-field"
                    placeholder="Search a task"
                    maxLength={155}
                    onChange={(event) => {
                        setsearchValue(event.target.value)
                    }}
                />
                <button className="add-task" onClick={() => setIsModalOpen(true)}>
                    <Image
                        src={addImage}
                        alt="Adicionar task"
                        className="add-task__img"
                    />
                </button>
            </div>

            {/* Modal para adicionar task */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <h2 className="modal-title">Adding Task</h2>
                <div className="modal-container">
                    <div className="modal-field">
                        <p>Name</p>
                        <input
                            type="text"
                            className="input-field__modal"
                            placeholder="Add a name to your task"
                            maxLength={155}
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                        />
                    </div>

                    <div className="modal-field">
                        <p>Description</p>
                        <input
                            type="text"
                            className="input-field__modal"
                            placeholder="Add a description to your task"
                            maxLength={350}
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                        />
                    </div>

                    <div className="modal-field">
                        <p>Priority</p>
                        <CustomSelect value={taskPriority} onChange={setTaskPriority}/>
                    </div>

                    <div className="modal-field">
                        <p>Date</p>
                        <input
                            type="date"
                            className="input-field__modal"
                            value={taskDate}
                            onChange={(e) => setTaskDate(e.target.value)}
                        />
                    </div>

                    <div className="modal-add__container">
                        <button className="modal-add_task" onClick={handleAddTask}>
                            Add Task
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Tarefas */}

            {searchValue === '' ? (
                // Se `searchValue` estiver vazio, exibe todas as tarefas normalmente
                <>
                    <div className="tasks__container">
                        <h2 className="title">Tasks to do {tasksTodo.length}</h2>
                        {tasksTodo.map((task) => (
                            <Task
                                key={task.id}
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

                    {/* Tarefas finalizadas */}
                    {tasksFinished.length > 0 && (
                        <div className="tasks__finished">
                            <h2 className="title">Done - {tasksFinished.length}</h2>
                            {tasksFinished.map((task) => (
                                <Task
                                    key={task.id}
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
                </>
            ) : (
                // Se `searchValue` não estiver vazio, exibe apenas os itens filtrados
                <>
                    <div className="tasks__container">
                        <h2 className="title">Tasks to do {filteredTasksTodo.length}</h2>
                        {filteredTasksTodo.map((task) => (
                            <Task
                                key={task.id}
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

                    {/* Tarefas finalizadas filtradas */}
                    {filteredTasksFinished.length > 0 && (
                        <div className="tasks__finished">
                            <h2 className="title">Done - {filteredTasksFinished.length}</h2>
                            {filteredTasksFinished.map((task) => (
                                <Task
                                    key={task.id}
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
                </>
            )}

        </section>
    );
}
