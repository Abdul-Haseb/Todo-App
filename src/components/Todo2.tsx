import React, { useEffect, useState } from "react";

// Define the shape of a TODO item using a TypeScript interface
interface TODO {
  id: number; // A unique identifier for the todo item
  value: string | null; // The text value of the todo item (nullable)
  completed: boolean; // A flag to indicate whether the todo item is completed
}

export default function Todo2() {
  // State to store the current input value for the todo input field
  const [inputValue, setInputValue] = useState("");

  // State to manage the ID of the todo that is currently being edited
  const [editTodoId, setEditTodoId] = useState<number | null>(null);

  // State to manage the new value of a todo that is being edited
  const [editValue, setEditValue] = useState<string>("");

  // State to store all todos, initialized as an empty array
  const [allTodos, setAllTodos] = useState<TODO[]>([]);

  // State to manage the current filter option ("all", "completed", "uncompleted")
  const [filter, setFilter] = useState("all");

  // State to store the search query input by the user
  const [searched, setSearched] = useState("");

  // State to manage the visibility of the filter dropdown menu
  const [showDropDown, setShowDropDown] = useState(false);

  // Function to add a new todo item to the list
  const handleAddTodo = () => {
    // Check if the input field is not empty
    if (inputValue.trim() !== "") {
      // Add the new todo item to the allTodos array
      setAllTodos((prevTodo) => [
        ...prevTodo,
        { id: Date.now(), value: inputValue, completed: false },
      ]);
      // Clear the input field after adding the todo
      setInputValue("");
    }
  };

  // Function to handle adding a todo when the "Enter" key is pressed
  const handleAddTodoOnEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Check if the pressed key is "Enter"
    if (e.key === "Enter") {
      // Call the function to add the todo item
      handleAddTodo();
    }
  };

  // Function to toggle the completed status of a todo item
  const handleToggle = (id: number) => {
    // Update the completed status of the specific todo by its ID
    setAllTodos((prevTodo) =>
      prevTodo.map((todo) =>
        // Toggle the completed status if the ID matches
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // Function to delete a todo item from the list
  const handleDeleteTodo = (id: number) => {
    // Remove the todo item with the specified ID from the allTodos array
    setAllTodos((prevTodo: TODO[]) =>
      prevTodo.filter((todo) => todo.id !== id)
    );
  };

  // Function to start editing a specific todo item
  const handleEdit = (id: number, currentValue: string) => {
    // Set the ID of the todo being edited
    setEditTodoId(id);
    // Set the current value of the todo to be edited
    setEditValue(currentValue);
  };

  // Function to save the edited value of a todo item
  const saveEditValue = (value: string, id: number) => {
    // Check if the new value is not empty
    if (value !== "") {
      // Update the value of the todo item with the specified ID
      setAllTodos((prevTodo) =>
        prevTodo.map((todo) =>
          todo.id === id ? { ...todo, value: value } : todo
        )
      );
    }
    // Clear the editing state after saving the new value
    setEditTodoId(null);
    setEditValue("");
  };

  // Function to filter and search todos based on the current filter and search query
  const filteredTodos = allTodos.filter((todo) => {
    // Determine if the todo matches the selected filter
    const matchesFilter =
      filter === "completed"
        ? todo.completed // Match completed todos if filter is "completed"
        : filter === "uncompleted"
        ? !todo.completed // Match uncompleted todos if filter is "uncompleted"
        : true; // Match all todos if filter is "all"

    // Determine if the todo matches the search query (case-insensitive)
    const matchesSearch = todo.value
      ?.toLowerCase()
      .includes(searched.toLowerCase());

    // Return true if the todo matches both the filter and search query
    return matchesFilter && matchesSearch;
  });

  // Function to trigger the search when the search button is clicked
  const handleSearch = () => {
    // Trim the search query to remove any leading or trailing spaces
    setSearched(searched.trim());
  };

  // Effect to load todos from localStorage when the component mounts
  useEffect(() => {
    // Get the todos stored in localStorage under the key "todos"
    const key = localStorage.getItem("todos");
    if (key) {
      // Parse the stored JSON string into an array of todos
      const getAllTodos = JSON.parse(key);
      // If the parsed array is valid and not empty, set it as the current todos
      if (getAllTodos?.length) {
        setAllTodos(getAllTodos);
      }
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // Effect to save the current todos to localStorage whenever they change
  useEffect(() => {
    // Convert the allTodos array to a JSON string and store it in localStorage
    localStorage.setItem("todos", JSON.stringify(allTodos));
  }, [allTodos]); // Dependency on allTodos means this effect runs every time allTodos changes

  return (
    <div className="max-w-6xl mx-auto flex flex-col items-center justify-center">
      {/* Header section with the title and search/filter controls */}
      <div className="flex justify-between items-center w-full">
        <h1 className="text-4xl font-bold py-6">Todo App</h1>

        {/* Search input and button */}
        <div className="flex items-center gap-1">
          <input
            type="text"
            value={searched}
            className="bg-transparent border p-2 h-10 rounded-lg"
            onChange={(e) => setSearched(e.target.value)} // Update search query as user types
          />
          <button
            onClick={handleSearch} // Trigger search when button is clicked
            className="w-10 h-10 rounded-full bg-red-500"
          >
            S
          </button>
        </div>

        {/* Filter dropdown button and menu */}
        <div className="relative">
          <button
            onClick={() => setShowDropDown((prev) => !prev)} // Toggle dropdown visibility
            className="bg-green-400 w-14 h-14 rounded-full"
          >
            Filter
          </button>
          {showDropDown && (
            <div className="absolute top-0 right-16 flex items-center justify-center gap-4 bg-green-400 p-2 rounded-lg">
              <button
                onClick={() => setFilter("completed")} // Set filter to "completed"
                className="bg-blue-400 px-4 py-2 rounded-lg"
              >
                Completed
              </button>
              <button
                onClick={() => setFilter("uncompleted")} // Set filter to "uncompleted"
                className="bg-blue-400 px-4 py-2 rounded-lg"
              >
                Uncompleted
              </button>
              <button
                onClick={() => setFilter("all")} // Set filter to "all"
                className="bg-blue-400 px-4 py-2 rounded-lg"
              >
                All
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Input field and button to add new todos */}
      <div className="w-full flex items-center gap-2">
        <input
          type="text"
          value={inputValue}
          className="w-full h-14 p-2 rounded-lg bg-transparent border active:ring-0"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInputValue(e.target.value)
          } // Update input value as user types
          onKeyDown={handleAddTodoOnEnter} // Add todo when Enter key is pressed
        />
        <button
          className="bg-blue-400 px-10 h-14 rounded-lg"
          onClick={handleAddTodo} // Add todo when button is clicked
        >
          Add
        </button>
      </div>

      {/* List of filtered and searched todos */}
      <ul className="w-full h-[80vh] overflow-y-scroll">
        {filteredTodos.length > 0 &&
          filteredTodos.map((todo) => (
            <li
              key={todo.id} // Unique key for each todo item
              className={`flex items-center justify-between w-full ${
                todo.completed
                  ? "bg-gray-600 text-gray-100" // Style for completed todos
                  : "bg-white text-black" // Style for uncompleted todos
              } my-4  rounded-lg p-2 text-black `}
            >
              {/* Render input field if editing this todo, otherwise render the text */}
              {editTodoId === todo.id ? (
                <input
                  type="text"
                  value={editValue} // Display the current edit value
                  className="w-[88%] p-2 rounded-lg outline-none border-b"
                  onChange={(e) => setEditValue(e.target.value)} // Update edit value as user types
                />
              ) : (
                <div className={`${todo.completed && "line-through"}`}>
                  {todo.value} {/* Display the todo text */}
                </div>
              )}

              {/* Buttons for edit, delete, and toggle completion */}
              <div>
                {editTodoId === todo.id ? (
                  <button
                    onClick={() => saveEditValue(editValue, todo.id)} // Save edited value
                    className="w-10 h-10 rounded-full bg-blue-400 text-black border border-gray-300"
                  >
                    S
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(todo.id, todo.value!)} // Start editing
                    className="w-10 h-10 rounded-full bg-gray-100 text-black border border-gray-300"
                  >
                    E
                  </button>
                )}
                <button
                  className="w-10 h-10 rounded-full bg-red-500"
                  onClick={() => handleDeleteTodo(todo.id)} // Delete the todo
                >
                  D
                </button>
                <button className="w-10 h-10 rounded-full bg-blue-400">
                  <input
                    type="checkbox"
                    checked={todo.completed} // Checkbox reflects completed status
                    onChange={() => handleToggle(todo.id)} // Toggle completion status
                  />
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
