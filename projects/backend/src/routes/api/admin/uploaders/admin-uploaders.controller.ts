import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Param, Patch, UseGuards } from '@nestjs/common';
import { Role } from '@shikicinema/types';

import { AllowRoles, RoleGuard } from '~backend/guards/role.guard';
import { GetUploaderById, PatchUploaderRequest } from '~backend/routes/api/admin/uploaders/dto';
import { UploaderInfo } from '~backend/routes/auth/dto/UploaderInfo.dto';
import { UploadersController } from '~backend/routes/api/uploaders/uploaders.controller';

@AllowRoles(Role.admin)
@UseGuards(RoleGuard)
@ApiCookieAuth()
@ApiTags('uploaders (admin)')
export class AdminUploadersController extends UploadersController {
    @Patch(':id')
    @ApiResponse({ status: 200, description: 'Patched uploader with specified id', type: UploaderInfo })
    @ApiResponse({ status: 404, description: 'Cannot find resource with provided parameters' })
    async edit(@Param() request: GetUploaderById, @Body() uploader: PatchUploaderRequest): Promise<UploaderInfo> {
        const entity = await this.uploaderService.editUploader(request.id, uploader);

        return new UploaderInfo(entity);
    }
}
