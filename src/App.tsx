import { UserListBuiltInPage } from "./Pages/UserListBuiltInPage";
import { UserListToolkitPage } from "./Pages/UserListToolkitPage";
import { UserListZustandPage } from "./Pages/UserListZustandPage";
import { match } from "ts-pattern";
import clsx from "clsx";
import { create } from "zustand";

// Unique global state
type Solution = "built-in" | "toolkit" | "zustand";

type State = {
  solution: Solution;
  selectSolution: (solution: Solution) => void;
};

const useSolutionStore = create<State>((set) => ({
  solution: "built-in",
  selectSolution: (solution) => set({ solution }),
}));

function App() {
  const { solution, selectSolution } = useSolutionStore();

  return (
    <div>
      <ul className="flex flex-row">
        <li>
          <button
            className={clsx("p-4", solution === "built-in" && "underline")}
            onClick={() => selectSolution("built-in")}
          >
            Built In
          </button>
        </li>

        <li>
          <button
            className={clsx("p-4", solution === "toolkit" && "underline")}
            onClick={() => selectSolution("toolkit")}
          >
            Toolkit
          </button>
        </li>

        <li>
          <button
            className={clsx("p-4", solution === "zustand" && "underline")}
            onClick={() => selectSolution("zustand")}
          >
            Zustand
          </button>
        </li>
      </ul>

      <div className="container mt-8">
        {match(solution)
          .with("built-in", () => <UserListBuiltInPage />)
          .with("toolkit", () => <UserListToolkitPage />)
          .with("zustand", () => <UserListZustandPage />)
          .exhaustive()}
      </div>
    </div>
  );
}

export default App;
