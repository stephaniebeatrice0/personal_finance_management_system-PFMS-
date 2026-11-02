export interface TopCard {
  id: string | number;
  icon: string;
  title: string;
  count: number;
  iconColor: string;
  iconBg: string;
}

export const topCardsData: TopCard[] = [
  {
    id: 1,
    icon: 'mage:heart-fill',
    title: 'Save Products',
    count: 178,
    iconColor: 'secondary.main',
    iconBg: 'transparent.secondary.main',
  }
];
