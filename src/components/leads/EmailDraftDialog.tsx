import React, { useState } from "react";
import { Copy, Loader2, Sparkles, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useDraftLeadEmailMutation } from "@/store/api/leadsApi";
import { EmailDraft } from "@/store/api/types/audit";

interface EmailDraftDialogProps {
  leadId: string;
  businessName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const copy = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(`${label} copied`);
  } catch {
    toast.error("Copy failed");
  }
};

/** Generates an outreach email for a lead (AI when available, else template). */
export const EmailDraftDialog: React.FC<EmailDraftDialogProps> = ({
  leadId,
  businessName,
  open,
  onOpenChange,
}) => {
  const [senderName, setSenderName] = useState("");
  const [draft, setDraft] = useState<EmailDraft | null>(null);
  const [draftEmail, { isLoading }] = useDraftLeadEmailMutation();

  const generate = async () => {
    try {
      const res = await draftEmail({
        leadId,
        senderName: senderName.trim() || undefined,
      }).unwrap();
      setDraft(res.data);
    } catch (err: any) {
      const status = err?.status;
      if (status === 402) toast.error("Not enough credits to draft an email.");
      else if (status === 409) toast.error("Audit this lead before drafting an email.");
      else toast.error("Could not draft the email. Please try again.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            Outreach email — {businessName}
          </DialogTitle>
          <DialogDescription>
            Personalized from this lead's audit findings. Edit before sending.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="senderName">Your name / sign-off</Label>
            <Input
              id="senderName"
              placeholder="e.g. Alex from PixelCraft"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>

          {draft && (
            <>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="subject">Subject</Label>
                  <span className="text-[11px] text-muted-foreground">
                    {draft.source === "ai" ? "AI-generated" : "Template"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Input
                    id="subject"
                    value={draft.subject}
                    onChange={(e) =>
                      setDraft({ ...draft, subject: e.target.value })
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => copy(draft.subject, "Subject")}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="body">Body</Label>
                <Textarea
                  id="body"
                  value={draft.body}
                  rows={12}
                  onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                />
              </div>
            </>
          )}
        </div>

        <DialogFooter className="gap-2 sm:gap-2">
          {draft && (
            <Button
              variant="outline"
              onClick={() => copy(`${draft.subject}\n\n${draft.body}`, "Email")}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy all
            </Button>
          )}
          <Button onClick={generate} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : draft ? (
              <RefreshCw className="mr-2 h-4 w-4" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            {draft ? "Regenerate" : "Generate email"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
