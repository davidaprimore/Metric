export enum Screen {
  LOGIN = 'LOGIN',
  DASHBOARD = 'DASHBOARD',
  ASSESSMENT = 'ASSESSMENT',
  RESULTS = 'RESULTS',
  SCHEDULE = 'SCHEDULE',
  PROFILE = 'PROFILE'
}

export interface MetricCardProps {
  title: string;
  value: string;
  unit: string;
  trend?: string;
  isPositive?: boolean;
  icon: string;
}

export interface Patient {
  id: string;
  name: string;
  image: string;
  status: 'Ativo' | 'Pendente';
}

export interface NavigationProps {
  onNavigate: (screen: Screen) => void;
}
