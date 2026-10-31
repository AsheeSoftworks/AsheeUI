/**
 * The studio editor.
 *
 * This is the one page that is web-only in the app — a device has no editor — and it is
 * also the proof that the umbrella carries Puck: the editor writes the document, and the
 * shared `StudioScreen` renders it with the same package on the other platform.
 */
import { Puck, type Data } from "@puckeditor/core";
import { asheePuckConfig } from "@asheeui/puck";
import { studioPage } from "@asheeui/fitness-shared";
import { Button, HStack, LoadingState, Typography, useToast } from "asheeui";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

const STORAGE_KEY = "pulse.studio.page";

/** Read the page the editor last published, if there is one. */
export function readStudioPage(): Data | undefined {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Data) : undefined;
  } catch {
    return undefined;
  }
}

/** The editor page. */
export function StudioEditorPage() {
  const navigate = useNavigate();
  const toast = useToast();
  const [mounted, setMounted] = useState(false);
  const [data, setData] = useState<Data>(() => (studioPage as unknown as Data));

  useEffect(() => {
    setMounted(true);
    const stored = readStudioPage();
    if (stored) setData(stored);
  }, []);

  if (!mounted) {
    return <LoadingState label="Opening the studio" />;
  }

  return (
    <div className="flex h-[calc(100dvh-9rem)] min-h-[40rem] flex-col gap-3">
      <HStack justify="between" align="center" gap="md" wrap>
        <HStack gap="sm" align="center">
          <Button size="sm" variant="ghost" onPress={() => navigate({ to: "/studio" })}>
            ← Back to the studio
          </Button>
          <Typography role="body-sm" tone="muted">
            Drag blocks, edit their fields, then publish. The device renders the same document.
          </Typography>
        </HStack>
        <Button
          size="sm"
          variant="bordered"
          onPress={() => {
            window.localStorage.removeItem(STORAGE_KEY);
            setData(studioPage as unknown as Data);
            toast.info("Studio page reset");
          }}
        >
          Reset
        </Button>
      </HStack>
      <div className="min-h-0 flex-1 rounded-xl border border-border">
        <Puck
          config={asheePuckConfig}
          data={data}
          onPublish={(next) => {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
            setData(next as unknown as Data);
            toast.success("Studio page published");
          }}
        />
      </div>
    </div>
  );
}
