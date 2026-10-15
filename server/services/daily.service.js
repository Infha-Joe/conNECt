const DAILY_API_BASE = "https://api.daily.co/v1";

export const getOrCreateWorkspaceRoom = async (workspaceId) => {
  if (!process.env.DAILY_API_KEY) {
    throw new Error(
      "Video classes are not configured — add DAILY_API_KEY to server/.env (see dashboard.daily.co)"
    );
  }

  const roomName = `connect-ws-${workspaceId}`;
  const headers = {
    Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
    "Content-Type": "application/json",
  };

  const existing = await fetch(`${DAILY_API_BASE}/rooms/${roomName}`, { headers });
  if (existing.ok) {
    const room = await existing.json();
    return room.url;
  }

  const created = await fetch(`${DAILY_API_BASE}/rooms`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: roomName,
      privacy: "private",
      properties: {
        enable_chat: true,
        enable_screenshare: true,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
      },
    }),
  });

  if (!created.ok) {
    const err = await created.text();
    throw new Error(`Failed to create video room: ${err}`);
  }

  const room = await created.json();
  return room.url;
};
