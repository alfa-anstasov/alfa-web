import { createStubPage } from '@/components/StubPage';

const stub = createStubPage('/monuments');
export const generateMetadata = stub.generateMetadata;
export default stub.Page;
