export default class QuestionController {
	public async create(
		req: Request,
		res: Response<ResponseJSON>,
		next: NextFunction,
	) {
		try {
			const { question, order } = req.body;
		} catch (error) {
			next(error);
		}
	}
}
