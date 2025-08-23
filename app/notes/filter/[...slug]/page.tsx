
import Notes from "../Notes.client";

interface Props {
  params: { slug?: string[] };
}

export default function NotesPage({ params }: Props) {
  const tag = params.slug?.[0] === "All" ? undefined : params.slug?.[0];
  return <Notes tag={tag} />;
}
