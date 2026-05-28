import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router";
import { Navigate } from "react-router-dom";
import { Loader as LoaderIcon, Loader2 } from "lucide-react";
import { Layout } from "./Layout";
import { supabase } from "@/lib/supabase";

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

function withSuspense<T extends React.ComponentType<object>>(Comp: T) {
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

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = React.useState<'loading' | 'ok' | 'denied'>('loading');

  React.useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session?.user) {
        setStatus('denied');
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', data.session.user.id)
        .single();

      if (!profile) {
        setStatus('denied');
        return;
      }

      setStatus(profile?.is_admin === true ? 'ok' : 'denied');
    })();
  }, []);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
      </div>
    );
  }

  if (status === 'denied') {
    return <Navigate to="/auth" replace />;
  }

  return <>{children}</>;
}

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
    element: (
      <ProtectedAdminRoute>
        <AdminPageSusp />
      </ProtectedAdminRoute>
    ),
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
