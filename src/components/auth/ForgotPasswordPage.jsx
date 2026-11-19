import { Link } from "@tanstack/react-router";
import { KeyRound, Mail } from "lucide-react";
import { useState } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";
import { AuthError, SubmitButton } from "@/components/auth/parts";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { base44 } from "@/api/base44Client";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (base44?.auth?.requestPasswordReset) {
        await base44.auth.requestPasswordReset({ email });
      }
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Failed to request password reset");
    } finally {
      setBusy(false);
    }
  }

  if (submitted) {
    return (
      <AuthLayout
        icon={Mail}
        title="Check your email"
        subtitle="We've sent a password reset link to your email"
        footer={
          <Link to="/login" className="font-medium text-primary hover:underline">
            Back to login
          </Link>
        }
      >
        <p className="text-center text-sm text-muted-foreground">
          If an account exists for {email}, you will receive instructions on how to reset your password.
        </p>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      icon={KeyRound}
      title="Reset your password"
      subtitle="Enter your email to receive a reset link"
      footer={
        <Link to="/login" className="font-medium text-primary hover:underline">
          Back to login
        </Link>
      }
    >
      <AuthError>{error}</AuthError>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="forgot-email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-12 pl-10"
              required
            />
          </div>
        </div>
        <SubmitButton busy={busy} busyLabel="Sending...">
          Send reset link
        </SubmitButton>
      </form>
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
