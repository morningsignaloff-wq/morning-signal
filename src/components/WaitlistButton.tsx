"use client";

import { useEffect, useState } from "react";
import { useOptionalLanguage } from "@/lib/i18n/context";
import { getTranslations } from "@/lib/i18n";

interface WaitlistButtonProps {
  className?: string;
  label?: string;
}

export function WaitlistButton({
  className = "btn-marketing-outline w-full justify-center !rounded-xl",
  label,
}: WaitlistButtonProps) {
  const lang = useOptionalLanguage();
  const waitlist = lang?.t.waitlist ?? getTranslations("en").waitlist;

  const [joined, setJoined] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("asp_waitlist") === "true") {
      setJoined(true);
    }
  }, []);

  function handleJoin() {
    setLoading(true);
    localStorage.setItem("asp_waitlist", "true");
    setTimeout(() => {
      setJoined(true);
      setLoading(false);
    }, 400);
  }

  if (joined) {
    return (
      <p className="text-sm text-center text-violet-600 font-medium py-3">
        {waitlist.success}
      </p>
    );
  }

  return (
    <button
      onClick={handleJoin}
      disabled={loading}
      className={`${className} disabled:opacity-50`}
    >
      {loading ? waitlist.loading : (label ?? waitlist.cta)}
    </button>
  );
}
