import { createStubPage } from '@/components/StubPage';

const stub = createStubPage('/reviews');
export const generateMetadata = stub.generateMetadata;
export default stub.Page;
