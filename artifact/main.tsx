import { createRoot } from "react-dom/client";
import { Flow } from "@/components/flow/flow";

// Entry for the single-file preview published as a Claude artifact.
// Renders the exact same <Flow /> as app/page.tsx.
createRoot(document.getElementById("root")!).render(<Flow />);