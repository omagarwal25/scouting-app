import { lazy, Suspense } from "react";
import ScannerDash from "./components/ScannerDash";

function App() {
  const ShowGames = lazy(() => import("./components/ShowGames"));

  return (
    <main className="container">
      <div className="w-screen p-4">
        <ScannerDash />
        <Suspense>
          <ShowGames />
        </Suspense>
      </div>
    </main>
  );
}

export default App;
