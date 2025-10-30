import { X } from "lucide-react";

interface SearchModalProps {
  onClose: () => void;
}

export const SearchModal = ({ onClose }: SearchModalProps) => {
  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-lg z-50 flex flex-col">
      <div className="flex items-center justify-between p-4 border-b border-border">
        <input
          type="text"
          placeholder="Search builds, shops, users..."
          className="flex-1 bg-transparent text-foreground placeholder:text-muted-foreground outline-none text-lg"
          autoFocus
        />
        <button onClick={onClose} className="ml-4 text-muted-foreground hover:text-foreground">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="flex-1 p-6">
        <p className="text-muted-foreground text-center mt-8">Start typing to search...</p>
      </div>
    </div>
  );
};
