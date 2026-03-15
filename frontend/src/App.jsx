import { RouterProvider } from "react-router-dom";
import GlobalStyles from "./styles/common/GlobalStyles";
import { router } from "./router";

export default function App() {
  return (
    <>
      <GlobalStyles />
      <RouterProvider router={router} />
    </>
  );
}
