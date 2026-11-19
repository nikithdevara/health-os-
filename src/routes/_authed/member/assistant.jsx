import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/member/assistant")({
  head: () => ({ meta: [{ title: "HealthOS — AI health assistant" }] }),
  component: AssistantPage,
});
import { Sparkles, Send, FileText, AlertTriangle, ShieldCheck } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { records, timeline } from "@/lib/data/orva";
import { useAssistant } from "@/lib/AssistantContext";
import { fmtDate } from "@/lib/format";

const PROMPTS = [
  "Summarise my last three records",
  "Explain my lipid panel in plain language",
  "What changed since my last cardiology visit?",
  "List my active medications and why I take them",
];

const HISTORY = [
  { id: "h1", question: "Summarise my recent medical records", at: "Yesterday · 18:20", sources: 3 },
  { id: "h2", question: "Explain my lipid panel", at: "2 days ago · 09:12", sources: 1 },
  { id: "h3", question: "How has my blood pressure trended?", at: "Last week", sources: 6 },
];

export default function AssistantPage() {
  const [recordId, setRecordId] = useState(records[0].id);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState(null);
  const [thinking, setThinking] = useState(false);
  const { openAssistant } = useAssistant();

  const record = records.find((r) => r.id === recordId);

  function ask(prompt) {
    const q = (prompt ?? question).trim();
    if (!q) return;
    setThinking(true);
    setAnswer(null);
    setTimeout(() => {
      const related = timeline.filter((t) => t.bodyRegion === "chest").slice(0, 3);
      setAnswer({
        question: q,
        text: `${record.title} (${fmtDate(record.date)}) shows: ${record.summary} This is consistent with the previous ${record.type.toLowerCase()} and does not contain a value that needs urgent review in this demonstration dataset.`,
        sources: [record.title, ...related.map((r) => r.title)].slice(0, 3),
      });
      setThinking(false);
      setQuestion("");
    }, 900);
  }

  return (
    <div>
      <PageHeader
        eyebrow="Intelligence"
        title="AI health assistant"
        description="Ask about your own records. Answers cite the documents they came from and are labelled as simulated throughout this phase."
        actions={
          <Button size="sm" variant="outline" className="h-9 gap-1.5 text-[12.5px]" onClick={() => openAssistant()}>
            <Sparkles className="h-3.5 w-3.5" /> Open side assistant
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <div className="orva-card p-4 sm:p-5">
            <p className="orva-label mb-2">Ask my records</p>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
              <Select value={recordId} onValueChange={setRecordId}>
                <SelectTrigger className="h-9 text-[12.5px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {records.map((r) => (
                    <SelectItem key={r.id} value={r.id}>
                      {r.title} · {fmtDate(r.date)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span className="hidden items-center rounded-lg border border-border bg-muted/50 px-2.5 text-[11px] text-brand-subtle sm:flex">
                {record.org}
              </span>
            </div>
            <Textarea
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="For example: what does my LDL result mean for my treatment plan?"
              className="mt-2 text-[13px]"
            />
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <p className="flex items-center gap-1.5 text-[10.5px] text-brand-subtle">
                <ShieldCheck className="h-3 w-3 text-primary" /> Only records you own are used
              </p>
              <Button size="sm" className="h-8 gap-1.5 text-[11.5px]" onClick={() => ask()} disabled={!question.trim() || thinking}>
                <Send className="h-3.5 w-3.5" /> {thinking ? "Reading…" : "Ask"}
              </Button>
            </div>
          </div>

          {thinking && (
            <div className="orva-card flex items-center gap-2 p-4 text-[12.5px] text-brand-subtle">
              <span className="flex gap-1">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary [animation-delay:240ms]" />
              </span>
              Reading {record.title.toLowerCase()}…
            </div>
          )}

          {answer && (
            <article className="orva-card p-4 sm:p-5">
              <p className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-brand-subtle">You asked</p>
              <p className="mt-1 text-[13px] font-semibold text-brand-ink">{answer.question}</p>
              <p className="mt-3 text-[13px] leading-relaxed text-brand-ink">{answer.text}</p>

              <div className="mt-3 rounded-xl border border-border bg-muted/50 p-3">
                <p className="orva-label mb-1.5 flex items-center gap-1.5">
                  <FileText className="h-3 w-3" /> Sources
                </p>
                <ul className="space-y-1">
                  {answer.sources.map((s) => (
                    <li key={s} className="text-[11.5px] text-brand-ink/80">
                      · {s}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="mt-3 flex items-start gap-1.5 rounded-lg bg-brand-warn/10 px-3 py-2 text-[11px] leading-relaxed text-[#8a5f16]">
                <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Simulated demonstration response. Not a diagnosis and not a substitute for clinical review.
              </p>
            </article>
          )}

          <div>
            <p className="orva-label mb-2">Suggested questions</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => ask(p)}
                  className="rounded-xl border border-border bg-card px-3 py-2.5 text-left text-[12.5px] text-brand-ink transition-colors hover:border-primary/30 hover:bg-brand-mint/40"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="orva-card p-4">
            <p className="orva-label mb-3">AI history</p>
            <ul className="space-y-2.5">
              {HISTORY.map((h) => (
                <li key={h.id} className="rounded-lg border border-border px-3 py-2">
                  <p className="text-[12px] font-semibold text-brand-ink">{h.question}</p>
                  <p className="mt-0.5 text-[10.5px] text-brand-subtle">
                    {h.at} · {h.sources} sources
                  </p>
                </li>
              ))}
            </ul>
          </div>
          <div className="orva-card p-4">
            <p className="orva-label mb-2">How HealthOS answers</p>
            <ul className="space-y-2 text-[11.5px] leading-relaxed text-brand-subtle">
              <li>· Observations cite the record and date they came from.</li>
              <li>· Suggestions are separated from observations and need your confirmation.</li>
              <li>· Nothing is written to your record without an explicit action.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}