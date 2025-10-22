'use client';

import {
  Card,
  // Center,
  Divider,
  Group,
  // Loader,
  // Stack,
  Text,
  // ThemeIcon,
  // Timeline,
} from '@mantine/core';
// import { IconExclamationCircle } from '@tabler/icons-react';
import { UseQueryOptions } from '@tanstack/react-query';

// import { Activity, Anamnese, Reviewable } from '@/shared/models';
import { Anamnese } from '@/shared/models';
// import { getActivityTitleFn } from '../utils';
// import ActivityItem from './activity-item';

export interface AnamneseHistorySectionProps {
  queryOptions: UseQueryOptions<Anamnese, Error, Anamnese, string[]>;
}

export default function AnamneseHistorySection() {
  // const { data, isLoading, isError } = useQuery({
  //   ...queryOptions,
  //   select: (data) => ({
  //     history: data.history,
  //   }),
  // });

  return (
    <Card withBorder shadow="sm" radius="md" px="sm">
      <Card.Section inheritPadding py="sm">
        <Group justify="space-between">
          <Text fw={600} size="lg">
            Histórico de modificações
          </Text>
        </Group>
      </Card.Section>

      <Divider my="none" />

      <Card.Section inheritPadding p="md">
        <div>opa</div>
        {/* <HistorySectionContent
          history={data?.history}
          type={data?.type}
          isLoading={isLoading}
          isError={isError}
        /> */}
      </Card.Section>
    </Card>
  );
}

// interface HistorySectionContentProps {
//   history?: Activity[];
//   type?: Reviewable['type'];
//   isLoading: boolean;
//   isError: boolean;
// }

// function HistorySectionContent(props: HistorySectionContentProps) {
//   const { history, isLoading, isError, type } = props;

//   if (isLoading) {
//     return (
//       <Center py="md">
//         <Loader size="sm" />
//       </Center>
//     );
//   }

//   if (isError) {
//     return (
//       <Stack align="center" gap="xs">
//         <ThemeIcon variant="white" color="red">
//           <IconExclamationCircle size={24} />
//         </ThemeIcon>
//         <Text size="sm" c="red" py="none">
//           Erro ao carregar histórico
//         </Text>
//       </Stack>
//     );
//   }

//   if (history === undefined || type === undefined) {
//     return null;
//   }

//   if (history.length === 0) {
//     return (
//       <Text size="sm" c="dimmed" ta="center">
//         Nenhuma atividade realizada.
//       </Text>
//     );
//   }

//   const activityTitleFn = getActivityTitleFn(type);

//   return (
//     <Timeline bulletSize={24} lineWidth={3}>
//       {history
//         .sort((a, b) => +a.createdAt - +b.createdAt)
//         .map((activity) => (
//           <ActivityItem
//             key={activity.id}
//             activity={activity}
//             getActivityTitle={activityTitleFn}
//           />
//         ))}
//     </Timeline>
//   );
// }
