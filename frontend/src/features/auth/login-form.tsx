'use client';

import {
  BackgroundImage,
  Box,
  Button,
  Card,
  Flex,
  Image,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import {
  IconAt,
  IconCircleCheck,
  IconCircleX,
  IconLock,
} from '@tabler/icons-react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

import { DEFAULT_REDIRECT } from '@/shared/routes';

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
    <Box>
      <BackgroundImage src="/assets/login-bg.svg">
        <Flex
          pl={{ base: 0, sm: 64, md: 128 }}
          justify={{ base: 'center', sm: 'start' }}
          align="center"
          h="100vh"
          w="100vw"
          bg="color.2"
        >
          <form onSubmit={form.onSubmit((values) => handleLogin(values))}>
            <Card
              shadow="sm"
              padding="xl"
              radius="md"
              w={{ base: 'full', md: 450 }}
            >
              <Card.Section inheritPadding py="md">
                <Stack gap={2} justify="center" align="center">
                  <Image
                    maw={300}
                    src="/assets/odontolog-logo.svg"
                    alt="Odontolog logo brand"
                  />
                  <Text size="xs" c="dimmed">
                    Conecte-se para acompanhar seus pacientes e procedimentos.
                  </Text>
                </Stack>
              </Card.Section>
              <Card.Section withBorder inheritPadding py="md" pb="xl">
                <TextInput
                  label="Email"
                  leftSection={<IconAt size={16} />}
                  placeholder="seu.nome@foufal.ufal.br"
                  key={form.key('email')}
                  {...form.getInputProps('email')}
                />
                <PasswordInput
                  leftSection={<IconLock size={16} />}
                  label="Senha"
                  placeholder="$enh@Forte123"
                  mt="md"
                  key={form.key('password')}
                  {...form.getInputProps('password')}
                />
                <Button fullWidth mt="xl" size="md" radius="md" type="submit">
                  Entrar
                </Button>
              </Card.Section>
            </Card>
          </form>
        </Flex>
      </BackgroundImage>
    </Box>
  );
}
