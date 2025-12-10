import { Controller } from '@nestjs/common';
import { InstallmentService } from 'src/installment/installment.service';

@Controller('installment')
export class InstallmentController {
    constructor(private installmentService: InstallmentService) {
        
    }
}
