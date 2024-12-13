import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDelete, MdEdit } from "react-icons/md";
import { FaPlus } from "react-icons/fa";

const Todos = () => {
  const [tasks, setTask] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    fetchTask();
  }, []);

  const fetchTask = async () => {
    try {
      const response = await axios.get(process.env.REACT_APP_API_URL + 'todos/');
      setTask(response.data);
    } catch (error) {
      console.log('error:', error);
    }
  };

  const addTask = async () => {
    try {
      setLoading(true);
      setError(null);
      if (inputValue.trim() !== '') {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}todos/add`, {
          title: inputValue,
          completed: false,
        });
        setTask([...tasks, response.data]);
        setInputValue('');
      }
    } catch (error) {
      setError("An error occurred while adding the task.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompleted = async (taskId) => {
    try {
      const taskUpdate = tasks.find((task) => task.id === taskId);
      if (taskUpdate) {
        const response = await axios.put( process.env.REACT_APP_API_URL + `${taskId}/update`, {
          completed: !taskUpdate.completed,
        });
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? { ...task, completed: response.data.completed } : task
        );
        setTask(updatedTasks);
      }
    } catch (error) {
      setError("An error occurred while updating the task.");
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete( process.env.REACT_APP_API_URL + `${taskId}/delete`);
      setTask(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      setError("An error occurred while deleting the task.");
      console.error("Error:", error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask();
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="h-100 text-center justify-center p-36">
        <h1 className="pb-4">App Todo 5</h1>
        {loading && <p>loading...</p>}
        {error && <p className="text-red-500">{error}</p>}
        <input
          type="text"
          className="bg-slate-200 rounded-lg py-1 px-5 border-b-4 placeholder:p-3 w-1/2"
          placeholder="Add a task"
          value={inputValue}
          onChange={handleChange}
        />
        <button
          type="submit"
          className="bg-emerald-500 ml-4  text-white py-1 h-10 w-10 rounded-full"
        >
          < FaPlus  className=' flex items-center justify-center m-auto'/>
        </button>

        <ul className="list-none p-0 bg-slate-400 rounded-md w-1/1 py-3 mt-2 items-center">
          {tasks?.map((task) => (
            <li
              key={task.id}
              onClick={() => toggleCompleted(task.id)}
              className={`flex justify-between items-center py-2 px-4 ${task.completed ? 'line-through text-gray-500' : ''}`}
            >
              <span>{task.title}</span>
              <div className="flex space-x-4">
                <MdEdit
                  className="cursor-pointer text-blue-500"
                  onClick={() => alert(`Modifier la tâche: ${task.id}`)}
                />
                <MdDelete
                  className="cursor-pointer text-red-500"
                  onClick={() => deleteTask(task.id)}
                />
              </div>
            </li>
          ))}
          {tasks.length === 0 && <p className="py-4 text-red-500">Aucune tâche trouvée.</p>}
        </ul>
      </form>
    </>
  );
};

export default Todos;

