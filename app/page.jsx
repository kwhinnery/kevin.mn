import {
  AiOutlineGithub,
  AiOutlineLinkedin,
  AiOutlineX,
} from "react-icons/ai";
import { PiButterfly } from "react-icons/pi";

export default function Home() {
  return (
    <main className="flex min-h-dvh w-full items-center justify-center p-6 sm:p-8">
      <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
        <img
          className="h-48 w-48 rounded-full object-cover shadow-2xl sm:h-auto sm:w-72 sm:rounded-lg"
          src="/kevin.jpeg"
          alt="Kevin Whinnery speaking on stage"
          width="665"
          height="1064"
        />
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-xl font-bold sm:text-3xl">Kevin Whinnery</h1>
          <ul className="flex flex-col items-start gap-2 text-sm">
            <li className="flex items-center gap-2">
              <AiOutlineX aria-hidden="true" className="h-4 w-4" />
              <a
                href="https://x.com/kevinwhinnery"
                target="_blank"
                rel="noreferrer"
              >
                @kevinwhinnery
              </a>
              <span aria-hidden="true">/</span>
              <PiButterfly aria-hidden="true" className="h-4 w-4" />
              <a
                href="https://bsky.app/profile/kevin.mn"
                target="_blank"
                rel="noreferrer"
              >
                @kevin.mn
              </a>
            </li>
            <li className="flex items-center gap-2">
              <AiOutlineGithub aria-hidden="true" className="h-4 w-4" />
              <a
                href="https://github.com/kwhinnery"
                target="_blank"
                rel="noreferrer"
              >
                @kwhinnery
              </a>
            </li>
            <li className="flex items-center gap-2">
              <AiOutlineLinkedin aria-hidden="true" className="h-4 w-4" />
              <a
                href="https://www.linkedin.com/in/kevinwhinnery/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
