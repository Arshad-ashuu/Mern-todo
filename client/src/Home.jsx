import { HiOutlinePencilSquare } from "react-icons/hi2";
import { MdDeleteOutline } from "react-icons/md";
import axios from "axios";
import { useEffect, useState } from "react";
import { FaRegCircle } from "react-icons/fa";
import { BsFillCheckCircleFill } from "react-icons/bs";


export default function Home() {
    const [todos, setTodos] = useState([]);
    const [task, setTask] = useState("");
    const [todoCount, setTodoCount] = useState(0);
    const [editingTodoId, setEditingTodoId] = useState(null);
    const [editedTask, setEditedTask] = useState("");

    useEffect(() => {
        fetchTodos();
    }, [todoCount]);

    const fetchTodos = () => {
        axios.get("http://localhost:3000/get")
            .then((res) => {
                console.log(res.data);
                setTodos(res.data);
            }).catch((err) => console.log(err))
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:3000/add", { task });
            setTask("");
            setTodoCount(prevCount => prevCount + 1);
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    const handleCheck = async (id) => {
        try {
            await axios.put("http://localhost:3000/check/" + id);
            setTodoCount(prevCount => prevCount + 1);
        } catch (error) {
            console.error("Error toggling task:", error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete("http://localhost:3000/delete/" + id);
            setTodoCount(prevCount => prevCount + 1);
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    const handleUpdate = async (id) => {
        try {
            await axios.put("http://localhost:3000/update/" + id, { task: editedTask });
            setEditingTodoId(null);
            setEditedTask("");
            setTodoCount(prevCount => prevCount + 1);
        } catch (error) {
            console.error("Error updating task:", error);
        }
    }

    // Sort todos based on their done status (checked todos move down)
    const sortedTodos = [...todos].sort((a, b) => a.done - b.done);

    return (
        <>
            <div className="flex justify-center items-center flex-col">
                <h1 className="text-3xl font-bold mt-12">TODO List</h1>
                <form>
                    <input className="w-[300px] p-3 border-b-2 border-solid outline-none"
                        type="text" name="todo" placeholder="Enter todo" value={task} onChange={(e) => setTask(e.target.value)} />
                    <button type="submit" onClick={handleSubmit} className="bg-black p-2 w-[84px] ml-3 mb-4 hover:bg-gray-800 rounded-md text-white font-semibold cursor-pointer">Add</button>
                    {
                        sortedTodos.length > 0 ?
                            sortedTodos.map((todo, i) => (
                                <div key={i} className="bg-[#191414] rounded-[10px] font-semibold text-[#d2d2d2] mb-2 p-3 ">
                                    <div className="flex flex-row justify-between">
                                        <div className="flex flex-row gap-2" onClick={() => handleCheck(todo._id)}>
                                            {todo.done ? <BsFillCheckCircleFill /> : <FaRegCircle />}
                                            {editingTodoId === todo._id ? (
                                                <input type="text" value={editedTask} onChange={(e) => setEditedTask(e.target.value)} />
                                            ) : (
                                                <p className="-mt-1">{todo.task}</p>
                                            )}
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            {editingTodoId === todo._id ? (
                                                <button type="button" onClick={() => handleUpdate(todo._id)}>Save</button>
                                            ) : (
                                                <button type="button" onClick={() => { setEditingTodoId(todo._id); setEditedTask(todo.task); }}><HiOutlinePencilSquare /></button>
                                            )}
                                            <button type="button" onClick={() => handleDelete(todo._id)}><MdDeleteOutline size={20} /></button>
                                        </div>
                                    </div>
                                </div>
                            )) :
                            <h1 className="mt-8 text-md text-gray-600 font-bold">No todos</h1>
                    }
                </form>
            </div>
        </>
    );
}
