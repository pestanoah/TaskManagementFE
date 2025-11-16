import { useAuth } from "react-oidc-context";
import "./App.css";
import Home from "./pages/Home";
import { Button } from "./components/ui/button";
import { useEffect } from "react";
import { ButtonGroup } from "./components/ui/button-group";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  const auth = useAuth();
  const signOutRedirect = () => {
    const clientId = "6fbkrdss49n7526s5sbmlvrhle";
    const logoutUri =
      (import.meta.env.DEV && "http://localhost:5173/") ||
      "https://task-management-fe-bucket.s3.us-east-2.amazonaws.com/index.html";
    const cognitoDomain =
      "https://us-east-2pxqpw6tiy.auth.us-east-2.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`;
  };

  useEffect(() => {
    auth.signinSilent().catch((error) => {
      console.error("Silent sign-in error:", error);
    });
  }, []);

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    console.log("Auth error:", auth.error);
  }

  if (auth.isAuthenticated) {
    return (
      <>
        <ThemeProvider defaultTheme="dark" storageKey="task-ui-theme">
          <Home />
        </ThemeProvider>
      </>
    );
  }

  return (
    <ThemeProvider defaultTheme="dark" storageKey="task-ui-theme">
      <div className="flex flex-col items-start gap-8">
        <ButtonGroup>
          <Button
            size="lg"
            variant="outline"
            onClick={() => auth.signinRedirect()}
          >
            Sign in
          </Button>
          <Button size="lg" variant="outline" onClick={() => signOutRedirect()}>
            Sign out
          </Button>
        </ButtonGroup>
      </div>
    </ThemeProvider>
  );
}

export default App;
