import React, { lazy, Suspense } from "react";
import { createBrowserRouter, Navigate } from "react-router";
import { Loader as LoaderIcon } from "lucide-react";
import { Layout } from "./Layout";

const Splash = lazy(() =>
  import("./pages/Splash").then((m) => ({ default: m.Splash })),
);
const AuthPage = lazy(() =>
  import("./pages/Auth").then((m) => ({ default: m.AuthPage })),
);
const HomePage = lazy(() =>
  import("./pages/Home").then((m) => ({ default: m.HomePage })),
);
const SavedPage = lazy(() =>
  import("./pages/Saved").then((m) => ({ default: m.SavedPage })),
);
const ContactPage = lazy(() =>
  import("./pages/Contact").then((m) => ({ default: m.ContactPage })),
);
const SettingsPage = lazy(() =>
  import("./pages/Settings").then((m) => ({ default: m.SettingsPage })),
);
const AdminPage = lazy(() =>
  import("./pages/Admin").then((m) => ({ default: m.AdminPage })),
);

function withSuspense<T extends React.ComponentType<any>>(Comp: T) {
  return (props: React.ComponentProps<T>) => (
    <Suspense
      fallback={
        <div className="flex items-center justify-center p-8">
          <LoaderIcon className="w-8 h-8 text-amber-500 animate-spin" />
        </div>
      }
    >
      <Comp {...props} />
    </Suspense>
  );
}

const SplashSusp = withSuspense(Splash);
const AuthPageSusp = withSuspense(AuthPage);
const HomePageSusp = withSuspense(HomePage);
const SavedPageSusp = withSuspense(SavedPage);
const ContactPageSusp = withSuspense(ContactPage);
const SettingsPageSusp = withSuspense(SettingsPage);
const AdminPageSusp = withSuspense(AdminPage);

export const router = createBrowserRouter([
  {
    path: "/",
    Component: SplashSusp,
  },
  {
    path: "/auth",
    Component: AuthPageSusp,
  },
  {
    path: "/admin",
    Component: AdminPageSusp,
  },
  {
    path: "/",
    Component: Layout,
    children: [
      { path: "home", Component: HomePageSusp },
      { path: "saved", Component: SavedPageSusp },
      { path: "contact", Component: ContactPageSusp },
      { path: "settings", Component: SettingsPageSusp },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/home" replace />,
  },
]);
