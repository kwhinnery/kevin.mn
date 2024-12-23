import { AiOutlineGithub, AiOutlineLinkedin, AiOutlineX } from "react-icons/ai";
import "./App.css";

function App() {
  return (
    <>
      <div
        className={`
          flex flex-col items-center justify-center h-full w-full gap-4
          md:flex-row
        `}
      >
        <div>
          <img
            className={`
              w-48 h-48 rounded-full object-cover shadow-2xl
              md:w-72 md:h-auto md:rounded-lg
            `}
            src="/kevin.jpeg"
            alt="Kevin Whinnery"
          />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <h1 className="text-xl md:text-3xl font-bold">Kevin Whinnery</h1>
          <p className="flex items-center gap-1">
            Developer Experience @{" "}
            <a
              href="https://platform.openai.com"
              target="_blank"
            >
              OpenAI
            </a>
          </p>
          <ul className="flex flex-col gap-2 items-start text-sm">
            <li className="flex items-center gap-2">
              <AiOutlineX className="w-4 h-4" />
              <a href="https://x.com/kevinwhinnery" target="_blank">
                @kevinwhinnery
              </a>
            </li>
            <li className="flex items-center gap-2">
              <AiOutlineGithub className="w-4 h-4" />
              <a href="https://github.com/kwhinnery" target="_blank">
                @kwhinnery
              </a>
            </li>
            <li className="flex items-center gap-2">
              <AiOutlineLinkedin className="w-4 h-4" />
              <a
                href="https://www.linkedin.com/in/kevinwhinnery/"
                target="_blank"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}

export default App;
