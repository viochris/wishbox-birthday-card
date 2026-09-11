import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, Copy } from 'lucide-react';
import { LetterContent } from '../types';
import { soundEngine } from '../utils/soundEngine';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  letterContent: LetterContent;
  onSave: (updated: Partial<LetterContent>) => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  letterContent,
  onSave
}) => {
  const [name, setName] = useState(letterContent.recipientName);
  const [signature, setSignature] = useState(letterContent.senderSignature);
  const [copied, setCopied] = useState(false);

  // Keep fields synchronized with current letterContent whenever opened
  useEffect(() => {
    if (isOpen) {
      setName(letterContent.recipientName);
      setSignature(letterContent.senderSignature);
      setCopied(false);
    }
  }, [isOpen, letterContent.recipientName, letterContent.senderSignature]);

  // Support pressing Escape to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    soundEngine.playButtonPop();
    onSave({
      recipientName: name.trim() || 'Alex',
      senderSignature: signature.trim() || 'With all my warmest wishes'
    });
    onClose();
  };

  const handleCopyLink = () => {
    soundEngine.playButtonPop();
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('to', name.trim() || 'Alex');
    url.searchParams.set('from', signature.trim() || 'With all my warmest wishes');

    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-xs"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.25 }}
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-pink-200"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-2 mb-1">
              <span className="p-2 rounded-xl bg-pink-100 text-pink-600">
                <Sparkles className="w-5 h-5" />
              </span>
              <h2 className="font-serif-title text-xl font-bold text-stone-900">
                Personalize Birthday Card
              </h2>
            </div>
            <p className="text-xs text-stone-500 mb-5 ml-1">
              Customize the card details for your friend, partner, or family member.
            </p>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label htmlFor="input-recipient-name" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Recipient&apos;s Name
                </label>
                <input
                  id="input-recipient-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex, Sarah, Mom, Jessica"
                  maxLength={40}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-sm transition-all"
                />
              </div>

              <div>
                <label htmlFor="input-sender-signature" className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                  Sender Signature / Closing
                </label>
                <input
                  id="input-sender-signature"
                  type="text"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                  placeholder="e.g. With lots of love & laughter, Sam"
                  maxLength={60}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:outline-none focus:ring-2 focus:ring-pink-400 focus:bg-white text-sm transition-all"
                />
              </div>

              {/* Quick Link Share Helper */}
              <div className="pt-2">
                <button
                  type="button"
                  id="btn-copy-personalized-link"
                  onClick={handleCopyLink}
                  className="w-full py-2.5 px-3 bg-amber-50 hover:bg-amber-100/80 text-amber-900 text-xs font-medium rounded-xl border border-amber-200 flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span className="text-emerald-700 font-semibold">Personalized Link Copied to Clipboard!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-amber-600" />
                      <span>Copy Shareable URL with these Names</span>
                    </>
                  )}
                </button>
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 text-stone-600 hover:bg-stone-100 text-sm font-medium rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  id="btn-save-personalize"
                  className="flex-1 py-2.5 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white text-sm font-semibold rounded-xl shadow-md transition-transform active:scale-95 cursor-pointer"
                >
                  Apply Changes
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
