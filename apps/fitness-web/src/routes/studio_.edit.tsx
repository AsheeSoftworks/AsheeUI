import { createFileRoute } from "@tanstack/react-router";
import { StudioEditorPage } from "../pages/StudioEditor";

export const Route = createFileRoute("/studio_/edit")({
  component: StudioEditorPage,
});
