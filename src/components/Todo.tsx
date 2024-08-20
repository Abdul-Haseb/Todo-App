import { useEffect, useState } from "react";

interface TODO {
  id: number;
  value: string;
  completed: boolean;
}

export default function Todo() {
  const [inputValue, setInputValue] = useState("");
  const [addInputValueToArray, setAddInputValueToArray] = useState<TODO[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleAdd = () => {
    if (inputValue.trim()) {
      setAddInputValueToArray([
        ...addInputValueToArray,
        { id: Date.now(), value: inputValue, completed: false },
      ]);
    }
    setInputValue("");
  };

  const handleToggle = (id: number) => {
    const newArr = addInputValueToArray.map((item) =>
      id === item.id ? { ...item, completed: !item.completed } : item
    );
    setAddInputValueToArray(newArr);
  };

  const handleDelete = (id: number) => {
    const newArray = addInputValueToArray.filter((todo) => id !== todo.id);
    setAddInputValueToArray(newArray);
  };

  // Save todos to localStorage whenever addInputValueToArray changes
  useEffect(() => {
    console.log("Saving todos to localStorage:", addInputValueToArray);
    localStorage.setItem("todos", JSON.stringify(addInputValueToArray));
  }, [addInputValueToArray]);

  // Load todos from localStorage when the component mounts
  useEffect(() => {
    const allTodos = localStorage.getItem("todos");
    console.log("Loading todos from localStorage:", allTodos);
    if (allTodos) {
      setAddInputValueToArray(JSON.parse(allTodos));
      console.log("State after loading:", JSON.parse(allTodos));
    }
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold py-10">Todo App</h1>
      <div className="w-full flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          className="w-full h-14 p-2 rounded-lg bg-transparent border active:ring-0"
          onChange={handleInputChange}
        />
        <button
          className="bg-blue-400 px-10 h-14 rounded-lg"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>
      <div className="w-full">
        <ul>
          {addInputValueToArray.length > 0 &&
            addInputValueToArray.map((inputValu) => (
              <li
                className={`w-full h-12 bg-white text-black rounded-lg text-xl font-semibold flex justify-between items-center my-3 p-3 ${
                  inputValu.completed && "bg-gray-400"
                } `}
                key={inputValu.id}
              >
                <div
                  className={`${inputValu.completed ? "text-gray-500" : ""}`}
                >
                  {inputValu.value}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDelete(inputValu.id)}
                    className="px-3 py-1 rounded-lg bg-red-400 text-white"
                  >
                    D
                  </button>
                  <div className="h-10 w-10 rounded-full bg-blue-300 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={inputValu.completed}
                      onChange={() => handleToggle(inputValu.id)}
                    />
                  </div>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
