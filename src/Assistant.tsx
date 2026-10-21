import { useEffect, useRef, useState } from 'react';
import { Coderman } from './Coderman';
import './Assistant.css';

const stops = [
  ['work', 'The proof is in the projects.', 'Here’s what the studio has brought to life. Open a project to explore its desktop and mobile screens.'],
  ['services', 'Pick your starting point.', 'From a focused landing page to a custom app. These are indicative USD prices; Unreal, XR and AI work is scoped around your idea.'],
  ['approach', 'No mysterious black box.', 'We agree a scope, build with your feedback, and test before launch. You see your idea take shape.'],
  ['contact', 'Your idea. Our next mission.', 'Choose a service and describe your idea. The form opens your email app with a prepared brief. Nothing is sent until you send it.'],
] as const;
const answers = [
  ['What do you build?', 'Websites, booking platforms, custom apps and AI workflow tools. We also work on Unreal multiplayer, XR and virtual production. Tell me what you have in mind.'],
  ['What does it cost?', 'Indicative USD pricing: Presence $199–399; Bookings $499–799; Ops app $900–2,000; Care $200–500/month. Custom AI, Unreal and XR projects need a scoped estimate.'],
  ['How long does it take?', 'Presence: 3–7 days. Bookings: 7–14 days. Ops app: 14–28 days. These are indicative timelines; scope and feedback affect the final schedule.'],
] as const;
type Message = { role: 'user' | 'assistant'; content: string };
export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [tour, setTour] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: 'I’m Coderman, your AI guide. I bring the code powers; you bring the idea. Want to explore the studio or talk about something you’re building?' }]);
  const [draft, setDraft] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const launcher = useRef<HTMLButtonElement>(null);
  const input = useRef<HTMLInputElement>(null);
  const log = useRef<HTMLDivElement>(null);
  const controller = useRef<AbortController | null>(null);
  const tourHeading = useRef<HTMLHeadingElement>(null);
  function close() { setOpen(false); setTour(null); launcher.current?.focus(); }
  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => { if (open && tour === null) input.current?.focus(); }, [open, tour]);
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight }); }, [messages, busy, error, open]);
  useEffect(() => {
    if (tour === null) return;
    const element = document.getElementById(stops[tour][0]);
    element?.classList.add('guided-section');
    element?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
    tourHeading.current?.focus({ preventScroll: true });
    return () => element?.classList.remove('guided-section');
  }, [tour]);
  async function send() {
    if (!draft.trim() || busy) return;
    const next: Message[] = [...messages, { role: 'user', content: draft.trim() }];
    setMessages(next); setDraft(''); setBusy(true); setError('');
    controller.current = new AbortController();
    const timeout = setTimeout(() => controller.current?.abort(), 30000);
    try {
      const response = await fetch('/api/chat', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: next.slice(-10).map(m => ({ ...m, content: m.content.slice(0, 1200) })) }), signal: controller.current.signal });
      const data = await response.json();
      if (!response.ok || typeof data.reply !== 'string') throw new Error(data.error || 'Connection unavailable. Quick answers and tours still work.');
      setMessages(m => [...m, { role: 'assistant', content: data.reply }]);
    } catch (err) { setError(err instanceof Error && err.name !== 'AbortError' ? err.message : 'Connection timed out. Try again, or take the tour.'); }
    finally { clearTimeout(timeout); setBusy(false); }
  }
  return <aside className={'cm-assistant' + (open ? ' is-open' : '')} aria-label="Coderman assistant" onKeyDown={e => { if (e.key === 'Escape') close(); }}>
    {open && <section className="cm-panel" role="region" aria-label="Chat with Coderman">
      <header><div><span className="cm-signal" /> <strong>CODERMAN</strong><small>Your AI studio guide</small></div><button aria-label="Close Coderman" onClick={close}>×</button></header>
      {tour !== null ? <div className="cm-tour" aria-live="polite"><span className="eyebrow">STUDIO TOUR / 0{tour + 1}</span><h3 ref={tourHeading} tabIndex={-1}>{stops[tour][1]}</h3><p>{stops[tour][2]}</p><div className="cm-tour-controls"><button disabled={tour === 0} onClick={() => setTour(t => Math.max(0, t! - 1))}>Back</button><button onClick={() => tour === stops.length - 1 ? setTour(null) : setTour(t => t! + 1)}>{tour === stops.length - 1 ? 'Finish tour' : 'Next stop →'}</button></div><button className="cm-text-button" onClick={() => setTour(null)}>Return to chat</button></div> : <>
        <div ref={log} className="cm-messages" role="log" aria-label="Conversation" aria-live="polite">{messages.map((m, i) => <div key={i} className={'cm-message ' + m.role}><small>{m.role === 'assistant' ? 'CODERMAN' : 'YOU'}</small><p>{m.content}</p></div>)}{busy && <p className="cm-thinking">Connecting the dots…</p>}{error && <p role="alert" className="cm-error">{error}</p>}</div>
        <div className="cm-quick"><button onClick={() => setTour(0)}>Take a tour ↗</button>{answers.map(([q, a]) => <button key={q} disabled={busy} onClick={() => { setError(''); setMessages(m => [...m, { role: 'user', content: q }, { role: 'assistant', content: a }]); }}>{q}</button>)}</div>
        <form onSubmit={e => { e.preventDefault(); void send(); }}><label className="sr-only" htmlFor="coderman-question">Ask Coderman</label><input id="coderman-question" ref={input} value={draft} onChange={e => setDraft(e.target.value)} maxLength={1200} placeholder="Tell me about your idea…" autoComplete="off" /><button type="submit" disabled={busy || !draft.trim()} aria-label="Send message">↑</button></form>
        <p className="cm-disclosure">AI replies can be imperfect. Messages go to our AI provider. Please don’t share sensitive details. Quick answers are studio-written.</p>
      </>}
    </section>}
    <button ref={launcher} className="cm-launcher" aria-label={open ? 'Close Coderman assistant' : 'Talk to Coderman'} aria-expanded={open} onClick={() => open ? close() : setOpen(true)}><Coderman /><span>{open ? 'Close comms' : 'Ask Coderman'} <i>↗</i></span></button>
  </aside>;
}

