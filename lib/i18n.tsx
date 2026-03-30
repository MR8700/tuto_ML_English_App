import { createContext, useContext, useState, ReactNode } from 'react';

export type Language = 'en' | 'fr';

export interface Translations {
  // Header
  title: string;
  subtitle: string;
  localClimate: string;
  soundOn: string;
  soundOff: string;

  // Controls
  seasonControls: string;
  rainfallIntensity: string;
  rainfallVariability: string;
  seasonLength: string;
  days: string;
  speed: string;
  normal: string;
  fast: string;
  soilQuality: string;
  region: string;
  scenarios: string;
  goodScenario: string;
  badScenario: string;
  unpredictableScenario: string;
  start: string;
  pause: string;
  resume: string;
  reset: string;
  importExcel: string;
  clearImported: string;
  importing: string;
  imported: string;

  // Dataset Example
  sampleDataset: string;
  sampleDescription: string;
  downloadSample: string;
  formatRequired: string;
  formatNote: string;

  // Charts
  avgRainfall: string;
  healthIndex: string;
  currentDay: string;
  of: string;

  // Status
  status: string;
  goodHarvest: string;
  healthyGrowth: string;
  waterStress: string;
  droughtRisk: string;

  // Prediction
  predictedYield: string;
  low: string;
  medium: string;
  high: string;
  aiYieldPrediction: string;
  category: string;
  tonsPerHectare: string;

  // Explainer
  whatIsHappening: string;
  rainySeason: string;
  drySeason: string;
  irregularRainfall: string;

  // Data Preview
  noDataUploaded: string;
  loadSampleData: string;
  uploadedDataPreview: string;
  rows: string;
  avgRain: string;

  // Crop Simulation
  simulationView: string;
  seedToMaturity: string;
  seed: string;
  growing: string;
  healthy: string;
  mature: string;
  dry: string;
  dead: string;

  // Dynamic Explainer
  lowRainfall: string;
  heavyRainfall: string;
  optimalRainfall: string;
  criticalHealth: string;
  decliningHealth: string;
  goodHealth: string;
  poorSoil: string;
  goodSoil: string;
  seedStage: string;
  growingStage: string;
  matureStage: string;

  createAccount: string;
  signIn: string;
  toUploadExcel: string;
  toAccessExcel: string;
  firstName: string;
  lastName: string;
  gmailAddress: string;
  password: string;
  confirmPassword: string;
  createAccountBtn: string;
  signInBtn: string;
  alreadyHaveAccount: string;
  dontHaveAccount: string;
  passwordRequirements: string;
  passwordReq1: string;
  passwordReq2: string;
  passwordReq3: string;
  passwordReq4: string;
  passwordReq5: string;
  passwordReq6: string;
  passwordValid: string;

  // Auth errors
  registrationFailed: string;
  signInFailed: string;
  emailOrPasswordIncorrect: string;
  scenarioLoaded: string;
  pleaseSignIn: string;
  welcome: string;
  importingFile: string;
  excelImported: string;
  importFailed: string;
  importedCleared: string;

  // Alerts
  alertTitle: string;
  droughtAlert: string;
  waterStressAlert: string;
  excessRainAlert: string;
  poorSoilAlert: string;
  optimalConditions: string;
  rareRainAlert: string;
  soilRecovery: string;
  criticalDrought: string;
  heavyRainWarning: string;
  soilDegradation: string;
  recoveryPhase: string;
  stableConditions: string;
  irrigationNeeded: string;
  soilImprovement: string;
}

