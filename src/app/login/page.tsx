"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ─── Skittex Dark Pro Design Tokens ─────────────────────────────────────────
const t = {
  surface: "#121317",
  surfaceLow: "#1a1b20",
  surfaceContainer: "#1f1f24",
  surfaceHigh: "#292a2e",
  surfaceHighest: "#343439",
  surfaceLowest: "#0d0e12",
  onSurface: "#e3e2e7",
  onSurfaceVariant: "#e5bdbb",
  outline: "#ac8887",
  outlineVariant: "#5c3f3f",
  primary: "#ffb3b1",
  primaryContainer: "#d81e36",
  onPrimary: "#ffffff",
  secondary: "#c6c6c9",
  background: "#121317",
};

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passFocused, setPassFocused] = useState(false);

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("error") === "unauthorized") {
        supabase.auth.signOut().then(() => {
          alert("Unauthorized user: Access is strictly denied.");
          router.replace("/login");
        });
      }
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsSubmitting(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      setIsSubmitting(false);
      return;
    }

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || user.email?.toLowerCase() !== "indrajithgamedevelouper2021@gmail.com") {
      await supabase.auth.signOut();
      alert("Unauthorized access");
      setIsSubmitting(false);
      return;
    }

    router.push("/");
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "https://billings.skittex.in"
      }
    });
  };

  // ─── Shared input-wrapper style ─────────────────────────────────────────
  const inputWrapper = (focused: boolean): React.CSSProperties => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 16px",
    borderRadius: "8px",
    border: `1.5px solid ${focused ? t.primaryContainer : t.outlineVariant}`,
    background: focused ? t.surfaceLow : t.surfaceLowest,
    boxShadow: focused ? `0 0 0 3px rgba(216, 30, 54, 0.20)` : "none",
    transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  });

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: "14px 0",
    border: "none",
    background: "transparent",
    outline: "none",
    fontFamily: "'Hanken Grotesk', sans-serif",
    fontSize: "16px",
    lineHeight: "24px",
    color: t.onSurface,
  };

  const iconStyle: React.CSSProperties = {
    fontFamily: "'Material Symbols Outlined'",
    fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24",
    fontSize: "20px",
    color: t.outline,
    userSelect: "none",
    flexShrink: 0,
  };

  return (
    <>
      {/* ── Fonts ─────────────────────────────────────────────────────── */}
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Hanken+Grotesk:wght@400;500;600&family=Geist:wght@400;500;600&display=swap"
        rel="stylesheet"
      />

      {/* ── Page Shell ────────────────────────────────────────────────── */}
      <div
        style={{
          minHeight: "100vh",
          width: "100%",
          background: t.background,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 16px",
          boxSizing: "border-box",
          position: "relative",
          overflowX: "hidden",
        }}
      >
        {/* Subtle ambient glow — dark mode version */}
        <div style={{
          position: "fixed",
          top: "-20%",
          right: "-10%",
          width: "500px",
          height: "500px",
          background: "radial-gradient(circle, rgba(216,30,54,0.10) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
          borderRadius: "9999px",
        }} />
        <div style={{
          position: "fixed",
          bottom: "-20%",
          left: "-10%",
          width: "400px",
          height: "400px",
          background: "radial-gradient(circle, rgba(216,30,54,0.07) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
          borderRadius: "9999px",
        }} />

        {/* ── Content wrapper ─────────────────────────────────────────── */}
        <div
          style={{
            width: "100%",
            maxWidth: "480px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          {/* ── Logo ────────────────────────────────────────────────── */}
          <div style={{ marginBottom: "32px", textAlign: "center" }}>
            <img
              alt="Skittex Studio"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuChKJE2-GXQBRNUMfpGyDxfDj3C-r-j9Pm88ZR4KZrDG4C67ucPxTD9I7hg5NKLLyBZB_ld5863emL8SMrLz0OwV_1PZEZyZlzlZMgZOx1FYqq8nhcq3UTBuobopO5EnKIu7U47XsfeJJcJSEs0DN_2_Ydb8uJr3xL-oEjv2UNgB4yay3TpOns1rO8-ouSh7xg3mJoTiCJUkdUwwuUAJMoT9YhTjJNvjd6cqBIrOojgvpLLIS-OtHHIsPjAENxfV-5Jwg_1kzoVByQ"
              style={{
                height: "72px",
                width: "auto",
                objectFit: "contain",
                filter: "drop-shadow(0 6px 20px rgba(216,30,54,0.25))",
              }}
            />
          </div>

          {/* ── Welcome text ────────────────────────────────────────── */}
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <h1
              style={{
                fontFamily: "'Sora', sans-serif",
                fontSize: "clamp(26px, 5vw, 32px)",
                fontWeight: 600,
                lineHeight: "40px",
                color: t.onSurface,
                letterSpacing: "-0.01em",
                margin: "0 0 10px",
              }}
            >
              Welcome back to
              <br />
              <span style={{ color: t.primaryContainer }}>Skittex Studio</span>
            </h1>
            <p
              style={{
                fontFamily: "'Hanken Grotesk', sans-serif",
                fontSize: "16px",
                lineHeight: "24px",
                color: t.secondary,
                margin: 0,
              }}
            >
              Login to access your creative workspace.
            </p>
          </div>

          {/* ── Login Card ──────────────────────────────────────────── */}
          <div
            style={{
              width: "100%",
              background: t.surfaceContainer,
              borderRadius: "16px",
              padding: "clamp(24px, 5vw, 40px)",
              boxSizing: "border-box",
              boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 16px 48px -8px rgba(0,0,0,0.5), 0 4px 20px rgba(216,30,54,0.08)",
            }}
          >
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

              {/* Email */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <label
                  htmlFor="email"
                  style={{
                    fontFamily: "'Geist', sans-serif",
                    fontSize: "12px",
                    fontWeight: 600,
                    lineHeight: "16px",
                    letterSpacing: "0.01em",
                    textTransform: "uppercase",
                    color: t.secondary,
                  }}
                >
                  Email Address
                </label>
                <div style={inputWrapper(emailFocused)}>
                  <span style={iconStyle}>alternate_email</span>
                  <input
                    id="email"
                    type="email"
                    required
                    placeholder="name@agency.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Password */}
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label
                    htmlFor="password"
                    style={{
                      fontFamily: "'Geist', sans-serif",
                      fontSize: "12px",
                      fontWeight: 600,
                      lineHeight: "16px",
                      letterSpacing: "0.01em",
                      textTransform: "uppercase",
                      color: t.secondary,
                    }}
                  >
                    Password
                  </label>
                  <a
                    href="#"
                    style={{
                      fontFamily: "'Geist', sans-serif",
                      fontSize: "13px",
                      fontWeight: 600,
                      color: t.primaryContainer,
                      textDecoration: "none",
                      letterSpacing: "0.02em",
                    }}
                  >
                    Forgot?
                  </a>
                </div>
                <div style={inputWrapper(passFocused)}>
                  <span style={iconStyle}>lock</span>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPassFocused(true)}
                    onBlur={() => setPassFocused(false)}
                    style={inputStyle}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "4px",
                      display: "flex",
                      alignItems: "center",
                      color: t.outline,
                      flexShrink: 0,
                    }}
                  >
                    <span style={iconStyle}>
                      {showPassword ? "visibility_off" : "visibility"}
                    </span>
                  </button>
                </div>
              </div>

              {/* Sign In Button */}
              <button
                type="submit"
                style={{
                  width: "100%",
                  padding: "16px",
                  marginTop: "4px",
                  background: t.primaryContainer,
                  color: t.onPrimary,
                  border: "none",
                  borderRadius: "8px",
                  fontFamily: "'Geist', sans-serif",
                  fontSize: "14px",
                  fontWeight: 500,
                  lineHeight: "20px",
                  letterSpacing: "0.01em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  boxShadow: "0 4px 20px rgba(216,30,54,0.25)",
                  transition: "all 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.filter = "brightness(1.15)";
                  (e.target as HTMLButtonElement).style.transform = "translateY(-1px)";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.filter = "none";
                  (e.target as HTMLButtonElement).style.transform = "translateY(0)";
                }}
              >
                Sign In
              </button>
            </form>

            {/* Divider */}
            <div
              style={{
                position: "relative",
                margin: "28px 0",
                textAlign: "center",
                display: "flex",
                alignItems: "center",
                gap: "16px",
              }}
            >
              <div style={{ flex: 1, height: "1px", background: t.outlineVariant }} />
              <span
                style={{
                  fontFamily: "'Geist', sans-serif",
                  fontSize: "11px",
                  fontWeight: 500,
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: t.outline,
                  whiteSpace: "nowrap",
                }}
              >
                Or continue with
              </span>
              <div style={{ flex: 1, height: "1px", background: t.outlineVariant }} />
            </div>

            {/* Google Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                padding: "14px",
                background: t.surfaceLow,
                border: `1.5px solid ${t.outlineVariant}`,
                borderRadius: "8px",
                fontFamily: "'Geist', sans-serif",
                fontSize: "14px",
                fontWeight: 500,
                lineHeight: "20px",
                color: t.onSurface,
                cursor: "pointer",
                letterSpacing: "0.01em",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.surfaceHigh;
                (e.currentTarget as HTMLButtonElement).style.borderColor = t.outline;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.background = t.surfaceLow;
                (e.currentTarget as HTMLButtonElement).style.borderColor = t.outlineVariant;
              }}
            >
              <svg fill="none" height="20" viewBox="0 0 24 24" width="20">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
          </div>

          {/* Footer note */}
          <p
            style={{
              marginTop: "32px",
              fontFamily: "'Hanken Grotesk', sans-serif",
              fontSize: "13px",
              color: t.outline,
              textAlign: "center",
            }}
          >
            © {new Date().getFullYear()} Skittex Studio. All rights reserved.
          </p>
        </div>

        {/* ── Success Overlay ──────────────────────────────────────────── */}
        {isSubmitting && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(18,19,23,0.94)",
              backdropFilter: "blur(16px)",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              animation: "fadeIn 0.3s ease",
            }}
          >
            <div
              style={{
                textAlign: "center",
                padding: "48px",
                background: t.surfaceContainer,
                borderRadius: "9999px",
                boxShadow: "0 0 0 1px rgba(255,255,255,0.06), 0 24px 80px rgba(0,0,0,0.6), 0 0 40px rgba(216,30,54,0.12)",
                width: "300px",
                height: "300px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontFamily: "'Material Symbols Outlined'",
                  fontVariationSettings: "'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48",
                  fontSize: "72px",
                  color: t.primaryContainer,
                  display: "block",
                  lineHeight: 1,
                  marginBottom: "8px",
                }}
              >
                check_circle
              </span>
              <h2
                style={{
                  fontFamily: "'Sora', sans-serif",
                  fontSize: "24px",
                  fontWeight: 600,
                  color: t.onSurface,
                  margin: 0,
                }}
              >
                Authenticated
              </h2>
              <p
                style={{
                  fontFamily: "'Hanken Grotesk', sans-serif",
                  fontSize: "14px",
                  color: t.secondary,
                  margin: 0,
                }}
              >
                Entering studio space...
              </p>
            </div>
          </div>
        )}

        <style dangerouslySetInnerHTML={{
          __html: `
          @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
          input::placeholder { color: #5c3f3f !important; opacity: 0.6; }
          input::-webkit-input-placeholder { color: #5c3f3f !important; opacity: 0.6; }
          input:-ms-input-placeholder { color: #5c3f3f !important; opacity: 0.6; }
        ` }} />
      </div>
    </>
  );
}
