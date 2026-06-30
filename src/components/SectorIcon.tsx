// src/components/SectorIcon.tsx
// Résout dynamiquement une icône Lucide depuis son nom (string, stocké dans
// sector_configs.icon). Utilisé partout où un secteur doit afficher une icône :
// CRM, sidebar, panel admin. Source unique = la base, jamais d'emoji codé en dur.

import * as Icons from 'lucide-react';
import { Building2 } from 'lucide-react';

interface SectorIconProps extends React.ComponentProps<typeof Building2> {
  name: string;
}

export function SectorIcon({ name, ...props }: SectorIconProps) {
  const Icon = (Icons as any)[name] || Building2;
  return <Icon {...props} />;
}

export default SectorIcon;
