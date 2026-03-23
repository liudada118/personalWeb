"use client";

import { useState } from "react";

import { withBasePath } from "@/lib/site-paths";

type ContactFormProps = {
  reasons: string[];
};

type FormState = {
  name: string;
  organization: string;
  email: string;
  phone: string;
  reason: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  organization: "",
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
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as { ok: boolean; message: string };

      if (!response.ok || !data.ok) {
        throw new Error(data.message || "提交失败");
      }

      setForm({
        ...initialState,
        reason: reasons[0] ?? "",
      });
      setStatus({ type: "success", message: data.message });
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "提交失败，请稍后再试。",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label>
          <span>姓名</span>
          <input
            onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
            required
            type="text"
            value={form.name}
          />
        </label>
        <label>
          <span>机构</span>
          <input
            onChange={(event) => setForm((current) => ({ ...current, organization: event.target.value }))}
            type="text"
            value={form.organization}
          />
        </label>
        <label>
          <span>邮箱</span>
          <input
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            required
            type="email"
            value={form.email}
          />
        </label>
        <label>
          <span>电话</span>
          <input
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            type="tel"
            value={form.phone}
          />
        </label>
      </div>
      <label>
        <span>来意</span>
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
        <span>详细说明</span>
        <textarea
          onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
          required
          rows={6}
          value={form.message}
        />
      </label>
      <button className="button-primary" disabled={submitting} type="submit">
        {submitting ? "提交中..." : "提交信息"}
      </button>
      {status.message ? <p className={`form-status ${status.type}`}>{status.message}</p> : null}
    </form>
  );
}
