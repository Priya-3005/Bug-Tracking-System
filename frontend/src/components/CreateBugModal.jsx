import React, { useState } from 'react';
import Modal from './Modal';
import api from '../utils/api';
import toast from 'react-hot-toast';
import { Spinner } from './Loader';

const initialForm = {
  title: '',
  description: '',
  priority: 'medium',
  severity: 'major',
  environment: '',
  stepsToReproduce: '',
};

export default function CreateBugModal({ isOpen, onClose, onCreated }) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) {
      toast.error('Title and description are required');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/bugs', form);
      toast.success('Bug reported successfully!');
      onCreated(res.data);
      setForm(initialForm);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create bug');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Report New Bug" size="lg">
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {/* Title */}
        <div>
          <label className="label">Bug Title *</label>
          <input
            className="input"
            placeholder="Brief, descriptive title of the issue"
            value={form.title}
            onChange={set('title')}
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="label">Description *</label>
          <textarea
            className="input resize-none"
            placeholder="Detailed description of the bug..."
            rows={3}
            value={form.description}
            onChange={set('description')}
            required
          />
        </div>

        {/* Priority & Severity */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Priority</label>
            <select className="select" value={form.priority} onChange={set('priority')}>
              <option value="low">🟢 Low</option>
              <option value="medium">🟡 Medium</option>
              <option value="high">🟠 High</option>
              <option value="critical">🔴 Critical</option>
            </select>
          </div>
          <div>
            <label className="label">Severity</label>
            <select className="select" value={form.severity} onChange={set('severity')}>
              <option value="minor">Minor</option>
              <option value="major">Major</option>
              <option value="critical">Critical</option>
              <option value="blocker">Blocker</option>
            </select>
          </div>
        </div>

        {/* Environment */}
        <div>
          <label className="label">Environment</label>
          <input
            className="input"
            placeholder="e.g., Chrome 115, Windows 11, Production"
            value={form.environment}
            onChange={set('environment')}
          />
        </div>

        {/* Steps to reproduce */}
        <div>
          <label className="label">Steps to Reproduce</label>
          <textarea
            className="input resize-none"
            placeholder="1. Go to...&#10;2. Click on...&#10;3. See error"
            rows={3}
            value={form.stepsToReproduce}
            onChange={set('stepsToReproduce')}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
          <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? <Spinner size="sm" /> : null}
            {loading ? 'Submitting...' : 'Report Bug'}
          </button>
        </div>
      </form>
    </Modal>
  );
}
