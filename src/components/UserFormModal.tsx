import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
} from '@mui/material';
import type { User, UserFormData } from '../types/user';
import { useAppDispatch, useAppSelector } from '../store';
import { clearActionError } from '../store/usersSlice';

interface UserFormModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: UserFormData) => Promise<void>;
  initialData?: User | null;
}

const emptyForm: UserFormData = {
  name: '',
  email: '',
  phone: '',
  city: '',
  company: '',
  jobTitle: '',
  avatar: '',
  bio: '',
};

export const UserFormModal: React.FC<UserFormModalProps> = ({
  open,
  onClose,
  onSubmit,
  initialData,
}) => {
  const dispatch = useAppDispatch();
  const { actionLoading, actionError } = useAppSelector((state) => state.users);

  const [formData, setFormData] = useState<UserFormData>(emptyForm);
  const [validationError, setValidationError] = useState<string | null>(null);

  const isEditMode = Boolean(initialData);

  useEffect(() => {
    if (open) {
      dispatch(clearActionError());
      setValidationError(null);
      if (initialData) {
        setFormData({
          name: initialData.name || '',
          email: initialData.email || '',
          phone: initialData.phone || '',
          city: initialData.city || '',
          company: initialData.company || '',
          jobTitle: initialData.jobTitle || '',
          avatar: initialData.avatar || '',
          bio: initialData.bio || '',
        });
      } else {
        setFormData(emptyForm);
      }
    }
  }, [open, initialData, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (validationError) {
      setValidationError(null);
    }
  };

  const validate = (): boolean => {
    if (!formData.name.trim()) {
      setValidationError('Поле «Имя» обязательно для заполнения');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim() || !emailRegex.test(formData.email.trim())) {
      setValidationError('Введите корректный адрес электронной почты');
      return false;
    }
    if (!formData.phone.trim()) {
      setValidationError('Поле «Телефон» обязательно для заполнения');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const payload: UserFormData = {
      ...formData,
      avatar:
        formData.avatar.trim() ||
        `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(formData.name)}`,
    };

    await onSubmit(payload);
  };

  return (
    <Dialog open={open} onClose={actionLoading ? undefined : onClose} fullWidth maxWidth="sm">
      <form onSubmit={handleSubmit} noValidate>
        <DialogTitle sx={{ fontWeight: 600 }}>
          {isEditMode ? 'Редактировать пользователя' : 'Создать пользователя'}
        </DialogTitle>

        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 0.5 }}>
            {(validationError || actionError) && (
              <Alert severity="error" onClose={() => {
                setValidationError(null);
                dispatch(clearActionError());
              }}>
                {validationError || actionError}
              </Alert>
            )}

            <TextField
              label="ФИО / Имя *"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
              disabled={actionLoading}
            />

            <TextField
              label="Email *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
              disabled={actionLoading}
            />

            <TextField
              label="Телефон *"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
              required
              disabled={actionLoading}
            />

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Город"
                name="city"
                value={formData.city}
                onChange={handleChange}
                fullWidth
                disabled={actionLoading}
              />

              <TextField
                label="Компания"
                name="company"
                value={formData.company}
                onChange={handleChange}
                fullWidth
                disabled={actionLoading}
              />
            </Stack>

            <TextField
              label="Должность"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleChange}
              fullWidth
              disabled={actionLoading}
            />

            <TextField
              label="Ссылка на аватар (необязательно)"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              fullWidth
              placeholder="https://example.com/avatar.jpg"
              disabled={actionLoading}
            />

            <TextField
              label="О пользователе"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              fullWidth
              multiline
              rows={3}
              disabled={actionLoading}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={onClose} color="inherit" disabled={actionLoading}>
            Отмена
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={actionLoading}
            startIcon={actionLoading ? <CircularProgress size={18} color="inherit" /> : null}
          >
            {isEditMode ? 'Сохранить изменения' : 'Создать'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default UserFormModal;