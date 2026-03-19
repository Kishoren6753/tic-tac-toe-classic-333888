import React, { useMemo, useState } from "react";
import "./App.css";

const PLAYERS = /** @type {const} */ (["X", "O"]);

function calculateWinner(squares) {
  /**
   * Returns winner symbol and winning line indices when a winner exists.
   * @param {(null|"X"|"O")[]} squares
   * @returns {{ winner: null|"X"|"O", line: number[] | null }}
   */
  const lines = [
    // rows
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    // cols
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    // diagonals
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }

  return { winner: null, line: null };
}

function isBoardFull(squares) {
  /**
   * @param {(null|"X"|"O")[]} squares
   * @returns {boolean}
   */
  return squares.every((s) => s !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** Main entrypoint for the Tic Tac Toe game UI.
   *
   * Renders a centered modern game layout with:
   * - 3×3 board
   * - turn indicator
   * - win/draw detection with winner announcement
   * - winning-line highlight
   * - restart button
   *
   * No backend/API calls are used (frontend-only).
   */
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const gameState = useMemo(() => {
    const { winner, line } = calculateWinner(squares);
    const draw = !winner && isBoardFull(squares);
    const nextPlayer = xIsNext ? PLAYERS[0] : PLAYERS[1];
    return { winner, line, draw, nextPlayer };
  }, [squares, xIsNext]);

  // PUBLIC_INTERFACE
  const handleSquareClick = (index) => {
    /** Handle a click on a board cell. */
    // Don't allow overwriting moves or playing after game end.
    if (squares[index] || gameState.winner || gameState.draw) return;

    setSquares((prev) => {
      const next = [...prev];
      next[index] = xIsNext ? "X" : "O";
      return next;
    });
    setXIsNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const restartGame = () => {
    /** Resets the board and returns turn to X. */
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  };

  const statusText = (() => {
    if (gameState.winner) return `Winner: ${gameState.winner}`;
    if (gameState.draw) return "It's a draw";
    return `Turn: ${gameState.nextPlayer}`;
  })();

  return (
    <div className="ttt-app">
      <main className="ttt-shell" aria-label="Tic Tac Toe">
        <header className="ttt-header">
          <div className="ttt-titleblock">
            <h1 className="ttt-title">Tic Tac Toe</h1>
            <p className="ttt-subtitle">Two players, one device.</p>
          </div>

          <div
            className={[
              "ttt-status",
              gameState.winner ? "is-winner" : "",
              gameState.draw ? "is-draw" : "",
            ].join(" ")}
            role="status"
            aria-live="polite"
          >
            <span className="ttt-statusDot" aria-hidden="true" />
            <span className="ttt-statusText">{statusText}</span>
          </div>
        </header>

        <section className="ttt-boardWrap" aria-label="Game board">
          <div className="ttt-board" role="grid" aria-label="3 by 3 board">
            {squares.map((value, idx) => {
              const isWinningCell = gameState.line?.includes(idx) ?? false;
              const isFilled = Boolean(value);
              return (
                <button
                  key={idx}
                  type="button"
                  className={[
                    "ttt-cell",
                    isWinningCell ? "is-winning" : "",
                    isFilled ? "is-filled" : "",
                    value === "X" ? "is-x" : "",
                    value === "O" ? "is-o" : "",
                  ].join(" ")}
                  onClick={() => handleSquareClick(idx)}
                  role="gridcell"
                  aria-label={`Cell ${idx + 1}${value ? `: ${value}` : ""}`}
                  disabled={Boolean(value) || Boolean(gameState.winner) || gameState.draw}
                >
                  <span className="ttt-cellValue" aria-hidden="true">
                    {value}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <footer className="ttt-footer">
          <button type="button" className="ttt-btn" onClick={restartGame}>
            Restart
          </button>

          <p className="ttt-hint">
            Tip:{" "}
            <span className="ttt-hintEm">
              {gameState.winner || gameState.draw
                ? "Restart to play again."
                : "First to get 3 in a row wins."}
            </span>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
