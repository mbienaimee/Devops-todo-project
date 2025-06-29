// src/components/TodoList.test.jsx
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, beforeEach, afterEach } from "vitest";
import TodoList from "./TodoList";

// Mocking localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    clear() {
      store = {};
    },
  };
})();

Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("TodoList Component", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  afterEach(() => {
    cleanup();
  });

  it("allows a user to add a new todo", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText("Add a new task...");
    const addButton = screen.getByRole("button", { name: /add/i });

    await user.type(input, "Learn testing");
    await user.click(addButton);

    expect(screen.getByText("Learn testing")).toBeInTheDocument();
    expect(screen.getByText("1 task left")).toBeInTheDocument();
  });

  it("allows a user to toggle a todo as completed", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    const input = screen.getByPlaceholderText("Add a new task...");
    await user.type(input, "Finish the project");
    await user.click(screen.getByRole("button", { name: /add/i }));

    const todoText = screen.getByText("Finish the project");
    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);

    expect(todoText).toHaveClass("line-through");
    expect(screen.getByText("0 tasks left")).toBeInTheDocument();
  });

  it("allows a user to delete a todo", async () => {
    const user = userEvent.setup();
    render(<TodoList />);

    await user.type(
      screen.getByPlaceholderText("Add a new task..."),
      "Task to be deleted"
    );
    await user.click(screen.getByRole("button", { name: /add/i }));

    expect(screen.getByText("Task to be deleted")).toBeInTheDocument();

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    await user.click(deleteButton);

    expect(screen.queryByText("Task to be deleted")).not.toBeInTheDocument();
  });
});
