
import React from 'react';
import { formatStatusText } from './utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type ModerationActionType = 'approve' | 'remove';

interface ModerationConfirmDialogProps {
  isOpen: boolean;
  actionType: ModerationActionType | null;
  itemSnippet: string | null;
  isProcessing: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ModerationConfirmDialog: React.FC<ModerationConfirmDialogProps> = ({
  isOpen,
  actionType,
  itemSnippet,
  isProcessing,
  onClose,
  onConfirm
}) => {
  if (!actionType || !isOpen) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Action: {formatStatusText(actionType)}</AlertDialogTitle>
          <AlertDialogDescription>
            {actionType === 'approve' && (
              `Are you sure you want to approve this content (dismiss the flag)? The content snippet starts: "${itemSnippet?.substring(0, 50)}..."`
            )}
            {actionType === 'remove' && (
              <span className="text-red-600 font-semibold">
                Are you sure you want to remove this content permanently? This cannot be undone.
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isProcessing}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isProcessing}
            className={actionType === 'remove' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'}
          >
            {isProcessing ? 'Processing...' : `Confirm ${formatStatusText(actionType)}`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModerationConfirmDialog;
