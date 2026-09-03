"use client";

import { useEffect, useMemo, useState } from "react";
import { loadSavedSessions, type MayaSessionRecord } from "@/lib/maya/libraryData";
import PptxGenJS from "pptxgenjs";

type DeckSlide = {
  id: number;
  title: string;
  body: string;
};

type DeckDraft = {
  title: string;
  slides: DeckSlide[];
  updatedAt: string;
};

const DECK_DRAFT_KEY = "maya_white_boardroom_deck_v1";

const initialSlides: DeckSlide[] = [
  {
    id: 1,
    title: "Decision",
    body: "State the decision, recommendation, or campaign idea.",
  },
  {
    id: 2,
    title: "Evidence",
    body: "Add the facts, financial signals, market evidence, and executive findings.",
  },
];

function safeFileName(value: string) {
  const cleaned = value.trim().replace(/[^a-z0-9-_]+/gi, "-").replace(/^-+|-+$/g, "");
  return cleaned || "maya-white-boardroom";
}

export default function PowerPointExport() {
  const [deckTitle, setDeckTitle] = useState("MAYA White Boardroom");
  const [slides, setSlides] = useState<DeckSlide[]>(initialSlides);
  const [status, setStatus] = useState<"idle" | "saved" | "exporting" | "complete" | "error">("idle");
  const [sessions, setSessions] = useState<MayaSessionRecord[]>([]);

  useEffect(() => {
    setSessions(
      loadSavedSessions().filter(
        (session) =>
          !session.id.startsWith("seed-") &&
          (session.clientVaultId ?? "personal") === "personal",
      ),
    );
    try {
      const raw = window.localStorage.getItem(DECK_DRAFT_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as DeckDraft;
      if (saved.title && Array.isArray(saved.slides) && saved.slides.length > 0) {
        setDeckTitle(saved.title);
        setSlides(saved.slides);
        setStatus("saved");
      }
    } catch {
      setStatus("error");
    }
  }, []);

  const hasContent = useMemo(
    () => Boolean(deckTitle.trim()) && slides.some((slide) => slide.title.trim() || slide.body.trim()),
    [deckTitle, slides],
  );

  const updateSlide = (id: number, field: "title" | "body", value: string) => {
    setSlides((current) =>
      current.map((slide) => (slide.id === id ? { ...slide, [field]: value } : slide)),
    );
  };

  const addSlide = () => {
    setSlides((current) => [
      ...current,
      {
        id: Math.max(0, ...current.map((slide) => slide.id)) + 1,
        title: `Slide ${current.length + 1}`,
        body: "",
      },
    ]);
  };

  const removeSlide = (id: number) => {
    setSlides((current) => (current.length === 1 ? current : current.filter((slide) => slide.id !== id)));
  };

  const addSessionToDeck = (session: MayaSessionRecord) => {
    setSlides((current) => {
      const nextId = Math.max(0, ...current.map((slide) => slide.id)) + 1;
      return [
        ...current,
        {
          id: nextId,
          title: session.title || "Executive question",
          body: session.query,
        },
        {
          id: nextId + 1,
          title: `${session.role.toUpperCase()} recommendation`,
          body: session.answer,
        },
      ];
    });
    setStatus("idle");
  };

  const saveDraft = () => {
    try {
      const draft: DeckDraft = {
        title: deckTitle.trim() || "MAYA White Boardroom",
        slides,
        updatedAt: new Date().toISOString(),
      };
      window.localStorage.setItem(DECK_DRAFT_KEY, JSON.stringify(draft));
      setStatus("saved");
    } catch (error) {
      console.error("Deck draft save failed", error);
      setStatus("error");
    }
  };

  const exportDeck = async () => {
    if (!hasContent || status === "exporting") return;

    setStatus("exporting");

    try {
      const pptx = new PptxGenJS();
      pptx.layout = "LAYOUT_WIDE";
      pptx.author = "MAYA";
      pptx.company = "RAIN";
      pptx.subject = "White Boardroom export";
      pptx.title = deckTitle.trim();
      pptx.theme = {
        headFontFace: "Aptos Display",
        bodyFontFace: "Aptos",
      };

      const titleSlide = pptx.addSlide();
      titleSlide.background = { color: "F7F7F4" };
      titleSlide.addText(deckTitle.trim(), {
        x: 0.8,
        y: 2.2,
        w: 11.7,
        h: 1.1,
        fontFace: "Aptos Display",
        fontSize: 50,
        bold: true,
        color: "171717",
        margin: 0,
        breakLine: false,
      });
      titleSlide.addText("MAYA · White Boardroom", {
        x: 0.82,
        y: 3.5,
        w: 5.5,
        h: 0.35,
        fontFace: "Aptos",
        fontSize: 13,
        bold: true,
        color: "6B7280",
        charSpacing: 1.2,
        margin: 0,
      });
      titleSlide.addShape(pptx.ShapeType.line, {
        x: 0.8,
        y: 4.05,
        w: 2.2,
        h: 0,
        line: { color: "171717", width: 2 },
      });

      slides.forEach((item, index) => {
        if (!item.title.trim() && !item.body.trim()) return;
        const slide = pptx.addSlide();
        slide.background = { color: index % 2 === 0 ? "FFFFFF" : "F7F7F4" };
        slide.addText(item.title.trim() || `Slide ${index + 1}`, {
          x: 0.75,
          y: 0.55,
          w: 11.8,
          h: 0.65,
          fontFace: "Aptos Display",
          fontSize: 35,
          bold: true,
          color: "171717",
          margin: 0,
          breakLine: false,
        });
        slide.addShape(pptx.ShapeType.line, {
          x: 0.75,
          y: 1.35,
          w: 11.8,
          h: 0,
          line: { color: "D1D5DB", width: 1 },
        });
        slide.addText(item.body.trim() || "Add supporting content in MAYA.", {
          x: 0.82,
          y: 1.75,
          w: 11.45,
          h: 4.7,
          fontFace: "Aptos",
          fontSize: 18,
          color: "303030",
          valign: "top",
          breakLine: false,
          margin: 0.06,
          bullet: item.body.includes("\n- ") ? { type: "bullet" } : undefined,
        });
        slide.addText(`MAYA · ${index + 1}`, {
          x: 10.9,
          y: 7.05,
          w: 1.4,
          h: 0.2,
          fontFace: "Aptos",
          fontSize: 9,
          color: "8A8A8A",
          align: "right",
          margin: 0,
        });
      });

      await pptx.writeFile({ fileName: `${safeFileName(deckTitle)}.pptx` });
      setStatus("complete");
    } catch (error) {
      console.error("PowerPoint export failed", error);
      setStatus("error");
    }
  };

  return (
    <section className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-5">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-black/40">
            Native presentation tool
          </p>
          <h2 className="mt-1 text-xl font-semibold">PowerPoint Deck Builder</h2>
          <p className="mt-1 max-w-2xl text-sm text-black/55">
            Turn selected White Boardroom notes into a PowerPoint file without leaving MAYA.
          </p>
        </div>
        <button
          type="button"
          onClick={exportDeck}
          disabled={!hasContent || status === "exporting"}
          className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === "exporting" ? "Building PowerPoint…" : "Download .pptx"}
        </button>
      </div>

      <section className="mt-5 rounded-xl border border-black/10 bg-[#f7f7f4] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-black/45">MAYA session sources</p>
            <p className="mt-1 text-sm text-black/55">
              Add real General-workspace executive sessions to this deck. Client-vault sources remain locked until encrypted retrieval is verified.
            </p>
          </div>
          <button
            type="button"
            onClick={saveDraft}
            className="rounded-lg border border-black/15 bg-white px-4 py-2 text-sm font-semibold"
          >
            Save deck draft
          </button>
        </div>
        {sessions.length === 0 ? (
          <p className="mt-3 text-sm text-black/45">No user-created General sessions are available yet.</p>
        ) : (
          <div className="mt-3 grid gap-2">
            {sessions.slice(0, 6).map((session) => (
              <div key={session.id} className="flex flex-col gap-3 rounded-lg border border-black/10 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{session.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-wider text-black/40">{session.role} · {session.savedAt}</p>
                </div>
                <button
                  type="button"
                  onClick={() => addSessionToDeck(session)}
                  className="shrink-0 rounded-lg bg-black px-3 py-2 text-xs font-semibold text-white"
                >
                  Add to deck
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <label className="mt-5 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-black/45">Deck title</span>
        <input
          value={deckTitle}
          onChange={(event) => {
            setDeckTitle(event.target.value);
            setStatus("idle");
          }}
          className="mt-2 w-full rounded-xl border border-black/10 bg-[#f7f7f4] px-4 py-3 text-lg font-semibold outline-none focus:border-black/30"
          aria-label="PowerPoint deck title"
        />
      </label>

      <div className="mt-4 grid gap-3">
        {slides.map((slide, index) => (
          <article key={slide.id} className="rounded-xl border border-black/10 bg-[#fbfbf9] p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-black/40">
                Slide {index + 1}
              </span>
              <button
                type="button"
                onClick={() => removeSlide(slide.id)}
                disabled={slides.length === 1}
                className="text-xs font-medium text-black/50 disabled:opacity-30"
              >
                Remove
              </button>
            </div>
            <input
              value={slide.title}
              onChange={(event) => {
                updateSlide(slide.id, "title", event.target.value);
                setStatus("idle");
              }}
              className="mt-3 w-full rounded-lg border border-black/10 bg-white px-3 py-2 text-sm font-semibold outline-none focus:border-black/30"
              aria-label={`Slide ${index + 1} title`}
              placeholder="Slide title"
            />
            <textarea
              value={slide.body}
              onChange={(event) => {
                updateSlide(slide.id, "body", event.target.value);
                setStatus("idle");
              }}
              className="mt-2 min-h-28 w-full resize-y rounded-lg border border-black/10 bg-white px-3 py-2 text-sm leading-relaxed outline-none focus:border-black/30"
              aria-label={`Slide ${index + 1} content`}
              placeholder="Add board notes, evidence, recommendations, or next steps"
            />
          </article>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={addSlide}
          className="rounded-lg border border-black/15 bg-white px-4 py-2 text-sm font-semibold"
        >
          + Add slide
        </button>
        <p className="text-xs text-black/50" role="status">
          {status === "complete" && "PowerPoint downloaded."}
          {status === "saved" && "Deck draft saved in this General workspace browser."}
          {status === "error" && "PowerPoint could not be generated. Your board content is unchanged."}
          {status === "idle" && "Exports locally in your browser; no Microsoft sign-in required."}
        </p>
      </div>
    </section>
  );
}
