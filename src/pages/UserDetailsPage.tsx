import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Stack,
  Avatar,
  Button,
  Divider,
  Box,
  Alert,
  CircularProgress,
  Chip,
  Snackbar,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import BusinessIcon from '@mui/icons-material/Business';
import WorkIcon from '@mui/icons-material/Work';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { useAppDispatch, useAppSelector } from '../store';
import {
  fetchUserById,
  updateUser,
  clearError,
  clearSelectedUser,
} from '../store/usersSlice';
import type { UserFormData } from '../types/user';
import { UserFormModal } from '../components/UserFormModal';

export const UserDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { selectedUser, items, loading, error } = useAppSelector(
    (state) => state.users
  );

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const cachedUser = items.find((u) => u.id === id);
  const user = selectedUser?.id === id ? selectedUser : cachedUser || null;

  useEffect(() => {
    if (id) {
      dispatch(fetchUserById(id));
    }
    return () => {
      dispatch(clearSelectedUser());
    };
  }, [id, dispatch]);

  const handleUpdateSubmit = async (formData: UserFormData) => {
    if (!id) return;
    const resultAction = await dispatch(updateUser({ id, data: formData }));
    if (updateUser.fulfilled.match(resultAction)) {
      setSuccessMessage('Профиль пользователя успешно обновлен');
      setEditModalOpen(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          color="inherit"
        >
          Назад к списку
        </Button>

        {user && (
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={() => setEditModalOpen(true)}
          >
            Редактировать профиль
          </Button>
        )}
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => dispatch(clearError())}
          action={
            id ? (
              <Button
                color="inherit"
                size="small"
                onClick={() => dispatch(fetchUserById(id))}
              >
                Повторить
              </Button>
            ) : null
          }
        >
          {error}
        </Alert>
      )}

      {loading && !user ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <CircularProgress />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Загрузка профиля пользователя...
          </Typography>
        </Paper>
      ) : !user ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="h6" gutterBottom>
            Пользователь не найден
          </Typography>
          <Button variant="outlined" onClick={() => navigate('/')} sx={{ mt: 1 }}>
            Вернуться на главную
          </Button>
        </Paper>
      ) : (
        <Paper elevation={2} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            spacing={3}
            sx={{
              alignItems: { xs: 'center', sm: 'flex-start' },
            }}
          >
            <Avatar
              src={user.avatar}
              alt={user.name}
              sx={{ width: 110, height: 110, fontSize: 36 }}
            />

            <Box sx={{ textAlign: { xs: 'center', sm: 'left' }, flexGrow: 1 }}>
              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={1.5}
                sx={{
                  alignItems: 'center',
                  mb: 1,
                }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {user.name}
                </Typography>
                <Chip label={`ID: ${user.id}`} size="small" variant="outlined" />
              </Stack>

              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {user.jobTitle || 'Должность не указана'}
              </Typography>

              {user.bio && (
                <Typography variant="body1" sx={{ mt: 2 }}>
                  {user.bio}
                </Typography>
              )}
            </Box>
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Контактная и рабочая информация
          </Typography>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2.5,
            }}
          >
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <EmailIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Электронная почта
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user.email}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <PhoneIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Телефон
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user.phone}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <LocationCityIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Город
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user.city || 'Не указан'}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <BusinessIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Компания
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user.company || 'Не указана'}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
              <WorkIcon color="action" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Должность
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {user.jobTitle || 'Не указана'}
                </Typography>
              </Box>
            </Stack>

            {user.createdAt && (
              <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                <CalendarTodayIcon color="action" />
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Дата создания профиля
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {new Date(user.createdAt).toLocaleDateString('ru-RU', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </Typography>
                </Box>
              </Stack>
            )}
          </Box>
        </Paper>
      )}

      <UserFormModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSubmit={handleUpdateSubmit}
        initialData={user}
      />

      <Snackbar
        open={Boolean(successMessage)}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          variant="filled"
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};