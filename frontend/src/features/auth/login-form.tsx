'use client';

import { Button, Paper, PasswordInput, TextInput, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { IconCircleCheck, IconCircleX } from '@tabler/icons-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { DEFAULT_REDIRECT } from '@/shared/routes';
import classes from './login-form.module.css';

interface LoginCredentials {
  email: string;
  password: string;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') ?? DEFAULT_REDIRECT;

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      email: '',
      password: '',
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Email inválido'),
    },
  });

  async function handleLogin(credentials: LoginCredentials) {
    if (!credentials.email) {
      form.setErrors({ email: 'Email deve ser informado.' });
      return;
    }
    if (!credentials.password) {
      form.setErrors({ password: 'Senha deve ser informada.' });
      return;
    }

    const res = await signIn('credentials', {
      email: credentials.email,
      password: credentials.password,
      redirect: false,
    });

    if (res.code === 'SERVER_DOWN') {
      notifications.show({
        title: 'Serviço offline!',
        message:
          'Não foi possível se comunicar com o serviço. Tente novamente mais tarde.',
        color: 'red',
        icon: <IconCircleX />,
      });
      return;
    }

    if (res.code === 'INVALID_CREDENTIALS') {
      notifications.show({
        title: 'Credenciais inválidas',
        message: 'Tem certeza que colocou as informações corretas?',
        color: 'red',
        icon: <IconCircleX />,
      });
      form.setErrors({
        password: 'Credencial inválida',
        email: 'Credencial inválida',
      });
      return;
    }

    if (res.error !== undefined) {
      notifications.show({
        title: 'Algo deu errado',
        message:
          'Tente novamente mais tarde. Se persistir, entre em contato com os administradores.',
        color: 'red',
        icon: <IconCircleX />,
      });
      return;
    }

    notifications.show({
      title: 'Bem vindo novamente!',
      message: 'Estamos felizes por ter você de volta.',
      color: 'green',
      icon: <IconCircleCheck />,
    });

    router.push(nextPath);
  }

  return (
    <div className={classes.wrapper}>
      <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
        <Paper className={classes.form}>
          <Title order={2} className={classes.title}>
            Welcome back to Mantine!
          </Title>

          <TextInput
            label="Email address"
            placeholder="hello@gmail.com"
            size="md"
            radius="md"
            key={form.key('email')}
            {...form.getInputProps('email')}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            mt="md"
            size="md"
            radius="md"
            key={form.key('password')}
            {...form.getInputProps('password')}
          />
          <Button fullWidth mt="xl" size="md" radius="md" type="submit">
            Login
          </Button>
        </Paper>
      </form>
    </div>
  );
}
