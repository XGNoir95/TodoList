import React, { useState, useEffect } from 'react';

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
        saveLocalTodos();
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
        setTodos([...todos, { text: inputText, completed: false, id: Math.random() * 1000 }]);
        setInputText("");
    };

    const deleteHandler = (todo) => {
        setTodos(todos.filter((el) => el.id !== todo.id));
    };

    const completeHandler = (todo) => {
        setTodos(todos.map((item) => {
            if (item.id === todo.id) {
                return {
                    ...item, completed: !item.completed
                };
            }
            return item;
        }));
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
                    {filteredTodos.map(todo => (
                        <div className={`todo ${todo.completed ? "completed" : ""}`} key={todo.id}>
                            <li className="todo-item">{todo.text}</li>
                            <button className="complete-btn" onClick={() => completeHandler(todo)}>
                                <i className="fas fa-check-circle"></i>
                            </button>
                            <button className="trash-btn" onClick={() => deleteHandler(todo)}>
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default App;
