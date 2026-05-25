export interface MockProject {
  id: string;
  name: string;
  slug: string;
  isOwner: boolean;
}

export const MOCK_PROJECTS: MockProject[] = [
  { id: '1', name: 'E-Commerce Platform', slug: 'e-commerce-platform', isOwner: true },
  { id: '2', name: 'Internal Dashboard', slug: 'internal-dashboard', isOwner: true },
  { id: '3', name: 'Mobile API Gateway', slug: 'mobile-api-gateway', isOwner: true },
  { id: '4', name: 'Auth Service', slug: 'auth-service', isOwner: false },
  { id: '5', name: 'Analytics Pipeline', slug: 'analytics-pipeline', isOwner: false },
];
