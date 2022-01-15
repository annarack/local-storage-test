import "./App.css";
import useLocalStorage from "react-use-localstorage";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

function ToDo({ todo, deleteTodo }) {
  return (
    <li>
      <div className="Todo">
        {todo.text}
        <button onClick={() => deleteTodo(todo.id)}>delete</button>
      </div>
    </li>
  );
}

function App() {
  const [localtodos, setLocalTodos] = useLocalStorage("todos", " ");

  const [todos, setTodos] = useState([]);
  const [currentToDo, setCurrentToDo] = useState("");

  // on app start load data as string from local storage
  // parse it to JSON and save it into the component state
  useEffect(() => {
    const savedTodos = JSON.parse(localtodos);
    if (savedTodos) {
      setTodos(savedTodos);
    }
  }, []);

  // each time the internal todos state updates also save it to local storage
  useEffect(() => {
    const json = JSON.stringify(todos);
    setLocalTodos(json);
  }, [todos]);

  // add a new todo to the todos state with an unique id
  const addTodo = (e) => {
    // preventDefault() prevents a whole page rerender
    e.preventDefault();
    const newTodo = {
      id: uuidv4(),
      text: currentToDo,
    };
    setTodos([...todos, newTodo]);
    //reset the currentToDo to empty the textfield
    setCurrentToDo("");
  };

  const deleteTodo = (idToDelete) => {
    const filteredTodos = todos.filter((todo) => todo.id !== idToDelete);
    setTodos(filteredTodos);
  };

  // in comparison to normal html input fields, you manually have to keep the state of it
  // if the input inside the textfield changes save it into the temporary currentToDo state
  return (
    <div className="App">
      <h2>My Todos</h2>
      <ul>
        {todos.map((todo) => (
          <ToDo todo={todo} key={todo.id} deleteTodo={deleteTodo} />
        ))}
      </ul>
      <form className="NewTodo" onSubmit={addTodo}>
        <input
          type="text"
          placeholder="Enter your todo"
          value={currentToDo}
          onChange={(e) => setCurrentToDo(e.target.value)}
        />
        <button type="submit">Add todo</button>
      </form>
    </div>
  );
}

export default App;
