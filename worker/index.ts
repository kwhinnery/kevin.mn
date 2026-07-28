interface Env {
  ASSETS: {
    fetch(request: Request): Promise<Response>;
  };
}

const CALENDAR_URL = "https://calendar.app.google/NhUoekZ6XjUf72VD6";

const worker = {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);

    if (url.hostname === "kevin.mn") {
      url.hostname = "www.kevin.mn";
      return Response.redirect(url, 308);
    }

    if (url.pathname === "/call") {
      return Response.redirect(CALENDAR_URL, 307);
    }

    return env.ASSETS.fetch(request);
  },
};

export default worker;
