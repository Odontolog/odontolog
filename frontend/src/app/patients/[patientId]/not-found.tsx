import { Button, Container, Group, Text, Title } from '@mantine/core';

import { Illustration } from '@/shared/components/not-found-illustration';
import classes from './not-found.module.css';

export default function PatientNoFound() {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>Paciente não encontrado</Title>
          <Text
            c="dimmed"
            size="lg"
            ta="center"
            className={classes.description}
          >
            A página que você tentou acessar não existe. Cheque novamente o
            endereço inserido.
          </Text>
          <Group justify="center">
            <Button size="md">Voltar para a página inicial</Button>
          </Group>
        </div>
      </div>
    </Container>
  );
}
