import * as dotenv from 'dotenv';

import { createServerInstance } from './app/createServer';

dotenv.config();

createServerInstance();
