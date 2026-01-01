import React, { useState, useMemo } from 'react';
import { Copy, Check, Gift } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/store/hooks/useAuth';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AffiliateCardProps {
  className?: string;
}

export const AffiliateCard: React.FC<AffiliateCardProps> = ({ className }) => {
  const { user } = useAuth();
  const [copiedLink, setCopiedLink] = useState(false);

  // Construct referral link
  const referralLink = useMemo(() => {
    if (!user?.user?.referralCode) return '';
    return `https://cazalead.com/?ref=${user.user.referralCode}`;
  }, [user?.user?.referralCode]);

  // Copy to clipboard function
  const copyToClipboard = async (text: string) => {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
      toast.success("Referral link copied!");
    } catch {
      toast.error("Failed to copy link");
    }
  };

  // Don't render if no referral code
  if (!referralLink) {
    return null;
  }

  return (
    <div className={cn("rounded-xl bg-card border border-border p-4 space-y-3 mb-4", className)}>
      {/* Header with icon */}
      <div className="flex items-start gap-2">
        <Gift className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-foreground text-base">
            Affiliate Program
          </h3>
          <p className="text-sm text-muted-foreground mt-1">
            Earn $20 for each paid customer you refer.
          </p>
        </div>
      </div>

      {/* Copy referral link button */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => copyToClipboard(referralLink)}
        className="w-full justify-center gap-2 text-sm cursor-pointer"
      >
        {copiedLink ? (
          <>
            <Check className="h-4 w-4 text-success" />
            Copied!
          </>
        ) : (
          <>
            <Copy className="h-4 w-4" />
            Copy referral link
          </>
        )}
      </Button>
    </div>
  );
};

