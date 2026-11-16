import { useState } from 'react'

/*
  Contact form. When CONTACT_ENDPOINT is set (a Formspree-style URL that accepts
  JSON and answers with JSON), messages are posted there, which stores them and
  emails an alert. Until then, sending opens the visitor's mail app with the
  message filled in, so the form never silently drops a message.
*/
export const CONTACT_ENDPOINT = 'https://formspree.io/f/xljbjovv'
const EMAIL = 'rishikeshsarangi56@gmail.com'

const field = 'w-full rounded-xl border border-line bg-base/60 px-4 py-3 text-fg placeholder:text-faint focus:border-accent/60 focus:outline-none transition-colors duration-300'

export default function ContactForm() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [error, setError] = useState('')

  const onSubmit = async (e) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    if (data._gotcha) return // bots fill hidden fields
    delete data._gotcha

    if (!CONTACT_ENDPOINT) {
      const subject = encodeURIComponent(`Portfolio message from ${data.name}`)
      const body = encodeURIComponent(`${data.message}\n\n${data.name} · ${data.email}`)
      window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`
      setStatus('sent')
      return
    }

    setStatus('sending')
    setError('')
    try {
      const res = await fetch(CONTACT_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ ...data, _subject: `Portfolio message from ${data.name}` }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      form.reset()
      setStatus('sent')
    } catch {
      setStatus('error')
      setError(`That didn't go through. Please email me at ${EMAIL} instead.`)
    }
  }

  if (status === 'sent') {
    return (
      <div role="status" className="rounded-2xl border border-accent/30 bg-accent/5 p-6 text-left">
        <div className="text-fg font-medium">Thanks, your message is on its way.</div>
        <p className="mt-1 text-sm text-dim">I usually reply within a day or two.</p>
        <button type="button" onClick={() => setStatus('idle')} className="mt-4 text-sm text-faint hover:text-accent">Send another</button>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 text-left" aria-label="Contact form">
      <div className="grid sm:grid-cols-2 gap-3">
        <label className="grid gap-1.5">
          <span className="text-xs font-mono uppercase tracking-[0.14em] text-faint">Name</span>
          <input name="name" required autoComplete="name" className={field} placeholder="Your name" />
        </label>
        <label className="grid gap-1.5">
          <span className="text-xs font-mono uppercase tracking-[0.14em] text-faint">Email</span>
          <input name="email" type="email" required autoComplete="email" className={field} placeholder="you@company.com" />
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="text-xs font-mono uppercase tracking-[0.14em] text-faint">Message</span>
        <textarea name="message" required rows={4} maxLength={4000} className={field} placeholder="What are you hiring for, or what would you like to talk about?" />
      </label>
      <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={status === 'sending'} className="press inline-flex items-center gap-2 rounded-full bg-accent text-base px-6 py-3 text-sm font-semibold hover:bg-accent2 disabled:opacity-60">
          {status === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        {error && <p role="alert" className="text-sm text-rose-300">{error}</p>}
      </div>
    </form>
  )
}