const translations: Record<Language, Translations> = {
  en: {
    // Header
    title: 'Rainfall Impact and Crop Productivity Simulator',
    subtitle: 'Burkina Faso context: irregular rainfall can quickly shift crops from healthy growth to drought risk.',
    localClimate: 'Local climate:',
    soundOn: 'Sound: On',
    soundOff: 'Sound: Off',

    // Controls
    seasonControls: 'Season Controls',
    rainfallIntensity: 'Rainfall Intensity',
    rainfallVariability: 'Rainfall Variability',
    seasonLength: 'Season Length',
    days: 'days',
    speed: 'Speed',
    normal: 'Normal',
    fast: 'Fast',
    soilQuality: 'Soil Quality',
    region: 'Region',
    scenarios: 'Scenarios',
    goodScenario: 'Good',
    badScenario: 'Bad',
    unpredictableScenario: 'Unpredictable',
    start: 'Start',
    pause: 'Pause',
    resume: 'Resume',
    reset: 'Reset',
    importExcel: 'Import Excel',
    clearImported: 'Clear Imported',
    importing: 'Importing',
    imported: 'Imported',
    rows: 'rows',

    // Dataset Example
    sampleDataset: 'Sample Dataset (Excel Format)',
    sampleDescription: 'Daily rainfall, temperature, soil, and yield data for Burkina Faso rainy season',
    downloadSample: '⬇ Download Sample Excel File',
    formatRequired: 'Format required: Excel (.xlsx or .xls) with columns: Date, Rainfall, Temperature, Soil, Yield',
    formatNote: 'Note: Your data must follow this exact structure to be properly imported.',

    // Charts
    avgRainfall: 'Avg rainfall',
    healthIndex: 'Health index',
    currentDay: 'Current day',
    of: 'of',

    // Status
    status: 'Status:',
    goodHarvest: 'Good harvest expected',
    healthyGrowth: 'Healthy growth',
    waterStress: 'Water stress',
    droughtRisk: 'Drought risk',

    // Prediction
    predictedYield: 'Predicted Yield',
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    aiYieldPrediction: 'AI Yield Prediction',
    category: 'Category',
    tonsPerHectare: 't/ha',

    // Explainer
    whatIsHappening: 'What is happening now?',
    rainySeason: 'Rainy season in Burkina Faso usually runs from June to September.',
    drySeason: 'Dry season usually runs from October to May.',
    irregularRainfall: 'Irregular rainfall affects crop productivity through drought spells and stress periods.',

    // Data Preview
    noDataUploaded: 'No data uploaded yet',
    loadSampleData: 'Load Sample Data',
    uploadedDataPreview: 'Uploaded Data Preview',
    avgRain: 'Avg Rain',

    // Crop Simulation
    simulationView: 'Simulation View',
    seedToMaturity: 'Seed to maturity based on rainfall and stress.',
    seed: 'Seed',
    growing: 'Growing',
    healthy: 'Healthy',
    mature: 'Mature',
    dry: 'Dry',
    dead: 'Dead',

    // Dynamic Explainer
    lowRainfall: '🌵 Very low rainfall detected. This dry period is stressing the crops and may lead to drought conditions if it continues.',
    heavyRainfall: '🌧️ Heavy rainfall today. While some water is good, too much can cause waterlogging and affect root health.',
    optimalRainfall: '✅ Today\'s rainfall is in the optimal range for crop growth. This supports healthy development.',
    criticalHealth: '🚨 Crop health is critically low. The plant is suffering from prolonged stress, likely due to insufficient water or poor soil conditions.',
    decliningHealth: '⚠️ Crop health is declining. The plant needs better water management and possibly improved soil quality.',
    goodHealth: '🌱 The crop is growing well with good health indicators. Current conditions are supporting strong development.',
    poorSoil: '🪨 Soil quality is poor. Low nutrient levels are limiting the plant\'s ability to grow optimally.',
    goodSoil: '🌾 Good soil quality is providing adequate nutrients for crop development.',
    seedStage: '🌱 The crop is in the early seeding stage. It needs consistent moisture to establish strong roots.',
    growingStage: '📈 The plant is actively growing. This is a critical period requiring balanced water and nutrients.',
    matureStage: '🌾 The crop has reached maturity. Harvest conditions are now the main concern.',

    createAccount: 'Create Account',
    signIn: 'Sign In',
    toUploadExcel: 'to upload your Excel dataset',
    toAccessExcel: 'to access Excel upload',
    firstName: 'First Name',
    lastName: 'Last Name',
    gmailAddress: 'Gmail Address',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    createAccountBtn: 'Create Account',
    signInBtn: 'Sign In',
    alreadyHaveAccount: 'Already have an account? Sign In',
    dontHaveAccount: "Don't have an account? Sign Up",
    passwordRequirements: 'Password requirements:',
    passwordReq1: '• At least 6 characters',
    passwordReq2: '• One uppercase letter (A-Z)',
    passwordReq3: '• One lowercase letter (a-z)',
    passwordReq4: '• One digit (0-9)',
    passwordReq5: '• One special character (!@#$%...)',
    passwordReq6: '• No spaces allowed',
    passwordValid: '✓ Password meets requirements',

    // Auth errors
    registrationFailed: 'Registration failed',
    signInFailed: 'Sign in failed',
    emailOrPasswordIncorrect: 'Email or password incorrect',
    scenarioLoaded: 'Scenario loaded:',
    pleaseSignIn: 'Please sign in or create an account to upload your Excel dataset.',
    welcome: 'Welcome',
    importingFile: 'Importing',
    excelImported: 'Excel imported:',
    importFailed: 'Import failed.',
    importedCleared: 'Imported dataset cleared. Simulation switched back to generated rainfall.',

    // Alerts
    alertTitle: '🌱 Real-time Plant Status',
    droughtAlert: '🚨 Drought Alert: Plant is suffering from severe water shortage. Immediate irrigation needed.',
    waterStressAlert: '⚠️ Water Stress: Plant shows signs of dehydration. Monitor soil moisture closely.',
    excessRainAlert: '🌧️ Excess Rain Warning: Too much water may cause root rot. Ensure good drainage.',
    poorSoilAlert: '🪨 Poor Soil Quality: Soil nutrients are low. Consider fertilization.',
    optimalConditions: '✅ Optimal Conditions: Plant is growing under ideal conditions.',
    rareRainAlert: '🌵 Rare Rainfall: Very little rain detected. Water conservation is critical.',
    soilRecovery: '🌱 Soil Recovery: Soil quality is improving with proper care.',
    criticalDrought: '🔥 Critical Drought: Plant survival is at risk. Emergency watering required.',
    heavyRainWarning: '⛈️ Heavy Rain Warning: Intense rainfall may cause soil erosion.',
    soilDegradation: '⚠️ Soil Degradation: Soil quality is declining. Soil management needed.',
    recoveryPhase: '🌿 Recovery Phase: Plant is recovering from stress conditions.',
    stableConditions: '📈 Stable Conditions: Plant growth is steady and healthy.',
    irrigationNeeded: '💧 Irrigation Needed: Supplemental watering recommended.',
    soilImprovement: '🌾 Soil Improvement: Soil quality has improved significantly.',
  },
  fr: {
    // Header
    title: 'Simulateur d\'Impact des Pluies et Productivité Agricole',
    subtitle: 'Contexte Burkina Faso : les pluies irrégulières peuvent rapidement faire passer les cultures d\'une croissance saine au risque de sécheresse.',
    localClimate: 'Climat local :',
    soundOn: 'Son : Activé',
    soundOff: 'Son : Désactivé',

    // Controls
    seasonControls: 'Contrôles de Saison',
    rainfallIntensity: 'Intensité des Pluies',
    rainfallVariability: 'Variabilité des Pluies',
    seasonLength: 'Durée de Saison',
    days: 'jours',
    speed: 'Vitesse',
    normal: 'Normal',
    fast: 'Rapide',
    soilQuality: 'Qualité du Sol',
    region: 'Région',
    scenarios: 'Scénarios',
    goodScenario: 'Bon',
    badScenario: 'Mauvais',
    unpredictableScenario: 'Imprévisible',
    start: 'Démarrer',
    pause: 'Pause',
    resume: 'Reprendre',
    reset: 'Réinitialiser',
    importExcel: 'Importer Excel',
    clearImported: 'Effacer Importé',
    importing: 'Importation',
    imported: 'Importé',
    rows: 'lignes',

    // Dataset Example
    sampleDataset: 'Exemple de Dataset (Format Excel)',
    sampleDescription: 'Données quotidiennes de pluie, température, sol et rendement pour la saison des pluies au Burkina Faso',
    downloadSample: '⬇ Télécharger Fichier Excel Exemple',
    formatRequired: 'Format requis : Excel (.xlsx ou .xls) avec colonnes : Date, Pluie, Température, Sol, Rendement',
    formatNote: 'Note : Vos données doivent suivre cette structure exacte pour être correctement importées.',

    // Charts
    avgRainfall: 'Pluie moy.',
    healthIndex: 'Indice santé',
    currentDay: 'Jour actuel',
    of: 'sur',

    // Status
    status: 'État :',
    goodHarvest: 'Bonne récolte attendue',
    healthyGrowth: 'Croissance saine',
    waterStress: 'Stress hydrique',
    droughtRisk: 'Risque de sécheresse',

    // Prediction
    predictedYield: 'Rendement Prévu',
    low: 'Faible',
    medium: 'Moyen',
    high: 'Élevé',
    aiYieldPrediction: 'Prédiction de Rendement IA',
    category: 'Catégorie',
    tonsPerHectare: 't/ha',

    // Explainer
    whatIsHappening: 'Que se passe-t-il maintenant ?',
    rainySeason: 'La saison des pluies au Burkina Faso dure généralement de juin à septembre.',
    drySeason: 'La saison sèche dure généralement d\'octobre à mai.',
    irregularRainfall: 'Les pluies irrégulières affectent la productivité des cultures par des périodes de sécheresse et de stress.',

    // Data Preview
    noDataUploaded: 'Aucune donnée téléchargée pour le moment',
    loadSampleData: 'Charger Données Exemple',
    uploadedDataPreview: 'Aperçu des Données Téléchargées',
    avgRain: 'Pluie moy.',

    // Crop Simulation
    simulationView: 'Vue de Simulation',
    seedToMaturity: 'De la graine à la maturité selon les pluies et le stress.',
    seed: 'Graine',
    growing: 'Croissance',
    healthy: 'Saine',
    mature: 'Mature',
    dry: 'Sèche',
    dead: 'Morte',

    // Dynamic Explainer
    lowRainfall: '🌵 Pluie très faible détectée. Cette période sèche stresse les cultures et peut entraîner des conditions de sécheresse si elle continue.',
    heavyRainfall: '🌧️ Forte pluie aujourd\'hui. Bien que l\'eau soit bonne, trop peut causer un engorgement et affecter la santé des racines.',
    optimalRainfall: '✅ La pluie d\'aujourd\'hui est dans la plage optimale pour la croissance des cultures. Cela soutient un développement sain.',
    criticalHealth: '🚨 La santé des cultures est extrêmement faible. La plante souffre d\'un stress prolongé, probablement dû à un manque d\'eau ou à de mauvaises conditions du sol.',
    decliningHealth: '⚠️ La santé des cultures décline. La plante a besoin d\'une meilleure gestion de l\'eau et possiblement d\'une amélioration de la qualité du sol.',
    goodHealth: '🌱 La culture se développe bien avec de bons indicateurs de santé. Les conditions actuelles soutiennent un développement solide.',
    poorSoil: '🪨 La qualité du sol est pauvre. Les faibles niveaux de nutriments limitent la capacité de la plante à se développer de manière optimale.',
    goodSoil: '🌾 Une bonne qualité du sol fournit les nutriments adéquats pour le développement des cultures.',
    seedStage: '🌱 La culture est au stade initial de semis. Elle a besoin d\'une humidité constante pour établir de solides racines.',
    growingStage: '📈 La plante est en pleine croissance. C\'est une période critique nécessitant un équilibre en eau et nutriments.',
    matureStage: '🌾 La culture a atteint la maturité. Les conditions de récolte sont maintenant la principale préoccupation.',

    createAccount: 'Créer un Compte',
    signIn: 'Se Connecter',
    toUploadExcel: 'pour télécharger votre dataset Excel',
    toAccessExcel: 'pour accéder au téléchargement Excel',
    firstName: 'Prénom',
    lastName: 'Nom',
    gmailAddress: 'Adresse Gmail',
    password: 'Mot de Passe',
    confirmPassword: 'Confirmer Mot de Passe',
    createAccountBtn: 'Créer un Compte',
    signInBtn: 'Se Connecter',
    alreadyHaveAccount: 'Déjà un compte ? Se Connecter',
    dontHaveAccount: 'Pas de compte ? S\'inscrire',
    passwordRequirements: 'Exigences du mot de passe :',
    passwordReq1: '• Au moins 6 caractères',
    passwordReq2: '• Une lettre majuscule (A-Z)',
    passwordReq3: '• Une lettre minuscule (a-z)',
    passwordReq4: '• Un chiffre (0-9)',
    passwordReq5: '• Un caractère spécial (!@#$%...)',
    passwordReq6: '• Aucun espace autorisé',
    passwordValid: '✓ Le mot de passe respecte les exigences',

    // Auth errors
    registrationFailed: 'Échec de l\'inscription',
    signInFailed: 'Échec de la connexion',
    emailOrPasswordIncorrect: 'Email ou mot de passe incorrect',
    scenarioLoaded: 'Scénario chargé :',
    pleaseSignIn: 'Veuillez vous connecter ou créer un compte pour télécharger votre dataset Excel.',
    welcome: 'Bienvenue',
    importingFile: 'Importation de',
    excelImported: 'Excel importé :',
    importFailed: 'Échec de l\'importation.',
    importedCleared: 'Dataset importé effacé. Simulation revenue aux pluies générées.',

    // Alerts
    alertTitle: '🌱 État de la Plante en Temps Réel',
    droughtAlert: '🚨 Alerte Sécheresse : La plante souffre d\'une pénurie d\'eau sévère. Irrigation immédiate nécessaire.',
    waterStressAlert: '⚠️ Stress Hydrique : La plante montre des signes de déshydratation. Surveiller l\'humidité du sol.',
    excessRainAlert: '🌧️ Alerte Pluie Excessive : Trop d\'eau peut causer la pourriture des racines. Assurer un bon drainage.',
    poorSoilAlert: '🪨 Qualité du Sol Pauvre : Les nutriments du sol sont faibles. Considérer la fertilisation.',
    optimalConditions: '✅ Conditions Optimales : La plante se développe dans des conditions idéales.',
    rareRainAlert: '🌵 Pluie Rare : Très peu de pluie détectée. La conservation d\'eau est critique.',
    soilRecovery: '🌱 Récupération du Sol : La qualité du sol s\'améliore avec les soins appropriés.',
    criticalDrought: '🔥 Sécheresse Critique : La survie de la plante est en danger. Arrosage d\'urgence requis.',
    heavyRainWarning: '⛈️ Alerte Pluie Forte : Pluie intense peut causer l\'érosion du sol.',
    soilDegradation: '⚠️ Dégradation du Sol : La qualité du sol diminue. Gestion du sol nécessaire.',
    recoveryPhase: '🌿 Phase de Récupération : La plante se remet des conditions de stress.',
    stableConditions: '📈 Conditions Stables : La croissance de la plante est régulière et saine.',
    irrigationNeeded: '💧 Irrigation Nécessaire : Arrosage supplémentaire recommandé.',
    soilImprovement: '🌾 Amélioration du Sol : La qualité du sol s\'est considérablement améliorée.',
  },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
