import SubmissionRepository from '../../repositories/submission/Submission.repository';
import AuthService from '../auth/Auth.service';
import { AuthValidateTokenResponse } from '../auth/response';
import { SubmissionCreateRequest, SubmissionGetListRequest } from './request';

export default class SubmissionService {
    private authService: AuthService;
    private submissionRepository: SubmissionRepository;
    constructor() {
        this.submissionRepository = new SubmissionRepository();
        this.authService = new AuthService();
    }

    async getList(request: SubmissionGetListRequest, accessToken?: string) {
        const { submitterId, problemId } = request;

        let validate: AuthValidateTokenResponse | null = null;
        if (accessToken) {
            validate = await this.authService.validateToken(accessToken);
        }
        const isValid = validate?.isValid;

        if (submitterId && problemId) {
            if (validate && validate.secret?.accountId !== submitterId) {
                throw new Error('Invalid access token');
            }
            return await this.submissionRepository.getManyBySubmitterIdAndProblemId(
                submitterId,
                problemId
            );
        } else if (submitterId) {
            return await this.submissionRepository.getManyBySubmitterId(
                submitterId
            );
        } else if (problemId) {
            return await this.submissionRepository.getManyByProblemId(
                problemId
            );
        } else {
            throw new Error('Either submitterId or problemId must be provided');
        }
    }
}
