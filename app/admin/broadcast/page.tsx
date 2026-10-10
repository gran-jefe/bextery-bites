'use client';

import React, { useState, useId, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Upload,
  Send,
  FileText,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Settings,
  HelpCircle,
  Trash2,
  Users,
  Copy,
  Check,
  Play,
  Pause,
  SkipForward,
  RotateCcw,
  MessageSquare,
  Sparkles,
  PhoneCall,
  Zap,
  Edit2,
  Filter,
} from 'lucide-react';
import {
  Contact,
  generateWaMeLink,
  parseContactsCsv,
  formatPhoneNumber,
} from '@/lib/whatsapp';
import AdminGuard from '@/components/admin/AdminGuard';

export default function WhatsAppBroadcastPage() {
  const fileInputId = useId();
  const queueFileInputId = useId();
  // Active Tab: default to 1-Click Queue so users don't need Meta API setup
  const [activeTab, setActiveTab] = useState<'wa_me_queue' | 'broadcast' | 'guide' | 'settings'>('wa_me_queue');

  // Contacts State
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [rawText, setRawText] = useState('');
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [filterValidStatus, setFilterValidStatus] = useState<'all' | 'valid' | 'invalid'>('all');

  // Inline editing state for fixing contact phone numbers
  const [editingContactId, setEditingContactId] = useState<string | null>(null);
  const [editingPhoneValue, setEditingPhoneValue] = useState('');

  // Message & Template State
  const [templateName, setTemplateName] = useState('bextery_customer_greeting');
  const [languageCode, setLanguageCode] = useState('en_US');
  const [messageTemplate, setMessageTemplate] = useState(
    'Hello {name}! 🍰 Special treats from Bextery Bites are freshly baked and ready for you today. Sumptuous feel in every nutritious bite! Reply here to place your order or ask for our daily menu.'
  );

  // Preview selection
  const [previewContactIndex, setPreviewContactIndex] = useState(0);

  // Sending / Progress State
  const [isSending, setIsSending] = useState(false);
  const [currentSendIndex, setCurrentSendIndex] = useState<number | null>(null);
  const [sendLogs, setSendLogs] = useState<Array<{ time: string; text: string; type: 'info' | 'success' | 'error' }>>([]);

  // 1-Click Queue Auto-Runner State
  const [runnerActive, setRunnerActive] = useState(false);
  const [runnerIndex, setRunnerIndex] = useState(0);
  const [autoAdvanceSpeed, setAutoAdvanceSpeed] = useState<number>(0); // 0 = manual/spacebar, 3, 5, 8 = auto seconds

  // API Credentials (Optional override from Settings)
  const [credentials, setCredentials] = useState({
    phoneNumberId: '',
    accessToken: '',
  });

  const [copiedLinkIndex, setCopiedLinkIndex] = useState<number | null>(null);

  // File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const parsed = parseContactsCsv(text);
        setContacts(parsed);
        addLog(`Loaded ${parsed.length} contacts from "${file.name}"`, 'info');
      }
    };
    reader.readAsText(file);
  };

  // Raw Text Paste Handler
  const handlePasteSubmit = () => {
    if (!rawText.trim()) return;
    const parsed = parseContactsCsv(rawText);
    setContacts(parsed);
    setShowPasteModal(false);
    addLog(`Imported ${parsed.length} contacts from pasted text`, 'info');
  };

  // Sample contacts loader for quick testing
  const loadSampleContacts = () => {
    const sample = `Name,Phone
Sherif,09061770885
Bextery,07067436817`;
    const parsed = parseContactsCsv(sample);
    setContacts(parsed);
    addLog('Loaded sample contacts: Sherif and Bextery', 'info');
  };

  const addLog = (text: string, type: 'info' | 'success' | 'error' = 'info') => {
    const time = new Date().toLocaleTimeString();
    setSendLogs((prev) => [{ time, text, type }, ...prev.slice(0, 99)]);
  };

  const clearContacts = () => {
    setContacts([]);
    setCurrentSendIndex(null);
    addLog('Cleared contacts list', 'info');
  };

  const handleSavePhoneEdit = (contactId: string) => {
    if (!editingPhoneValue.trim()) return;
    const { phone, isValid } = formatPhoneNumber(editingPhoneValue);
    setContacts((prev) =>
      prev.map((c) =>
        c.id === contactId
          ? {
              ...c,
              phone,
              rawPhone: editingPhoneValue.trim(),
              isValid,
            }
          : c
      )
    );
    setEditingContactId(null);
    setEditingPhoneValue('');
    addLog('Updated phone number for contact', 'info');
  };

  // Helper to compile the personalized message
  const getCompiledMessage = useCallback((name: string) => {
    return messageTemplate.replace(/\{name\}/gi, name || 'Valued Customer');
  }, [messageTemplate]);

  // Advance Auto-Runner: Opens current WhatsApp chat, marks sent, moves to next
  const sendAndAdvanceRunner = useCallback(() => {
    if (contacts.length === 0) return;

    const currentContact = contacts[runnerIndex];
    if (currentContact && currentContact.isValid) {
      const compiledMsg = getCompiledMessage(currentContact.name);
      const waLink = generateWaMeLink(currentContact.phone, compiledMsg);
      window.open(waLink, '_blank');

      setContacts((prev) =>
        prev.map((c, idx) => (idx === runnerIndex ? { ...c, status: 'sent' } : c))
      );
      addLog(`✓ Opened chat for ${currentContact.name} (${currentContact.phone})`, 'success');
    }

    // Find next contact that is valid and not yet sent
    const nextIdx = contacts.findIndex(
      (c, idx) => idx > runnerIndex && c.isValid && c.status !== 'sent'
    );

    if (nextIdx !== -1) {
      setRunnerIndex(nextIdx);
    } else {
      // Check if there are any remaining unsent before current runnerIndex
      const anyRemaining = contacts.findIndex((c) => c.isValid && c.status !== 'sent');
      if (anyRemaining !== -1 && anyRemaining !== runnerIndex) {
        setRunnerIndex(anyRemaining);
      } else {
        setRunnerActive(false);
        addLog('🎉 1-Click Bulk Queue Completed! All contacts have been reached.', 'success');
      }
    }
  }, [contacts, runnerIndex, getCompiledMessage]);

  // Start the Auto-Runner
  const startRunner = () => {
    const firstPendingIdx = contacts.findIndex((c) => c.isValid && c.status !== 'sent');
    if (firstPendingIdx === -1) {
      alert('All contacts are already marked as sent! Click "Reset Queue" to start over.');
      return;
    }
    setRunnerIndex(firstPendingIdx);
    setRunnerActive(true);
    addLog(`Started Auto-Runner queue at contact #${firstPendingIdx + 1}`, 'info');
  };

  // Skip current contact
  const skipRunnerContact = () => {
    const nextIdx = contacts.findIndex(
      (c, idx) => idx > runnerIndex && c.isValid && c.status !== 'sent'
    );
    if (nextIdx !== -1) {
      setRunnerIndex(nextIdx);
    } else {
      setRunnerActive(false);
      addLog('Reached end of contacts queue', 'info');
    }
  };

  // Reset all statuses in 1-Click Queue
  const resetQueueStatuses = () => {
    setContacts((prev) => prev.map((c) => ({ ...c, status: 'idle' })));
    setRunnerActive(false);
    setRunnerIndex(0);
    addLog('Reset all contact statuses in queue to pending', 'info');
  };

  // Keyboard shortcut listener for Spacebar / Enter
  useEffect(() => {
    if (!runnerActive || activeTab !== 'wa_me_queue') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault();
        sendAndAdvanceRunner();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [runnerActive, activeTab, sendAndAdvanceRunner]);

  // Auto-advance timer listener
  useEffect(() => {
    if (!runnerActive || autoAdvanceSpeed === 0 || activeTab !== 'wa_me_queue') return;

    const timer = setTimeout(() => {
      sendAndAdvanceRunner();
    }, autoAdvanceSpeed * 1000);

    return () => clearTimeout(timer);
  }, [runnerActive, autoAdvanceSpeed, activeTab, runnerIndex, sendAndAdvanceRunner]);

  // Automated Meta Cloud API Broadcast Sender
  const startMetaBroadcast = async () => {
    const validContacts = contacts.filter((c) => c.isValid && c.status !== 'sent');
    if (validContacts.length === 0) {
      alert('No valid pending contacts to send to.');
      return;
    }

    setIsSending(true);
    addLog(`Starting broadcast to ${validContacts.length} contacts...`, 'info');

    for (let i = 0; i < contacts.length; i++) {
      const contact = contacts[i];
      if (!contact.isValid || contact.status === 'sent') continue;

      setCurrentSendIndex(i);
      setContacts((prev) =>
        prev.map((c, idx) => (idx === i ? { ...c, status: 'sending' } : c))
      );

      try {
        const response = await fetch('/api/whatsapp/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            to: contact.phone,
            recipientName: contact.name,
            templateName,
            languageCode,
            credentials: credentials.phoneNumberId && credentials.accessToken ? credentials : undefined,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setContacts((prev) =>
            prev.map((c, idx) => (idx === i ? { ...c, status: 'sent', errorMessage: undefined } : c))
          );
          addLog(`✓ Sent successfully to ${contact.name} (${contact.phone})`, 'success');
        } else {
          const errMsg = data.error || 'Unknown error';
          setContacts((prev) =>
            prev.map((c, idx) => (idx === i ? { ...c, status: 'failed', errorMessage: errMsg } : c))
          );
          addLog(`✕ Failed to send to ${contact.name}: ${errMsg}`, 'error');
        }
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : 'Network error';
        setContacts((prev) =>
          prev.map((c, idx) => (idx === i ? { ...c, status: 'failed', errorMessage: errMsg } : c))
        );
        addLog(`✕ Error sending to ${contact.name}: ${errMsg}`, 'error');
      }

      // Small throttling delay (800ms) to respect rate limits
      await new Promise((resolve) => setTimeout(resolve, 800));
    }

    setIsSending(false);
    setCurrentSendIndex(null);
    addLog('Broadcast finished!', 'info');
  };

  const currentPreviewContact = contacts[previewContactIndex] || {
    name: 'Customer Name',
    phone: '2347067436817',
  };

  const validCount = contacts.filter((c) => c.isValid).length;
  const sentCount = contacts.filter((c) => c.status === 'sent').length;
  const failedCount = contacts.filter((c) => c.status === 'failed').length;

  return (
    <AdminGuard>
      <div className="bg-[#FAF3F1] text-[#4F4140] font-sans pb-16">
      {/* Top Header */}
      <header className="bg-white border-b border-[#D0B7B2]/40 shadow-xs sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="w-10 h-10 rounded-full bg-[#BD4935] text-white flex items-center justify-center font-bold text-lg shadow-sm hover:opacity-90 transition"
              title="Return to Bextery Bites website"
            >
              BB
            </Link>
            <div>
              <h1 className="text-xl font-bold text-[#4F4140] flex items-center gap-2">
                WhatsApp Broadcast Hub
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#BD4935]/10 text-[#BD4935] font-semibold border border-[#BD4935]/20">
                  Bextery Bites
                </span>
              </h1>
              <p className="text-xs text-[#9A684D]">
                Personalized bulk messaging with dynamic names
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex items-center gap-1 sm:gap-2 bg-[#FAF3F1] p-1 rounded-xl border border-[#D0B7B2]/50 text-xs sm:text-sm font-medium">
            <button
              onClick={() => setActiveTab('wa_me_queue')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'wa_me_queue'
                  ? 'bg-[#BD4935] text-white shadow-xs font-semibold'
                  : 'text-[#4F4140] hover:bg-white/60'
              }`}
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>1-Click Direct Queue</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 font-bold border border-emerald-300">
                No API Needed
              </span>
            </button>
            <button
              onClick={() => setActiveTab('broadcast')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'broadcast'
                  ? 'bg-[#BD4935] text-white shadow-xs font-semibold'
                  : 'text-[#4F4140] hover:bg-white/60'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>Meta Cloud API</span>
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'guide'
                  ? 'bg-[#BD4935] text-white shadow-xs'
                  : 'text-[#4F4140] hover:bg-white/60'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Setup Guide
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'settings'
                  ? 'bg-[#BD4935] text-white shadow-xs'
                  : 'text-[#4F4140] hover:bg-white/60'
              }`}
            >
              <Settings className="w-3.5 h-3.5" />
              API Settings
            </button>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* TAB 1: Meta Cloud API Broadcast */}
        {activeTab === 'broadcast' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: Contacts & Message Composer (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Card 1: Contacts Uploader */}
              <div className="bg-white rounded-2xl p-5 border border-[#D0B7B2]/40 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#BD4935]/10 text-[#BD4935] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <h2 className="font-bold text-base text-[#4F4140]">
                      1. Contacts List ({contacts.length})
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    {contacts.length === 0 && (
                      <button
                        onClick={loadSampleContacts}
                        className="text-xs text-[#BD4935] hover:underline font-semibold"
                      >
                        Load Demo Data
                      </button>
                    )}
                    {contacts.length > 0 && (
                      <button
                        onClick={clearContacts}
                        className="text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-medium"
                      >
                        <Trash2 className="w-3 h-3" /> Clear
                      </button>
                    )}
                  </div>
                </div>

                {contacts.length === 0 ? (
                  <div className="border-2 border-dashed border-[#D0B7B2] rounded-xl p-6 text-center hover:border-[#BD4935] transition bg-[#FAF3F1]/40">
                    <Upload className="w-8 h-8 mx-auto text-[#9A684D] mb-2" />
                    <p className="text-sm font-semibold text-[#4F4140] mb-1">
                      Upload your Contacts CSV file
                    </p>
                    <p className="text-xs text-[#9A684D] mb-4">
                      Exported from Google Contacts, iPhone, or WhatsApp Web (Columns: Name, Phone)
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <label
                        htmlFor={fileInputId}
                        className="cursor-pointer px-4 py-2 bg-[#BD4935] text-white rounded-xl text-xs font-semibold hover:bg-[#a63e2c] transition shadow-xs flex items-center gap-2"
                      >
                        <Upload className="w-3.5 h-3.5" /> Choose CSV File
                      </label>
                      <input
                        id={fileInputId}
                        type="file"
                        accept=".csv,.txt,.tsv"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        onClick={() => setShowPasteModal(true)}
                        className="px-4 py-2 border border-[#D0B7B2] bg-white text-[#4F4140] rounded-xl text-xs font-semibold hover:bg-gray-50 transition flex items-center gap-2"
                      >
                        <FileText className="w-3.5 h-3.5 text-[#9A684D]" /> Paste Text / Numbers
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {/* Status Counters */}
                    <div className="grid grid-cols-4 gap-2 text-center text-xs py-2 px-3 bg-[#FAF3F1] rounded-xl border border-[#D0B7B2]/40">
                      <div>
                        <div className="font-bold text-sm text-[#4F4140]">{contacts.length}</div>
                        <div className="text-gray-500">Total</div>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-emerald-600">{validCount}</div>
                        <div className="text-gray-500">Valid</div>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-[#BD4935]">{sentCount}</div>
                        <div className="text-gray-500">Sent</div>
                      </div>
                      <div>
                        <div className="font-bold text-sm text-red-600">{failedCount}</div>
                        <div className="text-gray-500">Failed</div>
                      </div>
                    </div>

                    {/* Compact Scrollable Contacts Table */}
                    <div className="max-h-56 overflow-y-auto rounded-xl border border-[#D0B7B2]/40 divide-y divide-gray-100 text-xs">
                      {contacts.map((contact, idx) => (
                        <div
                          key={contact.id}
                          onClick={() => setPreviewContactIndex(idx)}
                          className={`p-2.5 flex items-center justify-between cursor-pointer transition ${
                            previewContactIndex === idx
                              ? 'bg-[#FAF3F1] border-l-4 border-l-[#BD4935]'
                              : 'hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span className="w-5 text-gray-400 font-mono text-[10px]">
                              {idx + 1}.
                            </span>
                            <div className="truncate">
                              <p className="font-semibold text-[#4F4140] truncate">
                                {contact.name}
                              </p>
                              <p className="text-[11px] text-gray-500 font-mono">
                                {contact.phone || contact.rawPhone}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {!contact.isValid && (
                              <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-medium flex items-center gap-1">
                                <AlertCircle className="w-2.5 h-2.5" /> Invalid
                              </span>
                            )}
                            {contact.status === 'sending' && (
                              <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-medium animate-pulse">
                                Sending...
                              </span>
                            )}
                            {contact.status === 'sent' && (
                              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-2.5 h-2.5" /> Sent
                              </span>
                            )}
                            {contact.status === 'failed' && (
                              <span
                                title={contact.errorMessage}
                                className="px-2 py-0.5 bg-red-100 text-red-700 rounded-full text-[10px] font-medium flex items-center gap-1"
                              >
                                <AlertCircle className="w-2.5 h-2.5" /> Error
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-[11px] text-[#9A684D] px-1">
                      <span>Tip: Click any contact to preview their personalized message.</span>
                      <label htmlFor={fileInputId} className="cursor-pointer text-[#BD4935] hover:underline font-semibold">
                        + Replace file
                      </label>
                    </div>
                  </div>
                )}
              </div>

              {/* Card 2: Message & Template Configuration */}
              <div className="bg-white rounded-2xl p-5 border border-[#D0B7B2]/40 shadow-xs">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-[#BD4935]/10 text-[#BD4935] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="font-bold text-base text-[#4F4140]">
                    2. Message & Dynamic Template
                  </h2>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-[#4F4140] mb-1">
                        Meta Template Name
                      </label>
                      <input
                        type="text"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                        placeholder="e.g. bextery_customer_greeting"
                        className="w-full text-xs px-3 py-2 border border-[#D0B7B2]/60 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#BD4935]/30 bg-white"
                      />
                      <span className="text-[10px] text-gray-500">Must match your Meta Manager</span>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4F4140] mb-1">
                        Language Code
                      </label>
                      <select
                        value={languageCode}
                        onChange={(e) => setLanguageCode(e.target.value)}
                        className="w-full text-xs px-3 py-2 border border-[#D0B7B2]/60 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#BD4935]/30 bg-white"
                      >
                        <option value="en_US">English (US) - en_US</option>
                        <option value="en">English - en</option>
                        <option value="en_GB">English (UK) - en_GB</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4F4140] mb-1 flex items-center justify-between">
                      <span>Message Content (Use <code className="bg-[#FAF3F1] px-1 py-0.5 rounded text-[#BD4935]">{'{name}'}</code> for dynamic insertion)</span>
                    </label>
                    <textarea
                      rows={4}
                      value={messageTemplate}
                      onChange={(e) => setMessageTemplate(e.target.value)}
                      className="w-full text-xs p-3 border border-[#D0B7B2]/60 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#BD4935]/30 leading-relaxed font-sans"
                      placeholder="Type your message with {name} here..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Live WhatsApp Chat Mockup & Dispatch Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* WhatsApp Phone Mockup */}
              <div className="bg-white rounded-2xl p-5 border border-[#D0B7B2]/40 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#9A684D]">
                    Live Recipient Preview
                  </h3>
                  <span className="text-xs text-[#BD4935] font-semibold">
                    To: {currentPreviewContact.name}
                  </span>
                </div>

                {/* WhatsApp Chat Box UI */}
                <div className="rounded-2xl overflow-hidden border border-emerald-900/10 shadow-inner bg-[#EFEAE2]">
                  {/* WhatsApp Header */}
                  <div className="bg-[#075E54] text-white px-3.5 py-2.5 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-xs text-emerald-100">
                      BB
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold truncate leading-tight">Bextery Bites</p>
                      <p className="text-[10px] text-emerald-200 truncate">Official WhatsApp Business</p>
                    </div>
                  </div>

                  {/* Chat Message Bubble */}
                  <div className="p-4 min-h-44 flex flex-col justify-end">
                    <div className="self-end max-w-[90%] bg-[#E7FFDB] text-[#111B21] text-xs p-3 rounded-xl rounded-tr-xs shadow-xs border border-emerald-200/50 relative">
                      <p className="whitespace-pre-wrap leading-relaxed">
                        {getCompiledMessage(currentPreviewContact.name)}
                      </p>
                      <div className="text-[9px] text-gray-500 text-right mt-1.5 flex items-center justify-end gap-1">
                        <span>12:00 PM</span>
                        <span className="text-emerald-600 font-bold">✓✓</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dispatch Action Card */}
              <div className="bg-white rounded-2xl p-5 border border-[#D0B7B2]/40 shadow-xs space-y-4">
                <h3 className="font-bold text-base text-[#4F4140] flex items-center gap-2">
                  <Send className="w-4 h-4 text-[#BD4935]" />
                  Launch Meta API Broadcast
                </h3>

                <p className="text-xs text-[#9A684D] leading-relaxed">
                  Sends automated template messages through your verified Meta WhatsApp Business Account with dynamic recipient names.
                </p>

                {/* Send Button */}
                <div className="space-y-2">
                  <button
                    disabled={isSending || contacts.length === 0}
                    onClick={startMetaBroadcast}
                    className="w-full py-3 px-4 bg-[#BD4935] hover:bg-[#a63e2c] disabled:opacity-50 text-white rounded-xl font-bold text-sm transition shadow-sm flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isSending ? (
                      <>
                        <RotateCcw className="w-4 h-4 animate-spin" />
                        Broadcasting ({currentSendIndex !== null ? currentSendIndex + 1 : 0}/{contacts.length})...
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-white" />
                        Send Broadcast ({validCount} contacts)
                      </>
                    )}
                  </button>

                  <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
                    <span>Throttled at ~1 message/sec</span>
                    <button
                      onClick={() => setActiveTab('wa_me_queue')}
                      className="text-[#BD4935] hover:underline font-semibold"
                    >
                      Or use 1-Click Queue &rarr;
                    </button>
                  </div>
                </div>

                {/* Real-time Activity Logs */}
                <div className="pt-2 border-t border-gray-100">
                  <h4 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Activity Log
                  </h4>
                  <div className="h-32 overflow-y-auto bg-gray-50 rounded-xl p-2.5 font-mono text-[11px] space-y-1 border border-gray-200">
                    {sendLogs.length === 0 ? (
                      <p className="text-gray-400 italic">No activity yet. Import contacts to begin.</p>
                    ) : (
                      sendLogs.map((log, i) => (
                        <div
                          key={i}
                          className={`${
                            log.type === 'success'
                              ? 'text-emerald-700'
                              : log.type === 'error'
                              ? 'text-red-600'
                              : 'text-gray-600'
                          }`}
                        >
                          <span className="text-gray-400">[{log.time}]</span> {log.text}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: 1-Click WhatsApp Web / Mobile Queue (Instant Zero-Setup Mode) */}
        {activeTab === 'wa_me_queue' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#D0B7B2]/40 shadow-xs">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div>
                  <h2 className="text-lg font-bold text-[#4F4140] flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-[#BD4935]" />
                    1-Click Direct WhatsApp Queue
                  </h2>
                  <p className="text-xs text-[#9A684D] mt-1">
                    Send personalized messages directly from your WhatsApp without waiting for Meta API approvals or incurring per-message fees.
                  </p>
                </div>
              </div>

              {/* Top Queue Toolbar & Actions */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#4F4140]">Filter:</span>
                  <div className="flex items-center gap-1 bg-[#FAF3F1] p-0.5 rounded-lg border border-[#D0B7B2]/40 text-xs font-medium">
                    <button
                      onClick={() => setFilterValidStatus('all')}
                      className={`px-2.5 py-1 rounded-md transition ${
                        filterValidStatus === 'all'
                          ? 'bg-[#BD4935] text-white shadow-2xs font-semibold'
                          : 'text-gray-600 hover:bg-white/60'
                      }`}
                    >
                      All ({contacts.length})
                    </button>
                    <button
                      onClick={() => setFilterValidStatus('valid')}
                      className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                        filterValidStatus === 'valid'
                          ? 'bg-emerald-700 text-white shadow-2xs font-semibold'
                          : 'text-emerald-700 hover:bg-white/60'
                      }`}
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      Ready to Send ({validCount})
                    </button>
                    {contacts.length - validCount > 0 && (
                      <button
                        onClick={() => setFilterValidStatus('invalid')}
                        className={`px-2.5 py-1 rounded-md transition flex items-center gap-1 ${
                          filterValidStatus === 'invalid'
                            ? 'bg-red-700 text-white shadow-2xs font-semibold'
                            : 'text-red-600 hover:bg-white/60'
                        }`}
                      >
                        <AlertCircle className="w-3 h-3" />
                        Needs Phone ({contacts.length - validCount})
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor={queueFileInputId}
                    className="cursor-pointer px-3 py-1.5 bg-[#BD4935] text-white rounded-lg text-xs font-semibold hover:bg-[#a63e2c] transition shadow-2xs flex items-center gap-1.5"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>{contacts.length === 0 ? 'Upload Contacts File' : '+ Add / Replace File'}</span>
                  </label>
                  <input
                    id={queueFileInputId}
                    type="file"
                    accept=".csv,.vcf,.txt,.tsv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => setShowPasteModal(true)}
                    className="px-3 py-1.5 border border-[#D0B7B2] bg-white text-[#4F4140] hover:bg-gray-50 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#9A684D]" />
                    <span>Paste Text</span>
                  </button>
                  {contacts.length > 0 && (
                    <button
                      onClick={clearContacts}
                      className="px-2.5 py-1.5 text-xs text-red-600 hover:text-red-700 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3 h-3" /> Clear
                    </button>
                  )}
                </div>
              </div>

              {contacts.length === 0 ? (
                /* Empty state with full uploader */
                <div className="border-2 border-dashed border-[#D0B7B2] rounded-2xl p-8 text-center bg-[#FAF3F1]/40 space-y-4 my-4">
                  <div className="w-12 h-12 rounded-full bg-[#BD4935]/10 text-[#BD4935] flex items-center justify-center mx-auto">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#4F4140]">
                      No Contacts Loaded in Queue
                    </h3>
                    <p className="text-xs text-[#9A684D] max-w-md mx-auto mt-1">
                      Upload your contacts exported from Google Contacts, iPhone / Android vCard (.vcf), or a CSV file. Zero Meta API configuration needed!
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                    <label
                      htmlFor={queueFileInputId}
                      className="cursor-pointer px-5 py-2.5 bg-[#BD4935] hover:bg-[#a63e2c] text-white rounded-xl text-xs font-semibold transition shadow-xs flex items-center gap-2"
                    >
                      <Upload className="w-4 h-4" /> Choose Contacts File (.csv, .vcf, .txt)
                    </label>
                    <button
                      onClick={() => setShowPasteModal(true)}
                      className="px-4 py-2.5 border border-[#D0B7B2] bg-white text-[#4F4140] hover:bg-gray-50 rounded-xl text-xs font-semibold transition flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-[#9A684D]" /> Paste Names & Numbers
                    </button>
                    <button
                      onClick={loadSampleContacts}
                      className="px-4 py-2.5 text-xs text-[#BD4935] hover:underline font-semibold"
                    >
                      Load Demo Data
                    </button>
                  </div>
                  <div className="pt-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      100% Free &bull; Works directly with your WhatsApp app or WhatsApp Web
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Collapsible Message Template Box */}
                  <div className="p-4 rounded-xl bg-white border border-[#D0B7B2]/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#4F4140] flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-[#BD4935]" />
                        <span>Message Text to Blast (Dynamic <code className="bg-[#FAF3F1] px-1 py-0.5 rounded text-[#BD4935] font-mono">{'{name}'}</code> will be replaced with customer&apos;s name)</span>
                      </label>
                    </div>
                    <textarea
                      rows={2}
                      value={messageTemplate}
                      onChange={(e) => setMessageTemplate(e.target.value)}
                      className="w-full text-xs p-2.5 border border-[#D0B7B2]/60 rounded-xl focus:ring-2 focus:ring-[#BD4935]/30 focus:outline-hidden"
                      placeholder="Type your WhatsApp message..."
                    />
                  </div>

                  {/* Bulk Auto-Runner Control Deck */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#FAF3F1] to-white border border-[#D0B7B2]/60 shadow-xs space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-[#BD4935] text-white flex items-center justify-center shadow-xs">
                          <Zap className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="font-bold text-sm text-[#4F4140] flex items-center gap-2">
                            Bulk Auto-Runner Controller
                            {runnerActive && (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold animate-pulse">
                                RUNNING
                              </span>
                            )}
                          </h3>
                          <p className="text-[11px] text-[#9A684D]">
                            Blast through your contacts sequentially with pre-filled personalized messages
                          </p>
                        </div>
                      </div>

                      {/* Speed / Mode Switcher */}
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500 font-medium">Advance Mode:</span>
                        <select
                          value={autoAdvanceSpeed}
                          onChange={(e) => {
                            const val = Number(e.target.value);
                            setAutoAdvanceSpeed(val);
                          }}
                          className="px-2.5 py-1.5 bg-white border border-[#D0B7B2]/70 rounded-xl text-xs font-semibold text-[#4F4140] focus:ring-2 focus:ring-[#BD4935]/30 focus:outline-hidden"
                        >
                          <option value={0}>⌨️ Manual (Spacebar / Enter)</option>
                          <option value={3}>⚡ Auto (3 seconds delay)</option>
                          <option value={5}>⏱️ Auto (5 seconds delay)</option>
                          <option value={8}>🐢 Auto (8 seconds delay)</option>
                        </select>
                      </div>
                    </div>

                    {/* Progress Bar & Counters */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-[#4F4140]">
                        <span>Queue Progress: {contacts.filter((c) => c.status === 'sent').length} of {contacts.length} sent</span>
                        <span className="text-[#BD4935]">
                          {contacts.length > 0
                            ? Math.round((contacts.filter((c) => c.status === 'sent').length / contacts.length) * 100)
                            : 0}%
                        </span>
                      </div>
                      <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#BD4935] transition-all duration-300 rounded-full"
                          style={{
                            width: `${
                              contacts.length > 0
                                ? (contacts.filter((c) => c.status === 'sent').length / contacts.length) * 100
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Action Controls */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      {!runnerActive ? (
                        <div className="flex flex-wrap items-center gap-3">
                          <button
                            onClick={startRunner}
                            disabled={validCount === 0}
                            className="px-5 py-2.5 bg-[#BD4935] hover:bg-[#a63e2c] disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                          >
                            <Play className="w-4 h-4 fill-white" />
                            Start Bulk Auto-Runner ({validCount} ready)
                          </button>
                          <button
                            onClick={resetQueueStatuses}
                            className="px-3.5 py-2 bg-white border border-[#D0B7B2]/70 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset All to Pending
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                          <button
                            onClick={sendAndAdvanceRunner}
                            className="px-5 py-2.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center gap-2 cursor-pointer animate-bounce"
                          >
                            <PhoneCall className="w-4 h-4" />
                            Open WhatsApp & Next (Spacebar / Enter)
                            {autoAdvanceSpeed > 0 && (
                              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
                                {autoAdvanceSpeed}s auto
                              </span>
                            )}
                          </button>
                          <button
                            onClick={skipRunnerContact}
                            className="px-3.5 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <SkipForward className="w-3.5 h-3.5" />
                            Skip
                          </button>
                          <button
                            onClick={() => setRunnerActive(false)}
                            className="px-3.5 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-semibold text-xs rounded-xl transition flex items-center gap-1.5 cursor-pointer"
                          >
                            <Pause className="w-3.5 h-3.5" />
                            Pause Runner
                          </button>
                        </div>
                      )}

                      {/* Helper Keyboard Tag */}
                      <div className="text-[11px] text-[#9A684D] flex items-center gap-1">
                        <span>⌨️ Spacebar or Enter sends & moves to next</span>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Queue Table */}
                  <div className="overflow-x-auto rounded-xl border border-[#D0B7B2]/40">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-[#D0B7B2]/40 bg-[#FAF3F1]/80 text-[#4F4140]">
                          <th className="p-3 font-bold">#</th>
                          <th className="p-3 font-bold">Status</th>
                          <th className="p-3 font-bold">Name</th>
                          <th className="p-3 font-bold">Phone Number</th>
                          <th className="p-3 font-bold">Personalized Message Preview</th>
                          <th className="p-3 font-bold text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 bg-white">
                        {contacts
                          .filter((c) => {
                            if (filterValidStatus === 'valid') return c.isValid;
                            if (filterValidStatus === 'invalid') return !c.isValid;
                            return true;
                          })
                          .map((contact, idx) => {
                            const originalIdx = contacts.findIndex((c) => c.id === contact.id);
                            const compiledMsg = getCompiledMessage(contact.name);
                            const waLink = generateWaMeLink(contact.phone, compiledMsg);
                            const isCurrentRunnerTarget = runnerActive && runnerIndex === originalIdx;

                            return (
                              <tr
                                key={contact.id}
                                className={`transition ${
                                  isCurrentRunnerTarget
                                    ? 'bg-[#BD4935]/10 border-l-4 border-l-[#BD4935]'
                                    : contact.status === 'sent'
                                    ? 'bg-emerald-50/40'
                                    : 'hover:bg-gray-50'
                                }`}
                              >
                                <td className="p-3 text-gray-400 font-mono">{idx + 1}</td>
                                <td className="p-3">
                                  {contact.status === 'sent' ? (
                                    <button
                                      onClick={() => {
                                        setContacts((prev) =>
                                          prev.map((c) => (c.id === contact.id ? { ...c, status: 'idle' } : c))
                                        );
                                      }}
                                      title="Click to mark as pending"
                                      className="px-2 py-0.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-[10px] font-bold inline-flex items-center gap-1 cursor-pointer transition"
                                    >
                                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                      Sent
                                    </button>
                                  ) : isCurrentRunnerTarget ? (
                                    <span className="px-2 py-0.5 rounded-full bg-[#BD4935] text-white text-[10px] font-bold inline-flex items-center gap-1 animate-pulse">
                                      🎯 Next Up
                                    </span>
                                  ) : (
                                    <button
                                      onClick={() => {
                                        setContacts((prev) =>
                                          prev.map((c) => (c.id === contact.id ? { ...c, status: 'sent' } : c))
                                        );
                                      }}
                                      title="Click to mark as sent"
                                      className="px-2 py-0.5 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-[10px] font-medium inline-flex items-center gap-1 cursor-pointer transition"
                                    >
                                      Pending
                                    </button>
                                  )}
                                </td>
                                <td className="p-3 font-bold text-[#4F4140]">{contact.name}</td>
                                <td className="p-3 font-mono text-gray-600">
                                  {editingContactId === contact.id ? (
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="text"
                                        value={editingPhoneValue}
                                        onChange={(e) => setEditingPhoneValue(e.target.value)}
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') handleSavePhoneEdit(contact.id);
                                          if (e.key === 'Escape') setEditingContactId(null);
                                        }}
                                        placeholder="e.g. 07067436817"
                                        autoFocus
                                        className="text-xs px-2 py-1 border border-[#BD4935] rounded-md font-mono w-32 bg-white"
                                      />
                                      <button
                                        onClick={() => handleSavePhoneEdit(contact.id)}
                                        className="p-1 bg-[#BD4935] text-white rounded-md text-[10px] hover:bg-[#a63e2c]"
                                        title="Save number"
                                      >
                                        <Check className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={() => setEditingContactId(null)}
                                        className="p-1 bg-gray-200 text-gray-700 rounded-md text-[10px] hover:bg-gray-300"
                                        title="Cancel"
                                      >
                                        ✕
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-1.5">
                                      {contact.isValid ? (
                                        <span className="font-mono text-gray-700">+{contact.phone}</span>
                                      ) : (
                                        <span className="text-[10px] text-red-600 font-semibold flex items-center gap-1 bg-red-50 px-2 py-0.5 rounded-md border border-red-200">
                                          <AlertCircle className="w-3 h-3" /> No Phone
                                        </span>
                                      )}
                                      <button
                                        onClick={() => {
                                          setEditingContactId(contact.id);
                                          setEditingPhoneValue(contact.phone || contact.rawPhone || '');
                                        }}
                                        title="Edit / fix phone number"
                                        className="text-gray-400 hover:text-[#BD4935] p-1 transition"
                                      >
                                        <Edit2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                                <td className="p-3 text-gray-600 max-w-md truncate" title={compiledMsg}>
                                  {compiledMsg}
                                </td>
                                <td className="p-3 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(compiledMsg);
                                        setCopiedLinkIndex(originalIdx);
                                        setTimeout(() => setCopiedLinkIndex(null), 2000);
                                      }}
                                      title="Copy personalized text"
                                      className="p-1.5 text-gray-400 hover:text-[#4F4140] rounded-md transition"
                                    >
                                      {copiedLinkIndex === originalIdx ? (
                                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                                      ) : (
                                        <Copy className="w-3.5 h-3.5" />
                                      )}
                                    </button>

                                    {contact.isValid ? (
                                      <a
                                        href={waLink}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        onClick={() => {
                                          setContacts((prev) =>
                                            prev.map((c) => (c.id === contact.id ? { ...c, status: 'sent' } : c))
                                          );
                                        }}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg font-semibold text-xs transition shadow-xs cursor-pointer"
                                      >
                                        <PhoneCall className="w-3 h-3" />
                                        Send to {contact.name.split(' ')[0]}
                                        <ExternalLink className="w-2.5 h-2.5 opacity-70" />
                                      </a>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setEditingContactId(contact.id);
                                          setEditingPhoneValue(contact.phone || contact.rawPhone || '');
                                        }}
                                        className="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg text-xs font-semibold transition"
                                      >
                                        Fix Number
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Setup Guide */}
        {activeTab === 'guide' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D0B7B2]/40 shadow-xs max-w-4xl mx-auto space-y-8">
            <div>
              <h2 className="text-xl font-bold text-[#4F4140]">
                Step-by-Step Meta WhatsApp Cloud API Setup Guide
              </h2>
              <p className="text-sm text-[#9A684D] mt-1">
                Follow these steps to set up your verified Meta developer account and send automated template broadcasts.
              </p>
            </div>

            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#BD4935] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-[#4F4140]">
                    Create a Meta Developer App
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Go to{' '}
                    <a
                      href="https://developers.facebook.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#BD4935] font-semibold underline"
                    >
                      developers.facebook.com
                    </a>
                    , click <strong>My Apps &gt; Create App</strong>, select <strong>Other</strong> &gt; <strong>Business</strong>, and name it (e.g. <em>Bextery Bites WhatsApp</em>).
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#BD4935] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-[#4F4140]">
                    Add the WhatsApp Product & Get Phone Number ID
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Under the App Dashboard, find <strong>WhatsApp</strong> and click <strong>Set Up</strong>. Go to <strong>API Setup</strong>. You will see:
                  </p>
                  <ul className="text-xs text-gray-600 list-disc list-inside space-y-1 pl-2">
                    <li><strong>Temporary Access Token:</strong> Good for quick testing (24 hours).</li>
                    <li><strong>Phone Number ID:</strong> A numeric ID (e.g., <code>104829384920192</code>) assigned by Meta.</li>
                  </ul>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#BD4935] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-[#4F4140]">
                    Create Your Approved Message Template
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Meta requires outbound messages to use pre-approved templates:
                  </p>
                  <div className="p-3 bg-[#FAF3F1] rounded-xl border border-[#D0B7B2]/40 text-xs text-gray-700 space-y-1 font-mono">
                    <p><strong>Category:</strong> Marketing or Utility</p>
                    <p><strong>Template Name:</strong> bextery_customer_greeting</p>
                    <p><strong>Language:</strong> English (US)</p>
                    <p>
                      <strong>Body Text:</strong> Hello {'{{1}}'}! Special treats from Bextery Bites are freshly baked and ready for you today.
                    </p>
                  </div>
                  <p className="text-[11px] text-[#9A684D]">
                    Note: <code>{'{{1}}'}</code> is where the customer&apos;s name will be automatically inserted by our bot!
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#BD4935] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  4
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-[#4F4140]">
                    Generate a Permanent System User Token
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    In your Meta Business Suite, navigate to <strong>Business Settings &gt; System Users</strong>. Create a system user with Admin permissions and generate a permanent token with the <code>whatsapp_business_messaging</code> and <code>whatsapp_business_management</code> scopes.
                  </p>
                </div>
              </div>

              {/* Step 5 */}
              <div className="flex gap-4 items-start">
                <div className="w-8 h-8 rounded-full bg-[#BD4935] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  5
                </div>
                <div className="space-y-1.5">
                  <h3 className="font-bold text-base text-[#4F4140]">
                    Configure Environment Variables
                  </h3>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    Add the values into your <code>.env.local</code> file or input them directly on the <strong>API Settings</strong> tab:
                  </p>
                  <pre className="p-3 bg-gray-900 text-emerald-400 rounded-xl text-xs font-mono overflow-x-auto">
{`WHATSAPP_API_TOKEN="EAAG..."
WHATSAPP_PHONE_NUMBER_ID="104829384920192"
WHATSAPP_TEMPLATE_NAME="bextery_customer_greeting"
WHATSAPP_TEMPLATE_LANG="en_US"`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: API Settings (Manual Override) */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#D0B7B2]/40 shadow-xs max-w-xl mx-auto space-y-6">
            <div>
              <h2 className="text-lg font-bold text-[#4F4140] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#BD4935]" />
                Direct API Credentials
              </h2>
              <p className="text-xs text-[#9A684D] mt-1">
                You can optionally enter your Meta credentials here to test immediately without updating the server <code>.env.local</code>.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#4F4140] mb-1">
                  WhatsApp Phone Number ID
                </label>
                <input
                  type="text"
                  value={credentials.phoneNumberId}
                  onChange={(e) =>
                    setCredentials((prev) => ({ ...prev, phoneNumberId: e.target.value.trim() }))
                  }
                  placeholder="e.g. 104829384920192"
                  className="w-full text-xs px-3 py-2.5 border border-[#D0B7B2]/60 rounded-xl focus:ring-2 focus:ring-[#BD4935]/30 focus:outline-hidden font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#4F4140] mb-1">
                  Meta System User Access Token
                </label>
                <input
                  type="password"
                  value={credentials.accessToken}
                  onChange={(e) =>
                    setCredentials((prev) => ({ ...prev, accessToken: e.target.value.trim() }))
                  }
                  placeholder="EAAG..."
                  className="w-full text-xs px-3 py-2.5 border border-[#D0B7B2]/60 rounded-xl focus:ring-2 focus:ring-[#BD4935]/30 focus:outline-hidden font-mono"
                />
              </div>

              <div className="p-3 bg-[#FAF3F1] rounded-xl border border-[#D0B7B2]/40 text-[11px] text-[#4F4140] space-y-1">
                <p className="font-semibold text-[#BD4935]">🔒 Security Note:</p>
                <p>
                  These credentials stay in your browser session for this test. For production, store them in your server&apos;s <code>.env.local</code> file so they remain private.
                </p>
              </div>

              <button
                onClick={() => {
                  setActiveTab('broadcast');
                  addLog('Saved temporary Meta API credentials', 'info');
                }}
                className="w-full py-2.5 bg-[#BD4935] hover:bg-[#a63e2c] text-white font-semibold text-xs rounded-xl transition"
              >
                Apply & Return to Broadcast
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Paste Raw Text / Numbers */}
      {showPasteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-[#4F4140]">
              Paste Contacts (CSV or Name, Phone)
            </h3>
            <p className="text-xs text-[#9A684D]">
              Format: One contact per line with Name and Phone separated by comma or tab.
            </p>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder={`Amaka Adeleke, 07067436817\nBabatunde Ojo, 08031234567\nChioma Eze, +2349023456789`}
              className="w-full text-xs p-3 border border-[#D0B7B2]/60 rounded-xl font-mono focus:ring-2 focus:ring-[#BD4935]/30 focus:outline-hidden"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowPasteModal(false)}
                className="px-4 py-2 border border-gray-300 text-xs font-semibold rounded-xl text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePasteSubmit}
                className="px-4 py-2 bg-[#BD4935] text-white text-xs font-semibold rounded-xl hover:bg-[#a63e2c]"
              >
                Import Contacts
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </AdminGuard>
  );
}
