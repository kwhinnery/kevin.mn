import { AiOutlineGithub, AiOutlineLinkedin, AiOutlineX } from "react-icons/ai";
import { PiButterfly } from "react-icons/pi";

function App() {
  return (
    <>
      <div
        className={`
          flex h-full w-full flex-col items-center justify-center gap-4 
          sm:flex-row
        `}
      >
        <div>
          <img
            className={`
              h-48 w-48 rounded-full object-cover shadow-2xl
              sm:h-auto sm:w-72 sm:rounded-lg
            `}
            src="/kevin.jpeg"
            alt="Kevin Whinnery"
          />
        </div>
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-xl font-bold sm:text-3xl">Kevin Whinnery</h1>
          <p className="flex items-center gap-1">
            API Experience @{" "}
            <a href="https://platform.openai.com" target="_blank">
              OpenAI
            </a>
          </p>
          <ul className="flex flex-col items-start gap-2 text-sm">
            <li className="flex items-center gap-2">
              <AiOutlineX className="h-4 w-4" />
              <a href="https://x.com/kevinwhinnery" target="_blank">
                @kevinwhinnery
              </a>
              /
              <PiButterfly className="h-4 w-4" />
              <a href="https://bsky.app/profile/kevin.mn" target="_blank">
                @kevin.mn
              </a>
            </li>
            <li className="flex items-center gap-2">
              <AiOutlineGithub className="h-4 w-4" />
              <a href="https://github.com/kwhinnery" target="_blank">
                @kwhinnery
              </a>
            </li>
            <li className="flex items-center gap-2">
              <AiOutlineLinkedin className="h-4 w-4" />
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
