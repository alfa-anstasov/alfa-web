import { createStubPage } from '@/components/StubPage';

const stub = createStubPage('/about-us');
export const generateMetadata = stub.generateMetadata;
export default stub.Page;
