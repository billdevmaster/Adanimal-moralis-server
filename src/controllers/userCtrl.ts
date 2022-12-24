import { User } from '../models/User';

const getUser = async (req: any, res: any) => {
	const user = await User.findOne({ address: req.body.address });
	return res.json({status: "success", user})
}

export default {
  getUser
}