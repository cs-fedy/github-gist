import Header from "@/components/layout/Header";
import { CreateGistForm } from "@/features/create-gist/CreateGistForm";

export default function CreateGistPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CreateGistForm />
    </div>
  );
}
