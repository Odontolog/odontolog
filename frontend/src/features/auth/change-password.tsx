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
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock } from '@tabler/icons-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

import { DEFAULT_REDIRECT } from '@/shared/routes';

interface ChangePassword {
  password: string;
  confirmPassword: string;
}

export default function ChangePasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get('next') ?? DEFAULT_REDIRECT;
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);

  const isFirstAccess = session?.user?.firstAccess === true;

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      password: '',
      confirmPassword: '',
    },
    validate: {
      confirmPassword: (value, values) =>
        value === values.password ? null : 'As senhas devem ser iguais',
    },
  });

  async function handleChangePassword(credentials: ChangePassword) {
    if (!credentials.password) {
      form.setErrors({ password: 'Este campo deve ser informado.' });
      return;
    }
    if (!credentials.confirmPassword) {
      form.setErrors({ confirmPassword: 'Este campo deve ser informado.' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/change-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.user.accessToken}`,
          },
          body: JSON.stringify({
            newPassword: credentials.password,
            confirmPassword: credentials.confirmPassword,
          }),
        },
      );

      if (!res.ok) {
        throw new Error(
          `[${res.status}] Erro criar procedimento para o plano de tratamento.`,
        );
      }

      // Se for primeiro acesso, força um novo login para garantir sessão atualizada
      if (isFirstAccess) {
        // Aguarda um pouco para garantir que o backend processou a mudança
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Força logout e redireciona para login com mensagem de sucesso
        await signOut({
          callbackUrl: '/login?message=password-changed',
          redirect: true,
        });
        return;
      }

      router.push(nextPath);
    } catch (error) {
      form.setErrors({ password: 'Erro ao alterar senha. Tente novamente.' });
    } finally {
      setIsLoading(false);
    }
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
          <form
            onSubmit={form.onSubmit((values) => handleChangePassword(values))}
          >
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
                  <Text size="xs" c="dimmed" ta="center">
                    {isFirstAccess
                      ? 'Bem-vindo! Para sua segurança, crie uma nova senha antes de continuar.'
                      : 'Crie uma nova senha segura para sua conta.'}
                  </Text>
                </Stack>
              </Card.Section>
              <Card.Section withBorder inheritPadding py="md" pb="xl">
                <PasswordInput
                  leftSection={<IconLock size={16} />}
                  label="Senha"
                  placeholder="$enh@Forte123"
                  mt="md"
                  key={form.key('password')}
                  {...form.getInputProps('password')}
                />
                <PasswordInput
                  leftSection={<IconLock size={16} />}
                  label="Confirme a senha"
                  placeholder="$enh@Forte123"
                  mt="md"
                  key={form.key('confirmPassword')}
                  {...form.getInputProps('confirmPassword')}
                />
                <Button
                  fullWidth
                  mt="xl"
                  size="md"
                  radius="md"
                  type="submit"
                  loading={isLoading}
                >
                  {isFirstAccess ? 'Confirmar e continuar' : 'Criar nova senha'}
                </Button>
              </Card.Section>
            </Card>
          </form>
        </Flex>
      </BackgroundImage>
    </Box>
  );
}
