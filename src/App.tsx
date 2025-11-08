import { useAutoSignin } from "react-oidc-context";
import "./App.css";
import Home from "./pages/Home";
import { Button } from "./components/ui/button";

function App() {
  const auth = useAutoSignin();
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

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    console.log("Auth error:", auth.error);
  }

  if (auth.isAuthenticated) {
    return (
      <>
        <Home />
      </>
    );
  }

  return (
    <div>
      <Button onClick={() => signOutRedirect()}>Sign out</Button>
    </div>
  );
}

export default App;
