import { join } from 'path';

import { GrpcOptions, Transport } from '@nestjs/microservices';

export const userGrpcOptions = (url: string): GrpcOptions => ({
  transport: Transport.GRPC,
  options: {
    package: 'user',
    protoPath: join(process.cwd(), 'libs/proto/user.proto'),
    url,
  },
});
