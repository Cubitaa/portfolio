import { useRef, useState } from "react";
import { contactFormSchema, MIN_SUBMIT_SECONDS } from "@lib/contactSchema";

interface Copy {
  nameLabel: string;
  emailLabel: string;
  messageLabel: string;
  submitLabel: string;
  sendingLabel: string;
  successMessage: string;
  errorMessage: string;
  validationError: string;
}

interface Props {
  copy: Copy;
}

type Status = "idle" | "sending" | "success" | "error";

export default function ContactForm({ copy }: Props) {
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);
  const renderedAtRef = useRef(Date.now());

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldError(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      company: String(formData.get("company") ?? ""),
      renderedAt: renderedAtRef.current,
    };

    const parsed = contactFormSchema.safeParse(payload);
    if (!parsed.success) {
      setFieldError(copy.validationError);
      return;
    }

    // Honeypot: si el campo oculto viene relleno, es un bot — no enviamos nada
    if (parsed.data.company) {
      setStatus("success");
      form.reset();
      return;
    }

    // Envío demasiado rápido tras cargar el formulario => probablemente un bot
    const elapsedSeconds = (Date.now() - parsed.data.renderedAt) / 1000;
    if (elapsedSeconds < MIN_SUBMIT_SECONDS) {
      setStatus("success");
      form.reset();
      return;
    }

    setStatus("sending");
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: import.meta.env.PUBLIC_WEB3FORMS_ACCESS_KEY,
          subject: `Nuevo mensaje de ${parsed.data.name} desde el portafolio`,
          name: parsed.data.name,
          email: parsed.data.email,
          message: parsed.data.message,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message ?? "unknown");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="mt-8 flex w-full max-w-xl flex-col gap-5">
      {/* Honeypot — invisible para personas, visible para bots */}
      <input
        type="text"
        name="company"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="font-mono text-xs uppercase tracking-widest text-ink-secondary">
          {copy.nameLabel}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          minLength={2}
          maxLength={100}
          disabled={status === "sending"}
          className="rounded-lg border border-nebula-violet/25 bg-surface/40 px-4 py-3 text-sm text-ink-primary outline-none backdrop-blur-sm transition-colors focus:border-nebula-cyan/60 disabled:opacity-60"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="font-mono text-xs uppercase tracking-widest text-ink-secondary">
          {copy.emailLabel}
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          disabled={status === "sending"}
          className="rounded-lg border border-nebula-violet/25 bg-surface/40 px-4 py-3 text-sm text-ink-primary outline-none backdrop-blur-sm transition-colors focus:border-nebula-cyan/60 disabled:opacity-60"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="message" className="font-mono text-xs uppercase tracking-widest text-ink-secondary">
          {copy.messageLabel}
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          disabled={status === "sending"}
          className="resize-none rounded-lg border border-nebula-violet/25 bg-surface/40 px-4 py-3 text-sm text-ink-primary outline-none backdrop-blur-sm transition-colors focus:border-nebula-cyan/60 disabled:opacity-60"
        />
      </div>

      {fieldError && (
        <p role="alert" className="text-sm text-nebula-amber">
          {fieldError}
        </p>
      )}
      {status === "success" && (
        <p role="status" className="text-sm text-nebula-cyan">
          {copy.successMessage}
        </p>
      )}
      {status === "error" && (
        <p role="alert" className="text-sm text-nebula-amber">
          {copy.errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="group mt-2 flex w-fit items-center gap-3 rounded-full border border-nebula-violet/40 bg-surface/40 px-6 py-3 font-mono text-sm uppercase tracking-widest text-ink-primary backdrop-blur-md transition-all duration-300 hover:border-nebula-cyan/60 hover:bg-surface/60 focus-visible:outline-nebula-cyan disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "sending" ? copy.sendingLabel : copy.submitLabel}
        <span
          className={`inline-block h-2 w-2 rounded-full bg-nebula-cyan transition-transform duration-500 ${
            status === "sending" ? "animate-pulse" : "group-hover:scale-150"
          }`}
          aria-hidden="true"
        />
      </button>
    </form>
  );
}
