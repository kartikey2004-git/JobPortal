import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from "@/features/theme/ThemeProvider";
import { router } from "./routes";

const App = () => (
  <ThemeProvider>
    <RouterProvider router={router} />
  </ThemeProvider>
);

export default App;
