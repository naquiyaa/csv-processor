import FileUpload from "@/components/FileUpload";
import QueueStatus from "@/components/QueueStatus";
import FileStatus from "@/components/FileStatus";
import CancelFile from "@/components/CancelFile";

export default function Home() {
  return (
    <div className="min-h-screen p-8 bg-gray-100">
      <h1 className="text-3xl font-bold mb-4">File Processing Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2">
        <FileUpload />
        <QueueStatus />
        <FileStatus />
        <CancelFile />
      </div>
    </div>
  );
}
