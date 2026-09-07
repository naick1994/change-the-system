import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AmbientDots } from "./components/AmbientDots";
import { Footer } from "./components/Footer";
import { ScrollToTop } from "./components/ScrollToTop";
import { NavBar } from "./components/NavBar";
import Home from "./pages/Home";
import CompetitionsIndex from "./pages/CompetitionsIndex";
import EventPage from "./pages/EventPage";
import AthletesIndex from "./pages/AthletesIndex";
import AthleteGlobalPage from "./pages/AthleteGlobalPage";
import NotFound from "./pages/NotFound";

const App = () => (
  <BrowserRouter basename={import.meta.env.BASE_URL}>
    <AmbientDots />
    <ScrollToTop />
    <NavBar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/competitions" element={<CompetitionsIndex />} />
      <Route path="/athletes" element={<AthletesIndex />} />
      <Route path="/athletes/:name" element={<AthleteGlobalPage />} />
      <Route path="/:slug" element={<EventPage />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
    <Footer />
  </BrowserRouter>
);

export default App;
