import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../styles/layouts/RootLayout";

import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import SignUpPage from "../pages/signUp/SignUpPage";
import Vote from "../pages/vote/Vote";
import CertificatePage from "../pages/certificate/CertificatePage";

import SelectPart from "../pages/signUp/SelectPart";
import SelectRole from "../pages/signUp/SelectRole";
import VoteMain from "../pages/vote/VoteMain";
import VoteSection from "../pages/vote/VoteSection";
import VoteComplete from "../pages/vote/VoteComplete";
import AwardSectionPage from "../pages/award/AwardSectionPage";
import RedirectToFirstAward from "../pages/award/RedirectToFirstAward";

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

      { path: "vote", element: <Vote /> },
      { path: "vote/main", element: <VoteMain /> },
      { path: "vote/:id", element: <VoteSection /> },
      { path: "vote/complete", element: <VoteComplete /> },
      { path: "/signUp/info", element: <SignUpPage /> },

      {
        path: "award",
        children: [
          { index: true, element: <RedirectToFirstAward /> },

          { path: ":id", element: <AwardSectionPage /> },
        ],
      },

      { path: "certificate", element: <CertificatePage /> },
    ],
  },
]);
