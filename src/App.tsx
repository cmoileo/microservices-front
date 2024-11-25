import router from "@/router.tsx";
import {RouterProvider} from "react-router-dom";

function App() {
  return (
      <main className={"w-4/5 mx-auto mt-12"}>
          <RouterProvider router={router} />
      </main>
  )
}

export default App
