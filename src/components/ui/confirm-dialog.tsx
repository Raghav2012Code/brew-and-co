import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

/**
 * A confirmation gate for destructive, irreversible actions.
 *
 * Built on `@radix-ui/react-dialog` rather than a separate AlertDialog
 * package: the only real differences are the `alertdialog` role and
 * refusing to dismiss on an outside click, both of which are two props
 * here. That is not worth a new dependency.
 *
 * Escape and the cancel button both dismiss, which is safe — declining is
 * never the destructive path. Clicking the scrim deliberately does *not*
 * dismiss: a gate you can brush out of by clicking next to it is not a
 * gate.
 *
 * Pass `confirmPhrase` for actions that cannot be undone. The confirm
 * button stays disabled until the user types that phrase exactly, which is
 * the standard defence against a destructive click landing on the wrong
 * row. Omit it for actions that are merely annoying to redo.
 */
type ConfirmDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  /** What will happen, in the user's terms. Not a restatement of the title. */
  description: React.ReactNode
  confirmLabel: string
  cancelLabel?: string
  /** When set, the user must type this exactly to enable the confirm button. */
  confirmPhrase?: string
  onConfirm: () => void
}

const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancel",
  confirmPhrase,
  onConfirm,
}: ConfirmDialogProps) => {
  const [typed, setTyped] = React.useState("")

  // Never leave a half-typed phrase armed when the dialog is reopened.
  React.useEffect(() => {
    if (!open) setTyped("")
  }, [open])

  const phraseSatisfied = !confirmPhrase || typed.trim() === confirmPhrase

  const handleConfirm = () => {
    if (!phraseSatisfied) return
    onConfirm()
    onOpenChange(false)
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="anim-overlay-in fixed inset-0 z-50 bg-ink/70 backdrop-blur-sm" />
        <DialogPrimitive.Content
          // Radix renders role="dialog" by default. A confirmation is not a
          // dialog — it is an interruption that must be answered — so it
          // takes the assertive role screen readers announce differently.
          role="alertdialog"
          className={cn(
            // `anim-panel-in`, not `anim-panel`. The data-state variants hinge
            // unmounting on the closed-state animation firing `animationend`,
            // and Radix's Presence does not reliably observe that for a dialog
            // nested inside another one — it held the node in the DOM forever
            // with `pointer-events: auto`, silently eating every click behind
            // it. The unconditioned class always has a finite animation
            // running, so the exit can never hang. A confirmation gate gaining
            // or losing 150ms of slide is not worth an invisible click sink.
            "anim-panel-in fixed left-[50%] top-[50%] z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 border border-hairline bg-paper p-6 shadow-2xl dark:border-dark-hairline dark:bg-dark-subtle"
          )}
          // Keep the gate a gate: a stray click beside the panel must not
          // dismiss it. Escape is handled above, deliberately.
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="flex items-start gap-3">
            <span
              className="shrink-0 mt-0.5 flex h-8 w-8 items-center justify-center bg-vermillion/10 text-vermillion dark:bg-dark-vermillion/15 dark:text-dark-vermillion"
              aria-hidden="true"
            >
              <AlertTriangle className="h-4 w-4" />
            </span>
            <div className="min-w-0 flex-1">
              <DialogPrimitive.Title className="font-serif text-lg font-bold text-ink dark:text-dark-text-main">
                {title}
              </DialogPrimitive.Title>
              <DialogPrimitive.Description asChild>
                <div className="mt-1.5 text-xs leading-relaxed text-ink-muted dark:text-dark-text-muted">
                  {description}
                </div>
              </DialogPrimitive.Description>
            </div>
          </div>

          {confirmPhrase && (
            <div className="mt-5">
              <label
                htmlFor="confirm-dialog-phrase"
                className="block text-xs font-mono text-ink-muted dark:text-dark-text-muted"
              >
                Type <span className="font-bold text-ink dark:text-dark-text-main">{confirmPhrase}</span> to confirm
              </label>
              <input
                id="confirm-dialog-phrase"
                value={typed}
                onChange={(e) => setTyped(e.target.value)}
                autoComplete="off"
                spellCheck={false}
                className="mt-1.5 w-full border border-hairline bg-surface px-3 py-2 font-mono text-sm text-ink placeholder:text-ink-faint dark:border-dark-hairline dark:bg-dark-card dark:text-dark-text-main dark:placeholder:text-dark-text-faint"
              />
            </div>
          )}

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-hairline pt-4 sm:flex-row sm:justify-end dark:border-dark-hairline">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              {cancelLabel}
            </Button>
            <Button variant="destructive" onClick={handleConfirm} disabled={!phraseSatisfied}>
              {confirmLabel}
            </Button>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}

ConfirmDialog.displayName = "ConfirmDialog"

export { ConfirmDialog }
