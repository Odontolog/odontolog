import { Button, Container, Text, Title } from '@mantine/core';
import Link from 'next/link';

import { Illustration } from './not-found-illustration';
import classes from './not-found.module.css';

interface NotFoundProps {
  title: string;
  description: string;
  goBackUrl?: string;
}

export default function NotFound(props: NotFoundProps) {
  const goBackUrl = props.goBackUrl ?? '/';

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
          <div className={classes.action}>
            <Button component={Link} size="md" href={goBackUrl}>
              Me leve de volta
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
