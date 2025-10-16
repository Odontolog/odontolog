'use client';

import { Button, Container, Group, Text, Title } from '@mantine/core';
import classes from './server-error.module.css';

interface ServerErrorProps {
  title: string;
  description: string;
  reset?: () => void;
}

export function ServerError(props: ServerErrorProps) {
  return (
    <Container className={classes.root}>
      <div className={classes.label}>500</div>
      <Title className={classes.title}>{props.title}</Title>
      <Text c="dimmed" size="lg" ta="center" className={classes.description}>
        {props.description}
      </Text>
      <Group justify="center">
        <Button variant="subtle" size="md" onClick={props.reset}>
          Atualizar a página
        </Button>
      </Group>
    </Container>
  );
}
