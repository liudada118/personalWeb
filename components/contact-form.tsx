"use client";

import { useState } from "react";

import { withBasePath } from "@/lib/site-paths";

type ContactFormProps = {
  reasons: string[];
};

type FormState = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
};

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  reason: "",
  message: "",
};

export function ContactForm({ reasons }: ContactFormProps) {
  const [form, setForm] = useState<FormState>({
    ...initialState,
    reason: reasons[0] ?? "",
  });
  const [status, setStatus] = useState<{ type: "idle" | "success" | "error"; message: string }>({
    type: "idle",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setStatus({ type: "idle", message: "" });

    try {
      const response = await fetch(withBasePath("/api/contact"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: `${form.firstName} ${form.lastName}`.trim(),
          organization: "",
          email: form.email,
          phone: form.phone,
          reason: form.reason,
          message: form.message,
        }),
      });

      const data = (await response.json()) as { ok: boolean; message: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "Submission failed.");
      }

      setForm({
        ...initialState,
        reason: reasons[0] ?? "",
      });
      setStatus({ type: "success", message: data.message });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Submission failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="contact-form sidney-contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>First name</span>
          <input
            autoComplete="given-name"
            onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
            required
            type="text"
            value={form.firstName}
          />
        </label>
        <label>
          <span>Last name</span>
          <input
            autoComplete="family-name"
            onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
            required
            type="text"
            value={form.lastName}
          />
        </label>
        <label>
          <span>Email</span>
          <input
            autoComplete="email"
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
            type="email"
            value={form.email}
          />
        </label>
        <label>
          <span>Phone</span>
          <input
            autoComplete="tel"
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            type="tel"
            value={form.phone}
          />
        </label>
      </div>
      <label>
        <span>Enquiry type</span>
        <select
          onChange={(event) => setForm((current) => ({ ...current, reason: event.target.value }))}
          value={form.reason}
        >
          {reasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
      </label>
      <label>
        <span>Message</span>
        <textarea
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          placeholder="Tell us a bit about your event, team or question."
          required
          rows={6}
          value={form.message}
        />
      </label>
      <button className="button-primary" disabled={submitting} type="submit">
        {submitting ? "Sending..." : "Send message"}
      </button>
      {status.message ? <p className={`form-status ${status.type}`}>{status.message}</p> : null}
    </form>
  );
}
