"use client";

import { useActionState } from "react";
import { createContact } from "@/lib/actions";
import Button from "@/components/ui/Button";

export default function ContactForm() {
  const [state, formAction, pending] = useActionState(createContact, {
    success: false,
    message: "",
  });

  return (
    <div className="mx-auto w-full max-w-xl rounded-xl bg-white p-6 shadow-sm sm:p-8">
      {state.success ? (
        <div
          className="rounded-lg bg-sage/10 p-6 text-center"
          role="alert"
        >
          <svg
            width="48"
            height="48"
            viewBox="0 0 48 48"
            fill="none"
            className="mx-auto mb-4 text-sage"
            aria-hidden="true"
          >
            <circle cx="24" cy="24" r="22" stroke="currentColor" strokeWidth="2" />
            <path
              d="M16 24L22 30L32 18"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <p className="text-lg font-medium text-olive">{state.message}</p>
        </div>
      ) : (
        <form action={formAction} noValidate>
          <div className="space-y-5">
            {/* Nome */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-brown"
              >
                Nome <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                aria-required="true"
                aria-invalid={!!state.errors?.name}
                aria-describedby={state.errors?.name ? "name-error" : undefined}
                className={`w-full rounded-lg border bg-cream px-4 py-3 text-brown placeholder:text-brown-light/60 focus:outline-none focus:ring-2 focus:ring-sage ${
                  state.errors?.name ? "border-red-400" : "border-sage/30"
                }`}
                placeholder="Il tuo nome"
              />
              {state.errors?.name && (
                <p id="name-error" className="mt-1 text-sm text-red-500" role="alert">
                  {state.errors.name}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-brown"
              >
                Email <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                aria-required="true"
                aria-invalid={!!state.errors?.email}
                aria-describedby={state.errors?.email ? "email-error" : undefined}
                className={`w-full rounded-lg border bg-cream px-4 py-3 text-brown placeholder:text-brown-light/60 focus:outline-none focus:ring-2 focus:ring-sage ${
                  state.errors?.email ? "border-red-400" : "border-sage/30"
                }`}
                placeholder="La tua email"
              />
              {state.errors?.email && (
                <p id="email-error" className="mt-1 text-sm text-red-500" role="alert">
                  {state.errors.email}
                </p>
              )}
            </div>

            {/* Messaggio */}
            <div>
              <label
                htmlFor="message"
                className="mb-1.5 block text-sm font-medium text-brown"
              >
                Messaggio <span className="text-red-500" aria-hidden="true">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={5}
                aria-required="true"
                aria-invalid={!!state.errors?.message}
                aria-describedby={
                  state.errors?.message ? "message-error" : undefined
                }
                className={`w-full resize-y rounded-lg border bg-cream px-4 py-3 text-brown placeholder:text-brown-light/60 focus:outline-none focus:ring-2 focus:ring-sage ${
                  state.errors?.message ? "border-red-400" : "border-sage/30"
                }`}
                placeholder="Scrivi il tuo messaggio..."
              />
              {state.errors?.message && (
                <p
                  id="message-error"
                  className="mt-1 text-sm text-red-500"
                  role="alert"
                >
                  {state.errors.message}
                </p>
              )}
            </div>
          </div>

          {/* Messaggio di errore generale */}
          {state.message && !state.success && (
            <div
              className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600"
              role="alert"
            >
              {state.message}
            </div>
          )}

          {/* Submit */}
          <div className="mt-6">
            <Button
              type="submit"
              variant="primary"
              disabled={pending}
              className="w-full"
              ariaLabel={pending ? "Invio in corso..." : "Invia messaggio"}
            >
              {pending ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Invio in corso...
                </span>
              ) : (
                "Invia messaggio"
              )}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
