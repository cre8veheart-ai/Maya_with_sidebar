"use client";

import { useState, useEffect } from "react";
import { getBetaStatus, needsSurvey } from "@/lib/beta/betaGate";
import type { BetaProfile } from "@/lib/beta/betaGate";
import BetaInviteGate from "./BetaInviteGate";
import BetaSurvey from "./BetaSurvey";

type GateState = "loading" | "gate" | "survey" | "ok";

export default function BetaGate({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GateState>("loading");

  useEffect(() => {
    if (getBetaStatus() !== "approved") {
      setState("gate");
    } else if (needsSurvey()) {
      setState("survey");
    } else {
      setState("ok");
    }
  }, []);

  function handleApproved(_profile: BetaProfile) {
    if (needsSurvey()) {
      setState("survey");
    } else {
      setState("ok");
    }
  }

  if (state === "loading") {
    return (
      <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center">
        <span className="text-[#585b70] text-[13px]">Loading MAYA…</span>
      </div>
    );
  }

  if (state === "gate") {
    return <BetaInviteGate onApproved={handleApproved} />;
  }

  if (state === "survey") {
    return <BetaSurvey onComplete={() => setState("ok")} />;
  }

  return <>{children}</>;
}
