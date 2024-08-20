import React, { useEffect, useState } from "react";

interface TODO {
  id: number;
  value: string | null;
  completed: boolean;
}

export default function Todo2() {
  // State to save the input Value
  const [inputValue, setInputValue] = useState("");

  //   STATES FOR EDIT TODO ....
  const [editTodoId, setEditTodoId] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>("");

  // State to save All The todos in an array
  const [allTodos, setAllTodos] = useState<TODO[]>([]);

  // ADD FUNCTION TO ADD THE TODO TO THE ALLTODOS ARRAY
  const handleAddTodo = () => {
    if (inputValue.trim() !== "") {
      setAllTodos((prevTodo) => [
        ...prevTodo,
        { id: Date.now(), value: inputValue, completed: false },
      ]);
      setInputValue("");
    }
  };

  //   TOGGLE FUNCTION FOR THE TOGGLE CHECKBOX WHEN THE TASK IS COMPLELTED
  const handleToggle = (id: number) => {
    setAllTodos((prevTodo: TODO[]) =>
      prevTodo.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  //   DELETE A TODO
  const handleDeleteTodo = (id: number) => {
    setAllTodos((prevTodo: TODO[]) =>
      prevTodo.filter((todo) => todo.id !== id)
    );
  };

  //  PASSING THE EXACT TODO ID AND VALUE TO THE FUNCTION
  const handleEdit = (id: number, currentValue: string) => {
    setEditTodoId(id);
    setEditValue(currentValue);
  };

  const saveEditValue = (value: string, id: number) => {
    if (value !== "") {
      setAllTodos((prevTodo) =>
        prevTodo.map((todo) =>
          todo.id === id ? { ...todo, value: value } : todo
        )
      );
    }
    setEditTodoId(null);
    setEditValue("");
  };

  useEffect(() => {
    const key = localStorage.getItem("todos");
    if (key) {
      const getAllTodos = JSON.parse(key);
      if (getAllTodos?.length) {
        setAllTodos(getAllTodos);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(allTodos));
  }, [allTodos]);

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold py-10">Todo App</h1>
      <div className="w-full flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          className="w-full h-14 p-2 rounded-lg bg-transparent border active:ring-0"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          }
        />
        <button
          className="bg-blue-400 px-10 h-14 rounded-lg"
          onClick={handleAddTodo}
        >
          Add
        </button>
      </div>
      <ul className="w-full">
        {allTodos.length > 0 &&
          allTodos.map((todo) => (
            <li
              key={todo.id}
              className={`flex items-center justify-between w-full bg-white my-4 rounded-lg p-2 text-black ${
                todo.completed && "bg-gray-700 text-gray-300 border"
              }`}
            >
              {editTodoId === todo.id ? (
                <input
                  type="text"
                  value={editValue}
                  className="w-[88%] p-2 rounded-lg outline-none border-b"
                  onChange={(e) => setEditValue(e.target.value)}
                />
              ) : (
                <div className={`${todo.completed && "line-through"}`}>
                  {todo.value}
                </div>
              )}
              <div>
                {editTodoId === todo.id ? (
                  <button
                    onClick={() => saveEditValue(editValue, todo.id)}
                    className="w-10 h-10 rounded-full bg-blue-400 text-black border border-gray-300"
                  >
                    S
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(todo.id, todo.value)}
                    className="w-10 h-10 rounded-full bg-gray-100 text-black border border-gray-300"
                  >
                    E
                  </button>
                )}
                <button
                  className="w-10 h-10 rounded-full bg-red-500"
                  onClick={() => handleDeleteTodo(todo.id)}
                >
                  D
                </button>
                <button className="w-10 h-10 rounded-full bg-blue-400">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => handleToggle(todo.id)}
                  />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
