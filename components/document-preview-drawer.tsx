'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { X, CheckCircle2, XCircle } from 'lucide-react';
import type { Document } from '@/lib/types';
import { useState } from 'react';

interface DocumentPreviewDrawerProps {
  document: Document | null;
  onClose: () => void;
  onApprove?: (documentId: string) => Promise<void>;
  onReject?: (documentId: string, reason: string) => Promise<void>;
  canApprove?: boolean;
}

export function DocumentPreviewDrawer({
  document,
  onClose,
  onApprove,
  onReject,
  canApprove = false,
}: DocumentPreviewDrawerProps) {
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!document) return null;

  const handleApprove = async () => {
    if (!onApprove) return;
    setIsSubmitting(true);
    try {
      await onApprove(document.id);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    if (!onReject || !rejectionReason.trim()) return;
    setIsSubmitting(true);
    try {
      await onReject(document.id, rejectionReason);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600';
      case 'rejected':
        return 'text-red-600';
      case 'pending':
        return 'text-yellow-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full max-w-2xl bg-background rounded-t-lg shadow-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {document.title}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Uploaded by {document.uploadedByName} on{' '}
              {document.createdAt.toString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Status */}
          <div className="flex items-center gap-2">
            {getStatusIcon(document.status)}
            <span
              className={`font-medium capitalize ${getStatusColor(
                document.status
              )}`}
            >
              {document.status}
            </span>
          </div>

          {/* Content Preview */}
          <Card className="border border-border">
            <CardHeader>
              <CardTitle className="text-lg">Document Content</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
                <p className="text-sm text-foreground whitespace-pre-wrap">
                  {document.content}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Rejection Reason (if rejected) */}
          {document.status === 'rejected' && document.rejectionReason && (
            <Card className="border border-destructive/50 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-lg text-destructive">
                  Rejection Reason
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground">
                  {document.rejectionReason}
                </p>
              </CardContent>
            </Card>
          )}

          {/* Approval Actions (Admin Only) */}
          {canApprove && document.status === 'pending' && (
            <div className="space-y-4">
              {!showRejectForm ? (
                <div className="flex gap-3">
                  <Button
                    className="flex-1 gap-2"
                    onClick={handleApprove}
                    disabled={isSubmitting}
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    Approve Document
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 gap-2 bg-transparent"
                    onClick={() => setShowRejectForm(true)}
                  >
                    <XCircle className="h-4 w-4" />
                    Reject Document
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 p-4 rounded-lg border border-border bg-muted/50">
                  <label className="text-sm font-medium text-foreground">
                    Rejection Reason
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Explain why this document is being rejected..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-input text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handleReject}
                      disabled={!rejectionReason.trim() || isSubmitting}
                    >
                      {isSubmitting ? 'Rejecting...' : 'Confirm Rejection'}
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 bg-transparent"
                      onClick={() => {
                        setShowRejectForm(false);
                        setRejectionReason('');
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
