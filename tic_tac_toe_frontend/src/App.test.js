import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

function clickCell(cellNumber1to9) {
  fireEvent.click(screen.getByRole("button", { name: new RegExp(`Cell ${cellNumber1to9}\\b`, "i") }));
}

test("renders game title and initial turn", () => {
  render(<App />);
  expect(screen.getByText(/tic tac toe/i)).toBeInTheDocument();
  expect(screen.getByRole("status")).toHaveTextContent(/turn:\s*x/i);
});

test("players alternate turns and marks appear", () => {
  render(<App />);

  clickCell(1);
  expect(screen.getByRole("status")).toHaveTextContent(/turn:\s*o/i);
  expect(screen.getByRole("button", { name: /cell 1/i })).toHaveTextContent("X");

  clickCell(2);
  expect(screen.getByRole("status")).toHaveTextContent(/turn:\s*x/i);
  expect(screen.getByRole("button", { name: /cell 2/i })).toHaveTextContent("O");
});

test("detects a winner and announces it", () => {
  render(<App />);

  // X wins across top row: 1,2,3
  clickCell(1); // X
  clickCell(4); // O
  clickCell(2); // X
  clickCell(5); // O
  clickCell(3); // X -> win

  expect(screen.getByRole("status")).toHaveTextContent(/winner:\s*x/i);
});

test("detects a draw", () => {
  render(<App />);

  // Draw sequence (no 3-in-a-row):
  // X:1 O:2 X:3 O:5 X:4 O:6 X:8 O:7 X:9
  clickCell(1);
  clickCell(2);
  clickCell(3);
  clickCell(5);
  clickCell(4);
  clickCell(6);
  clickCell(8);
  clickCell(7);
  clickCell(9);

  expect(screen.getByRole("status")).toHaveTextContent(/draw/i);
});

test("restart clears the board and resets turn", () => {
  render(<App />);

  clickCell(1);
  expect(screen.getByRole("button", { name: /cell 1/i })).toHaveTextContent("X");

  fireEvent.click(screen.getByRole("button", { name: /restart/i }));

  expect(screen.getByRole("status")).toHaveTextContent(/turn:\s*x/i);
  expect(screen.getByRole("button", { name: /cell 1/i })).toHaveTextContent("");
});
