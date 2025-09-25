import { Container, Text, Title } from '@mantine/core';

import { Illustration } from './not-found-illustration';
import classes from './not-found.module.css';

interface NotFoundProps {
  title: string;
  description: string;
}

export default function NotFound(props: NotFoundProps) {
  return (
    <Container className={classes.root}>
      <div className={classes.inner}>
        <Illustration className={classes.image} />
        <div className={classes.content}>
          <Title className={classes.title}>{props.title}</Title>
          <Text
            c="dimmed"
            size="lg"
            ta="center"
            className={classes.description}
          >
            {props.description}
          </Text>
        </div>
      </div>
    </Container>
  );
}
