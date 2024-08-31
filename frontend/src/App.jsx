import { Routes, Route } from "react-router-dom";
import { HomePage, LoginPage, SignUpPage , NotificationPage ,ProfilePage} from "./pages/pages";
import { Sidebar , RightPanel} from "./components/components";
function App() {
  return (
    <div className="flex max-w-6xl mx-auto">
      <Sidebar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/profile/:username" element={<ProfilePage />} />
        <Route path="/notifications" element={<NotificationPage />} />
      </Routes>
      <RightPanel />
    </div>
  );
}

export default App;
