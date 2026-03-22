export const onRequestPost: PagesFunction = async ({ request }) => {
  try {
    const data = await request.json();

    // minimal validation
    const name = String(data?.name ?? "").trim();
    const email = String(data?.email ?? "").trim();
    const team = String(data?.team ?? "").trim();
    const team_not_listed = String(data?.team_not_listed ?? "").trim();

    if (!name || !email || !team) {
      return new Response(JSON.stringify({ ok: false, error: "Missing required fields." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const APPS_SCRIPT_URL =
      "https://script.google.com/macros/s/AKfycbxiiap2ckA6EGiL1e8cdo3n_qwtMRGTjDUB5eRIny38iGaaZA69MQwGtfgxA9nTran55Q/exec";

    const res = await fetch(APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ name, email, team, team_not_listed }),
      redirect: "follow",
    });

    const text = await res.text();

    // return whatever apps script returned (usually JSON {ok:true})
    return new Response(text, {
      status: res.ok ? 200 : 502,
      headers: {
        "content-type": res.headers.get("content-type") || "application/json",
      },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
};
