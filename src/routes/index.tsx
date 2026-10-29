import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState, type ReactNode } from "react";
import hero from "@/assets/hero.jpg";
import group from "@/assets/group.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hvor går grensen? – Studenter og KI" },
      { name: "description", content: "En student, en oppgave og en KI-chat. Hva er hjelp, og hva er fusk?" },
      { property: "og:title", content: "Hvor går grensen? – Studenter og KI" },
      { property: "og:description", content: "En student, en oppgave og en KI-chat. Hva er hjelp, og hva er fusk?" },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Article,
});

function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && e.target.classList.add("in")),
      { threshold: 0.15 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}

function Typewriter({ text, speed = 28 }: { text: string; speed?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (n >= text.length) return;
    const t = setTimeout(() => setN(n + 1), speed);
    return () => clearTimeout(t);
  }, [n, text, speed]);
  return <span className={n < text.length ? "caret" : ""}>{text.slice(0, n)}</span>;
}

/* Prompt bubble that grows in size through the article */
function Prompt({ level, children }: { level: number; children: ReactNode }) {
  const sizes = ["text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl"];
  return (
    <div className="reveal my-10 flex justify-end">
      <div
        className={`max-w-[88%] rounded-3xl rounded-br-md bg-ink px-5 py-3 font-mono text-ink-foreground shadow-lg ${sizes[level]}`}
      >
        {children}
      </div>
    </div>
  );
}

