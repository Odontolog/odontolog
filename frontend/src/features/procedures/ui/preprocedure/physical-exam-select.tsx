'use client';

import { Combobox, Input, InputBase, useCombobox } from '@mantine/core';

interface PhysicalExameSelect {
  value: string | null;
  setValue: (value: string | null) => void;
}

export function PhysicalExameSelect({ value, setValue }: PhysicalExameSelect) {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  return (
    <Combobox
      store={combobox}
      withinPortal
      onOptionSubmit={(val) => {
        setValue(val);
        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          component="button"
          type="button"
          pointer
          rightSection={<Combobox.Chevron />}
          onClick={() => combobox.toggleDropdown()}
          rightSectionPointerEvents="none"
        >
          {value ?? (
            <Input.Placeholder>
              Escolha o tipo de exame físico que vai realizar
            </Input.Placeholder>
          )}
        </InputBase>
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          <Combobox.Option value="Exame Extra Oral">
            1. Exame Extra Oral
          </Combobox.Option>
          <Combobox.Group label="Exames Intra Orais">
            <Combobox.Option value="Exame dos Tecidos Moles">
              2. Exame dos Tecidos Moles
            </Combobox.Option>
            <Combobox.Option value="Registro de Periograma Simplificado (RPS)">
              3. Registro de Periograma Simplificado (RPS)
            </Combobox.Option>
            <Combobox.Option value="Periograma">4. Periograma</Combobox.Option>
            <Combobox.Option value="Registro do Controle de Biofilme Dentário">
              5. Registro do Controle de Biofilme Dentário
            </Combobox.Option>
            <Combobox.Option value="Endodontia">6. Endodontia</Combobox.Option>
          </Combobox.Group>
          <Combobox.Group label="Outros">
            <Combobox.Option value="Exames Complementares">
              7. Exames Complementares
            </Combobox.Option>
          </Combobox.Group>
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
