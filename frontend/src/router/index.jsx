import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../styles/layouts/RootLayout";

import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import SignUpPage from "../pages/signUp/SignUpPage";
import CertificatePage from "../pages/certificate/CertificatePage";

import SelectPart from "../pages/signUp/SelectPart";
import SelectRole from "../pages/signUp/SelectRole";
import VoteMain from "../pages/vote/VoteMain";
import VoteSection from "../pages/vote/VoteSection";
import VoteComplete from "../pages/vote/VoteComplete";
import AwardSectionPage from "../pages/award/AwardSectionPage";
import Chat from "../pages/chat/Chat";
import VoteGate from "../pages/vote/VoteGate";
import AwardGate from "../pages/award/AwardGate";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "login", element: <Login /> },

      { path: "signUp", element: <SelectPart /> },
      { path: "signUp/role", element: <SelectRole /> },
      { path: "signUp/part", element: <SelectPart /> },
      { path: "signUp/info", element: <SignUpPage /> },
      { path: "chat", element: <Chat /> },

      { path: "vote", element: <VoteGate /> },
      { path: "vote/main", element: <VoteMain /> },
      { path: "vote/:id", element: <VoteSection /> },
      { path: "vote/complete", element: <VoteComplete /> },

      {
        path: "award",
        children: [
          { index: true, element: <AwardGate /> },
          { path: ":id", element: <AwardSectionPage /> },
        ],
      },

      { path: "certificate", element: <CertificatePage /> },
    ],
  },
]);
