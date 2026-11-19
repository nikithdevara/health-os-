const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, X, Paperclip, Mic, Send, Check, ArrowRight, CalendarClock, ShieldCheck, Undo2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";

import { useAssistant } from "@/lib/AssistantContext";
import { useRole } from "@/lib/RoleContext";
import { member } from "@/lib/data/orva";
import Sparkline from "@/components/dashboard/Sparkline";
import VoiceOverlay from "./VoiceOverlay";

function AiMark({ className = "" }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        d="M12 1.5c.7 4.2 2.3 7.1 4.6 8.6 1.5 1 3 1.6 5.9 1.9-4.2.7-7.1 2.3-8.6 4.6-1 1.5-1.6 3-1.9 5.9-.7-4.2-2.3-7.1-4.6-8.6-1.5-1-3-1.6-5.9-1.9 4.2-.7 7.1-2.3 8.6-4.6 1-1.5 1.6-3 1.9-5.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

const SUGGESTIONS = {
  member: ["Summarise my week", "Explain my lipid panel", "Reschedule my cardiology review"],
  doctor: ["Summarise Amara's history", "Compare the last two lipid panels", "Draft a consultation note"],
  default: ["Summarise today", "What needs my attention?", "Explain the latest results"],
};

const REPLY = {
  member:
    "Your week: blood pressure averaged 123/78 across six home readings, resting heart rate held at 64 bpm, and LDL came back at 2.9 mmol/L — down from 3.3. Nothing is flagged urgent. Your cardiology review is booked for 12 Nov at 09:30.",
  doctor:
    "Amara Okafor, 35, on amlodipine 5 mg. Home BP averages 126/80 over six weeks, LDL 2.9 mmol/L, no acute findings on the last chest radiograph. Reported penicillin allergy — flag before any antibiotic.",
  default:
    "This is a simulated HealthOS AI response over demonstration data. It can summarise records and outline next steps, but nothing is saved or shared without your confirmation.",
};

const SOURCES = {
  member: ["Home BP series", "Lipid panel · Meridian", "Cardiology note"],
  doctor: ["Consultation note", "Lipid panel", "Chest radiograph"],
  default: ["HealthOS demonstration dataset"],
};

export default function AssistantPanel() {
  const { open, setOpen, seed, setSeed } = useAssistant();
  const { role } = useRole();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [voiceOpen, setVoiceOpen] = useState(false);
  const [remind, setRemind] = useState(true);
  const scrollRef = useRef(null);
  const fileRef = useRef(null);

  const suggestions = SUGGESTIONS[role] || SUGGESTIONS.default;

  useEffect(() => {
    if (open && seed) {
      send(seed);
      setSeed(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, seed]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  function reply(question) {
    const wantsReschedule = /resched|move|appointment|book/i.test(question);
    setThinking(true);
    setTimeout(() => {
      setThinking(false);
      setMessages((prev) => [
        ...prev,
        wantsReschedule
          ? { id: `a-${Date.now()}`, role: "assistant", text: "I found the confirmed slot below. Nothing changes until you send it.", card: { confirmed: false } }
          : {
              id: `a-${Date.now()}`,
              role: "assistant",
              text: REPLY[role] || REPLY.default,
              sources: SOURCES[role] || SOURCES.default,
              metric: {
                title: "Blood pressure",
                value: role === "doctor" ? "126/80" : "123/78",
                unit: "mmHg",
                delta: "−3.4% vs last month",
                series: [128, 124, 131, 122, 126, 123],
              },
            },
      ]);
    }, 900);
  }

  function send(text) {
    const value = (text ?? input).trim();
    if (!value) return;
    const names = attachments.map((a) => a.name);
    setMessages((prev) => [
      ...prev,
      { id: `u-${Date.now()}`, role: "user", text: value, files: names },
    ]);
    setInput("");
    setAttachments([]);
    reply(value);
  }

  async function handleFiles(event) {
    const target = event.target;
    const files = Array.from(target.files || []).slice(0, 3);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploaded = [];
      for (const file of files) {
        const res = await db.integrations.Core.UploadPrivateFile({ file });
        uploaded.push({ name: file.name, uri: res.file_uri });
      }
      setAttachments((prev) => [...prev, ...uploaded]);
      toast.success("Attached", { description: "Files are added to this conversation only." });
    } catch (error) {
      toast.error("Upload failed", { description: "That file could not be attached." });
    } finally {
      setUploading(false);
      target.value = "";
    }
  }

  const confirmCard = (id) => {
    setMessages((prev) =>
      prev.map((m) => (m.card ? { ...m, card: { ...m.card, confirmed: true } } : m)),
    );
    setMessages((prev) => [
      ...prev,
      {
        id: `done-${Date.now()}`,
        role: "assistant",
        text: "Done. Your cardiology review is now Monday 15 Nov at 16:00 with Dr. Elias Mensah, and a reminder is queued 2 hours before.",
        actions: true,
      },
    ]);
    toast.success("Appointment rescheduled", { description: `${member.firstName} · Mon 15 Nov, 16:00` });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="flex w-full flex-col gap-0 border-l border-border bg-background p-0 sm:max-w-[430px]">
          <header className="flex items-start justify-between px-4 pb-3 pt-4">
            <div className="flex items-center gap-2.5">
              <span className="grid h-9 w-9 place-items-center rounded-2xl bg-brand-carbon text-brand-lime shadow-[0_8px_20px_rgba(23,43,36,0.18)]">
                <AiMark className="h-4 w-4" />
              </span>
              <div>
                <p className="font-heading text-[14px] font-extrabold leading-tight tracking-[-0.02em] text-brand-ink">
                  HealthOS AI
                </p>
                <p className="text-[9.5px] text-brand-subtle">
                  Connected to your record · Private &amp; consent-safe
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="New conversation"
                onClick={() => {
                  setMessages([]);
                  setAttachments([]);
                }}
                className="grid h-7 w-7 place-items-center rounded-full border border-border text-brand-ink hover:bg-muted"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                aria-label="Close assistant"
                onClick={() => setOpen(false)}
                className="grid h-7 w-7 place-items-center rounded-full border border-border text-brand-ink hover:bg-muted"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </header>

          <div ref={scrollRef} className="orva-scroll flex-1 space-y-4 overflow-y-auto px-4 pb-3">
            {messages.length === 0 ? (
              <div>
                <p className="text-[13.5px] leading-relaxed text-brand-ink">
                  I can read the records you have consented to share and explain them in plain language. I never change
                  a record without your confirmation.
                </p>
                <div className="mt-3 flex items-start gap-2 rounded-2xl bg-secondary/70 p-3">
                  <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-forest" />
                  <p className="text-[11px] leading-relaxed text-brand-forest">
                    Every answer is a simulation over HealthOS demonstration data — not a diagnosis.
                  </p>
                </div>
                <p className="orva-label mt-5 pb-2">Try</p>
                <div className="flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => send(s)}
                      className="rounded-full border border-border bg-card px-2.5 py-1.5 text-[11px] font-medium text-brand-ink transition-colors hover:border-brand-ink/25"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              messages.map((m) =>
                m.role === "user" ? (
                  <div key={m.id} className="flex flex-col items-end gap-1">
                    <p className="max-w-[85%] rounded-2xl rounded-br-sm bg-brand-carbon px-3 py-2 text-[12.5px] leading-relaxed text-white">
                      {m.text}
                    </p>
                    {m.files?.length > 0 && (
                      <p className="text-[9.5px] text-brand-subtle">Attached · {m.files.join(", ")}</p>
                    )}
                  </div>
                ) : (
                  <div key={m.id} className="space-y-2">
                    <div className="flex gap-2">
                      <AiMark className="mt-0.5 h-4 w-4 shrink-0 text-brand-forest" />
                      <p className="text-[12.5px] leading-relaxed text-brand-ink">{m.text}</p>
                    </div>

                    {m.metric && (
                      <div className="ml-6 flex items-center justify-between gap-2 rounded-2xl border border-brand-line2 bg-card p-2.5">
                        <div>
                          <p className="text-[8.5px] font-bold uppercase tracking-[0.08em] text-brand-subtle">
                            {m.metric.title}
                          </p>
                          <p className="tnum text-[15px] font-extrabold leading-tight text-brand-ink">
                            {m.metric.value}{" "}
                            <span className="text-[9px] font-medium text-brand-subtle">{m.metric.unit}</span>
                          </p>
                          <span className="mt-0.5 inline-block rounded-full bg-brand-lime px-1.5 py-0.5 text-[8.5px] font-bold text-brand-carbon">
                            {m.metric.delta}
                          </span>
                        </div>
                        <Sparkline values={m.metric.series} className="h-10 w-[104px] shrink-0" height={40} width={104} />
                      </div>
                    )}

                    {m.sources && (
                      <div className="ml-6 flex flex-wrap gap-1">
                        {m.sources.map((s) => (
                          <span key={s} className="rounded-full bg-muted px-2 py-0.5 text-[9.5px] text-brand-subtle">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}

                    {m.card && (
                      <div className="ml-6 rounded-2xl border border-brand-forest/15 bg-secondary p-3">
                        <div className="flex items-center justify-between">
                          <p className="flex items-center gap-1.5 text-[11.5px] font-bold text-brand-forest">
                            <CalendarClock className="h-3.5 w-3.5" /> Reschedule appointment
                          </p>
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[8.5px] font-bold uppercase tracking-[0.06em] ${
                              m.card.confirmed
                                ? "bg-brand-forest text-white"
                                : "bg-brand-lime text-brand-carbon"
                            }`}
                          >
                            {m.card.confirmed ? "Confirmed" : "Suggested"}
                          </span>
                        </div>

                        <dl className="mt-2 space-y-1 text-[10.5px]">
                          <div className="flex justify-between">
                            <dt className="text-brand-forest/70">Patient</dt>
                            <dd className="font-semibold text-brand-forest">{member.name}</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-brand-forest/70">From</dt>
                            <dd className="text-brand-forest line-through">Fri 12 Nov · 09:30</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-brand-forest/70">To</dt>
                            <dd className="font-semibold text-brand-forest">Mon 15 Nov · 16:00</dd>
                          </div>
                          <div className="flex justify-between">
                            <dt className="text-brand-forest/70">Clinician</dt>
                            <dd className="text-brand-forest">Dr. Elias Mensah · Mercy Grace</dd>
                          </div>
                        </dl>

                        <div className="mt-2 flex items-center justify-between rounded-xl bg-card/70 px-2 py-1.5">
                          <span className="text-[10px] text-brand-forest">SMS + app reminder, 2h before</span>
                          <Switch checked={remind} onCheckedChange={setRemind} className="scale-90" />
                        </div>

                        <button
                          type="button"
                          disabled={m.card.confirmed}
                          onClick={() => confirmCard(m.id)}
                          className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-brand-carbon py-2 text-[11px] font-semibold text-white disabled:opacity-45"
                        >
                          <Check className="h-3.5 w-3.5" /> Confirm &amp; send
                        </button>
                      </div>
                    )}

                    {m.actions && (
                      <div className="ml-6 flex flex-wrap gap-1.5">
                        <Link
                          to="/member/appointments"
                          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold text-brand-ink hover:border-brand-ink/25"
                        >
                          View appointment <ArrowRight className="h-2.5 w-2.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => {
                            setMessages((prev) =>
                              prev
                                .filter((msg) => !msg.actions)
                                .map((msg) => (msg.card ? { ...msg, card: { ...msg.card, confirmed: false } } : msg)),
                            );
                            toast("Reverted", { description: "The original slot is restored." });
                          }}
                          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold text-brand-ink hover:border-brand-ink/25"
                        >
                          <Undo2 className="h-2.5 w-2.5" /> Undo
                        </button>
                      </div>
                    )}
                  </div>
                ),
              )
            )}

            {thinking && (
              <div className="flex items-center gap-2 text-[11.5px] text-brand-subtle">
                <span className="flex h-4 items-center gap-[2px]" aria-hidden="true">
                  {[6, 12, 8, 14, 7, 11].map((h, i) => (
                    <span
                      key={i}
                      className="w-[2.5px] origin-center rounded-full bg-brand-carbon/60 animate-wave"
                      style={{ height: `${h}px`, animationDelay: `${i * 90}ms` }}
                    />
                  ))}
                </span>
                Reading your record…
              </div>
            )}
          </div>

          <div className="border-t border-border px-3 pb-3 pt-2.5">
            <div className="mb-2 flex flex-wrap gap-1.5">
              {suggestions.slice(0, 3).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => send(s)}
                  className="rounded-full bg-muted px-2.5 py-1 text-[10px] font-medium text-brand-subtle transition-colors hover:text-brand-ink"
                >
                  {s}
                </button>
              ))}
            </div>

            {attachments.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1.5">
                {attachments.map((a) => (
                  <span key={a.uri} className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-1 text-[10px] font-medium text-brand-forest">
                    <Paperclip className="h-2.5 w-2.5" /> {a.name}
                    <button
                      type="button"
                      aria-label={`Remove ${a.name}`}
                      onClick={() => setAttachments((prev) => prev.filter((x) => x.uri !== a.uri))}
                      className="text-brand-forest/60 hover:text-brand-forest"
                    >
                      <X className="h-2.5 w-2.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                send();
              }}
              className="flex items-end gap-1.5 rounded-2xl border border-border bg-card p-1.5 focus-within:border-brand-ink/25"
            >
              <input ref={fileRef} type="file" multiple className="hidden" onChange={handleFiles} />
              <button
                type="button"
                aria-label="Attach a file"
                disabled={uploading}
                onClick={() => fileRef.current?.click()}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-brand-subtle hover:bg-muted hover:text-brand-ink disabled:opacity-50"
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Paperclip className="h-3.5 w-3.5" />}
              </button>

              <textarea
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                placeholder="Ask anything or tell HealthOS what to do…"
                className="max-h-24 flex-1 resize-none bg-transparent px-0.5 py-1.5 text-[12.5px] outline-none placeholder:text-brand-subtle"
              />

              <button
                type="button"
                aria-label="Speak to HealthOS"
                onClick={() => setVoiceOpen(true)}
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-brand-subtle hover:bg-muted hover:text-brand-ink"
              >
                <Mic className="h-3.5 w-3.5" />
              </button>
              <button
                type="submit"
                aria-label="Send"
                className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-carbon text-brand-lime transition-opacity hover:opacity-90"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
            <p className="mt-1.5 px-1 text-[9px] text-brand-subtle">
              Demonstration only — no live model is connected. Attachments are stored privately.
            </p>
          </div>
        </SheetContent>
      </Sheet>

      <VoiceOverlay
        open={voiceOpen}
        onClose={() => setVoiceOpen(false)}
        onDone={(text) => {
          setVoiceOpen(false);
          send(text);
        }}
      />
    </>
  );
}