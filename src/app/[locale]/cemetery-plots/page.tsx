import { createStubPage } from '@/components/StubPage';

const stub = createStubPage('/cemetery-plots');
export const generateMetadata = stub.generateMetadata;
export default stub.Page;
