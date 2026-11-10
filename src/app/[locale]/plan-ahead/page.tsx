import { createStubPage } from '@/components/StubPage';

const stub = createStubPage('/plan-ahead');
export const generateMetadata = stub.generateMetadata;
export default stub.Page;
