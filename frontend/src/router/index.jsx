import { Navigate, createBrowserRouter } from "react-router-dom";
import RootLayout from "../styles/layouts/RootLayout";

import Login from "../pages/login/Login";
import Home from "../pages/home/Home";

import SelectPart from "../pages/signUp/SelectPart";
import SelectRole from "../pages/signUp/SelectRole";
import SignUpPage from "../pages/signUp/SignUpPage";

import Chat from "../pages/chat/Chat";

import AwardSectionPage from "../pages/award/AwardSectionPage";
import { AWARD_CATEGORIES } from "../pages/award/awardCategories";

import CertificatePage from "../pages/certificate/CertificatePage";
import RouteErrorPage from "../pages/common/RouteErrorPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "oauth/kakao/callback", element: <Login /> },

      { path: "signUp", element: <SelectPart /> },
      { path: "signUp/role", element: <SelectRole /> },
      { path: "signUp/info", element: <SignUpPage /> },

      { path: "chat", element: <Chat /> },

      { path: "vote", element: <Navigate to="/award" replace /> },
      { path: "vote/*", element: <Navigate to="/award" replace /> },

      {
        path: "award",
        children: [
          { index: true, element: <Navigate to={`/award/${AWARD_CATEGORIES[0]}`} replace /> },
          { path: ":id", element: <AwardSectionPage /> },
        ],
      },

      { path: "certificate", element: <CertificatePage /> },
      { path: "*", element: <Navigate to="/" replace /> },
    ],
  },
]);
