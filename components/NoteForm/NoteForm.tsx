'use client';

import React, { useState, FormEvent, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import type { CreateNoteParams, NoteTag } from '../../types/note';
import { createNote } from '../../lib/api';
import { useNoteStore } from '@/lib/store/noteStore';
import css from './NoteForm.module.css';

interface NoteFormProps {
  onCancel?: () => void;
  onSubmit?: () => void;
}

const NoteForm: React.FC<NoteFormProps> = ({ onCancel, onSubmit }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  
  // Отримуємо функції зі стору
  const { draft, setDraft, clearDraft } = useNoteStore();
  
  // Ініціалізуємо форму з draft або початковими значеннями
  const [formData, setFormData] = useState<CreateNoteParams>({
    title: draft.title || '',
    content: draft.content || '',
    tag: (draft.tag || 'Todo') as NoteTag,
  });
  
  const [errors, setErrors] = useState<Partial<CreateNoteParams>>({});

  // Оновлюємо формData коли draft змінюється
  useEffect(() => {
    setFormData({
      title: draft.title || '',
      content: draft.content || '',
      tag: (draft.tag || 'Todo') as NoteTag,
    });
  }, [draft]);

  const createMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      // Очищаємо чернетку після успішного створення
      clearDraft();
      if (onSubmit) {
        onSubmit();
      } else {
        router.push('/notes/filter');
      }
    },
    onError: (error) => {
      console.error('Failed to create note:', error);
    },
  });

  const validateForm = (): boolean => {
    const newErrors: Partial<CreateNoteParams> = {};
    
    if (!formData.title) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 50) {
      newErrors.title = 'Title must be at most 50 characters';
    }
    
    if (formData.content && formData.content.length > 500) {
      newErrors.content = 'Content must be at most 500 characters';
    }
    
    if (!formData.tag) {
      newErrors.tag = 'Tag is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      createMutation.mutate(formData);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Оновлюємо локальний стан
    const updatedData = {
      ...formData,
      [name]: value,
    };
    setFormData(updatedData);
    
    // Зберігаємо в draft одразу при зміні
    setDraft({
      [name]: value,
    });
    
    // Очищаємо помилку для цього поля
    if (errors[name as keyof CreateNoteParams]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleCancel = () => {
    // При Cancel НЕ очищаємо draft
    if (onCancel) {
      onCancel();
    } else {
      router.push('/notes/filter');
    }
  };

  return (
    <form className={css.form} onSubmit={handleSubmit}>
      <div className={css.formGroup}>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className={css.input}
          placeholder="Enter note title..."
        />
        {errors.title && <span className={css.error}>{errors.title}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="content">Content</label>
        <textarea
          id="content"
          name="content"
          rows={8}
          value={formData.content}
          onChange={handleChange}
          className={css.textarea}
          placeholder="Enter note content..."
        />
        {errors.content && <span className={css.error}>{errors.content}</span>}
      </div>

      <div className={css.formGroup}>
        <label htmlFor="tag">Tag</label>
        <select
          id="tag"
          name="tag"
          value={formData.tag}
          onChange={handleChange}
          className={css.select}
        >
          <option value="Todo">Todo</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Meeting">Meeting</option>
          <option value="Shopping">Shopping</option>
        </select>
        {errors.tag && <span className={css.error}>{errors.tag}</span>}
      </div>

      <div className={css.actions}>
        <button
          type="button"
          className={css.cancelButton}
          onClick={handleCancel}
          disabled={createMutation.isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className={css.submitButton}
          disabled={createMutation.isPending}
        >
          {createMutation.isPending ? 'Creating...' : 'Create note'}
        </button>
      </div>
    </form>
  );
};

export default NoteForm;