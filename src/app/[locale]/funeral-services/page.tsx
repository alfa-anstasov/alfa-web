import { createStubPage } from '@/components/StubPage';

const stub = createStubPage('/funeral-services');
export const generateMetadata = stub.generateMetadata;
export default stub.Page;
