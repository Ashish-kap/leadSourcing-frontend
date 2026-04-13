import React, { useState } from "react";
import { MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeedbackModal } from "@/components/feedback/FeedbackModal";

/** Always-available feedback entry point for authenticated users. */
export const FeedbackFloatingButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <Button
        type="button"
        variant="default"
        size="icon"
        aria-label="Share feedback"
        title="Share feedback"
        className="fixed bottom-6 right-6 z-40 h-14 w-14 rounded-full shadow-lg cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <MessageSquare className="h-6 w-6" />
      </Button>
      <FeedbackModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onUpgrade={() => {
          navigate("/subscription");
          setOpen(false);
        }}
      />
    </>
  );
};
