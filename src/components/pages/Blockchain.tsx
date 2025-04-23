import { Button } from "@/components/ui/button";

export const Blockchain = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Blockchain</h1>
      <div className="flex flex-col items-start gap-4">
        <Button variant="outline">
          Configure Blockchain
        </Button>
      </div>
    </div>
  );
}; 