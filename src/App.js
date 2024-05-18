import React, { useState, useEffect } from 'react';
import './styles.css'; // Import the CSS file

function App() {
    const [inputText, setInputText] = useState("");
    const [todos, setTodos] = useState([]);
    const [status, setStatus] = useState("all");
    const [filteredTodos, setFilteredTodos] = useState([]);

    useEffect(() => {
        getLocalTodos();
    }, []);

    useEffect(() => {
        filterHandler();
        saveLocalTodos(); // Saving todos to local storage when todos or status change
    }, [todos, status]);

    const filterHandler = () => {
        switch (status) {
            case 'completed':
                setFilteredTodos(todos.filter(todo => todo.completed === true));
                break;
            case 'incomplete':
                setFilteredTodos(todos.filter(todo => todo.completed === false));
                break;
            default:
                setFilteredTodos(todos);
                break;
        }
    };

    const saveLocalTodos = () => {
        localStorage.setItem("todos", JSON.stringify(todos));
    };

    const getLocalTodos = () => {
        if (localStorage.getItem("todos") === null) {
            localStorage.setItem("todos", JSON.stringify([]));
        } else {
            let todoLocal = JSON.parse(localStorage.getItem("todos"));
            setTodos(todoLocal);
        }
    };

    const addTodoHandler = (e) => {
        e.preventDefault();
        if (inputText.trim() !== "") {
            setTodos([...todos, { text: inputText, completed: false, id: Math.random() * 1000, editMode: false }]);
            setInputText("");
        } else {
            // Show error response, for example:
            alert("Please enter a non-empty task!");
        }
    };

    const deleteHandler = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    const completeHandler = (id) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    const editHandler = (id) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, editMode: !todo.editMode } : todo
            )
        );
    };

    const handleEditChange = (e, id) => {
        setTodos(
            todos.map(todo =>
                todo.id === id ? { ...todo, text: e.target.value } : todo
            )
        );
    };

    const clearAllHandler = () => {
        setTodos([]);
    };

    const handleDragStart = (e, index) => {
        e.dataTransfer.setData("text/plain", index);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e, currentIndex) => {
        e.preventDefault();
        const draggedIndex = e.dataTransfer.getData("text/plain");
        const draggedTodo = todos[draggedIndex];
        
        // Reorder todos
        const newTodos = [...todos];
        newTodos.splice(draggedIndex, 1);
        newTodos.splice(currentIndex, 0, draggedTodo);
        
        setTodos(newTodos);
    };

    return (
        <div>
            <header>
                <h1>My To Do List</h1>
            </header>
            <form>
                <input type="text" value={inputText} onChange={(e) => setInputText(e.target.value)} className="todo-input" />
                <button className="todo-button" onClick={addTodoHandler} type="submit">
                    <i className="fas fa-plus-circle fa-lg"></i>
                </button>
                <div className="select">
                    <select name="todos" className="filter-todo" onChange={(e) => setStatus(e.target.value)}>
                        <option value="all">All</option>
                        <option value="completed">Completed</option>
                        <option value="incomplete">Incomplete</option>
                    </select>
                </div>
            </form>
            <div className="todo-container">
                <ul className="todo-list">
                    {filteredTodos.map((todo, index) => (
                        <div
                            className={`todo ${todo.completed ? "completed" : ""}`}
                            key={todo.id}
                            draggable="true"
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={(e) => handleDragOver(e)}
                            onDrop={(e) => handleDrop(e, index)}
                        >
                            {todo.editMode ? (
                                <input
                                    type="text"
                                    value={todo.text}
                                    onChange={(e) => handleEditChange(e, todo.id)}
                                    className="todo-edit-input"
                                />
                            ) : (
                                <li className="todo-item">{todo.text}</li>
                            )}
                            <button className="complete-btn" onClick={() => completeHandler(todo.id)}>
                                <i className="fas fa-check-circle"></i>
                            </button>
                            <button className="edit-btn" onClick={() => editHandler(todo.id)}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="trash-btn" onClick={() => deleteHandler(todo.id)}>
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    ))}
                </ul>
            </div>
            <div className="button-container">
                <button className="clear-all-btn" onClick={clearAllHandler}>Clear All Tasks</button>
            </div>
        </div>
    );
}

export default App;
