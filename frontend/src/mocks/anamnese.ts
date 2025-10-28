import {
  Anamnese,
  AnamneseFormValues,
  ConditionFormValue,
} from '@/features/anamnese/models';

export const mockAnamnese: Anamnese = {
  patientId: '123',
  notes:
    'Paciente relata boa higiene oral e visitas regulares ao dentista. Não apresenta dor ou desconforto no momento.',
  conditions: [
    {
      id: '1',
      condition: 'BLOOD_PRESSURE',
      category: 'MEDICAL',
      hasCondition: true,
      notes:
        'Hipertenso controlado com losartana 50mg/dia.\n\nAtualização 20/09: Paciente trouxe exame.',
    },
    {
      id: '2',
      condition: 'CARDIAC',
      category: 'MEDICAL',
      hasCondition: false,
      notes:
        'Paciente relata boa higiene oral e visitas regulares ao dentista. Não apresenta dor ou desconforto no momento.Paciente relata boa higiene oral e visitas regulares ao dentista. Não apresenta dor ou desconforto no momento.Paciente relata boa higiene oral e visitas regulares ao dentista. Não apresenta dor ou desconforto no momento.',
    },
    {
      id: '3',
      condition: 'PULMONARY',
      category: 'MEDICAL',
      hasCondition: false,
      notes: '',
    },
    {
      id: '4',
      condition: 'RENAL',
      category: 'MEDICAL',
      hasCondition: false,
      notes: '',
    },
    {
      id: '5',
      condition: 'INTESTINAL',
      category: 'MEDICAL',
      hasCondition: false,
      notes: '',
    },
    {
      id: '6',
      condition: 'HEPATIC',
      category: 'MEDICAL',
      hasCondition: false,
      notes: '',
    },
    {
      id: '7',
      condition: 'PANCREATIC',
      category: 'MEDICAL',
      hasCondition: false,
      notes: '',
    },
    {
      id: '8',
      condition: 'ENDOCRINE',
      category: 'MEDICAL',
      hasCondition: true,
      notes: 'Diabetes tipo 2 diagnosticada há 5 anos.',
    },
    {
      id: '9',
      condition: 'NEUROLOGICAL',
      category: 'MEDICAL',
      hasCondition: false,
      notes: '',
    },
    {
      id: '10',
      condition: 'HEMATOLOGICAL',
      category: 'MEDICAL',
      hasCondition: false,
      notes: '',
    },
    {
      id: '11',
      condition: 'NEOPLASTIC',
      category: 'MEDICAL',
      hasCondition: false,
      notes: '',
    },
    {
      id: '12',
      condition: 'CHEMO_RADIOTHERAPY',
      category: 'MEDICAL',
      hasCondition: false,
      notes: '',
    },
    {
      id: '13',
      condition: 'MEDICATIONS',
      category: 'MEDICAL',
      hasCondition: true,
      notes: 'Usa metformina 850mg/dia e losartana 50mg/dia.',
    },
    {
      id: '14',
      condition: 'IMMUNOLOGICAL_ALLERGY',
      category: 'MEDICAL',
      hasCondition: true,
      notes: 'Alergia a dipirona (rash cutâneo leve).',
    },
  ],
  history: [
    {
      id: 1,
      type: 'EDIT_CONDITIONS',
      actor: {
        id: '11',
        name: 'João Pereira',
        email: 'joao.pereira@clinic.edu',
        role: 'STUDENT',
      },
      description:
        'Histórica clínica atualiza por João Pereira (joao.pereira@clinic.edu)',
      metadata: {
        updatedFields: [
          {
            condition: 'BLOOD_PRESSURE',
            hasCondition: false,
            notes: 'Hipertenção controlado com losartana 50mg/dia.',
          },
        ],
      },
      createdAt: new Date('2025-10-20T09:15:00Z'),
    },
    {
      id: 2,
      type: 'EDIT_CONDITIONS',
      actor: {
        id: '11',
        name: 'João Pereira',
        email: 'joao.pereira@clinic.edu',
        role: 'STUDENT',
      },
      description:
        'Histórica clínica atualiza por João Pereira (joao.pereira@clinic.edu)',
      metadata: {
        updatedFields: [
          {
            condition: 'BLOOD_PRESSURE',
            hasCondition: true,
            notes: 'Hipertenção controlado com losartana 50mg/dia.',
          },
        ],
      },
      createdAt: new Date('2025-10-20T09:20:00Z'),
    },
    {
      id: 3,
      type: 'EDIT_NOTES',
      actor: {
        id: '11',
        name: 'João Pereira',
        email: 'joao.pereira@clinic.edu',
        role: 'STUDENT',
      },
      description:
        'Notas de anamnese atualizadas por João Pereira (joao.pereira@clinic.edu)',
      metadata: {
        data: 'Paciente trouxe exame de sangue atualizado na última consulta.',
      },
      createdAt: new Date('2025-10-20T09:25:00Z'),
    },
    {
      id: 4,
      type: 'EDIT_CONDITIONS',
      actor: {
        id: '21',
        name: 'Dra. Helena Costa',
        email: 'helena.costa@clinic.edu',
        role: 'SUPERVISOR',
      },
      description:
        'Histórica clínica atualizada por Dra. Helena Costa (helena.costa@clinic.edu)',
      metadata: {
        updatedFields: [
          {
            condition: 'BLOOD_PRESSURE',
            hasCondition: true,
            notes:
              'Hipertenção controlado com losartana 50mg/dia.\n\nAtualização 20/09: Paciente trouxe exame.',
          },
          {
            condition: 'ENDOCRINE',
            hasCondition: true,
            notes: 'Diabetes tipo 2 diagnosticada há 5 anos.',
          },
        ],
      },
      createdAt: new Date('2025-10-21T10:10:00Z'),
    },
  ],
};

export function updateMockAnamneseNotes(value: string) {
  mockAnamnese.notes = value;
}

export function updateMockAnamnese(anamnese: AnamneseFormValues) {
  const incomingConditions = anamnese.conditions;
  if (!Array.isArray(incomingConditions)) {
    return;
  }

  incomingConditions.forEach((cond: ConditionFormValue, idx: number) => {
    const target = mockAnamnese.conditions[idx];

    target.hasCondition = Boolean(cond.hasCondition);
    target.notes = cond.notes;
  });
}
