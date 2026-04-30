import Chat from "@/components/Chat";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <main className="flex flex-1 flex-col items-center px-4 py-12">
        <Chat />
      </main>
    </div>
  );
}
