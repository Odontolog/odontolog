package br.ufal.ic.odontolog.enums;

public enum ClinicalCondition {
  BLOOD_PRESSURE,
  CARDIAC,
  PULMONARY,
  RENAL,
  INTESTINAL,
  HEPATIC,
  PANCREATIC,
  ENDOCRINE,
  NEUROLOGICAL,
  HEMATOLOGICAL,
  NEOPLASTIC,
  CHEMO_RADIOTHERAPY,
  MEDICATIONS,
  IMMUNOLOGICAL_ALLERGY,

  // Female Conditions
  MENARCHE,
  REGULAR_MENSTRUAL_CYCLE,
  CONTRACEPTIVE_USE,
  PREGNANCY,
  CLIMACTERIC_PERIMENOPAUSE,
  MENOPAUSE,
  HORMONE_REPLACEMENT,
  OTHER_CONDITIONS,

  // Habits and Addictions
  SMOKING,
  ALCOHOL,
  OTHER_HABITS;

  public String getDescription() {
    return switch (this) {
      case BLOOD_PRESSURE -> "Pressão Arterial";
      case CARDIAC -> "Cardíaca";
      case PULMONARY -> "Pulmonar";
      case RENAL -> "Renal";
      case INTESTINAL -> "Intestinal";
      case HEPATIC -> "Hepática";
      case PANCREATIC -> "Pancreática";
      case ENDOCRINE -> "Endócrina";
      case NEUROLOGICAL -> "Neurológica";
      case HEMATOLOGICAL -> "Hematológica";
      case NEOPLASTIC -> "Neoplásica";
      case CHEMO_RADIOTHERAPY -> "Quimioterapia / Radioterapia";
      case MEDICATIONS -> "Medicamentos";
      case IMMUNOLOGICAL_ALLERGY -> "Imunológica / Alergia";
      case MENARCHE -> "Menarca";
      case REGULAR_MENSTRUAL_CYCLE -> "Ciclo Menstrual Regular";
      case CONTRACEPTIVE_USE -> "Anticoncepcional";
      case PREGNANCY -> "Gravidez";
      case CLIMACTERIC_PERIMENOPAUSE -> "Climatério (Perimenopausa)";
      case MENOPAUSE -> "Menopausa";
      case HORMONE_REPLACEMENT -> "Reposição Hormonal";
      case OTHER_CONDITIONS -> "Outras Condições";
      case SMOKING -> "Fumo";
      case ALCOHOL -> "Bebida";
      case OTHER_HABITS -> "Outros Hábitos";
    };
  }
}
