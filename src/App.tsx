import { useSession } from "./state/store";
import { Home } from "./screens/Home";
import { World } from "./screens/World";
import { Level } from "./screens/Level";
import { Lesson } from "./screens/Lesson";

function App() {
  const screen = useSession((s) => s.screen);

  switch (screen) {
    case "world":
      return <World />;
    case "level":
      return <Level />;
    case "lesson":
      return <Lesson />;
    case "home":
    default:
      return <Home />;
  }
}

export default App;
