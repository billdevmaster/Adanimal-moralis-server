const updateCharacter = async (req: any, res: any) => {
  try {
    /// const { key, value } = req.body;
    return res.status(200).json({ status: "success" });
  } catch (e) {
    console.log(e)
    return res.status(400).json({ status: "failed" });
  }
}

export default {
  updateCharacter
};