import { Route, Routes } from "react-router-dom";
import { ROUTERS } from "./utils/router";
import MasterLayout from "./pages/users/theme/masterLayout";
import HomePage from "./pages/users/homePage";
import ProfilePage from "./pages/users/profilePage";
import SearchPage from "./pages/users/searchPage";
import LoginPage from "./pages/users/loginPage";
import BookingPage from "./pages/users/bookingPage";

const routes = [
  { path: ROUTERS.USER.HOME, component: <HomePage /> },
  { path: ROUTERS.USER.PROFILE, component: <ProfilePage /> },
  { path: ROUTERS.USER.SEARCH, component: <SearchPage /> },
  { path: ROUTERS.USER.LOGIN, component: <LoginPage /> },
  { path: ROUTERS.USER.BOOKING, component: <BookingPage /> },
];

const RouterCustom = () => (
  <MasterLayout>
    <Routes>
      {routes.map(({ path, component }) => (
        <Route key={path} path={path} element={component} />
      ))}
    </Routes>
  </MasterLayout>
);

export default RouterCustom;