function Section({ kicker, title, children }: { kicker: string; title: string; children: ReactNode }) {
  return (
    <section className="reveal py-6">
      <p className="font-mono text-xs uppercase tracking-widest text-primary">{kicker}</p>
      <h2 className="mt-2 font-serif text-3xl font-bold leading-tight">{title}</h2>
      <div className="mt-4 space-y-4 text-[17px] leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}

const stats = [
  { label: "Forklare pensum", v: 68 },
  { label: "Språkvask", v: 54 },
  { label: "Idémyldring", v: 47 },
  { label: "Oppsummere kilder", v: 39 },
  { label: "Skrive tekst", v: 18 },
];

const quiz = [
  { q: "Be KI forklare et vanskelig begrep", a: "ok" },
  { q: "Lime inn KI-tekst og levere som din egen", a: "fusk" },
  { q: "Bruke KI til å rette rettskriving", a: "ok" },
  { q: "La KI skrive drøftingen uten å oppgi det", a: "fusk" },
];

function Quiz() {
  const [ans, setAns] = useState<Record<number, string>>({});
  return (
    <div className="space-y-3">
      {quiz.map((item, i) => {
        const picked = ans[i];
        const right = picked === item.a;
        return (
          <div key={i} className="rounded-2xl border bg-card p-4">
            <p className="font-medium">{item.q}</p>
            <div className="mt-3 flex gap-2">
              {["ok", "fusk"].map((o) => (
                <button
                  key={o}
                  onClick={() => setAns({ ...ans, [i]: o })}
                  className={`flex-1 rounded-full border px-3 py-2 text-sm font-semibold transition ${
                    picked === o
                      ? right
                        ? "border-good bg-good text-primary-foreground"
                        : "border-destructive bg-destructive text-primary-foreground"
                      : "bg-background"
                  }`}
                >
                  {o === "ok" ? "Lov" : "Fusk"}
                </button>
              ))}
            </div>
            {picked && (
              <p className="mt-2 text-sm text-muted-foreground animate-rise">
                {right ? "Riktig." : `Nei – dette regnes som ${item.a === "ok" ? "lov" : "fusk"}.`}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

const chat = [
  { who: "Jonas", me: false, t: "Har noen begynt på drøftingsdelen? 😅" },
  { who: "Sara", me: false, t: "Jeg fikk KI til å skrive et utkast, kan bare lime det inn" },
  { who: "Emil", me: false, t: "Nei. Hvis det blir oppdaget, ryker hele gruppa." },
  { who: "Sara", me: false, t: "Alle gjør det jo?" },
];

function GroupChat() {
  const [choice, setChoice] = useState<string | null>(null);
  const options = [
    { k: "a", t: "«Greit, vi bruker utkastet.»", r: "Gruppa sparer tid – men alle står ansvarlige for teksten ved en eventuell fuskesak." },
    { k: "b", t: "«La oss bruke KI til ideer, men skrive selv.»", r: "Et kompromiss mange faglærere vil godta – så lenge bruken oppgis." },
    { k: "c", t: "«Jeg vil ikke bruke KI i det hele tatt.»", r: "Tryggest, men krever mer tid. Gruppa må bli enige." },
  ];
  return (
    <div className="overflow-hidden rounded-3xl bg-ink p-4 text-ink-foreground">
      <p className="mb-3 text-center font-mono text-xs opacity-60">Gruppe 4 · Samfunnsfag</p>
      <div className="space-y-3">
        {chat.map((m, i) => (
          <div key={i} className="reveal">
            <p className="mb-1 text-xs opacity-60">{m.who}</p>
            <div className="inline-block max-w-[85%] rounded-2xl rounded-tl-md bg-bubble px-4 py-2 text-sm">{m.t}</div>
          </div>
        ))}
        {choice && (
          <div className="flex justify-end animate-rise">
            <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2 text-sm text-primary-foreground">
              {options.find((o) => o.k === choice)!.t.replace(/[«»]/g, "")}
            </div>
          </div>
        )}
      </div>
      <div className="mt-5 border-t border-bubble pt-4">
        <p className="mb-2 text-xs uppercase tracking-widest opacity-60">Hva svarer du?</p>
        <div className="space-y-2">
          {options.map((o) => (
            <button
              key={o.k}
              onClick={() => setChoice(o.k)}
              className={`w-full rounded-xl border border-bubble px-4 py-3 text-left text-sm transition ${choice === o.k ? "bg-bubble" : ""}`}
            >
              {o.t}
            </button>
          ))}
        </div>
        {choice && (
          <p className="mt-3 text-sm opacity-80 animate-rise">{options.find((o) => o.k === choice)!.r}</p>
        )}
      </div>
    </div>
  );
}

function Quote({ who, role, children }: { who: string; role: string; children: ReactNode }) {
  return (
    <figure className="reveal border-l-4 border-primary pl-4">
      <blockquote className="font-serif text-xl leading-snug">«{children}»</blockquote>
      <figcaption className="mt-2 text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">{who}</span>, {role}
      </figcaption>
    </figure>
  );
}

function Article() {
  useReveal();
  const [ending, setEnding] = useState<string | null>(null);

  return (
    <main className="mx-auto max-w-[440px] bg-background pb-20">
      {/* HOOK */}
      <header className="relative h-[100svh] min-h-[620px] overflow-hidden bg-ink text-ink-foreground">
        <img src={hero} alt="Student foran laptop med KI-chat" width={864} height={1152} className="absolute inset-0 h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/60 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-6">
          <div className="mb-8 rounded-2xl bg-bubble/90 p-4 font-mono text-sm backdrop-blur animate-rise">
            <p className="mb-2 text-xs opacity-60">KI-assistent</p>
            <Typewriter text="Selvfølgelig! Her er en ferdig drøfting på 1200 ord om demokrati i Norge …" />
          </div>
          <p className="font-mono text-xs uppercase tracking-widest text-primary">Utdanning · 6 min lesing</p>
          <h1 className="mt-3 font-serif text-5xl font-black leading-[0.95]">Hvor går grensen?</h1>
          <p className="mt-4 text-lg opacity-85">Klokka er 23.40. Fristen er i morgen. Markøren blinker i chatvinduet.</p>
        </div>
      </header>

      <article className="px-5 pt-8">
        <p className="font-serif text-xl leading-relaxed first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:font-black first-letter:text-primary">
          Mia (21) har skrevet tre setninger på en oppgave som skal være fem sider. Hun vet at én melding til en KI-chat kan løse alt. Spørsmålet er bare: bør hun?
        </p>

        <Prompt level={0}>Kan du forklare hva deliberativt demokrati er?</Prompt>

        <Section kicker="Hjelp" title="Det starter uskyldig">
          <p>For de fleste begynner det med et enkelt spørsmål. Studenter bruker KI som en tålmodig privatlærer – til å forklare, oppsummere og rydde i tankene.</p>
          <div className="flex flex-wrap gap-2">
            {["Forklare begreper", "Lage studieplan", "Språkvask", "Idémyldring", "Øve til eksamen", "Oppsummere artikler"].map((t) => (
              <span key={t} className="rounded-full bg-secondary px-3 py-1.5 text-sm">{t}</span>
            ))}
          </div>
        </Section>

        <Prompt level={1}>Kan du gi meg tre argumenter for og mot?</Prompt>

        <Section kicker="Tallene" title="Nesten alle gjør det">
          <p>I en spørreundersøkelse blant studenter oppga et stort flertall at de har brukt KI i studiene. Men <em>hva</em> de bruker det til varierer.</p>
          <div className="rounded-2xl bg-card p-5">
            <p className="font-serif text-6xl font-black text-primary">8 av 10</p>
            <p className="text-sm text-muted-foreground">har brukt KI i studiene siste semester</p>
            <div className="mt-5 space-y-3">
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="flex justify-between text-sm"><span>{s.label}</span><span className="font-mono">{s.v}%</span></div>
                  <div className="mt-1 h-2 rounded-full bg-muted">
                    <div className="h-2 rounded-full bg-primary" style={{ width: `${s.v}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-muted-foreground">Illustrative tall.</p>
          </div>
        </Section>

        <Prompt level={2}>Skriv innledningen for meg, med kilder.</Prompt>

        <Section kicker="Reglene" title="Hva regnes egentlig som fusk?">
          <p>De fleste lærested sier det samme: KI er lov som hjelpemiddel, men du må selv stå for teksten – og ofte oppgi hvordan du brukte verktøyet. Test deg selv:</p>
          <Quiz />
        </Section>

        <Prompt level={3}>Skriv hele drøftingen. 1200 ord.</Prompt>

        <Section kicker="Dilemmaet" title="Når gruppa ikke er enig">
          <img src={group} alt="Studenter rundt et bord" loading="lazy" width={1024} height={768} className="rounded-2xl" />
          <p>I gruppeoppgaver blir det vanskeligere. Én bruker KI mye, en annen vil ikke ha det i nærheten av oppgaven. Hvem bestemmer?</p>
          <GroupChat />
        </Section>

        <Prompt level={4}>Gjør det så det ikke høres ut som KI.</Prompt>

        <Section kicker="Stemmene" title="Mellom hjelp og selvstendighet">
          <p>Vi spurte studenter og en faglærer hvor de trekker linjen.</p>
          <div className="space-y-8 pt-2">
            <Quote who="Ahmed, 22" role="student">Jeg bruker det som en sparringpartner. Men jeg merker at jeg lærer mindre når jeg lar den skrive.</Quote>
            <Quote who="Ingrid, 20" role="student">Det er fristende når du er sliten. Det er derfor det er farlig.</Quote>
            <Quote who="Kari Holm" role="universitetslektor">Jeg vil vurdere hva studenten kan, ikke hva maskinen kan. Åpenhet om bruken er nøkkelen.</Quote>
          </div>
        </Section>

        <Prompt level={5}>Lever den for meg.</Prompt>

        <Section kicker="Konsekvensene" title="Det som står på spill">
          <p>Fusk kan gi annullert eksamen og utestengelse i opptil ett år. Men den største prisen er kanskje den usynlige: kunnskapen du aldri fikk.</p>
          <div className="flex flex-wrap gap-2">
            {["ansvar", "åpenhet", "læring", "tillit", "fristelse", "tidspress", "egen stemme"].map((k, i) => (
              <span key={k} className={`rounded-full px-4 py-2 font-serif ${i % 2 ? "bg-accent text-accent-foreground" : "bg-ink text-ink-foreground"}`} style={{ fontSize: `${14 + (i % 3) * 4}px` }}>{k}</span>
            ))}
          </div>
        </Section>
      </article>

      {/* ENDING */}
      <section className="reveal mt-10 bg-ink px-5 py-14 text-ink-foreground">
        <p className="font-mono text-xs uppercase tracking-widest text-primary">23.58</p>
        <p className="mt-3 font-serif text-2xl leading-snug">Mia ser på chatvinduet. Svaret er ferdig skrevet. Hun trenger bare å kopiere det.</p>
        <div className="mt-8 rounded-2xl bg-bubble p-4 font-mono text-sm opacity-80">Her er din ferdige drøfting …</div>
        <h2 className="mt-12 font-serif text-5xl font-black">Hva er grensen?</h2>
        <p className="mt-3 opacity-75">Hva ville du gjort?</p>
        <div className="mt-6 grid gap-3">
          {[
            ["copy", "Kopiere svaret", "Du leverer i tide. Men teksten er ikke din."],
            ["edit", "Bruke det som inspirasjon", "Du skriver selv, med KI som støtte – og oppgir det."],
            ["close", "Lukke vinduet", "Det blir en lang natt. Men alt du leverer er ditt."],
          ].map(([k, t, r]) => (
            <button key={k} onClick={() => setEnding(k ?? null)} className={`rounded-2xl border border-bubble px-5 py-4 text-left transition ${ending === k ? "bg-primary text-primary-foreground" : ""}`}>
              <span className="font-semibold">{t}</span>
              {ending === k && <span className="mt-1 block text-sm animate-rise">{r}</span>}
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}
