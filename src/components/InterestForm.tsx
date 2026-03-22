import React, { useMemo, useState } from "react";

type Props = {
  endpointUrl: string;
  teams: string[];
};

export default function InterestForm({ endpointUrl, teams }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [team, setTeam] = useState("");
  const [teamNotListed, setTeamNotListed] = useState("");

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  const isNotListed = team === "Not listed";

  const teamOptions = useMemo(() => {
    // ensure Not listed exists as last option
    const cleaned = teams.map((t) => t.trim()).filter(Boolean);
    const withoutNotListed = cleaned.filter((t) => t !== "Not listed");
    return [...withoutNotListed.sort((a, b) => a.localeCompare(b)), "Not listed"];
  }, [teams]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMsg("");

    try {
      const payload = {
        name,
        email,
        team,
        team_not_listed: isNotListed ? teamNotListed : "",
      };

      const res = await fetch(endpointUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        redirect: "follow",
      });

      // Apps Script sometimes responds with 200 + JSON, sometimes text; we handle both.
      const text = await res.text();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`);

      let ok = false;
      try {
        const json = JSON.parse(text);
        ok = Boolean(json?.ok);
      } catch {
        // if not JSON, still accept success on 200
        ok = true;
      }

      if (!ok) throw new Error(text);

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMsg(err?.message ?? String(err));
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border bg-white p-6">
        <h2 className="text-xl font-semibold">Thanks!</h2>
        <p className="mt-2 text-slate-600">
          Your details were submitted. We’ll contact you with updates.
        </p>
        <button
          className="mt-6 rounded-lg border px-4 py-2 hover:bg-slate-50"
          onClick={() => {
            setName("");
            setEmail("");
            setTeam("");
            setTeamNotListed("");
            setStatus("idle");
          }}
          type="button"
        >
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-6 shadow-sm">
      <div className="grid gap-6">
        <div>
          <label className="text-sm font-medium">Full name *</label>
          <input
            className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-slate-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            autoComplete="name"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Email *</label>
          <input
            className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-slate-400"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="text-sm font-medium">iGEM Team *</label>
          <select
            className="mt-2 w-full rounded-lg border bg-white px-3 py-2 outline-none focus:border-slate-400"
            value={team}
            onChange={(e) => setTeam(e.target.value)}
            required
          >
            <option value="" disabled>
              Select a team…
            </option>
            {teamOptions.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {isNotListed && (
          <div>
            <label className="text-sm font-medium">Your team/university (not listed) *</label>
            <input
              className="mt-2 w-full rounded-lg border px-3 py-2 outline-none focus:border-slate-400"
              value={teamNotListed}
              onChange={(e) => setTeamNotListed(e.target.value)}
              required
            />
          </div>
        )}

        {status === "error" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-800">
            <div className="font-medium">Submission failed</div>
            <div className="mt-1 break-words">{errorMsg}</div>
          </div>
        )}

        <button
          className="rounded-lg bg-black px-5 py-3 text-white hover:bg-slate-800 disabled:opacity-60"
          type="submit"
          disabled={status === "submitting"}
        >
          {status === "submitting" ? "Submitting…" : "Submit interest"}
        </button>

        <p className="text-xs text-slate-500">
          By submitting, you agree that we store your details to contact you about this event.
        </p>
      </div>
    </form>
  );
}
