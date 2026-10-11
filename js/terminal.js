(() => {
  const form = document.querySelector("#terminal-form");
  const input = document.querySelector("#terminal-input");
  const output = document.querySelector("#terminal-output");
  if (!form || !input || !output) return;

  const history = [];
  let historyIndex = 0;
  let cwd = "/";
  const files = {
    "/": ["about.txt", "archive/", "workshop/", "frequencies/", "field-notes/", "elsewhere/", "lost/", "system/"],
    "/archive": ["index.txt", "internet.txt", "copyright.txt", "unfinished-things.txt"],
    "/workshop": ["null-island.txt", "small-game.txt", "personal-search.txt"],
    "/frequencies": ["listening-notes.txt", "music-policy.txt"],
    "/field-notes": ["note-001.txt", "note-002.txt"],
    "/elsewhere": ["links.txt"],
    "/system": ["logs/", "status.txt"],
    "/system/logs": ["boot.log", "notes.log"],
    "/lost": ["readme.txt"]
  };
  const docs = {
    "/about.txt": "I am a person with too many open tabs and a suspicious number of ongoing interests. Replace this with your own introduction.",
    "/archive/index.txt": "THE ARCHIVE\\nWriting, research, notes, and ideas worth keeping. Visit archive.html for the full index.",
    "/archive/internet.txt": "QUESTION: What makes a personal website feel personal?\\nA starting point: specific details, links with context, and room for things that are not optimised for attention.",
    "/archive/copyright.txt": "RESEARCH SEED\\nWho owns a sound that was never recorded? This is a question to investigate, not a legal conclusion.",
    "/archive/unfinished-things.txt": "A prototype can be useful even if it never becomes a finished product. The experiment is part of the result.",
    "/workshop/null-island.txt": "This website is the first experiment. Status: ACTIVE. Objective: make a small corner of the internet.",
    "/workshop/small-game.txt": "A small game idea. Status: PAUSED. Next action: build one room and one interesting interaction.",
    "/workshop/personal-search.txt": "A search tool for personal notes. Status: IDEA STAGE.",
    "/frequencies/listening-notes.txt": "A place for records, songs, playlists, and sounds worth returning to. No copyrighted audio is included by default.",
    "/frequencies/music-policy.txt": "Host only audio you created, licensed, or have permission to share.",
    "/field-notes/note-001.txt": "Start before the concept is perfect. Making a rough version can answer questions that planning cannot.",
    "/field-notes/note-002.txt": "The internet is more interesting when people make strange little things.",
    "/elsewhere/links.txt": "Neocities — https://neocities.org/\\nInternet Archive — https://archive.org/\\nMDN — https://developer.mozilla.org/",
    "/system/status.txt": "SYSTEM STATUS: ONLINE\\nPUBLIC ROUTES: AVAILABLE\\nIDEAS UNFINISHED: MANY\\nREASON TO WORRY: NONE",
    "/system/logs/boot.log": "00:00:01 interface initialised\\n00:00:02 public routes loaded\\n00:00:03 operator reminded to update the archive",
    "/system/logs/notes.log": "NOTE: there is a room that isn't on the map.\\nHINT: open /backroom",
    "/lost/readme.txt": "Nothing is broken. You may have typed a path that does not exist. Try ls, help, or open /."
  };

  function line(text, className = "") {
    const p = document.createElement("p");
    p.className = "terminal-line" + (className ? " " + className : "");
    p.textContent = text;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
  }
  function linkLine(label, href) {
    const p = document.createElement("p");
    p.className = "terminal-line";
    const a = document.createElement("a");
    a.href = href;
    a.textContent = label;
    a.className = "text-link";
    p.appendChild(a);
    output.appendChild(p);
    output.scrollTop = output.scrollHeight;
  }
  function normalisePath(path) {
    if (!path || path === ".") return cwd;
    if (path === "~") return "/";
    let parts = (path.startsWith("/") ? path : `${cwd === "/" ? "" : cwd}/${path}`).split("/");
    const clean = [];
    for (const part of parts) {
      if (!part || part === ".") continue;
      if (part === "..") clean.pop();
      else clean.push(part);
    }
    return "/" + clean.join("/");
  }
  function routeFor(path) {
    const routes = {
      "/": "index.html", "/about": "about.html", "/archive": "archive.html",
      "/workshop": "workshop.html", "/frequencies": "frequencies.html",
      "/field-notes": "field-notes.html", "/elsewhere": "elsewhere.html",
      "/lost": "lost.html", "/backroom": "backroom.html", "/system/logs": "logs.html"
    };
    return routes[path] || null;
  }
  function help(secret = false) {
    line("AVAILABLE COMMANDS", "accent");
    line("help             show this list");
    line("ls [path]        list a directory");
    line("cd [path]        change the current directory");
    line("pwd              print current directory");
    line("cat [file]       read a text file");
    line("open [path]      open a website page");
    line("search [term]    search the known index");
    line("whoami           identify the operator");
    line("history          show commands from this session");
    line("clear            clear terminal output");
    if (secret) {
      line("UNLISTED COMMANDS", "accent");
      line("help secrets     display this list");
      line("sudo make me a sandwich");
      line("try: open /backroom");
    } else {
      line("Tip: try help secrets if you are curious.");
    }
  }
  function execute(raw) {
    const value = raw.trim();
    if (!value) return;
    history.push(value);
    historyIndex = history.length;
    line(`visitor@null-island:${cwd === "/" ? "~" : "~" + cwd}$ ${value}`, "muted");
    const split = value.match(/^(\S+)(?:\s+([\s\S]*))?$/);
    const cmd = split[1].toLowerCase();
    const arg = (split[2] || "").trim();

    switch (cmd) {
      case "help": help(arg === "secrets" || arg === "--all"); break;
      case "clear": output.innerHTML = ""; break;
      case "pwd": line(cwd); break;
      case "whoami": line("A curious person maintaining a small corner of the internet."); break;
      case "date": line(new Date().toString()); break;
      case "history":
        if (!history.length) line("No commands recorded.");
        else history.forEach((item, i) => line(`${String(i + 1).padStart(2, "0")}  ${item}`));
        break;
      case "ls": {
        const path = normalisePath(arg || cwd);
        if (files[path]) files[path].forEach(item => line(item, item.endsWith("/") ? "accent" : ""));
        else line(`ls: cannot access '${path}': no such directory`);
        break;
      }
      case "cd": {
        const path = normalisePath(arg || "/");
        if (files[path]) { cwd = path; line(`directory changed to ${cwd}`); }
        else line(`cd: no such directory: ${path}`);
        break;
      }
      case "cat": {
        if (!arg) { line("usage: cat [file]"); break; }
        const path = normalisePath(arg);
        if (docs[path]) docs[path].split("\\n").forEach(part => line(part));
        else line(`cat: ${arg}: file not found`);
        break;
      }
      case "open": {
        if (!arg || arg === "/") { location.href = "index.html"; break; }
        const path = normalisePath(arg).replace(/\/$/, "");
        const route = routeFor(path);
        if (route) {
          if (path === "/backroom") line("UNLISTED ROUTE FOUND.", "accent");
          location.href = route;
        } else {
          line(`open: no known page at ${path}`);
        }
        break;
      }
      case "search": {
        if (!arg) { line("usage: search [term]"); break; }
        const term = arg.toLowerCase();
        const known = [
          ["archive", "writing, research, notes, copyright, internet", "archive.html"],
          ["workshop", "code, game, prototype, project, unfinished", "workshop.html"],
          ["frequencies", "music, listening, sound, playlist", "frequencies.html"],
          ["field-notes", "journal, thoughts, observations, copyright", "field-notes.html"],
          ["about", "person, interests, operator", "about.html"],
          ["elsewhere", "links, websites, internet archive", "elsewhere.html"]
        ];
        const matches = known.filter(item => (item.join(" ") + " " + item[1]).toLowerCase().includes(term));
        if (!matches.length) line("No indexed records found. The index is small by design.");
        matches.forEach(item => linkLine(`/${item[0]} — ${item[1]}`, item[2]));
        break;
      }
      case "sudo":
        if (arg.toLowerCase() === "make me a sandwich") line("permission denied: the operator is in the kitchen.");
        else line("sudo: this simulated terminal does not grant elevated privileges.");
        break;
      case "rm":
        line("Nice try. This terminal cannot delete files.");
        break;
      case "exit":
        line("There is no shell to exit. You can close the tab, though.");
        break;
      default:
        line(`${cmd}: command not found. Type help to see available commands.`);
    }
  }

  form.addEventListener("submit", event => {
    event.preventDefault();
    const command = input.value;
    input.value = "";
    execute(command);
    input.focus();
  });
  input.addEventListener("keydown", event => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (history.length) { historyIndex = Math.max(0, historyIndex - 1); input.value = history[historyIndex] || ""; }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      historyIndex = Math.min(history.length, historyIndex + 1);
      input.value = history[historyIndex] || "";
    } else if (event.key === "Tab") {
      const known = ["help", "ls", "cd", "pwd", "cat", "open", "search", "whoami", "history", "clear", "date"];
      const current = input.value.trim();
      const match = known.find(command => command.startsWith(current) && command !== current);
      if (match) { event.preventDefault(); input.value = match; }
    }
  });
})();
