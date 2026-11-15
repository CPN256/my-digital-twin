import { useState } from "react";
import { Download, Share, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePWAInstall } from "@/hooks/usePWAInstall";

const InstallApp = ({ mobile = false }: { mobile?: boolean }) => {
  const { canInstall, isInstalled, install } = usePWAInstall();
  const [open, setOpen] = useState(false);
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  if (isInstalled) return null;

  const handleInstall = async () => {
    if (canInstall && await install()) return;
    setOpen(true);
  };

  return (
    <>
      <Button variant="secondary" size="sm" onClick={handleInstall} className={mobile ? "w-full justify-start gap-3" : "text-xs"}>
        <Download size={15} /> Install App
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm w-[calc(100%-2rem)] rounded-lg">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-3">
              <img src="/pwa-192x192.png" alt="" width={56} height={56} className="rounded-lg" />
              <Smartphone className="text-primary" size={24} />
            </div>
            <DialogTitle>Install CAT CPN</DialogTitle>
            <DialogDescription>Add CAT CPN to your home screen or desktop. An internet connection is required.</DialogDescription>
          </DialogHeader>
          {isIOS ? (
            <ol className="list-decimal pl-5 space-y-3 text-sm text-foreground">
              <li>Open CAT CPN in Safari.</li>
              <li>Tap <Share className="inline text-primary" size={16} /> Share, then Add to Home Screen.</li>
              <li>Tap Add.</li>
            </ol>
          ) : (
            <div className="space-y-3 text-sm text-foreground">
              <p>In Chrome or Edge, open the browser menu and choose Install CAT CPN, Install app, or Add to Home screen.</p>
              <p className="text-muted-foreground">On a Mac using Safari, choose File → Add to Dock. Installation options depend on your browser.</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default InstallApp;