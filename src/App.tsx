import router from "@/router.tsx";
import {RouterProvider} from "react-router-dom";
import {Toaster} from "@/components/ui/toaster.tsx";

function App() {
  return (
      <main className={"w-4/5 mx-auto mt-12"}>
          <RouterProvider router={router} />
          <Toaster />
      </main>
  )
}

export default App
