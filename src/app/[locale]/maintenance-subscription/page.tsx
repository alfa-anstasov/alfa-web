import { createStubPage } from '@/components/StubPage';

const stub = createStubPage('/maintenance-subscription');
export const generateMetadata = stub.generateMetadata;
export default stub.Page;
